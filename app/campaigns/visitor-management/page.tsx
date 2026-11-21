import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

const PRIMARY_VIDEO = "/campaigns/visitor-management-animated-vo.mp4";
const PRIMARY_POSTER = "/campaigns/visitor-management-animated-vo-poster.jpg";
const SILENT_VIDEO = "/campaigns/visitor-management-campaign.mp4";
const SILENT_POSTER = "/campaigns/visitor-management-campaign-poster.jpg";

export const metadata: Metadata = {
  title: "Visitor Management Campaign Video",
  description:
    "Animated SmartPatrol Visitor Management campaign with voice-over — pre/spot registration, QR visitor passes, host SOS alerts, restricted-zone and long-stay alerts, and QR checkout.",
  alternates: {
    canonical: absoluteUrl("/campaigns/visitor-management"),
  },
  openGraph: {
    title: "Visitor Management System Campaign | CloudGen SmartPatrol",
    description:
      "Animated campaign video with voice-over for SmartPatrol Visitor Management.",
    url: absoluteUrl("/campaigns/visitor-management"),
    type: "website",
    videos: [
      {
        url: absoluteUrl(PRIMARY_VIDEO),
        type: "video/mp4",
        width: 1920,
        height: 1080,
      },
    ],
    images: [
      {
        url: absoluteUrl(PRIMARY_POSTER),
        width: 1920,
        height: 1080,
        alt: "SmartPatrol Visitor Management System animated campaign",
      },
    ],
  },
};

const FEATURES = [
  {
    title: "Pre / Spot Registration",
    body: "Register visitors ahead of arrival or instantly at the gate kiosk.",
  },
  {
    title: "QR Code Visitor Pass",
    body: "Generate secure digital passes for seamless entry.",
  },
  {
    title: "Security QR Scan at Gate",
    body: "Security scans the visitor pass in real time before allowing entry.",
  },
  {
    title: "Arrival & Approval SOS Alerts",
    body: "Notify invitee / host instantly when a visitor arrives for approval.",
  },
  {
    title: "Restricted Zone SOS Alerts",
    body: "Trigger SOS when a visitor moves into a restricted area.",
  },
  {
    title: "Long-Stay SOS Alerts",
    body: "Alert security when visitors remain inside premises too long.",
  },
  {
    title: "Checkout by QR Scan",
    body: "Security scans the visitor QR pass to close the visit securely.",
  },
] as const;

export default function VisitorManagementCampaignPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "SmartPatrol Visitor Management System — Animated Campaign",
    description:
      "Animated campaign with voice-over for CloudGen SmartPatrol Visitor Management System.",
    thumbnailUrl: absoluteUrl(PRIMARY_POSTER),
    contentUrl: absoluteUrl(PRIMARY_VIDEO),
    embedUrl: absoluteUrl("/campaigns/visitor-management"),
    uploadDate: "2026-11-21",
    duration: "PT1M18S",
    publisher: {
      "@type": "Organization",
      name: site.company,
      logo: absoluteUrl(site.logo),
    },
  };

  return (
    <div className="pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-[var(--line)] bg-[linear-gradient(160deg,#0b1f36_0%,#123552_48%,#0d2a40_100%)] text-white">
        <div className="shell grid gap-8 py-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d4af55]">
              Animated campaign · Voice-over
            </p>
            <h1 className="display mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
              Visitor Management System
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
              Watch the animated SmartPatrol visitor journey with narration —
              registration, QR passes, host approval SOS, restricted-zone and
              long-stay alerts, then QR checkout.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/demo" className="btn-primary">
                Book a demo
              </Link>
              <Link
                href="/solutions/visitor-management-system"
                className="btn-outline border-white/30 text-white hover:bg-white/10"
              >
                Product details
              </Link>
              <a
                href={PRIMARY_VIDEO}
                download
                className="btn-outline border-white/30 text-white hover:bg-white/10"
              >
                Download MP4
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/15 bg-black shadow-2xl">
            <video
              className="aspect-video w-full"
              controls
              playsInline
              preload="metadata"
              poster={PRIMARY_POSTER}
              aria-label="Animated Visitor Management System campaign with voice-over"
            >
              <source src={PRIMARY_VIDEO} type="video/mp4" />
            </video>
          </div>
        </div>
      </section>

      <section className="shell py-14">
        <h2 className="display text-3xl font-extrabold text-[var(--ink)]">
          What this campaign covers
        </h2>
        <p className="mt-2 max-w-2xl text-[var(--steel)]">
          Six visitor-ops capabilities narrated for security teams, facilities and societies.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((item, index) => (
            <li key={item.title} className="border-t border-[var(--line)] pt-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--teal-deep)]">
                Feature {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-lg font-bold text-[var(--ink)]">{item.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--steel)]">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="shell pb-14">
        <h2 className="display text-2xl font-extrabold text-[var(--ink)]">
          Silent motion version
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-[var(--steel)]">
          Prefer a shorter cut without narration? Use this version for social posts and mute autoplay.
        </p>
        <div className="mt-6 max-w-3xl overflow-hidden rounded-2xl border border-[var(--line)] bg-black">
          <video
            className="aspect-video w-full"
            controls
            playsInline
            preload="metadata"
            poster={SILENT_POSTER}
            aria-label="Silent Visitor Management campaign video"
          >
            <source src={SILENT_VIDEO} type="video/mp4" />
          </video>
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[#eef2f6]">
        <div className="shell grid gap-6 py-12 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="display text-2xl font-extrabold">{site.company}</h2>
            <p className="mt-2 text-sm text-[var(--steel)]">
              SmartPatrol | AI-Powered Smart Patrol Solutions
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--navy)]">
              {site.address}
              <br />
              Mobile: {site.phone}
              <br />
              Email:{" "}
              <a
                href="mailto:ravit@cloudgentechnologies.com"
                className="font-semibold text-[var(--teal-deep)]"
              >
                ravit@cloudgentechnologies.com
              </a>
              <br />
              Website:{" "}
              <a href={site.companyUrl} className="font-semibold text-[var(--teal-deep)]">
                {site.companyUrl}
              </a>
            </p>
            <p className="mt-3 text-xs text-[var(--steel)]">
              Workforce Management | Security Operations | CCTV AI Analytics | Incident Management
            </p>
          </div>
          <Link href="/contact" className="btn-primary">
            Get in touch
          </Link>
        </div>
      </section>
    </div>
  );
}
