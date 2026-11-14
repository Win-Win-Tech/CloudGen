import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Free Demo Test",
  description:
    "Start a free SmartPatrol demo test for checkpoints, attendance and incident workflows.",
};

export default function DemoTestPage() {
  return (
    <div className="shell grid gap-10 py-12 lg:grid-cols-[1fr_1fr]">
      <div>
        <p className="eyebrow">Free testing</p>
        <h1 className="display mt-2 text-4xl font-extrabold">
          Try SmartPatrol before you subscribe
        </h1>
        <p className="mt-3 text-[var(--steel)]">
          Request access to a guided demo test environment. Validate QR scans,
          geofence attendance, tickets and reporting with your team.
        </p>
        <ol className="mt-6 space-y-3 text-sm text-[var(--navy)]">
          <li>1. Submit your organization details</li>
          <li>2. Receive demo credentials by email</li>
          <li>3. Test mobile + web workflows</li>
          <li>4. Choose a plan and checkout with Razorpay</li>
        </ol>
        <Link href="/pricing" className="btn-dark mt-8 inline-flex">
          Compare packages
        </Link>
      </div>
      <LeadForm kind="demo-test" defaultInterest="Free demo test" />
    </div>
  );
}
