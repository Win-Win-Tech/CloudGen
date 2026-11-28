import { fetchGaDailyReport, gaReportConfigured } from "../lib/gaReport";
import { fetchGscDailyReport, gscReportConfigured } from "../lib/gscReport";
import { runSeoHealthCheck } from "../lib/seoDaily";
import { formatSeoDigest } from "../lib/seoDigestMail";

async function main() {
  const report = await runSeoHealthCheck();
  const [ga, gsc] = await Promise.all([
    gaReportConfigured() ? fetchGaDailyReport() : Promise.resolve(null),
    gscReportConfigured() ? fetchGscDailyReport() : Promise.resolve(null),
  ]);
  const mail = formatSeoDigest(report, ga, gsc);
  console.log("=== SUBJECT ===");
  console.log(mail.subject);
  console.log("");
  console.log("=== EMAIL BODY ===");
  console.log(mail.text);
  if (gsc) {
    console.log("");
    console.log("=== GSC RAW ===");
    console.log(JSON.stringify(gsc, null, 2));
  } else {
    console.log("");
    console.log(
      "(GSC skipped — set GA_SERVICE_ACCOUNT_JSON + add SA to Search Console)",
    );
  }
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
