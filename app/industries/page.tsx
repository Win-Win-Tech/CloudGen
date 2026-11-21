import type { Metadata } from "next";
import Link from "next/link";
import { INDUSTRIES } from "@/lib/industries";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Industries & Domains | SmartPatrol Use Cases",
  description:
    "How CloudGen SmartPatrol is leveraged by security companies, consultants, FM & property managers, healthcare, education, IT, manufacturing, malls, airports, stations, apartments and warehouses.",
  keywords: [
    "guard tour system industries",
    "security management software India",
    "facility management patrol software",
    "apartment visitor management",
    "warehouse security software",
    "airport guard patrol system",
  ],
  alternates: { canonical: absoluteUrl("/industries") },
};

export default function IndustriesPage() {
  return (
    <div className="pb-16">
      <section className="border-b border-[var(--line)] bg-white py-12">
        <div className="shell max-w-3xl">
          <p className="eyebrow">Domains</p>
          <h1 className="display mt-2 text-4xl font-extrabold sm:text-5xl">
            Industries that run on SmartPatrol
          </h1>
          <p className="mt-3 text-[var(--steel)]">
            From security firms to airports and apartments — see how each domain
            can leverage attendance, QR patrolling, gate control, ticketing and
            Vision AI.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {INDUSTRIES.map((item) => (
              <a
                key={item.slug}
                href={`#${item.slug}`}
                className="rounded-md border border-[var(--line)] bg-[#f8fafc] px-3 py-1.5 text-xs font-semibold text-[var(--navy)] hover:border-[var(--teal)] hover:text-[var(--teal-deep)]"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="shell space-y-8 py-12">
        {INDUSTRIES.map((item, index) => (
          <article
            key={item.slug}
            id={item.slug}
            className="card-panel scroll-mt-24 p-6 sm:p-8"
          >
            <p className="text-xs font-bold tracking-[0.14em] text-[var(--teal)]">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2 className="display mt-2 text-3xl font-bold">{item.title}</h2>
            <p className="mt-2 max-w-3xl text-[var(--steel)]">{item.summary}</p>

            <h3 className="mt-6 text-sm font-bold uppercase tracking-[0.1em] text-[var(--navy)]">
              How SmartPatrol can be leveraged
            </h3>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {item.leverage.map((point) => (
                <li key={point} className="flex gap-2 text-sm text-[var(--navy)]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-[var(--orange)]" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              {item.modules.map((mod) => (
                <span
                  key={mod}
                  className="rounded-full border border-[var(--line)] bg-[#eef6f7] px-3 py-1 text-xs font-semibold text-[var(--teal-deep)]"
                >
                  {mod}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="shell">
        <div className="card-panel flex flex-col gap-4 bg-[linear-gradient(120deg,#10233a,#0f6b74)] p-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9be7ee]">
              Next step
            </p>
            <h2 className="display mt-2 text-2xl font-extrabold">
              Map SmartPatrol to your domain
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/80">
              Tell us your industry and site count — we will recommend the right
              package and a pilot plan.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/demo" className="btn-primary">
              Book a demo
            </Link>
            <Link
              href="/pricing"
              className="btn border border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
