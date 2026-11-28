import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import { processDueFollowups, upsertCrmLead } from "@/lib/crm";
import { sendLeadEmail } from "@/lib/mail";
import {
  assessLeadSpam,
  silentSpamResponse,
} from "@/lib/spamGuard";

const schema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(200),
  phone: z.string().min(7).max(30),
  organization: z.string().min(2).max(160),
  sites: z
    .string()
    .max(8)
    .optional()
    .refine((v) => v == null || v.trim() === "" || /^\d{1,4}$/.test(v.trim()), {
      message: "Sites must be a number",
    }),
  website: z.string().optional(),
  companyUrl: z.string().optional(),
  formStartedAt: z.union([z.number(), z.string()]).optional(),
});

export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());

    const verdict = assessLeadSpam(
      {
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        organization: body.organization,
        sites: body.sites,
        website: body.website,
        companyUrl: body.companyUrl,
        formStartedAt: body.formStartedAt,
      },
      request,
    );

    if (verdict.spam) {
      console.warn("[spam] register blocked", verdict.reason, body.email);
      // Do not email Hostinger / do not write spam rows.
      return NextResponse.json(silentSpamResponse());
    }

    const id = crypto.randomUUID();
    await sql(
      `INSERT INTO registrations (id, full_name, email, phone, organization, sites)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        id,
        body.fullName.trim(),
        body.email.trim().toLowerCase(),
        body.phone.trim() || null,
        body.organization.trim(),
        body.sites?.trim() || null,
      ],
    );

    try {
      await upsertCrmLead({
        fullName: body.fullName.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone.trim(),
        organization: body.organization.trim(),
        source: "register",
        sites: body.sites?.trim(),
        sourceId: id,
      });
      await processDueFollowups(5);
    } catch (crmError) {
      console.error("[crm]", crmError);
    }

    let mailed = false;
    try {
      const mail = await sendLeadEmail({
        id,
        kind: "register",
        fullName: body.fullName.trim(),
        email: body.email.trim().toLowerCase(),
        phone: body.phone.trim(),
        organization: body.organization.trim(),
        sites: body.sites?.trim(),
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
