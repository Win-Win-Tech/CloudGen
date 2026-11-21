import Link from "next/link";
import { PRODUCT_PILLARS } from "@/lib/seo";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[#eef2f6]">
      <div className="shell grid gap-8 py-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <p className="display text-xl font-extrabold uppercase">{site.company}</p>
          <p className="mt-1 text-sm text-[var(--steel)]">
            {site.product} · {site.appName} workforce app
          </p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--steel)]">
            Smart Patrol packages for attendance, checkpoints, visitors, vehicles,
            Vision AI, industry apps and custom builds — from Madurai, India.
          </p>
          <p className="mt-4 text-xs text-[var(--steel)]">
            Copyright © {new Date().getFullYear()} {site.company}
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--steel)]">
            Pages
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm font-semibold">
            <Link href="/">Home</Link>
            <Link href="/about">About Us</Link>
            <Link href="/solutions">Product</Link>
            <Link href="/industries">Industries</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/blog">Guides</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/app">Get the App</Link>
            <Link href="/demo">Book a Demo</Link>
            <Link href="/privacy">Privacy Policy</Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--steel)]">
            Solutions
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm font-semibold">
            {PRODUCT_PILLARS.map((pillar) => (
              <Link key={pillar.slug} href={`/solutions/${pillar.slug}`}>
                {pillar.h1.split(" for ")[0]}
              </Link>
            ))}
            <Link href="/pricing" className="text-[var(--teal-deep)]">
              All packages →
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--steel)]">
            Contact
          </p>
          <div className="mt-3 space-y-2 text-sm">
            <p>
              <a className="font-semibold text-[var(--teal-deep)]" href={site.phoneHref}>
                {site.phone}
              </a>
            </p>
            <p>
              <a
                className="font-semibold text-[var(--teal-deep)]"
                href={`mailto:${site.email}`}
              >
                {site.email}
              </a>
            </p>
            <p className="text-[var(--steel)]">{site.address}</p>
            <p>
              <a
                className="font-semibold text-[var(--teal-deep)]"
                href={site.companyUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                cloudgentechnologies.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
