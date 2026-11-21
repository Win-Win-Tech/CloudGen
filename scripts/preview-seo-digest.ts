import { fetchGaDailyReport, gaReportConfigured } from "../lib/gaReport";
import { runSeoHealthCheck } from "../lib/seoDaily";
import { formatSeoDigest } from "../lib/seoDigestMail";

async function main() {
  const report = await runSeoHealthCheck();
  const ga = gaReportConfigured() ? await fetchGaDailyReport() : null;
  const mail = formatSeoDigest(report, ga);
  console.log("=== SUBJECT ===");
  console.log(mail.subject);
  console.log("");
  console.log("=== EMAIL BODY ===");
  console.log(mail.text);
  if (ga) {
    console.log("");
    console.log("=== GA RAW ===");
    console.log(JSON.stringify(ga, null, 2));
  } else {
    console.log("");
    console.log("(GA skipped — set GA4_PROPERTY_ID + GA_SERVICE_ACCOUNT_JSON)");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
