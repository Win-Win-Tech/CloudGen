import { NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import {
  DEMO_DURATION_DAYS,
  demoStatus,
  formatDemoExpiry,
  hashDemoPassword,
  msRemaining,
  type DemoAccountRecord,
} from "@/lib/demo";

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(4),
});

/**
 * Called by the mobile app / backend on login.
 * Returns whether the demo is still valid; expired demos are kicked out here.
 */
export async function POST(request: Request) {
  try {
    const body = schema.parse(await request.json());

    // Opportunistic expiry sweep.
    await sql(
      `UPDATE demo_accounts
       SET status = 'expired'
       WHERE status = 'active' AND expires_at <= NOW()`,
    );

    const rows = await sql<DemoAccountRecord>(
      `SELECT * FROM demo_accounts WHERE username = $1 LIMIT 1`,
      [body.username.trim()],
    );
    const account = rows[0];
    if (!account) {
      return NextResponse.json(
        { ok: false, valid: false, reason: "unknown_user", message: "Demo account not found." },
        { status: 401 },
      );
    }

    const passwordOk = account.password_hash === hashDemoPassword(body.password);
    if (!passwordOk) {
      return NextResponse.json(
        { ok: false, valid: false, reason: "bad_password", message: "Invalid demo credentials." },
        { status: 401 },
      );
    }

    const status = demoStatus(account);
    if (status !== "active") {
      if (account.status === "active") {
        await sql(`UPDATE demo_accounts SET status = 'expired' WHERE id = $1`, [
          account.id,
        ]);
      }
      return NextResponse.json(
        {
          ok: false,
          valid: false,
          reason: status,
          message:
            status === "revoked"
              ? "This demo was revoked. Please contact sales or subscribe."
              : `Demo expired on ${formatDemoExpiry(account.expires_at)} IST. Subscribe to continue.`,
          expiresAt: new Date(account.expires_at).toISOString(),
          subscribeUrl: "/pricing",
        },
        { status: 403 },
      );
    }

    await sql(`UPDATE demo_accounts SET last_validated_at = NOW() WHERE id = $1`, [
      account.id,
    ]);

    return NextResponse.json({
      ok: true,
      valid: true,
      reason: "active",
      message: "Demo access granted.",
      username: account.username,
      organization: account.organization,
      email: account.email,
      startsAt: new Date(account.starts_at).toISOString(),
      expiresAt: new Date(account.expires_at).toISOString(),
      expiresAtLabel: formatDemoExpiry(account.expires_at),
      remainingMs: msRemaining(account.expires_at),
      durationDays: DEMO_DURATION_DAYS,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Validation failed" },
      { status: 400 },
    );
  }
}
