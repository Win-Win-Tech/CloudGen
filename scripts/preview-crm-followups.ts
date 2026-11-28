/**
 * Local smoke test: upsert a sample lead and process due follow-ups (PGlite).
 * Run: npx tsx scripts/preview-crm-followups.ts
 */
import { crmSnapshot, processDueFollowups, upsertCrmLead } from "../lib/crm";

async function main() {
  const contact = await upsertCrmLead({
    fullName: "Preview Lead",
    email: `preview+crm-${Date.now()}@example.com`,
    phone: "+91 90000 00000",
    organization: "Preview Security Pvt Ltd",
    source: "demo",
    interest: "QR checkpoint guard tour",
    message: "Local CRM smoke test",
  });
  console.log("Contact:", contact.id, contact.email, contact.stage);

  const run = await processDueFollowups(10);
  console.log("Follow-up run:", JSON.stringify(run, null, 2));

  const snap = await crmSnapshot();
  console.log("Snapshot:", snap);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
