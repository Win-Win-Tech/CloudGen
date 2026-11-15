import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import { quotePlan } from "@/lib/pricing";
import { getRazorpay, getRazorpayKeyId, razorpayConfigured } from "@/lib/razorpay";
import {
  quotePackage,
  type SolutionPackageId,
} from "@/lib/solutions";

const packageIds = [
  "essentials",
  "operations",
  "vision-ai",
  "industry",
  "enterprise",
] as const;

const schema = z.object({
  // Guard-count plans
  planId: z.enum(["base", "pro", "gold"]).optional(),
  guards: z.number().int().min(1).max(100).optional(),
  // USD solution packages
  packageId: z.enum(packageIds).optional(),
  billing: z.enum(["monthly", "annual"]),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  organization: z.string().min(2),
  includeSetup: z.boolean().optional().default(true),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const subscriptionId = crypto.randomUUID();

    let amountInr: number;
    let amountEur: number | null = null;
    let amountUsd: number | null = null;
    let planKey: string;
    let guards = 0;
    let description: string;

    if (body.packageId) {
      const quote = quotePackage(body.packageId as SolutionPackageId, body.billing);
      const usdDue = body.includeSetup === false
        ? quote.usdPeriod
        : quote.usdDue;
      amountUsd = usdDue;
      amountInr = Math.round(usdDue * (Number(process.env.NEXT_PUBLIC_USD_TO_INR || 83)));
      planKey = `pkg:${body.packageId}`;
      description = `${quote.pkg.name} package · ${body.billing}`;
    } else if (body.planId && body.guards) {
      const quote = quotePlan(body.planId, body.guards, body.billing);
      if (quote.needsQuote || !quote.inrDue || !quote.eurDue) {
        return NextResponse.json(
          { error: "This selection requires a custom quote" },
          { status: 400 },
        );
      }
      amountInr = quote.inrDue;
      amountEur = quote.eurDue;
      planKey = body.planId;
      guards = body.guards;
      description = `${quote.plan.name} · ${body.guards} guards · ${body.billing}`;
    } else {
      return NextResponse.json(
        { error: "Provide either a guard plan or a solution package" },
        { status: 400 },
      );
    }

    const amountPaise = amountInr * 100;

    if (!razorpayConfigured()) {
      await sql(
        `INSERT INTO subscriptions
          (id, full_name, email, phone, organization, plan_id, guards, billing, amount_eur, amount_inr, status)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'demo')`,
        [
          subscriptionId,
          body.fullName,
          body.email,
          body.phone || null,
          body.organization,
          planKey,
          guards,
          body.billing,
          amountEur,
          amountInr,
        ],
      );
      return NextResponse.json({
        mode: "demo",
        subscriptionId,
        amount: amountPaise,
        currency: "INR",
        keyId: getRazorpayKeyId(),
        description,
      });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: subscriptionId.slice(0, 40),
      notes: {
        planId: planKey,
        guards: String(guards),
        billing: body.billing,
        organization: body.organization,
        eurDue: amountEur != null ? String(amountEur) : "",
        usdDue: amountUsd != null ? String(amountUsd) : "",
        description,
      },
    });

    await sql(
      `INSERT INTO subscriptions
        (id, full_name, email, phone, organization, plan_id, guards, billing, amount_eur, amount_inr, razorpay_order_id, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,'created')`,
      [
        subscriptionId,
        body.fullName,
        body.email,
        body.phone || null,
        body.organization,
        planKey,
        guards,
        body.billing,
        amountEur,
        amountInr,
        order.id,
      ],
    );

    return NextResponse.json({
      mode: "live",
      subscriptionId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: getRazorpayKeyId(),
      description,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create order" },
      { status: 400 },
    );
  }
}
