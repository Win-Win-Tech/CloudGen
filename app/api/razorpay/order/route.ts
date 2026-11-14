import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import { quotePlan } from "@/lib/pricing";
import { getRazorpay, getRazorpayKeyId, razorpayConfigured } from "@/lib/razorpay";

const schema = z.object({
  planId: z.enum(["base", "pro", "gold"]),
  guards: z.number().int().min(1).max(100),
  billing: z.enum(["monthly", "annual"]),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  organization: z.string().min(2),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const quote = quotePlan(body.planId, body.guards, body.billing);
    if (quote.needsQuote || !quote.inrDue || !quote.eurDue) {
      return NextResponse.json(
        { error: "This selection requires a custom quote" },
        { status: 400 },
      );
    }

    const subscriptionId = crypto.randomUUID();
    const amountPaise = quote.inrDue * 100;

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
          body.planId,
          body.guards,
          body.billing,
          quote.eurDue,
          quote.inrDue,
        ],
      );
      return NextResponse.json({
        mode: "demo",
        subscriptionId,
        amount: amountPaise,
        currency: "INR",
        keyId: getRazorpayKeyId(),
      });
    }

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: amountPaise,
      currency: "INR",
      receipt: subscriptionId.slice(0, 40),
      notes: {
        planId: body.planId,
        guards: String(body.guards),
        billing: body.billing,
        organization: body.organization,
        eurDue: String(quote.eurDue),
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
        body.planId,
        body.guards,
        body.billing,
        quote.eurDue,
        quote.inrDue,
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
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create order" },
      { status: 400 },
    );
  }
}
