import Link from "next/link";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[#eef2f6]">
      <div className="shell grid gap-8 py-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <p className="display text-xl font-extrabold uppercase">{site.name}</p>
          <p className="mt-1 text-sm text-[var(--steel)]">{site.company}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--steel)]">
            Features and integrations depend on deployment scope, devices/cameras,
            connectivity and third-party services. Attendance controls should be
            validated against local regulations.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--steel)]">
            Product
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm font-semibold">
            <Link href="/solutions">Solutions</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/app">Get the App</Link>
            <Link href="/demo">Book a Demo</Link>
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
          </div>
        </div>
      </div>
    </footer>
  );
}
