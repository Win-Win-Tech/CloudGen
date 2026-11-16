import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { OpenTawkButton } from "@/components/OpenTawkButton";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.company} for SmartPatrol demos, pricing, and custom digital solutions.`,
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string }>;
}) {
  const params = await searchParams;
  const interest = params.interest || "General enquiry";

  return (
    <div className="shell grid gap-10 py-12 lg:grid-cols-[1fr_1fr]">
      <div>
        <p className="eyebrow">Contact</p>
        <h1 className="display mt-2 text-4xl font-extrabold">
          Talk to {site.company}
        </h1>
        <p className="mt-3 text-[var(--steel)]">
          Reach us for product demos, Smart Patrol packages (Attendance,
          Checkpoint, Visitor, Vehicle, Site Ops Suite), or Vision AI / Industry /
          Custom Build quotes.
        </p>

        <div className="mt-8 space-y-4 text-sm">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--steel)]">
              Click to chat
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <a
                href={site.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn bg-[#25D366] text-white hover:bg-[#1ebe57]"
              >
                WhatsApp
              </a>
              <OpenTawkButton className="btn-primary" />
            </div>
            <p className="mt-2 text-xs text-[var(--steel)]">
              Use the floating Click to chat button anytime, or WhatsApp {site.phone}.
            </p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--steel)]">
              Phone
            </p>
            <a className="mt-1 block text-lg font-bold text-[var(--teal-deep)]" href={site.phoneHref}>
              {site.phone}
            </a>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--steel)]">
              Email
            </p>
            <a
              className="mt-1 block text-lg font-bold text-[var(--teal-deep)]"
              href={`mailto:${site.email}`}
            >
              {site.email}
            </a>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--steel)]">
              Address
            </p>
            <p className="mt-1 max-w-md text-[var(--navy)]">{site.address}</p>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[var(--steel)]">
              Website
            </p>
            <a
              className="mt-1 block font-semibold text-[var(--teal-deep)]"
              href={site.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              cloudgentechnologies.com
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/demo" className="btn-outline">
            Book a product demo
          </Link>
          <Link href="/demo/test" className="btn-outline">
            Free testing
          </Link>
        </div>
      </div>

      <LeadForm kind="contact" defaultInterest={interest} />
    </div>
  );
}
