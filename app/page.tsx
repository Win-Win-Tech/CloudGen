import Link from "next/link";
import { PricingCalculator } from "@/components/PricingCalculator";
import { site } from "@/lib/site";

const solutions = [
  {
    id: "01",
    title: "Smart Patrol",
    tag: "Geofence & workforce attendance",
    points: [
      "Liveness face biometric verification and GPS geofencing",
      "Present, Absent, Half Day, Less Duration & On-Work controls",
      "Automatic checkout on boundary breach or shift buffer time",
    ],
  },
  {
    id: "02",
    title: "Smart Patrolling",
    tag: "QR checkpoint & incident management",
    points: [
      "Scheduled QR checkpoint scans with time/location verification",
      "Raise incidents with voice, image and video evidence",
      "Automated WhatsApp and IVR ticket alerts",
    ],
  },
  {
    id: "03",
    title: "Smart Gate",
    tag: "Visitor & vehicle management",
    points: [
      "ID capture with name, ID number and address extraction",
      "Vehicle image capture and registration number recognition",
      "Digital QR pass, blacklist/whitelist and SOS alerts",
    ],
  },
  {
    id: "04",
    title: "Enterprise Suite",
    tag: "Integrated security operations",
    points: [
      "All modules in one centralized platform",
      "CCTV AI analytics integration options",
      "Audit trail, roles and management reporting",
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
              {site.company}
            </p>
            <h1 className="display mt-3 text-5xl font-extrabold uppercase leading-none sm:text-6xl">
              {site.name}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/85">
              The No.1 AI-powered guard tour & workforce platform for security
              companies and facility managers.
            </p>
            <p className="mt-3 max-w-xl text-sm text-white/70">{site.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/demo/test" className="btn-primary">
                Free testing
              </Link>
              <Link href="/demo" className="btn border border-white/40 bg-transparent text-white hover:bg-white/10">
                Book a demo
              </Link>
              <Link href="/register" className="btn border border-white/40 bg-transparent text-white hover:bg-white/10">
                Request a demo account
              </Link>
            </div>
          </div>
          <div className="card-panel bg-white/95 p-5 text-[var(--ink)] shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--ink)] text-lg font-extrabold text-white">
                SP
              </div>
              <div>
                <p className="display text-2xl font-extrabold">SMART PATROL</p>
                <p className="text-sm text-[var(--steel)]">{site.company}</p>
                <p className="mt-2 text-sm font-semibold text-[var(--teal-deep)]">
                  Productivity · Free · {site.appRequires}
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[var(--navy)]">
              QR checkpoint scanning, guard tour patrolling, geofence face biometric
              attendance, ticketing and automated payslips — in one mobile app.
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
          <p className="eyebrow">A new way of patrol monitoring</p>
          <h2 className="display mt-2 text-3xl font-extrabold sm:text-4xl">
            Manage your security staff from everywhere
          </h2>
          <p className="mt-3 text-[var(--steel)]">
            Digitize attendance, checkpoint rounds, incidents and gate access with
            real-time visibility and automated daily reports at 7:00 AM.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {solutions.map((item) => (
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
            Explore all solutions
          </Link>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-[#f7fafc] py-16">
        <div className="shell">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <p className="eyebrow">Just a few clicks away</p>
            <h2 className="display mt-2 text-3xl font-extrabold sm:text-4xl">
              Choose your SmartPatrol plan
            </h2>
            <p className="mt-3 text-[var(--steel)]">
              Same package structure and EUR pricing model as leading guard-tour
              platforms — Base, Pro and Gold — with a guard slider and Razorpay
              subscription checkout.
            </p>
          </div>
          <PricingCalculator />
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
            <Link href="/checkout" className="btn-dark">
              Subscribe & pay
            </Link>
          </div>
        </div>
        <div className="card-panel grid gap-4 p-6 sm:grid-cols-2">
          {[
            ["01", "Register", "Create your organization profile"],
            ["02", "Demo test", "Try checkpoints, attendance and tickets"],
            ["03", "Live demo", "Walkthrough with CloudGen specialists"],
            ["04", "Subscribe", "Pick guards, checkout with Razorpay"],
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
