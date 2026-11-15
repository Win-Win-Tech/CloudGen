import type { Metadata } from "next";
import Link from "next/link";
import { COMPANY_SERVICES, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Us",
  description: `About ${site.company} — builders of the Guards / SmartPatrol workforce and security operations platform in Madurai, India.`,
};

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
            attendance — plus custom web, mobile, cloud and IoT delivery for
            organizations across Madurai and India.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[
            [
              "Product",
              `${site.appName} / ${site.product}`,
              "Workforce management with QR patrol, face attendance, ticketing and gate control.",
            ],
            [
              "Delivery",
              "Web · Mobile · Cloud · AI",
              "Full-stack builds, Flutter apps, cloud transformation and AI/vision integrations.",
            ],
            [
              "Support",
              "Always on",
              "Demo, onboarding and 24×7 WhatsApp command-centre style operations support.",
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
          <p className="eyebrow">Company services</p>
          <h2 className="display mt-2 text-3xl font-extrabold">
            What CloudGen delivers
          </h2>
          <p className="mt-2 max-w-2xl text-[var(--steel)]">
            Service lines published on cloudgentechnologies.com — available as
            standalone engagements or alongside {site.product} deployments.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {COMPANY_SERVICES.map((service) => (
              <article key={service.title} className="card-panel p-5">
                <h3 className="font-bold text-[var(--ink)]">{service.title}</h3>
                <p className="mt-2 text-sm text-[var(--steel)]">{service.body}</p>
              </article>
            ))}
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
