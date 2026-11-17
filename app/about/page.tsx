import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { SOLUTIONS, type Solution } from "@/lib/solutions";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${site.company} — builders of the Guards / SmartPatrol workforce and security operations platform in Madurai, India.`,
};

const CATEGORY_LABELS: Record<Solution["category"], string> = {
  workforce: "Smart Patrol Attendance",
  security: "Smart Patrol Checkpoint · Visitor · Vehicle",
  operations: "Smart Patrol Industry Suite & Ticketing",
  cctv: "Smart Patrol Vision AI",
  custom: "Smart Patrol Custom Build",
};

const CATEGORY_ORDER: Solution["category"][] = [
  "workforce",
  "security",
  "operations",
  "cctv",
  "custom",
];

export default function AboutPage() {
  return (
    <div className="pb-16">
      <section className="shell py-12">
        <div className="max-w-3xl">
          <p className="eyebrow">About Us</p>
          <h1 className="display mt-2 text-4xl font-extrabold sm:text-5xl">
            {site.company}
          </h1>
          <p className="mt-4 text-lg text-[var(--navy)]">
            {site.tagline}
          </p>
          <p className="mt-3 text-[var(--steel)]">
            We build AI-powered workforce and security products — starting with
            the Guards / {site.product} mobile platform for QR checkpoint
            scanning, guard tour patrolling, and geofence face biometric
            attendance — plus the full catalog of fifteen CloudGen solutions for
            organizations across Madurai and India.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            [
              "Product",
              `${site.appName} / ${site.product}`,
              "Smart Patrol Attendance, Checkpoint, Visitor, Vehicle and Site Ops Suite.",
            ],
            [
              "Catalog",
              `${SOLUTIONS.length} solutions`,
              "Modular USD packages plus Vision AI, Industry Suite and Custom Build quotes.",
            ],
            [
              "Support",
              "Always on",
              "Demo, onboarding and Ticket Complaints Tracking System operations support.",
            ],
          ].map(([eyebrow, title, body]) => (
            <article key={title} className="card-panel p-6">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--teal)]">
                {eyebrow}
              </p>
              <h2 className="mt-2 text-xl font-bold">{title}</h2>
              <p className="mt-2 text-sm text-[var(--steel)]">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[#f7fafc] py-12">
        <div className="shell">
          <p className="eyebrow">Product catalog · {SOLUTIONS.length} solutions</p>
          <h2 className="display mt-2 text-3xl font-extrabold">
            What CloudGen delivers
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--steel)]">
            Every CloudGen offering maps to one of the fifteen SmartPatrol
            solutions — available as modular USD packages or custom quotes.
          </p>

          <div className="mt-10 space-y-10">
            {CATEGORY_ORDER.map((category) => {
              const items = SOLUTIONS.filter((s) => s.category === category);
              return (
                <div key={category}>
                  <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-[var(--teal-deep)]">
                    {CATEGORY_LABELS[category]}
                  </h3>
                  <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((solution) => (
                      <article key={solution.id} className="card-panel p-5">
                        <p className="text-xs font-bold uppercase tracking-wide text-[var(--teal)]">
                          {solution.platform}
                        </p>
                        <h4 className="mt-2 font-bold text-[var(--ink)]">
                          {solution.name}
                        </h4>
                        <p className="mt-2 text-sm text-[var(--steel)]">
                          {solution.summary}
                        </p>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/solutions" className="btn-primary">
              View full product details
            </Link>
            <Link href="/pricing" className="btn-outline">
              See package pricing
            </Link>
          </div>
        </div>
      </section>

      <section className="shell py-12">
        <div className="card-panel grid gap-6 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <h2 className="display text-3xl font-extrabold">Based in Madurai</h2>
            <p className="mt-3 text-[var(--steel)]">{site.address}</p>
            <p className="mt-2 text-sm text-[var(--navy)]">
              <a className="font-semibold text-[var(--teal-deep)]" href={site.phoneHref}>
                {site.phone}
              </a>
              {" · "}
              <a
                className="font-semibold text-[var(--teal-deep)]"
                href={`mailto:${site.email}`}
              >
                {site.email}
              </a>
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/contact" className="btn-primary">
              Contact us
            </Link>
            <Link href="/pricing" className="btn-outline">
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
