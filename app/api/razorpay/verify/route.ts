import { NextResponse } from "next/server";
import { z } from "zod";
import { upsertCrmLead } from "@/lib/crm";
import { sql } from "@/lib/db";
import { sendLeadEmail } from "@/lib/mail";
import { verifyPaymentSignature } from "@/lib/razorpay";

const schema = z.object({
  subscriptionId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const valid = verifyPaymentSignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    });
    if (!valid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    await sql(
      `UPDATE subscriptions
       SET status = 'paid',
           razorpay_order_id = $2,
           razorpay_payment_id = $3,
           paid_at = NOW()
       WHERE id = $1`,
      [body.subscriptionId, body.razorpay_order_id, body.razorpay_payment_id],
    );

    const rows = await sql<{
      full_name: string;
      email: string;
      phone: string | null;
      organization: string;
      plan_id: string;
      guards: number;
      billing: string;
      amount_inr: number;
    }>(
      `SELECT full_name, email, phone, organization, plan_id, guards, billing, amount_inr
       FROM subscriptions WHERE id = $1`,
      [body.subscriptionId],
    );
    const row = rows[0];
    if (row) {
      try {
        const contact = await upsertCrmLead({
          fullName: row.full_name,
          email: row.email,
          phone: row.phone,
          organization: row.organization,
          source: "payment",
          interest: `Paid subscription · ${row.plan_id} · ${row.billing}`,
          message: `Razorpay payment ${body.razorpay_payment_id} · Order ${body.razorpay_order_id} · ₹${row.amount_inr} · guards=${row.guards}`,
          sourceId: body.subscriptionId,
        });
        await sql(
          `UPDATE crm_contacts SET stage = 'won', score = score + 50, updated_at = NOW() WHERE id = $1`,
          [contact.id],
        );
        await sql(
          `UPDATE crm_sequence_enrollments SET
             status = 'stopped', stopped_reason = 'won', next_send_at = NULL
           WHERE contact_id = $1 AND status = 'active'`,
          [contact.id],
        );
      } catch (crmError) {
        console.error("[crm] payment", crmError);
      }

      try {
        await sendLeadEmail({
          id: body.subscriptionId,
          kind: "contact",
          fullName: row.full_name,
          email: row.email,
          phone: row.phone,
          organization: row.organization,
          interest: `Paid subscription · ${row.plan_id} · ${row.billing}`,
          message: `Razorpay payment ${body.razorpay_payment_id} · Order ${body.razorpay_order_id} · ₹${row.amount_inr} · guards=${row.guards}`,
        });
      } catch (mailError) {
        console.error("[mail] payment notice failed", mailError);
      }
    }

    return NextResponse.json({
      ok: true,
      subscriptionId: body.subscriptionId,
      paymentId: body.razorpay_payment_id,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Verification failed" },
      { status: 400 },
    );
  }
}
