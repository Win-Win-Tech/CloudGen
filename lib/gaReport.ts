import { BetaAnalyticsDataClient } from "@google-analytics/data";

export type GaRow = { label: string; value: number; extra?: string };

export type GaDailyReport = {
  configured: boolean;
  propertyId: string | null;
  error?: string;
  yesterday: {
    activeUsers: number;
    sessions: number;
    screenPageViews: number;
    engagedSessions: number;
    averageSessionDurationSec: number;
    bounceRate: number;
  } | null;
  last7Days: {
    activeUsers: number;
    sessions: number;
    screenPageViews: number;
    engagedSessions: number;
  } | null;
  topPages: GaRow[];
  topChannels: GaRow[];
  topCountries: GaRow[];
  topSources: GaRow[];
  organicLandingPages: GaRow[];
};

function propertyId() {
  const raw =
    process.env.GA4_PROPERTY_ID?.trim() ||
    process.env.GOOGLE_ANALYTICS_PROPERTY_ID?.trim() ||
    "";
  return raw.replace(/^properties\//, "") || null;
}

function credentialsFromEnv(): object | null {
  const raw = process.env.GA_SERVICE_ACCOUNT_JSON?.trim();
  if (!raw) return null;
  try {
    return JSON.parse(raw) as object;
  } catch {
    // Allow base64-encoded JSON (easier to paste into Vercel)
    try {
      const decoded = Buffer.from(raw, "base64").toString("utf8");
      return JSON.parse(decoded) as object;
    } catch {
      return null;
    }
  }
}

export function gaReportConfigured() {
  return Boolean(propertyId() && credentialsFromEnv());
}

function metricNumber(
  row: { metricValues?: Array<{ value?: string | null }> | null } | undefined,
  index: number,
) {
  const v = row?.metricValues?.[index]?.value;
  const n = Number(v ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function emptyReport(partial?: Partial<GaDailyReport>): GaDailyReport {
  return {
    configured: false,
    propertyId: propertyId(),
    yesterday: null,
    last7Days: null,
    topPages: [],
    topChannels: [],
    topCountries: [],
    topSources: [],
    organicLandingPages: [],
    ...partial,
  };
}

function clientOrNull() {
  const credentials = credentialsFromEnv();
  if (!credentials) return null;
  return new BetaAnalyticsDataClient({ credentials });
}

async function totals(
  client: BetaAnalyticsDataClient,
  property: string,
  startDate: string,
  endDate: string,
) {
  const [response] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    metrics: [
      { name: "activeUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "engagedSessions" },
      { name: "averageSessionDuration" },
      { name: "bounceRate" },
    ],
  });
  const row = response.rows?.[0];
  return {
    activeUsers: metricNumber(row, 0),
    sessions: metricNumber(row, 1),
    screenPageViews: metricNumber(row, 2),
    engagedSessions: metricNumber(row, 3),
    averageSessionDurationSec: metricNumber(row, 4),
    bounceRate: metricNumber(row, 5),
  };
}

async function dimensionReport(
  client: BetaAnalyticsDataClient,
  property: string,
  dimension: string,
  metric: string,
  startDate: string,
  endDate: string,
  limit = 8,
  dimensionFilter?: object,
): Promise<GaRow[]> {
  const [response] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: dimension }],
    metrics: [{ name: metric }],
    orderBys: [{ metric: { metricName: metric }, desc: true }],
    limit,
    ...(dimensionFilter ? { dimensionFilter } : {}),
  });

  return (response.rows || []).map((row) => ({
    label: row.dimensionValues?.[0]?.value || "(not set)",
    value: metricNumber(row, 0),
  }));
}

async function sourceMediumReport(
  client: BetaAnalyticsDataClient,
  property: string,
  startDate: string,
  endDate: string,
  limit = 8,
): Promise<GaRow[]> {
  const [response] = await client.runReport({
    property,
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: "sessionSource" }, { name: "sessionMedium" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit,
  });

  return (response.rows || []).map((row) => ({
    label: `${row.dimensionValues?.[0]?.value || "(direct)"} / ${row.dimensionValues?.[1]?.value || "(none)"}`,
    value: metricNumber(row, 0),
  }));
}

/**
 * Pull a detailed GA4 snapshot for the daily digest.
 * Requires GA4_PROPERTY_ID + GA_SERVICE_ACCOUNT_JSON (Viewer on the property).
 */
export async function fetchGaDailyReport(): Promise<GaDailyReport> {
  const id = propertyId();
  const client = clientOrNull();
  if (!id || !client) {
    return emptyReport({
      configured: false,
      error: !id
        ? "Missing GA4_PROPERTY_ID"
        : "Missing or invalid GA_SERVICE_ACCOUNT_JSON",
    });
  }

  const property = `properties/${id}`;

  try {
    const [
      yesterday,
      last7,
      topPages,
      topChannels,
      topCountries,
      topSources,
      organicLandingPages,
    ] = await Promise.all([
      totals(client, property, "yesterday", "yesterday"),
      totals(client, property, "7daysAgo", "yesterday"),
      dimensionReport(
        client,
        property,
        "pagePath",
        "screenPageViews",
        "7daysAgo",
        "yesterday",
        8,
      ),
      dimensionReport(
        client,
        property,
        "sessionDefaultChannelGrouping",
        "sessions",
        "7daysAgo",
        "yesterday",
        8,
      ),
      dimensionReport(
        client,
        property,
        "country",
        "activeUsers",
        "7daysAgo",
        "yesterday",
        5,
      ),
      sourceMediumReport(client, property, "7daysAgo", "yesterday", 8),
      dimensionReport(
        client,
        property,
        "landingPagePlusQueryString",
        "sessions",
        "7daysAgo",
        "yesterday",
        8,
        {
          filter: {
            fieldName: "sessionDefaultChannelGrouping",
            stringFilter: { value: "Organic Search", matchType: "EXACT" },
          },
        },
      ),
    ]);

    return {
      configured: true,
      propertyId: id,
      yesterday: {
        activeUsers: yesterday.activeUsers,
        sessions: yesterday.sessions,
        screenPageViews: yesterday.screenPageViews,
        engagedSessions: yesterday.engagedSessions,
        averageSessionDurationSec: yesterday.averageSessionDurationSec,
        bounceRate: yesterday.bounceRate,
      },
      last7Days: {
        activeUsers: last7.activeUsers,
        sessions: last7.sessions,
        screenPageViews: last7.screenPageViews,
        engagedSessions: last7.engagedSessions,
      },
      topPages,
      topChannels,
      topCountries,
      topSources,
      organicLandingPages,
    };
  } catch (err) {
    return emptyReport({
      configured: true,
      propertyId: id,
      error: err instanceof Error ? err.message : "GA4 API request failed",
    });
  }
}

export function formatDuration(seconds: number) {
  if (!seconds || seconds < 0) return "0s";
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function formatPct(rate: number) {
  // GA4 bounceRate is 0–1
  const pct = rate <= 1 ? rate * 100 : rate;
  return `${pct.toFixed(1)}%`;
}
