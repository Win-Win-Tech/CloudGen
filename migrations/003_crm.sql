-- Lightweight CRM for CloudGen website leads (own Postgres / PGlite).

CREATE TABLE IF NOT EXISTS schema_migrations (
  id TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS crm_contacts (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  organization TEXT,
  source TEXT NOT NULL,
  interest TEXT,
  message TEXT,
  sites TEXT,
  stage TEXT NOT NULL DEFAULT 'new',
  score INTEGER NOT NULL DEFAULT 0,
  owner_email TEXT,
  last_touch_at TIMESTAMPTZ,
  next_action_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS crm_contacts_email_uidx
  ON crm_contacts (lower(email));

CREATE INDEX IF NOT EXISTS crm_contacts_stage_idx ON crm_contacts (stage);
CREATE INDEX IF NOT EXISTS crm_contacts_next_action_idx ON crm_contacts (next_action_at);

CREATE TABLE IF NOT EXISTS crm_activities (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  kind TEXT NOT NULL,
  subject TEXT,
  body TEXT,
  meta TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS crm_activities_contact_idx
  ON crm_activities (contact_id, created_at DESC);

CREATE TABLE IF NOT EXISTS crm_sequence_enrollments (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  sequence_key TEXT NOT NULL DEFAULT 'lead_nurture',
  status TEXT NOT NULL DEFAULT 'active',
  current_step INTEGER NOT NULL DEFAULT 0,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  next_send_at TIMESTAMPTZ,
  stopped_reason TEXT,
  UNIQUE (contact_id, sequence_key)
);

CREATE INDEX IF NOT EXISTS crm_enrollments_due_idx
  ON crm_sequence_enrollments (status, next_send_at);

CREATE TABLE IF NOT EXISTS crm_sequence_sends (
  id TEXT PRIMARY KEY,
  enrollment_id TEXT NOT NULL REFERENCES crm_sequence_enrollments(id) ON DELETE CASCADE,
  contact_id TEXT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  step_key TEXT NOT NULL,
  status TEXT NOT NULL,
  provider TEXT,
  error TEXT,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (enrollment_id, step_key)
);

CREATE TABLE IF NOT EXISTS crm_tasks (
  id TEXT PRIMARY KEY,
  contact_id TEXT NOT NULL REFERENCES crm_contacts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  due_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS crm_tasks_open_idx
  ON crm_tasks (status, due_at);
