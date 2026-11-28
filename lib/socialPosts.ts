import { BLOG_POSTS, PRODUCT_PILLARS, absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";
import { SOLUTION_PACKAGES, formatUSD } from "@/lib/solutions";

export type DailySocialPack = {
  dateKey: string;
  theme: string;
  pageUrl: string;
  hashtags: string[];
  x: string;
  facebook: string;
  instagram: string;
  youtube: {
    title: string;
    description: string;
    talkTrack: string;
  };
};

function dayIndex(date = new Date()) {
  // Stable day-of-year rotation (UTC).
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const now = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.floor((now - start) / 86_400_000);
}

function hashtagsFor(theme: string): string[] {
  const base = [
    "#SmartPatrol",
    "#CloudGen",
    "#GuardTour",
    "#SecurityOperations",
    "#India",
  ];
  if (/visitor/i.test(theme)) base.push("#VisitorManagement");
  if (/vehicle|gate/i.test(theme)) base.push("#VehicleManagement");
  if (/attendance|face/i.test(theme)) base.push("#FaceAttendance");
  if (/patrol|checkpoint|QR/i.test(theme)) base.push("#QRCheckpoint");
  if (/pricing|package/i.test(theme)) base.push("#SaaS");
  return [...new Set(base)].slice(0, 8);
}

type Theme = {
  theme: string;
  pagePath: string;
  hook: string;
  body: string;
  cta: string;
};

function buildThemes(): Theme[] {
  const start = SOLUTION_PACKAGES.find((p) => p.usdMonthly != null);
  const priceLine = start?.usdMonthly
    ? `Packages from ${formatUSD(start.usdMonthly)}/mo.`
    : "See packages on our pricing page.";

  const pillarThemes: Theme[] = PRODUCT_PILLARS.map((p) => ({
    theme: p.h1,
    pagePath: `/solutions/${p.slug}`,
    hook: p.title,
    body: p.description,
    cta: `Learn more: ${absoluteUrl(`/solutions/${p.slug}`)}`,
  }));

  const blogThemes: Theme[] = BLOG_POSTS.slice(0, 10).map((p) => ({
    theme: p.title,
    pagePath: `/blog/${p.slug}`,
    hook: p.title,
    body: p.description,
    cta: `Read the guide: ${absoluteUrl(`/blog/${p.slug}`)}`,
  }));

  const alwaysOn: Theme[] = [
    {
      theme: "SmartPatrol platform",
      pagePath: "/",
      hook: "One platform for site security work",
      body: "Attendance, QR patrol checkpoints, visitors and vehicles — with tickets built in. Built by CloudGen Technologies for teams in India and worldwide.",
      cta: `Explore SmartPatrol: ${absoluteUrl("/")}`,
    },
    {
      theme: "Pricing & packages",
      pagePath: "/pricing",
      hook: "Clear SmartPatrol packaging",
      body: `${priceLine} Ticket Complaints Tracking included. Choose modules, duos, or Site Ops Suite.`,
      cta: `View pricing: ${absoluteUrl("/pricing")}`,
    },
    {
      theme: "Book a demo",
      pagePath: "/demo",
      hook: "See SmartPatrol on your site type",
      body: "A short walkthrough with CloudGen — map Attendance, Checkpoint, Visitor or Vehicle to how you operate today.",
      cta: `Book a demo: ${absoluteUrl("/demo")}`,
    },
    {
      theme: "Guards app",
      pagePath: "/app",
      hook: `${site.appName} app for the field`,
      body: `Guards work on Android (${site.appRequires}). Supervisors get live status and proof of every round.`,
      cta: `App details: ${absoluteUrl("/app")} · Play Store: ${site.playStoreUrl}`,
    },
  ];

  return [...alwaysOn, ...pillarThemes, ...blogThemes];
}

export function getDailySocialPack(date = new Date()): DailySocialPack {
  const themes = buildThemes();
  const pick = themes[dayIndex(date) % themes.length]!;
  const pageUrl = absoluteUrl(pick.pagePath);
  const tags = hashtagsFor(pick.theme);
  const tagLine = tags.join(" ");

  const xTags = tags.slice(0, 3).join(" ");
  const xShort = `${pick.hook}\n\n${pageUrl}\n\n${xTags}`;
  const xFull = `${pick.hook}\n\n${pick.body}\n\n${pageUrl}\n\n${xTags}`;
  const x = xFull.length <= 280 ? xFull : xShort.slice(0, 280);

  const facebook = [
    pick.hook,
    "",
    pick.body,
    "",
    pick.cta,
    "",
    tagLine,
  ].join("\n");

  const instagram = [
    pick.hook,
    "",
    pick.body,
    "",
    "Save this if you run security or facility ops.",
    "",
    `Link in bio → ${pageUrl}`,
    "",
    tagLine,
  ].join("\n");

  const youtube = {
    title: `${pick.hook} | ${site.product}`,
    description: [
      pick.body,
      "",
      pick.cta,
      "",
      `Company: ${site.company}`,
      `Web: ${site.url}`,
      `Contact: ${site.phone}`,
      "",
      tagLine,
    ].join("\n"),
    talkTrack: [
      `Open with: "${pick.hook}".`,
      `Explain in 45–60s: ${pick.body}`,
      `Close with CTA: ${pick.cta}`,
      "Show the Guards app screen or website module if filming today.",
    ].join(" "),
  };

  const dateKey = date.toISOString().slice(0, 10);

  return {
    dateKey,
    theme: pick.theme,
    pageUrl,
    hashtags: tags,
    x,
    facebook,
    instagram,
    youtube,
  };
}
