import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get the App",
  description:
    "Download SMART PATROL by CloudGen Technologies — QR checkpoint scanning, geofence attendance, tickets and payslips.",
};

const screenshots = [
  "Attendance & geofence",
  "QR checkpoint scan",
  "Incident tickets",
  "Live alerts",
  "Shift & payroll",
];

export default function AppPage() {
  return (
    <div className="pb-16">
      <section className="border-b border-[var(--line)] bg-white">
        <div className="shell grid gap-8 py-10 lg:grid-cols-[auto_1fr] lg:items-start">
          <div className="flex h-28 w-28 items-center justify-center rounded-[28px] bg-[var(--ink)] text-3xl font-extrabold text-white shadow-lg">
            SP
          </div>
          <div>
            <h1 className="display text-4xl font-extrabold">SMART PATROL</h1>
            <p className="mt-1 text-lg font-semibold text-[var(--teal-deep)]">
              {site.company}
            </p>
            <p className="mt-3 max-w-2xl text-[var(--steel)]">
              A smart mobile application for security companies and facility managers
              that streamlines guard tour patrolling with ticket management, auto
              alerts, geofence attendance and automated payslip generation.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-[var(--steel)]">
              <span className="rounded-full bg-[#eef6f7] px-3 py-1 font-semibold text-[var(--teal-deep)]">
                Productivity
              </span>
              <span>Contains ads: No</span>
              <span>In-app purchases: No</span>
              <span>Version {site.appVersion}</span>
              <span>{site.appSize}</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={site.playStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary min-w-40"
              >
                Install
              </a>
              <Link href="/demo/test" className="btn-outline">
                Free demo test
              </Link>
              <Link href="/demo" className="btn-outline">
                Book a live demo
              </Link>
            </div>
            <p className="mt-3 text-xs text-[var(--steel)]">
              Package ID: {site.playStoreId} · Requires {site.appRequires}
            </p>
            <p className="mt-2 max-w-2xl text-sm text-[var(--navy)]">
              For a free trial: request demo credentials on{" "}
              <Link className="font-semibold text-[var(--teal-deep)]" href="/demo/test">
                Free demo test
              </Link>
              , install this app, then sign in. Access lasts a fixed window and is
              rejected automatically after expiry.
            </p>
          </div>
        </div>
      </section>

      <section className="shell py-10">
        <h2 className="display text-2xl font-bold">Screenshots</h2>
        <div className="mt-5 flex gap-4 overflow-x-auto pb-2">
          {screenshots.map((label, index) => (
            <div
              key={label}
              className="h-72 w-40 shrink-0 rounded-2xl border border-[var(--line)] bg-[linear-gradient(160deg,#10233a,#0f6b74)] p-4 text-white shadow-md"
            >
              <p className="text-xs font-bold opacity-70">0{index + 1}</p>
              <p className="mt-40 text-sm font-semibold">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="shell grid gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h2 className="display text-2xl font-bold">About this app</h2>
          <div className="mt-4 space-y-4 text-[var(--navy)]">
            <p>
              SMART PATROL helps security teams monitor patrol routes in real time,
              report issues instantly through ticketing, and verify attendance with
              geofencing and face biometrics — reducing manual errors and admin
              overhead.
            </p>
            <p>
              Facility managers get transparent operations with checkpoint proof,
              WhatsApp/IVR alerts, shift controls and automated payslip generation
              based on verified work.
            </p>
          </div>
          <h3 className="display mt-8 text-xl font-bold">Data safety</h3>
          <ul className="mt-3 space-y-2 text-sm text-[var(--steel)]">
            <li>Location, camera and microphone access used for patrol evidence</li>
            <li>Data handled according to CloudGen / SmartPatrol privacy policy</li>
            <li>
              Privacy policy:{" "}
              <a className="font-semibold text-[var(--teal-deep)]" href={site.privacyUrl}>
                {site.privacyUrl}
              </a>
            </li>
          </ul>
        </div>
        <aside className="card-panel h-fit space-y-3 p-5 text-sm">
          <p className="font-bold">App support</p>
          <p>
            Email:{" "}
            <a className="text-[var(--teal-deep)]" href={`mailto:${site.supportEmail}`}>
              {site.supportEmail}
            </a>
          </p>
          <p>
            Website:{" "}
            <a className="text-[var(--teal-deep)]" href={site.url}>
              {site.url}
            </a>
          </p>
          <p>Developer: {site.company}</p>
          <p>Released for Android · Content rating: Everyone</p>
          <Link href="/pricing" className="btn-dark mt-2 inline-flex w-full">
            See Smart Patrol packages
          </Link>
        </aside>
      </section>
    </div>
  );
}
