import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  organization: z.string().min(2),
  interest: z.string().min(2),
  message: z.string().optional(),
  kind: z.enum(["demo", "demo-test", "register", "contact"]).default("demo"),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const id = crypto.randomUUID();
    const storedKind =
      body.kind === "register" || body.kind === "contact" ? "demo" : body.kind;
    await sql(
      `INSERT INTO demo_requests (id, full_name, email, phone, organization, interest, message, kind)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        id,
        body.fullName,
        body.email,
        body.phone || null,
        body.organization,
        body.interest,
        body.message || null,
        storedKind,
      ],
    );
    return NextResponse.json({
      ok: true,
      id,
      message:
        body.kind === "demo-test"
          ? "Demo test request received. Credentials will be emailed when your sandbox is ready."
          : body.kind === "contact"
            ? "Message received. CloudGen will get back to you shortly."
            : "Demo request received. We will contact you to schedule a walkthrough.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }
}
