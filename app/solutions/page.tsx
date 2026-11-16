import type { Metadata } from "next";
import Link from "next/link";
import { SolutionPackages } from "@/components/SolutionPackages";
import {
  SOLUTIONS,
  VALUE_PROPS,
  type Solution,
} from "@/lib/solutions";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Fifteen CloudGen SmartPatrol solutions — workforce, security ops, CCTV AI, industry apps and custom development — packaged with competitive INR pricing.",
};

const CATEGORY_ORDER: {
  id: Solution["category"];
  title: string;
  subtitle: string;
}[] = [
  {
    id: "workforce",
    title: "Workforce Management",
    subtitle: "Attendance and presence with mobile biometrics.",
  },
  {
    id: "security",
    title: "Security Operations",
    subtitle: "Visitors, vehicles and QR checkpoint patrolling.",
  },
  {
    id: "operations",
    title: "Incident & Industry Operations",
    subtitle: "24×7 ticketing plus ready vertical business apps.",
  },
  {
    id: "cctv",
    title: "CCTV AI Analytics",
    subtitle: "Attendance, people counting, ANPR and ID OCR.",
  },
  {
    id: "custom",
    title: "Custom Development",
    subtitle: "Web apps, mobile apps and modern websites.",
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
            workforce management, security operations, CCTV AI analytics and
            incident management — available as competitive USD packages.
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
