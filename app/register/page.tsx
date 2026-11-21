import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Register",
  description: "Register your organization for SmartPatrol access and onboarding.",
  robots: { index: false, follow: false },
};

export default function RegisterPage() {
  return (
    <div className="shell grid gap-10 py-12 lg:grid-cols-[1fr_1fr]">
      <div>
        <p className="eyebrow">User registration</p>
        <h1 className="display mt-2 text-4xl font-extrabold">
          Register your organization
        </h1>
        <p className="mt-3 text-[var(--steel)]">
          Create your SmartPatrol profile to unlock demo accounts, onboarding and
          subscription checkout.
        </p>
        <div className="mt-8 space-y-3 text-sm">
          <p className="font-semibold text-[var(--navy)]">After registration you can:</p>
          <ul className="space-y-2 text-[var(--steel)]">
            <li>• Start a free demo test</li>
            <li>• Book a live specialist demo</li>
            <li>• Download the SMART PATROL Android app</li>
            <li>• Subscribe online with Razorpay</li>
          </ul>
        </div>
        <Link href="/pricing" className="btn-outline mt-8 inline-flex">
          Browse Smart Patrol packages
        </Link>
      </div>
      <LeadForm kind="register" />
    </div>
  );
}
