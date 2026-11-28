import { createHmac, timingSafeEqual } from "node:crypto";
import { sql } from "@/lib/db";
import {
  LEAD_NURTURE_SEQUENCE_KEY,
  LEAD_NURTURE_STEPS,
} from "@/lib/followupSequence";
import { sendSimpleEmail } from "@/lib/mail";
import { site } from "@/lib/site";

export type CrmLeadInput = {
  fullName: string;
  email: string;
  phone?: string | null;
  organization?: string | null;
  source: "demo" | "demo-test" | "contact" | "register" | "payment";
  interest?: string | null;
  message?: string | null;
  sites?: string | null;
  sourceId?: string | null;
};

export type CrmContact = {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  organization: string | null;
  source: string;
  interest: string | null;
  message: string | null;
  sites: string | null;
  stage: string;
  score: number;
  unsubscribed_at: string | null;
};

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function unsubscribeSecret() {
  return (
    process.env.CRM_UNSUBSCRIBE_SECRET?.trim() ||
    process.env.CRON_SECRET?.trim() ||
    "cloudgen-crm-dev-secret"
  );
}

export function unsubscribeToken(email: string) {
  const e = normalizeEmail(email);
  return createHmac("sha256", unsubscribeSecret())
    .update(`unsub:${e}`)
    .digest("hex")
    .slice(0, 32);
}

export function verifyUnsubscribeToken(email: string, token: string) {
  const expected = unsubscribeToken(email);
  try {
    return timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(String(token || "")),
    );
  } catch {
    return false;
  }
}

export function unsubscribeUrl(email: string) {
  const u = new URL("/api/crm/unsubscribe", site.url);
  u.searchParams.set("email", normalizeEmail(email));
  u.searchParams.set("token", unsubscribeToken(email));
  return u.toString();
}

async function logActivity(
  contactId: string,
  kind: string,
  subject?: string,
  body?: string,
  meta?: Record<string, unknown>,
) {
  await sql(
    `INSERT INTO crm_activities (id, contact_id, kind, subject, body, meta)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      crypto.randomUUID(),
      contactId,
      kind,
      subject || null,
      body || null,
      meta ? JSON.stringify(meta) : null,
    ],
  );
}

async function createTask(
  contactId: string,
  title: string,
  dueAt: Date,
) {
  await sql(
    `INSERT INTO crm_tasks (id, contact_id, title, due_at, status)
     VALUES ($1, $2, $3, $4, 'open')`,
    [crypto.randomUUID(), contactId, title, dueAt.toISOString()],
  );
}

/**
 * Upsert a website lead into CRM and enroll in the nurture sequence.
 * Idempotent on email — re-touch updates fields and restarts sequence only if stopped/unsubscribed no.
 */
export async function upsertCrmLead(input: CrmLeadInput): Promise<CrmContact> {
  const email = normalizeEmail(input.email);
  const existing = await sql<CrmContact>(
    `SELECT * FROM crm_contacts WHERE lower(email) = lower($1) LIMIT 1`,
    [email],
  );

  const now = new Date();
  let contact: CrmContact;

  if (existing[0]) {
    const id = existing[0].id;
    const rows = await sql<CrmContact>(
      `UPDATE crm_contacts SET
         full_name = $2,
         phone = COALESCE($3, phone),
         organization = COALESCE($4, organization),
         source = $5,
         interest = COALESCE($6, interest),
         message = COALESCE($7, message),
         sites = COALESCE($8, sites),
         stage = CASE
           WHEN unsubscribed_at IS NOT NULL THEN stage
           WHEN stage IN ('won', 'lost') THEN stage
           ELSE 'new'
         END,
         score = score + 5,
         last_touch_at = $9,
         updated_at = $9
       WHERE id = $1
       RETURNING *`,
      [
        id,
        input.fullName.trim(),
        input.phone?.trim() || null,
        input.organization?.trim() || null,
        input.source,
        input.interest?.trim() || null,
        input.message?.trim() || null,
        input.sites?.trim() || null,
        now.toISOString(),
      ],
    );
    contact = rows[0]!;
    await logActivity(contact.id, "lead_updated", `New ${input.source} submission`, input.message || undefined, {
      sourceId: input.sourceId,
      source: input.source,
    });
  } else {
    const id = crypto.randomUUID();
    const rows = await sql<CrmContact>(
      `INSERT INTO crm_contacts
        (id, email, full_name, phone, organization, source, interest, message, sites, stage, score, owner_email, last_touch_at, next_action_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'new',10,$10,$11,$11)
       RETURNING *`,
      [
        id,
        email,
        input.fullName.trim(),
        input.phone?.trim() || null,
        input.organization?.trim() || null,
        input.source,
        input.interest?.trim() || null,
        input.message?.trim() || null,
        input.sites?.trim() || null,
        site.email,
        now.toISOString(),
      ],
    );
    contact = rows[0]!;
    await logActivity(contact.id, "lead_created", `New ${input.source} lead`, input.message || undefined, {
      sourceId: input.sourceId,
      source: input.source,
    });
  }

  if (!contact.unsubscribed_at) {
    await enrollLeadNurture(contact.id, now);
  }

  return contact;
}

async function enrollLeadNurture(contactId: string, now = new Date()) {
  const existing = await sql<{
    id: string;
    status: string;
  }>(
    `SELECT id, status FROM crm_sequence_enrollments
     WHERE contact_id = $1 AND sequence_key = $2
     LIMIT 1`,
    [contactId, LEAD_NURTURE_SEQUENCE_KEY],
  );

  const nextSend = now.toISOString();

  if (existing[0]) {
    if (existing[0].status === "active") {
      // Keep existing cadence; bump next_send if somehow null.
      await sql(
        `UPDATE crm_sequence_enrollments
         SET next_send_at = COALESCE(next_send_at, $2)
         WHERE id = $1`,
        [existing[0].id, nextSend],
      );
      return existing[0].id;
    }
    // Re-enroll stopped/completed contacts on a new inbound lead.
    await sql(
      `UPDATE crm_sequence_enrollments SET
         status = 'active',
         current_step = 0,
         enrolled_at = $2,
         next_send_at = $2,
         stopped_reason = NULL
       WHERE id = $1`,
      [existing[0].id, nextSend],
    );
    await logActivity(contactId, "sequence_reenrolled", LEAD_NURTURE_SEQUENCE_KEY);
    return existing[0].id;
  }

  const id = crypto.randomUUID();
  await sql(
    `INSERT INTO crm_sequence_enrollments
      (id, contact_id, sequence_key, status, current_step, enrolled_at, next_send_at)
     VALUES ($1,$2,$3,'active',0,$4,$4)`,
    [id, contactId, LEAD_NURTURE_SEQUENCE_KEY, nextSend],
  );
  await logActivity(contactId, "sequence_enrolled", LEAD_NURTURE_SEQUENCE_KEY);
  return id;
}

export async function unsubscribeContact(email: string) {
  const rows = await sql<CrmContact>(
    `UPDATE crm_contacts SET
       stage = 'unsubscribed',
       unsubscribed_at = NOW(),
       updated_at = NOW()
     WHERE lower(email) = lower($1)
     RETURNING *`,
    [normalizeEmail(email)],
  );
  const contact = rows[0];
  if (!contact) return null;

  await sql(
    `UPDATE crm_sequence_enrollments SET
       status = 'stopped',
       stopped_reason = 'unsubscribed',
       next_send_at = NULL
     WHERE contact_id = $1 AND status = 'active'`,
    [contact.id],
  );
  await logActivity(contact.id, "unsubscribed", "Contact unsubscribed from follow-ups");
  return contact;
}

type DueEnrollment = {
  enrollment_id: string;
  contact_id: string;
  current_step: number;
  enrolled_at: string;
  email: string;
  full_name: string;
  organization: string | null;
  interest: string | null;
  unsubscribed_at: string | null;
  stage: string;
};

export type FollowupRunResult = {
  processed: number;
  sent: number;
  failed: number;
  completed: number;
  skipped: number;
  details: Array<{ email: string; step: string; status: string; error?: string }>;
};

/**
 * Process due nurture emails (cron). Sends at most one step per enrollment per run.
 */
export async function processDueFollowups(
  limit = 40,
): Promise<FollowupRunResult> {
  const due = await sql<DueEnrollment>(
    `SELECT e.id AS enrollment_id, e.contact_id, e.current_step, e.enrolled_at,
            c.email, c.full_name, c.organization, c.interest, c.unsubscribed_at, c.stage
     FROM crm_sequence_enrollments e
     JOIN crm_contacts c ON c.id = e.contact_id
     WHERE e.sequence_key = $1
       AND e.status = 'active'
       AND e.next_send_at IS NOT NULL
       AND e.next_send_at <= NOW()
     ORDER BY e.next_send_at ASC
     LIMIT $2`,
    [LEAD_NURTURE_SEQUENCE_KEY, limit],
  );

  const result: FollowupRunResult = {
    processed: 0,
    sent: 0,
    failed: 0,
    completed: 0,
    skipped: 0,
    details: [],
  };

  for (const row of due) {
    result.processed += 1;

    if (row.unsubscribed_at || row.stage === "unsubscribed") {
      await sql(
        `UPDATE crm_sequence_enrollments SET
           status = 'stopped', stopped_reason = 'unsubscribed', next_send_at = NULL
         WHERE id = $1`,
        [row.enrollment_id],
      );
      result.skipped += 1;
      result.details.push({
        email: row.email,
        step: "—",
        status: "skipped_unsubscribed",
      });
      continue;
    }

    const stepIndex = row.current_step;
    const step = LEAD_NURTURE_STEPS[stepIndex];
    if (!step) {
      await completeEnrollment(row);
      result.completed += 1;
      result.details.push({
        email: row.email,
        step: "done",
        status: "completed",
      });
      continue;
    }

    const enrolledAt = new Date(row.enrolled_at).getTime();
    const readyAt = enrolledAt + step.delayHours * 3_600_000;
    if (Date.now() < readyAt) {
      await sql(
        `UPDATE crm_sequence_enrollments SET next_send_at = $2 WHERE id = $1`,
        [row.enrollment_id, new Date(readyAt).toISOString()],
      );
      result.skipped += 1;
      result.details.push({
        email: row.email,
        step: step.key,
        status: "not_due_yet",
      });
      continue;
    }

    const already = await sql<{ id: string }>(
      `SELECT id FROM crm_sequence_sends
       WHERE enrollment_id = $1 AND step_key = $2
       LIMIT 1`,
      [row.enrollment_id, step.key],
    );
    if (already[0]) {
      await advanceEnrollment(row, stepIndex);
      result.skipped += 1;
      result.details.push({
        email: row.email,
        step: step.key,
        status: "already_sent",
      });
      continue;
    }

    const unsub = unsubscribeUrl(row.email);
    const args = {
      fullName: row.full_name,
      organization: row.organization || "",
      interest: row.interest,
      unsubscribeUrl: unsub,
    };

    try {
      const mail = await sendSimpleEmail({
        to: row.email,
        subject: step.subject(row.full_name),
        text: step.text(args),
        html: step.html(args),
      });

      if (!mail.sent) {
        await sql(
          `INSERT INTO crm_sequence_sends
            (id, enrollment_id, contact_id, step_key, status, provider, error)
           VALUES ($1,$2,$3,$4,'failed',$5,$6)
           ON CONFLICT (enrollment_id, step_key) DO NOTHING`,
          [
            crypto.randomUUID(),
            row.enrollment_id,
            row.contact_id,
            step.key,
            mail.provider,
            "Mail not configured",
          ],
        );
        await logActivity(
          row.contact_id,
          "email_failed",
          step.subject(row.full_name),
          undefined,
          { step: step.key, provider: mail.provider },
        );
        // Retry in 6 hours
        await sql(
          `UPDATE crm_sequence_enrollments
           SET next_send_at = NOW() + INTERVAL '6 hours'
           WHERE id = $1`,
          [row.enrollment_id],
        );
        result.failed += 1;
        result.details.push({
          email: row.email,
          step: step.key,
          status: "failed",
          error: "Mail not configured",
        });
        continue;
      }

      await sql(
        `INSERT INTO crm_sequence_sends
          (id, enrollment_id, contact_id, step_key, status, provider)
         VALUES ($1,$2,$3,$4,'sent',$5)
         ON CONFLICT (enrollment_id, step_key) DO NOTHING`,
        [
          crypto.randomUUID(),
          row.enrollment_id,
          row.contact_id,
          step.key,
          mail.provider,
        ],
      );
      await logActivity(
        row.contact_id,
        "email_sent",
        step.subject(row.full_name),
        undefined,
        { step: step.key, provider: mail.provider },
      );
      await sql(
        `UPDATE crm_contacts SET
           stage = CASE WHEN stage = 'new' THEN 'nurturing' ELSE stage END,
           last_touch_at = NOW(),
           updated_at = NOW()
         WHERE id = $1`,
        [row.contact_id],
      );

      await advanceEnrollment(row, stepIndex);
      result.sent += 1;
      result.details.push({
        email: row.email,
        step: step.key,
        status: "sent",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "send failed";
      await sql(
        `INSERT INTO crm_sequence_sends
          (id, enrollment_id, contact_id, step_key, status, provider, error)
         VALUES ($1,$2,$3,$4,'failed','error',$5)
         ON CONFLICT (enrollment_id, step_key) DO NOTHING`,
        [
          crypto.randomUUID(),
          row.enrollment_id,
          row.contact_id,
          step.key,
          message,
        ],
      );
      await sql(
        `UPDATE crm_sequence_enrollments
         SET next_send_at = NOW() + INTERVAL '6 hours'
         WHERE id = $1`,
        [row.enrollment_id],
      );
      result.failed += 1;
      result.details.push({
        email: row.email,
        step: step.key,
        status: "failed",
        error: message,
      });
    }
  }

  return result;
}

async function advanceEnrollment(row: DueEnrollment, stepIndex: number) {
  const nextIndex = stepIndex + 1;
  const nextStep = LEAD_NURTURE_STEPS[nextIndex];
  if (!nextStep) {
    await completeEnrollment(row);
    return;
  }

  const enrolledAt = new Date(row.enrolled_at).getTime();
  const nextSendAt = new Date(
    enrolledAt + nextStep.delayHours * 3_600_000,
  ).toISOString();

  await sql(
    `UPDATE crm_sequence_enrollments SET
       current_step = $2,
       next_send_at = $3
     WHERE id = $1`,
    [row.enrollment_id, nextIndex, nextSendAt],
  );
  await sql(
    `UPDATE crm_contacts SET next_action_at = $2, updated_at = NOW() WHERE id = $1`,
    [row.contact_id, nextSendAt],
  );
}

async function completeEnrollment(row: DueEnrollment) {
  await sql(
    `UPDATE crm_sequence_enrollments SET
       status = 'completed',
       current_step = $2,
       next_send_at = NULL,
       stopped_reason = 'sequence_finished'
     WHERE id = $1`,
    [row.enrollment_id, LEAD_NURTURE_STEPS.length],
  );

  const due = new Date();
  due.setUTCDate(due.getUTCDate() + 1);
  await createTask(
    row.contact_id,
    `Sales follow-up call — ${row.full_name} (${row.email})`,
    due,
  );
  await sql(
    `UPDATE crm_contacts SET
       stage = CASE WHEN stage IN ('won', 'lost', 'unsubscribed') THEN stage ELSE 'qualified' END,
       next_action_at = $2,
       updated_at = NOW()
     WHERE id = $1`,
    [row.contact_id, due.toISOString()],
  );
  await logActivity(
    row.contact_id,
    "sequence_completed",
    LEAD_NURTURE_SEQUENCE_KEY,
    "Created sales follow-up task",
  );
}

export async function crmSnapshot() {
  const [stages, openTasks, activeSequences] = await Promise.all([
    sql<{ stage: string; count: string }>(
      `SELECT stage, COUNT(*)::text AS count FROM crm_contacts GROUP BY stage ORDER BY count DESC`,
    ),
    sql<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM crm_tasks WHERE status = 'open'`,
    ),
    sql<{ count: string }>(
      `SELECT COUNT(*)::text AS count FROM crm_sequence_enrollments WHERE status = 'active'`,
    ),
  ]);

  return {
    stages: stages.map((s) => ({ stage: s.stage, count: Number(s.count) })),
    openTasks: Number(openTasks[0]?.count || 0),
    activeSequences: Number(activeSequences[0]?.count || 0),
  };
}
