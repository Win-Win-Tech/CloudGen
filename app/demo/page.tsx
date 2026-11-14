import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Book a Demo",
  description: "Schedule a SmartPatrol product demo with CloudGen Technologies.",
};

export default async function DemoPage({
  searchParams,
}: {
  searchParams: Promise<{ interest?: string }>;
}) {
  const params = await searchParams;
  const interest = params.interest || "SmartPatrol Enterprise";

  return (
    <div className="shell grid gap-10 py-12 lg:grid-cols-[1fr_1fr]">
      <div>
        <p className="eyebrow">Book a demo</p>
        <h1 className="display mt-2 text-4xl font-extrabold">
          See SmartPatrol in action
        </h1>
        <p className="mt-3 text-[var(--steel)]">
          Schedule a 15-minute walkthrough of attendance, QR patrolling, incidents,
          Smart Gate and enterprise reporting.
        </p>
        <ul className="mt-6 space-y-3 text-sm text-[var(--navy)]">
          <li>• Live product walkthrough with CloudGen specialists</li>
          <li>• Fit assessment for your sites and guard count</li>
          <li>• Guidance on Base / Pro / Gold packaging</li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/demo/test" className="btn-outline">
            Prefer free testing?
          </Link>
          <Link href="/register" className="btn-outline">
            Request a demo account
          </Link>
        </div>
      </div>
      <LeadForm kind="demo" defaultInterest={interest} />
    </div>
  );
}
