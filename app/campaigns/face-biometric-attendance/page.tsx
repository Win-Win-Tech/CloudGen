import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

const PRIMARY_VIDEO = "/campaigns/face-biometric-attendance-campaign.mp4";
const PRIMARY_POSTER =
  "/campaigns/face-biometric-attendance-campaign-poster.jpg";

export const metadata: Metadata = {
  title: "Face Biometric Attendance Campaign Video",
  description:
    "CloudGen SmartPatrol campaign video — a presenter explains the Guards mobile app face biometric attendance system with geofence and liveness checks for Indian sites.",
  alternates: {
    canonical: absoluteUrl("/campaigns/face-biometric-attendance"),
  },
  openGraph: {
    title: "Face Biometric Attendance Campaign | CloudGen SmartPatrol",
    description:
      "Campaign video explaining SmartPatrol mobile face biometric attendance for security and facility teams.",
    url: absoluteUrl("/campaigns/face-biometric-attendance"),
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
        alt: "SmartPatrol Face Biometric Attendance campaign presenter",
      },
    ],
  },
};

const FEATURES = [
  {
    title: "Mobile face punch",
    body: "Guards open the Guards Android app and punch with their face — no passwords.",
  },
  {
    title: "Liveness checks",
    body: "Reduce buddy punching with live face capture on the phone camera.",
  },
  {
    title: "Geofence attendance",
    body: "Limit punches to the approved site boundary for cleaner payroll trails.",
  },
  {
    title: "Supervisor visibility",
    body: "See who is present across factories, campuses, hospitals and multi-site deployments.",
  },
  {
    title: "Field-ready Android app",
    body: "Built for security and facility teams working on site every day.",
  },
  {
    title: "Replace paper registers",
    body: "Move from clipboards to auditable digital attendance with SmartPatrol.",
  },
] as const;

export default function FaceBiometricAttendanceCampaignPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: "SmartPatrol Face Biometric Attendance — Campaign",
    description:
      "Presenter-led campaign video for CloudGen SmartPatrol mobile face biometric attendance.",
    thumbnailUrl: absoluteUrl(PRIMARY_POSTER),
    contentUrl: absoluteUrl(PRIMARY_VIDEO),
    embedUrl: absoluteUrl("/campaigns/face-biometric-attendance"),
    uploadDate: "2026-11-28",
    duration: "PT1M6S",
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
        <div className="shell grid gap-8 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#d4af55]">
              Campaign · Presenter + Voice
            </p>
            <h1 className="display mt-3 text-4xl font-extrabold leading-tight md:text-5xl">
              Face Biometric Attendance
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
              Watch how SmartPatrol&apos;s Guards mobile app captures face
              punches with liveness and geofence checks — so supervisors get
              real, on-site attendance for payroll and audits.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/demo" className="btn-primary">
                Book a demo
              </Link>
              <Link
                href="/solutions/face-biometric-attendance"
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
              aria-label="Face biometric attendance campaign video with presenter voice-over"
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
          Mobile face attendance for security agencies, factories, campuses and
          facility teams.
        </p>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((item, index) => (
            <li key={item.title} className="border-t border-[var(--line)] pt-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--teal-deep)]">
                Feature {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-2 text-lg font-bold text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-[var(--steel)]">
                {item.body}
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-[var(--line)] bg-[#eef2f6]">
        <div className="shell grid gap-6 py-12 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <h2 className="display text-2xl font-extrabold">{site.company}</h2>
            <p className="mt-2 text-sm text-[var(--steel)]">
              SmartPatrol | AI-Powered Smart Patrol Solutions
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-[var(--navy)]">
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
              <a
                href={site.companyUrl}
                className="font-semibold text-[var(--teal-deep)]"
              >
                {site.companyUrl}
              </a>
            </p>
            <p className="mt-3 text-xs text-[var(--steel)]">
              Face biometric attendance · Geofence punch · Guards Android app
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
