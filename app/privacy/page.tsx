import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${site.company} websites and the ${site.product} / ${site.appName} application — how we collect, use and protect personal information.`,
  alternates: { canonical: absoluteUrl("/privacy") },
};

const sections: {
  id: string;
  title: string;
  intro?: string;
  bullets?: string[];
  subsections?: { title: string; bullets: string[] }[];
  paras?: string[];
}[] = [
  {
    id: "collect",
    title: "Information we collect",
    intro:
      "Depending on the features you use on this website or in the Application, we may collect the following information.",
    subsections: [
      {
        title: "Website and sales enquiries",
        bullets: [
          "Name, email address, phone number and organisation details you submit via contact, demo or registration forms",
          "Chat messages you send through live chat (for example Tawk.to)",
          "Basic technical data such as browser type, device type and pages visited (including analytics if enabled)",
        ],
      },
      {
        title: "User account information (Application)",
        bullets: [
          "Name, email address, phone number",
          "Employee ID/code, user role and organisation information",
          "Profile or face photo where attendance or identity features are enabled",
        ],
      },
      {
        title: "Visitor and vehicle information (Application)",
        bullets: [
          "Visitor name, phone number, ID/passport number and visitor type",
          "Purpose of visit, host information, company name and expected arrival/departure times",
          "Vehicle details, remarks, visitor/ID photographs and pass information",
        ],
      },
    ],
  },
  {
    id: "use",
    title: "How we use information",
    bullets: [
      "Respond to sales, demo and support enquiries",
      "Authenticate users and manage accounts and permissions",
      "Operate visitor check-in/out, host approvals and visitor passes",
      "Support guard tour, attendance, roll-call and incident workflows",
      "Provide GPS/location-based operational features",
      "Send application and operational notifications",
      "Improve website, product functionality and security",
      "Meet legal, accounting and contractual obligations",
    ],
  },
  {
    id: "id-docs",
    title: "ID and document information",
    paras: [
      "The Application may process images of identification documents provided by users or visitors.",
      "Where applicable, OCR or similar recognition may extract details such as identification numbers and names from submitted images.",
    ],
  },
  {
    id: "camera",
    title: "Camera and photos",
    intro:
      "The Application may request camera and photo-library access for security, attendance and visitor-management functionality, including:",
    bullets: [
      "Capturing visitor photographs and identification documents",
      "Capturing other required operational images",
      "Selecting images from the device when permitted by the workflow",
    ],
  },
  {
    id: "location",
    title: "Location information",
    paras: [
      "The Application may request GPS/location access for attendance geofencing, patrol evidence, visitor/gate operations and related security workflows.",
    ],
  },
  {
    id: "microphone",
    title: "Microphone and speech recognition",
    paras: [
      "The Application may request microphone access when speech-to-text or similar input features are used (for example voice-assisted data entry).",
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    intro: "We may send notifications related to:",
    bullets: [
      "Visitor approvals and check-in/out events",
      "Security operations and incidents",
      "Roll-call and attendance activities",
      "Demo, billing or account messages you request from the website",
    ],
  },
  {
    id: "security",
    title: "Data storage and security",
    paras: [
      "We take reasonable measures to protect information from unauthorised access, alteration, disclosure or destruction.",
      "Authentication information may be stored on the device to maintain an authenticated session.",
      "No method of electronic transmission or storage is completely secure.",
    ],
  },
  {
    id: "sharing",
    title: "Data sharing",
    paras: [
      "We do not sell personal information.",
      "Information may be transmitted to our backend services and authorised systems when needed to provide the website or Application.",
      "Information may be disclosed when required by applicable law, regulation, legal process or legitimate security requirements.",
    ],
  },
  {
    id: "third-party",
    title: "Third-party services",
    intro:
      "We may use third-party technologies to operate the website and Application, such as:",
    bullets: [
      "Live chat and messaging (for example Tawk.to)",
      "Analytics (when enabled, for example Google Analytics)",
      "Payment processing (for example Razorpay)",
      "Push notifications, maps/location, speech recognition and image/OCR services",
      "Hosting and infrastructure providers",
    ],
  },
  {
    id: "retention",
    title: "Data retention",
    paras: [
      "Personal information is retained only as long as reasonably necessary to provide the services, meet operational requirements or comply with legal obligations.",
    ],
  },
  {
    id: "deletion",
    title: "Account and data deletion",
    paras: [
      "Users may request deletion of their account or personal information by contacting the organisation that manages their Application deployment, or by emailing us using the contacts below.",
      "Website enquiry records may be deleted or anonymised on request where we are not required to retain them for legal or contractual reasons.",
    ],
  },
  {
    id: "children",
    title: "Children’s privacy",
    paras: [
      "Our website and Application are intended for authorised organisational, security, visitor-management, attendance and related business use. They are not directed at children.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paras: [
      "We may update this Privacy Policy from time to time. The updated version will be posted on this page with a revised “Last updated” date.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="pb-16">
      <section className="border-b border-[var(--line)] bg-white py-12">
        <div className="shell max-w-3xl">
          <p className="eyebrow">Legal</p>
          <h1 className="display mt-2 text-4xl font-extrabold sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-[var(--steel)]">
            This Privacy Policy explains how {site.company} (“we”, “us”) collects
            and uses information through{" "}
            <a className="font-semibold text-[var(--teal-deep)]" href={site.url}>
              {site.url.replace(/^https?:\/\//, "")}
            </a>
            , related CloudGen web properties, and the {site.product} /{" "}
            {site.appName} application (the “Application”).
          </p>
          <p className="mt-3 text-sm text-[var(--steel)]">
            Last updated: 16 November 2026 · Organisation: {site.company}
          </p>
        </div>
      </section>

      <section className="shell max-w-3xl py-12">
        <nav className="mb-10 rounded-xl border border-[var(--line)] bg-[#f7fafc] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--steel)]">
            On this page
          </p>
          <ol className="mt-3 grid gap-2 text-sm font-semibold sm:grid-cols-2">
            {sections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="text-[var(--navy)] hover:text-[var(--teal-deep)]"
                >
                  {String(index + 1).padStart(2, "0")}. {section.title}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                className="text-[var(--navy)] hover:text-[var(--teal-deep)]"
              >
                {String(sections.length + 1).padStart(2, "0")}. Contact
              </a>
            </li>
          </ol>
        </nav>

        <div className="space-y-10">
          {sections.map((section, index) => (
            <article key={section.id} id={section.id}>
              <h2 className="display text-2xl font-extrabold">
                <span className="text-[var(--teal)]">
                  {String(index + 1).padStart(2, "0")}
                </span>{" "}
                {section.title}
              </h2>
              {section.intro ? (
                <p className="mt-3 text-[var(--steel)]">{section.intro}</p>
              ) : null}
              {section.paras?.map((p) => (
                <p key={p.slice(0, 40)} className="mt-3 text-[var(--steel)]">
                  {p}
                </p>
              ))}
              {section.bullets ? (
                <ul className="mt-3 list-disc space-y-1 pl-5 text-[var(--steel)]">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
              {section.subsections?.map((sub) => (
                <div key={sub.title} className="mt-5">
                  <h3 className="font-bold text-[var(--ink)]">{sub.title}</h3>
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--steel)]">
                    {sub.bullets.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </article>
          ))}

          <article id="contact">
            <h2 className="display text-2xl font-extrabold">
              <span className="text-[var(--teal)]">
                {String(sections.length + 1).padStart(2, "0")}
              </span>{" "}
              Contact
            </h2>
            <p className="mt-3 text-[var(--steel)]">
              For privacy questions, account or data deletion requests, or general
              support, contact {site.company}:
            </p>
            <ul className="mt-3 space-y-2 text-[var(--steel)]">
              <li>
                Sales:{" "}
                <a
                  className="font-semibold text-[var(--teal-deep)]"
                  href={`mailto:${site.email}`}
                >
                  {site.email}
                </a>
              </li>
              <li>
                App support:{" "}
                <a
                  className="font-semibold text-[var(--teal-deep)]"
                  href={`mailto:${site.supportEmail}`}
                >
                  {site.supportEmail}
                </a>
              </li>
              <li>
                Phone:{" "}
                <a className="font-semibold text-[var(--teal-deep)]" href={site.phoneHref}>
                  {site.phone}
                </a>
              </li>
              <li>Address: {site.address}</li>
            </ul>
            <p className="mt-6 text-sm text-[var(--steel)]">
              Related pages:{" "}
              <Link href="/contact" className="font-semibold text-[var(--teal-deep)]">
                Contact
              </Link>
              {" · "}
              <Link href="/app" className="font-semibold text-[var(--teal-deep)]">
                Get the App
              </Link>
              {" · "}
              <Link href="/about" className="font-semibold text-[var(--teal-deep)]">
                About Us
              </Link>
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}
