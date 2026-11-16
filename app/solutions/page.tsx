import type { Metadata } from "next";
import Link from "next/link";
import { SolutionPackages } from "@/components/SolutionPackages";
import { PRODUCT_PILLARS, absoluteUrl } from "@/lib/seo";
import {
  SOLUTIONS,
  VALUE_PROPS,
  type Solution,
} from "@/lib/solutions";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Fifteen CloudGen SmartPatrol solutions — workforce, security ops, CCTV AI, industry apps and custom development — packaged with competitive INR pricing.",
  alternates: { canonical: absoluteUrl("/solutions") },
};

const CATEGORY_ORDER: {
  id: Solution["category"];
  title: string;
  subtitle: string;
}[] = [
  {
    id: "workforce",
    title: "Smart Patrol Attendance",
    subtitle: "Face biometric attendance — sold as Smart Patrol Attendance.",
  },
  {
    id: "security",
    title: "Smart Patrol Checkpoint · Visitor · Vehicle",
    subtitle: "QR patrol and gate modules — alone or in Duo / Site Ops Suite.",
  },
  {
    id: "operations",
    title: "Smart Patrol Industry Suite & Ticketing",
    subtitle: "Ticket Complaints Tracking on every package · Industry Suite on quote.",
  },
  {
    id: "cctv",
    title: "Smart Patrol Vision AI",
    subtitle: "CCTV attendance, people counting, ANPR and ID OCR — quote only.",
  },
  {
    id: "custom",
    title: "Smart Patrol Custom Build",
    subtitle: "Web apps, mobile apps and modern websites — quote only.",
  },
];

export default function SolutionsPage() {
  return (
    <div className="pb-16">
      <section className="shell py-12">
        <div className="max-w-3xl">
          <p className="eyebrow">Product catalog</p>
          <h1 className="display mt-2 text-4xl font-extrabold">
            AI-powered Smart Patrol solutions
          </h1>
          <p className="mt-3 text-[var(--steel)]">
            Smarter solutions. Safer communities. Fifteen CloudGen offerings across
            workforce, security, Vision AI, industry and custom delivery — available
            as competitive Smart Patrol INR packages.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {VALUE_PROPS.map((item) => (
            <div key={item.title} className="card-panel p-5">
              <p className="font-bold text-[var(--ink)]">{item.title}</p>
              <p className="mt-2 text-sm text-[var(--steel)]">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h2 className="display text-2xl font-extrabold">Top solution guides</h2>
          <p className="mt-2 max-w-2xl text-sm text-[var(--steel)]">
            Deep-dive landing pages for the searches buyers use most — attendance,
            QR guard tour, visitor, vehicle and Vision AI.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_PILLARS.map((pillar) => (
              <Link
                key={pillar.slug}
                href={`/solutions/${pillar.slug}`}
                className="rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--navy)] hover:border-[var(--teal)] hover:text-[var(--teal-deep)]"
              >
                {pillar.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[#f7fafc] py-12">
        <div className="shell space-y-10">
          {CATEGORY_ORDER.map((category, index) => {
            const items = SOLUTIONS.filter((s) => s.category === category.id);
            return (
              <div key={category.id}>
                <p className="text-xs font-bold tracking-[0.14em] text-[var(--teal)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="display mt-2 text-3xl font-bold">{category.title}</h2>
                <p className="mt-1 font-semibold text-[var(--steel)]">
                  {category.subtitle}
                </p>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {items.map((solution) => (
                    <article key={solution.id} className="card-panel p-5">
                      <p className="text-xs font-bold uppercase tracking-wide text-[var(--teal-deep)]">
                        {solution.platform}
                      </p>
                      <h3 className="mt-2 text-lg font-bold text-[var(--ink)]">
                        {solution.name}
                      </h3>
                      <p className="mt-2 text-sm text-[var(--navy)]">
                        {solution.summary}
                      </p>
                    </article>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="shell py-14">
        <SolutionPackages />
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/pricing" className="btn-primary">
            Compare package pricing
          </Link>
          <Link href="/demo" className="btn-outline">
            Book a demo
          </Link>
        </div>
      </section>
    </div>
  );
}
