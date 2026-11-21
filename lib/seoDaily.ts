import { absoluteUrl, BLOG_POSTS, PRODUCT_PILLARS } from "@/lib/seo";
import { SEO_KEYWORD_CLUSTERS, type KeywordCluster } from "@/lib/seoKeywords";

export type UrlHealth = {
  path: string;
  url: string;
  status: number | null;
  ok: boolean;
  finalUrl?: string;
  error?: string;
};

const CORE_PATHS = [
  "/",
  "/about",
  "/solutions",
  "/pricing",
  "/contact",
  "/blog",
  "/app",
  "/demo",
  "/privacy",
  "/sitemap.xml",
  "/robots.txt",
] as const;

function dayOfYear(d = new Date()) {
  const start = Date.UTC(d.getUTCFullYear(), 0, 0);
  const now = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.floor((now - start) / 86_400_000);
}

/** Rotate focus cluster so each day highlights a different keyword set. */
export function focusClusterForToday(d = new Date()): KeywordCluster {
  const idx = dayOfYear(d) % SEO_KEYWORD_CLUSTERS.length;
  return SEO_KEYWORD_CLUSTERS[idx]!;
}

export function pathsToMonitor(): string[] {
  const pillars = PRODUCT_PILLARS.map((p) => `/solutions/${p.slug}`);
  const posts = BLOG_POSTS.map((p) => `/blog/${p.slug}`);
  return [...CORE_PATHS, ...pillars, ...posts];
}

async function checkUrl(path: string): Promise<UrlHealth> {
  const url = absoluteUrl(path);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      cache: "no-store",
      headers: { "User-Agent": "CloudGenSeoDaily/1.0" },
      signal: AbortSignal.timeout(15_000),
    });
    return {
      path,
      url,
      status: res.status,
      ok: res.status >= 200 && res.status < 400,
      finalUrl: res.url,
    };
  } catch (err) {
    return {
      path,
      url,
      status: null,
      ok: false,
      error: err instanceof Error ? err.message : "fetch failed",
    };
  }
}

export async function runSeoHealthCheck() {
  const paths = pathsToMonitor();
  const results: UrlHealth[] = [];
  // Small batches to avoid hammering the origin
  for (let i = 0; i < paths.length; i += 6) {
    const batch = paths.slice(i, i + 6);
    const chunk = await Promise.all(batch.map(checkUrl));
    results.push(...chunk);
  }
  const failing = results.filter((r) => !r.ok);
  const focus = focusClusterForToday();
  return {
    checkedAt: new Date().toISOString(),
    total: results.length,
    okCount: results.length - failing.length,
    failing,
    focus,
    gscLinks: {
      performance:
        "https://search.google.com/search-console/performance/search-analytics",
      indexing: "https://search.google.com/search-console/index",
      removals: "https://search.google.com/search-console/removals",
    },
  };
}

export type SeoDailyReport = Awaited<ReturnType<typeof runSeoHealthCheck>>;
