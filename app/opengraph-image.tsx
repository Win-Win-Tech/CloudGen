import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.company} — ${site.product}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(120deg, #10233a 0%, #164056 48%, #0f6b74 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: 2, opacity: 0.85 }}>
          {site.company.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.05 }}>
            {site.product}
          </div>
          <div style={{ fontSize: 32, opacity: 0.9, maxWidth: 900 }}>
            {site.tagline}
          </div>
        </div>
        <div style={{ fontSize: 24, opacity: 0.8 }}>
          Guard tour · Face attendance · Visitor · Vehicle · Vision AI
        </div>
      </div>
    ),
    { ...size },
  );
}
