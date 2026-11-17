import Link from "next/link";
import { SolutionPackages } from "@/components/SolutionPackages";
import { site } from "@/lib/site";
import { formatUSD, SOLUTION_PACKAGES, SOLUTIONS } from "@/lib/solutions";

const highlights = [
  {
    id: "01",
    title: "Smart Patrol modules",
    tag: "Attendance · Checkpoint · Visitor · Vehicle",
    points: [
      "Smart Patrol Attendance — face biometric (upto 25 users)",
      "Smart Patrol Checkpoint — QR scan (upto 20 codes)",
      "Smart Patrol Visitor & Vehicle — per-site gate control",
    ],
  },
  {
    id: "02",
    title: "Smart Patrol bundles",
    tag: "Workforce Duo · Gate Duo · Site Ops Suite",
    points: [
      "Workforce Duo — Face + QR at a discounted rate",
      "Gate Duo — Visitor + Vehicle together",
      "Site Ops Suite — full Face + QR + Visitor + Vehicle stack",
    ],
  },
  {
    id: "03",
    title: "Quote-only specialties",
    tag: "Vision AI · Industry Suite · Custom Build",
    points: [
      "Smart Patrol Vision AI — CCTV attendance, counting, ANPR, OCR",
      "Smart Patrol Industry Suite — hospital, pharmacy, doctor booking",
      "Smart Patrol Custom Build — web, mobile and website projects",
    ],
  },
  {
    id: "04",
    title: "Included everywhere",
    tag: "Ticket Complaints Tracking",
    points: [
      "Availability Command Centre on every package",
      "Ticket Complaints Tracking System included",
      "Pay online with Razorpay (USD list → INR)",
    ],
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-[var(--line)] bg-[linear-gradient(120deg,#10233a_0%,#164056_48%,#0f6b74_100%)] text-white">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="shell relative grid gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#9be7ee]">
              {site.company} · {SOLUTIONS.length} solutions
            </p>
            <h1 className="display mt-3 text-4xl font-extrabold uppercase leading-none sm:text-5xl lg:text-6xl">
              {site.product}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/85">
              {site.tagline} Modular Smart Patrol packages for attendance,
              checkpoints, visitors, vehicles, Vision AI, industry apps and custom
              builds — in one CloudGen stack.
            </p>
            <p className="mt-3 max-w-xl text-sm text-white/70">
              Choose Smart Patrol Attendance, Checkpoint, Visitor or Vehicle alone —
              or Workforce Duo, Gate Duo and Site Ops Suite. Ticket Complaints
              Tracking is included on every package.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/solutions" className="btn-primary">
                Explore product
              </Link>
              <Link href="/pricing" className="btn border border-white/40 bg-transparent text-white hover:bg-white/10">
                Pricing
              </Link>
              <Link href="/contact" className="btn border border-white/40 bg-transparent text-white hover:bg-white/10">
                Contact
              </Link>
            </div>
          </div>
          <div className="card-panel bg-white/95 p-5 text-[var(--ink)] shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--ink)] text-lg font-extrabold text-white">
                CG
              </div>
              <div>
                <p className="display text-2xl font-extrabold">{site.product}</p>
                <p className="text-sm text-[var(--steel)]">{site.company}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--teal-deep)]">
                  {site.appName} app · Free · {site.appRequires}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--navy)]">
              Fifteen solutions packaged as Smart Patrol modules and suites —
              starting from {formatUSD(SOLUTION_PACKAGES[0].usdMonthly!)}/mo, with
              Ticket Complaints Tracking on every plan.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/app" className="btn-dark">
                View app details
              </Link>
              <a
                href={site.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Get it on Google Play
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">Full CloudGen catalog · {SOLUTIONS.length} solutions</p>
          <h2 className="display mt-2 text-3xl font-extrabold sm:text-4xl">
            {site.tagline}
          </h2>
          <p className="mt-3 text-[var(--steel)]">
            Digitize workforce and security with Smart Patrol packages — plus Vision
            AI, Industry Suite and Custom Build on quote — with real-time insights
            and always-on support.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {highlights.map((item) => (
            <article key={item.id} className="card-panel p-6">
              <p className="text-xs font-bold tracking-[0.14em] text-[var(--teal)]">
                {item.id}
              </p>
              <h3 className="display mt-2 text-2xl font-bold">{item.title}</h3>
              <p className="mt-1 text-sm font-semibold text-[var(--steel)]">{item.tag}</p>
              <ul className="mt-4 space-y-2 text-sm text-[var(--navy)]">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-[var(--orange)]" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/solutions" className="btn-outline">
            Explore all {SOLUTIONS.length} solutions
          </Link>
        </div>
      </section>

      <section className="shell py-16">
        <SolutionPackages />
      </section>

      <section className="shell py-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">What CloudGen delivers · {SOLUTIONS.length} solutions</p>
          <h2 className="display mt-2 text-3xl font-extrabold">
            Matched to the full product catalog
          </h2>
          <p className="mt-3 text-[var(--steel)]">
            Every CloudGen delivery maps to one of the fifteen SmartPatrol solutions.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SOLUTIONS.map((solution) => (
            <article key={solution.id} className="card-panel p-5">
              <p className="text-xs font-bold uppercase tracking-wide text-[var(--teal)]">
                {solution.platform}
              </p>
              <h3 className="mt-2 font-bold">{solution.name}</h3>
              <p className="mt-2 text-sm text-[var(--steel)]">{solution.summary}</p>
            </article>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/solutions" className="btn-primary">
            Explore product
          </Link>
          <Link href="/about" className="btn-outline">
            About CloudGen
          </Link>
        </div>
      </section>

      <section className="shell grid gap-8 py-16 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">Ready to skyrocket operations?</p>
          <h2 className="display mt-2 text-3xl font-extrabold">
            Test, demo, register and subscribe
          </h2>
          <p className="mt-3 text-[var(--steel)]">
            Follow a clear path from free testing to paid subscription — the same
            commercial flow used by modern guard-tour SaaS platforms.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/demo/test" className="btn-primary">
              Free testing
            </Link>
            <Link href="/demo" className="btn-outline">
              Schedule a demo
            </Link>
            <Link href="/register" className="btn-outline">
              Register
            </Link>
            <Link href="/pricing" className="btn-dark">
              View packages & pay
            </Link>
          </div>
        </div>
        <div className="card-panel grid gap-4 p-6 sm:grid-cols-2">
          {[
            ["01", "Register", "Create your organization profile"],
            ["02", "Demo test", "Try checkpoints, attendance and tickets"],
            ["03", "Live demo", "Walkthrough with CloudGen specialists"],
            ["04", "Subscribe", "Pick a Smart Patrol package, pay with Razorpay"],
          ].map(([num, title, body]) => (
            <div key={num} className="rounded-lg border border-[var(--line)] p-4">
              <p className="text-xs font-bold text-[var(--teal)]">{num}</p>
              <p className="mt-1 font-bold">{title}</p>
              <p className="mt-1 text-sm text-[var(--steel)]">{body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
