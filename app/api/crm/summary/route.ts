import { NextResponse } from "next/server";
import { crmSnapshot } from "@/lib/crm";
import { sql } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(req: Request) {
  const secret =
    process.env.CRM_API_SECRET?.trim() || process.env.CRON_SECRET?.trim();
  if (!secret) return false;
  const header = req.headers.get("authorization") || "";
  return header === `Bearer ${secret}`;
}

/** Sales snapshot of CRM contacts + open tasks (Bearer CRON_SECRET or CRM_API_SECRET). */
export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await crmSnapshot();
  const recent = await sql<{
    id: string;
    email: string;
    full_name: string;
    organization: string | null;
    source: string;
    stage: string;
    last_touch_at: string | null;
    next_action_at: string | null;
    created_at: string;
  }>(
    `SELECT id, email, full_name, organization, source, stage,
            last_touch_at, next_action_at, created_at
     FROM crm_contacts
     ORDER BY updated_at DESC
     LIMIT 50`,
  );

  const tasks = await sql<{
    id: string;
    title: string;
    due_at: string;
    email: string;
    full_name: string;
  }>(
    `SELECT t.id, t.title, t.due_at, c.email, c.full_name
     FROM crm_tasks t
     JOIN crm_contacts c ON c.id = t.contact_id
     WHERE t.status = 'open'
     ORDER BY t.due_at ASC
     LIMIT 50`,
  );

  return NextResponse.json({ ok: true, snapshot, recent, openTasks: tasks });
}
