import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Solutions",
  description:
    "Smart Patrol, Smart Patrolling, Smart Gate and Enterprise Suite — CloudGen SmartPatrol security operations platform.",
};

const modules = [
  {
    title: "Smart Patrol",
    subtitle: "Geofence & workforce attendance",
    items: [
      "Liveness face biometric verification and GPS geofencing",
      "Present, Absent, Half Day, Less Duration & On-Work controls",
      "Automatic checkout on boundary breach or shift buffer time",
      "Dynamic shifts/sites; multi-site and multi-shift guard access",
      "Shift roll call, holiday calendar and working-hour tracking",
      "Configurable 8-hour/day and 26-working-day controls",
    ],
  },
  {
    title: "Smart Patrolling",
    subtitle: "QR checkpoint & incident management",
    items: [
      "Scheduled QR checkpoint scans with time/location verification",
      "Digital checklist at every checkpoint",
      "Raise incidents with voice, image and video evidence",
      "Ticket management, status tracking and escalation",
      "Automated WhatsApp and IVR ticket alerts",
    ],
  },
  {
    title: "Smart Gate",
    subtitle: "Visitor & vehicle management",
    items: [
      "ID card capture with name, ID number and address extraction",
      "Vehicle image capture and registration number recognition",
      "Visitor check-in, digital QR pass and exit verification",
      "Pre-registration, spot registration and host approval",
      "Visitor/vehicle blacklist & whitelist controls",
      "Overstay and restricted-area SOS alerts",
    ],
  },
  {
    title: "Enterprise Suite",
    subtitle: "Integrated security operations",
    items: [
      "All three modules in one centralized platform",
      "Multi-location operations and real-time activity visibility",
      "CCTV AI analytics integration options",
      "Centralized records, audit trail and management reporting",
      "Configurable access roles and operational workflows",
      "Automated daily email reports at 7:00 AM",
    ],
  },
];

export default function SolutionsPage() {
  return (
    <div className="shell py-12 pb-16">
      <div className="max-w-3xl">
        <p className="eyebrow">Product modules</p>
        <h1 className="display mt-2 text-4xl font-extrabold">
          One connected security operations stack
        </h1>
        <p className="mt-3 text-[var(--steel)]">
          Digitize guard attendance, checkpoint patrolling, incident response and
          visitor/vehicle access with real-time visibility.
        </p>
      </div>
      <div className="mt-10 grid gap-6">
        {modules.map((mod, index) => (
          <article key={mod.title} className="card-panel p-6 sm:p-8">
            <p className="text-xs font-bold tracking-[0.14em] text-[var(--teal)]">
              0{index + 1}
            </p>
            <h2 className="display mt-2 text-3xl font-bold">{mod.title}</h2>
            <p className="mt-1 font-semibold text-[var(--steel)]">{mod.subtitle}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {mod.items.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-[var(--navy)]">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-sm bg-[var(--orange)]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/pricing" className="btn-primary">
          View pricing
        </Link>
        <Link href="/demo" className="btn-outline">
          Book a demo
        </Link>
      </div>
    </div>
  );
}
