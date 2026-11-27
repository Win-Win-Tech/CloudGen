import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

const pillars = [
  {
    title: "Attendance",
    body: "Face biometric check-in so you know who is on duty — and when.",
    href: "/solutions/face-biometric-attendance",
  },
  {
    title: "Patrol checkpoints",
    body: "Guards scan QR points on route. Time and location are logged automatically.",
    href: "/solutions/qr-checkpoint-guard-tour",
  },
  {
    title: "Visitor gate",
    body: "Digital visitor passes, host approval, and a clear entry trail.",
    href: "/solutions/visitor-management-system",
  },
  {
    title: "Vehicle gate",
    body: "Track vehicles in and out of the site with the same control desk.",
    href: "/solutions/vehicle-management-system",
  },
] as const;

const reasons = [
  {
    title: "Proof of every round",
    body: "Patrol scans create a timestamped record you can audit anytime.",
  },
  {
    title: "One app for the field",
    body: "Guards use the Guards mobile app. Supervisors see live status on web.",
  },
  {
    title: "Tickets built in",
    body: "Complaints and site issues are tracked inside the same platform.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      <section className="relative min-h-[min(92vh,820px)] overflow-hidden border-b border-[var(--line)] bg-[linear-gradient(125deg,#0d1c2e_0%,#14364a_45%,#0c5c66_100%)] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.18]"
          style={{
            backgroundImage:
              "radial-gradient(ellipse 80% 60% at 70% 40%, rgba(155,231,238,0.35), transparent 55%)",
          }}
        />
        <div className="shell relative flex min-h-[min(92vh,820px)] flex-col justify-center py-16 lg:py-20">
          <div className="home-fade max-w-3xl">
            <p className="display text-sm font-bold uppercase tracking-[0.2em] text-[#9be7ee] sm:text-base">
              {site.company}
            </p>
            <h1 className="display mt-4 text-5xl font-extrabold uppercase leading-[0.95] sm:text-6xl lg:text-7xl">
              {site.product}
            </h1>
            <p className="mt-5 max-w-xl text-xl font-medium text-white/90 sm:text-2xl">
              Security operations software for attendance, patrols, visitors and
              vehicles — in one place.
            </p>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70">
              Built for security firms and site teams who need clear proof of work,
              not another cluttered dashboard.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/demo" className="btn-primary">
                Book a demo
              </Link>
              <Link
                href="/pricing"
                className="btn border border-white/35 bg-transparent text-white hover:bg-white/10"
              >
                See pricing
              </Link>
            </div>
          </div>

          <div className="home-fade-delay pointer-events-none absolute bottom-0 right-0 hidden w-[min(48%,520px)] lg:block">
            <div className="relative aspect-[4/5] overflow-hidden rounded-tl-[2rem] opacity-90 shadow-2xl">
              <Image
                src="/campaigns/visitor-management-campaign-poster.jpg"
                alt="SmartPatrol on site — visitor and security operations"
                fill
                className="object-cover object-center"
                sizes="520px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0d1c2e] via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow">What it is</p>
          <h2 className="display mt-2 text-3xl font-extrabold sm:text-4xl">
            One platform for site security work
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-[var(--steel)]">
            SmartPatrol digitizes the daily jobs your guards already do: mark
            attendance, walk checkpoints, clear visitors, and log vehicles. You get
            a live picture of the site — without juggling spreadsheets or paper
            registers.
          </p>
        </div>
      </section>

      <section className="border-y border-[var(--line)] bg-white/70 py-16 sm:py-20">
        <div className="shell">
          <div className="max-w-2xl">
            <p className="eyebrow">Core modules</p>
            <h2 className="display mt-2 text-3xl font-extrabold sm:text-4xl">
              Four things SmartPatrol does
            </h2>
            <p className="mt-3 text-[var(--steel)]">
              Start with one module or run them together. Ticket tracking is included.
            </p>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {pillars.map((item, index) => (
              <Link
                key={item.title}
                href={item.href}
                className="group home-rise block border-l-2 border-[var(--teal)] pl-5 transition hover:border-[var(--orange)]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <h3 className="display text-xl font-bold text-[var(--ink)] group-hover:text-[var(--teal-deep)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-[var(--steel)] leading-relaxed">{item.body}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-[var(--teal-deep)]">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/solutions" className="btn-outline">
              View full product list
            </Link>
          </div>
        </div>
      </section>

      <section className="shell py-16 sm:py-20">
        <div className="max-w-2xl">
          <p className="eyebrow">Why teams choose it</p>
          <h2 className="display mt-2 text-3xl font-extrabold sm:text-4xl">
            Clear records. Less guesswork.
          </h2>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-3">
          {reasons.map((item) => (
            <div key={item.title}>
              <h3 className="display text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-[var(--steel)] leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--line)] bg-[linear-gradient(180deg,#f4f7fb_0%,#ffffff_100%)] py-16 sm:py-20">
        <div className="shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="eyebrow">Next step</p>
            <h2 className="display mt-2 text-3xl font-extrabold sm:text-4xl">
              See SmartPatrol on your site type
            </h2>
            <p className="mt-3 max-w-xl text-[var(--steel)] leading-relaxed">
              Book a short demo with CloudGen, or check package pricing first. We
              will match Attendance, Checkpoint, Visitor or Vehicle to how you
              operate today.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/demo" className="btn-primary">
                Book a demo
              </Link>
              <Link href="/pricing" className="btn-dark">
                View pricing
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact sales
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-xl border border-[var(--line)] bg-white p-5">
            <Image
              src={site.logo}
              alt="Smart Patrol logo"
              width={56}
              height={56}
              className="h-14 w-14 object-contain"
            />
            <div>
              <p className="display text-lg font-extrabold">{site.product}</p>
              <p className="text-sm text-[var(--steel)]">
                {site.appName} app · Android · {site.appRequires}
              </p>
              <a
                href={site.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-block text-sm font-semibold text-[var(--teal-deep)] hover:underline"
              >
                Get it on Google Play
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
