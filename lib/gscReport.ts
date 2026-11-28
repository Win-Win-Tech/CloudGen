import { GoogleAuth } from "google-auth-library";
import { site } from "@/lib/site";

export type GscQueryRow = {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type GscDailyReport = {
  configured: boolean;
  siteUrl: string | null;
  /** Inclusive start (YYYY-MM-DD) of the Search Console window. */
  startDate: string | null;
  /** Inclusive end (YYYY-MM-DD). GSC data is typically ~2–3 days delayed. */
  endDate: string | null;
  error?: string;
  totals: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  } | null;
  /** Top Google search keywords that showed/clicked through to the site. */
  topQueries: GscQueryRow[];
  /** Top landing pages from Google Search. */
  topPages: GscQueryRow[];
};

const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

function credentialsFromEnv(): object | null {
  const raw = process.env.GA_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as object;
  } catch {
    try {
      const decoded = Buffer.from(raw, "base64").toString("utf8");
      return JSON.parse(decoded) as object;
    } catch {
      return null;
    }
  }
}

/** Search Console property URL (must match GSC exactly). */
export function gscSiteUrl() {
  const fromEnv = process.env.GSC_SITE_URL?.trim();
  if (fromEnv) return fromEnv;
  // Prefer www hostname used in production; trailing slash required for URL-prefix properties.
  const base = site.url.replace(/\/$/, "");
  return `${base}/`;
}

export function gscReportConfigured() {
  return Boolean(credentialsFromEnv());
}

function ymd(d: Date) {
  return d.toISOString().slice(0, 10);
}

/**
 * GSC search analytics usually lag 2–3 days. Use a 7-day window ending 3 days ago.
 */
function defaultDateRange() {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 3);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 6);
  return { startDate: ymd(start), endDate: ymd(end) };
}

function num(v: unknown) {
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function mapRows(
  rows: Array<{
    keys?: string[];
    clicks?: number;
    impressions?: number;
    ctr?: number;
    position?: number;
  }> | undefined,
  keyLabel: "query" | "page",
): GscQueryRow[] {
  return (rows || []).map((row) => ({
    query: row.keys?.[0] || `(unknown ${keyLabel})`,
    clicks: num(row.clicks),
    impressions: num(row.impressions),
    ctr: num(row.ctr),
    position: num(row.position),
  }));
}

function emptyReport(partial?: Partial<GscDailyReport>): GscDailyReport {
  return {
    configured: false,
    siteUrl: gscSiteUrl(),
    startDate: null,
    endDate: null,
    totals: null,
    topQueries: [],
    topPages: [],
    ...partial,
  };
}

async function searchAnalytics(
  accessToken: string,
  siteUrl: string,
  body: Record<string, unknown>,
) {
  const encoded = encodeURIComponent(siteUrl);
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encoded}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(25_000),
    },
  );

  const json = (await res.json().catch(() => ({}))) as {
    error?: { message?: string; status?: string };
    rows?: Array<{
      keys?: string[];
      clicks?: number;
      impressions?: number;
      ctr?: number;
      position?: number;
    }>;
  };

  if (!res.ok) {
    const msg =
      json.error?.message ||
      `Search Console API HTTP ${res.status}`;
    throw new Error(msg);
  }

  return json;
}

/**
 * Pull Google Search Console keyword + landing data for the daily digest.
 * Reuses GA_SERVICE_ACCOUNT_JSON. Add that service account email as a user
 * on the Search Console property, and enable the Search Console API in GCP.
 */
export async function fetchGscDailyReport(): Promise<GscDailyReport> {
  const credentials = credentialsFromEnv();
  const siteUrl = gscSiteUrl();
  const { startDate, endDate } = defaultDateRange();

  if (!credentials) {
    return emptyReport({
      configured: false,
      error: "Missing or invalid GA_SERVICE_ACCOUNT_JSON",
      startDate,
      endDate,
    });
  }

  try {
    const auth = new GoogleAuth({
      credentials,
      scopes: [GSC_SCOPE],
    });
    const client = await auth.getClient();
    const tokenRes = await client.getAccessToken();
    const accessToken =
      typeof tokenRes === "string" ? tokenRes : tokenRes?.token;
    if (!accessToken) {
      return emptyReport({
        configured: true,
        siteUrl,
        startDate,
        endDate,
        error: "Could not obtain Search Console access token",
      });
    }

    const [totalsRes, queriesRes, pagesRes] = await Promise.all([
      searchAnalytics(accessToken, siteUrl, {
        startDate,
        endDate,
        dimensions: [],
        rowLimit: 1,
        dataState: "final",
      }),
      searchAnalytics(accessToken, siteUrl, {
        startDate,
        endDate,
        dimensions: ["query"],
        rowLimit: 25,
        dataState: "final",
      }),
      searchAnalytics(accessToken, siteUrl, {
        startDate,
        endDate,
        dimensions: ["page"],
        rowLimit: 10,
        dataState: "final",
      }),
    ]);

    const totalRow = totalsRes.rows?.[0];
    const totals = totalRow
      ? {
          clicks: num(totalRow.clicks),
          impressions: num(totalRow.impressions),
          ctr: num(totalRow.ctr),
          position: num(totalRow.position),
        }
      : {
          clicks: 0,
          impressions: 0,
          ctr: 0,
          position: 0,
        };

    return {
      configured: true,
      siteUrl,
      startDate,
      endDate,
      totals,
      topQueries: mapRows(queriesRes.rows, "query"),
      topPages: mapRows(pagesRes.rows, "page"),
    };
  } catch (err) {
    return emptyReport({
      configured: true,
      siteUrl,
      startDate,
      endDate,
      error: err instanceof Error ? err.message : "Search Console API failed",
    });
  }
}

export function formatCtr(ctr: number) {
  const pct = ctr <= 1 ? ctr * 100 : ctr;
  return `${pct.toFixed(1)}%`;
}

export function formatPosition(position: number) {
  return position > 0 ? position.toFixed(1) : "—";
}
