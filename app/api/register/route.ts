import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import { sendLeadEmail } from "@/lib/mail";

const schema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(7, "Mobile number is required"),
  organization: z.string().min(2),
  sites: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());
    const id = crypto.randomUUID();
    await sql(
      `INSERT INTO registrations (id, full_name, email, phone, organization, sites)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        id,
        body.fullName,
        body.email,
        body.phone || null,
        body.organization,
        body.sites || null,
      ],
    );

    let mailed = false;
    try {
      const mail = await sendLeadEmail({
        id,
        kind: "register",
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        organization: body.organization,
        sites: body.sites,
      });
      mailed = mail.sent;
    } catch (mailError) {
      console.error("[mail]", mailError);
    }

    return NextResponse.json({
      ok: true,
      id,
      mailed,
      message: mailed
        ? "Registration received and emailed to sales. Our team will share onboarding next steps shortly."
        : "Registration received and saved. Our team will share onboarding next steps shortly.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid registration" },
      { status: 400 },
    );
  }
}
