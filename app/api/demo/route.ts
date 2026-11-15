import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import {
  DEMO_DURATION_DAYS,
  demoInstructions,
  demoStatus,
  demoWindow,
  formatDemoExpiry,
  generateDemoPassword,
  generateDemoUsername,
  hashDemoPassword,
  type DemoAccountRecord,
} from "@/lib/demo";
import { sendLeadEmail } from "@/lib/mail";
import { site } from "@/lib/site";

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

    // Live demo booking / contact — save first; email is best-effort.
    if (body.kind !== "demo-test") {
      let mailed = false;
      try {
        const mail = await sendLeadEmail({
          id,
          kind: body.kind,
          fullName: body.fullName,
          email: body.email,
          phone: body.phone,
          organization: body.organization,
          interest: body.interest,
          message: body.message,
        });
        mailed = mail.sent;
      } catch (mailError) {
        console.error("[mail]", mailError);
      }

      return NextResponse.json({
        ok: true,
        id,
        message: mailed
          ? body.kind === "contact"
            ? "Message received and emailed to sales@cloudgentechnologies.com. We will get back to you shortly."
            : "Demo request received and emailed to our sales team. We will contact you to schedule a walkthrough."
          : body.kind === "contact"
            ? "Message received and saved. Our team will follow up shortly."
            : "Demo request received and saved. Our team will contact you to schedule a walkthrough.",
      });
    }

    // Free demo test — issue timed credentials immediately.
    const existing = await sql<DemoAccountRecord>(
      `SELECT * FROM demo_accounts
       WHERE lower(email) = lower($1) AND status = 'active'
       ORDER BY created_at DESC
       LIMIT 1`,
      [body.email],
    );

    let account = existing[0];
    let passwordPlain: string | null = null;

    if (account && demoStatus(account) === "active") {
      // Reuse active demo; password was emailed earlier — do not rotate unless expired.
      passwordPlain = null;
    } else {
      if (account && demoStatus(account) === "expired") {
        await sql(`UPDATE demo_accounts SET status = 'expired' WHERE id = $1`, [
          account.id,
        ]);
      }

      const password = generateDemoPassword();
      const username = generateDemoUsername(body.organization, body.email);
      const { startsAt, expiresAt } = demoWindow();
      const accountId = crypto.randomUUID();

      await sql(
        `INSERT INTO demo_accounts
          (id, request_id, full_name, email, phone, organization, username, password_hash, password_hint, status, starts_at, expires_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'active',$10,$11)`,
        [
          accountId,
          id,
          body.fullName,
          body.email,
          body.phone || null,
          body.organization,
          username,
          hashDemoPassword(password),
          password.slice(0, 2) + "******",
          startsAt.toISOString(),
          expiresAt.toISOString(),
        ],
      );

      const created = await sql<DemoAccountRecord>(
        `SELECT * FROM demo_accounts WHERE id = $1`,
        [accountId],
      );
      account = created[0];
      passwordPlain = password;
    }

    if (!account) {
      return NextResponse.json({ error: "Could not create demo account" }, { status: 500 });
    }

    // Mark expired rows opportunistically.
    await sql(
      `UPDATE demo_accounts
       SET status = 'expired'
       WHERE status = 'active' AND expires_at <= NOW()`,
    );

    const instructions =
      passwordPlain != null
        ? demoInstructions({
            username: account.username,
            password: passwordPlain,
            expiresAt: account.expires_at,
          })
        : [
            `You already have an active ${site.product} demo.`,
            `Username: ${account.username}`,
            `Valid until: ${formatDemoExpiry(account.expires_at)} IST`,
            `Install the app: ${site.playStoreUrl}`,
            "Use the password from your earlier demo email. Request again after expiry for a new password.",
          ].join("\n");

    let mailed = false;
    try {
      const mail = await sendLeadEmail({
        id: account.id,
        kind: "demo-test",
        fullName: body.fullName,
        email: body.email,
        phone: body.phone,
        organization: body.organization,
        interest: body.interest,
        message: instructions,
      });
      mailed = mail.sent;
    } catch (mailError) {
      console.error("[mail] demo credentials", mailError);
    }

    return NextResponse.json({
      ok: true,
      id: account.id,
      message:
        passwordPlain != null
          ? mailed
            ? `Demo account created for ${DEMO_DURATION_DAYS} days. Credentials are shown below and emailed to ${body.email}.`
            : `Demo account created for ${DEMO_DURATION_DAYS} days. Credentials are shown below (copy them now).`
          : `Your existing demo is still active until ${formatDemoExpiry(account.expires_at)} IST.`,
      demo: {
        username: account.username,
        password: passwordPlain,
        expiresAt: new Date(account.expires_at).toISOString(),
        expiresAtLabel: formatDemoExpiry(account.expires_at),
        durationDays: DEMO_DURATION_DAYS,
        playStoreUrl: site.playStoreUrl,
        status: demoStatus(account),
        validateUrl: "/api/demo/validate",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid request" },
      { status: 400 },
    );
  }
}
