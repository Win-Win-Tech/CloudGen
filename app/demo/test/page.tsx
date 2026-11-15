import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/LeadForm";
import { DEMO_DURATION_DAYS } from "@/lib/demo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Free Demo Test",
  description: `Start a ${DEMO_DURATION_DAYS}-day SmartPatrol demo test — download the app, sign in with timed credentials, and try checkpoints, attendance and tickets.`,
};

export default function DemoTestPage() {
  return (
    <div className="shell grid gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <p className="eyebrow">Free testing · {DEMO_DURATION_DAYS} days</p>
        <h1 className="display mt-2 text-4xl font-extrabold">
          Try SmartPatrol before you subscribe
        </h1>
        <p className="mt-3 text-[var(--steel)]">
          Request a timed demo account, install the {site.appName} app from Google
          Play, and sign in with the credentials we issue. Access stops
          automatically when the demo window ends.
        </p>

        <ol className="mt-8 space-y-4 text-sm text-[var(--navy)]">
          <li className="rounded-lg border border-[var(--line)] bg-white p-4">
            <p className="font-bold">1. Request demo access</p>
            <p className="mt-1 text-[var(--steel)]">
              Submit your organization details. We create a unique username and
              password and store them in our <code>demo_accounts</code> database
              with an expiry timestamp.
            </p>
          </li>
          <li className="rounded-lg border border-[var(--line)] bg-white p-4">
            <p className="font-bold">2. Get credentials ({DEMO_DURATION_DAYS} days)</p>
            <p className="mt-1 text-[var(--steel)]">
              Credentials appear on this page and are emailed to you. Demo lasts{" "}
              <strong>{DEMO_DURATION_DAYS} days</strong> from issue time (IST).
            </p>
          </li>
          <li className="rounded-lg border border-[var(--line)] bg-white p-4">
            <p className="font-bold">3. Download the app &amp; sign in</p>
            <p className="mt-1 text-[var(--steel)]">
              Install{" "}
              <a
                className="font-semibold text-[var(--teal-deep)]"
                href={site.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                {site.playStoreId}
              </a>{" "}
              from Google Play, then log in with the demo username and password.
            </p>
          </li>
          <li className="rounded-lg border border-[var(--line)] bg-white p-4">
            <p className="font-bold">4. Expiry / kick-out</p>
            <p className="mt-1 text-[var(--steel)]">
              On every login the app/backend calls{" "}
              <code>/api/demo/validate</code>. If <code>expires_at</code> has
              passed, status becomes <strong>expired</strong> and login is
              rejected — credentials stop working with no manual cleanup.
            </p>
          </li>
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={site.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-dark"
          >
            Get the app
          </a>
          <Link href="/pricing" className="btn-outline">
            Compare packages
          </Link>
        </div>
      </div>
      <LeadForm kind="demo-test" defaultInterest="Free demo test" />
    </div>
  );
}
