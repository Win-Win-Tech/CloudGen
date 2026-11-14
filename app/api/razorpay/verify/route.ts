import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
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
