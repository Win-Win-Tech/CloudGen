"use client";

import { FormEvent, useState } from "react";
import { site } from "@/lib/site";

type Kind = "register" | "demo" | "demo-test" | "contact";

type DemoPayload = {
  username: string;
  password: string | null;
  expiresAt: string;
  expiresAtLabel: string;
  durationDays: number;
  playStoreUrl: string;
  status: string;
};

const copy: Record<Kind, { title: string; submit: string; endpoint: string }> = {
  register: {
    title: "Create your SmartPatrol account",
    submit: "Register",
    endpoint: "/api/register",
  },
  demo: {
    title: "Book a live product demo",
    submit: "Request demo",
    endpoint: "/api/demo",
  },
  "demo-test": {
    title: "Start a free demo test",
    submit: "Start demo test",
    endpoint: "/api/demo",
  },
  contact: {
    title: "Send a message to CloudGen",
    submit: "Send message",
    endpoint: "/api/demo",
  },
};

/** Browser-side FormSubmit — Cloudflare blocks server IPs, but browser posts usually deliver. */
async function notifySalesInbox(payload: Record<string, FormDataEntryValue>) {
  const inbox = site.email;
  const subject =
    payload.kind === "contact"
      ? `New contact message — ${site.company}`
      : payload.kind === "demo-test"
        ? `New demo test request — ${site.product}`
        : payload.kind === "register"
          ? `New registration — ${site.product}`
          : `New demo request — ${site.product}`;

  const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(inbox)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: String(payload.fullName || ""),
      email: String(payload.email || ""),
      phone: String(payload.phone || ""),
      organization: String(payload.organization || ""),
      interest: String(payload.interest || ""),
      message: String(payload.message || ""),
      sites: String(payload.sites || ""),
      kind: String(payload.kind || ""),
      _subject: subject,
      _template: "table",
      _replyto: String(payload.email || ""),
      _captcha: "false",
    }),
  });

  const detail = await res.text();
  if (
    detail.includes("Just a moment") ||
    detail.includes("cf-chl") ||
    detail.includes("<!DOCTYPE html")
  ) {
    return false;
  }

  try {
    const parsed = JSON.parse(detail) as { success?: string | boolean };
    return parsed.success === true || parsed.success === "true";
  } catch {
    return false;
  }
}

export function LeadForm({
  kind,
  defaultInterest = "Operations package",
}: {
  kind: Kind;
  defaultInterest?: string;
}) {
  const meta = copy[kind];
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [demo, setDemo] = useState<DemoPayload | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setStatus("loading");
    setMessage("");
    setDemo(null);
    const form = new FormData(formEl);
    const payload = Object.fromEntries(form.entries());
    try {
      const res = await fetch(meta.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, kind }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      let mailed = Boolean(data.mailed);
      if (!mailed && kind !== "demo-test") {
        try {
          mailed = await notifySalesInbox({ ...payload, kind });
        } catch {
          mailed = false;
        }
      }

      setStatus("done");
      setMessage(
        mailed
          ? kind === "contact"
            ? "Message received and emailed to sales@cloudgentechnologies.com. We will get back to you shortly."
            : "Demo request received and emailed to our sales team. We will contact you to schedule a walkthrough."
          : data.message || "Submitted successfully.",
      );
      if (data.demo) setDemo(data.demo as DemoPayload);
      formEl.reset();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form className="card-panel space-y-4 p-6" onSubmit={onSubmit}>
      <h2 className="display text-2xl font-bold">{meta.title}</h2>
      <label className="block text-sm font-semibold">
        Full name
        <input className="input mt-1" name="fullName" required />
      </label>
      <label className="block text-sm font-semibold">
        Work email
        <input className="input mt-1" name="email" type="email" required />
      </label>
      <label className="block text-sm font-semibold">
        Mobile
        <input className="input mt-1" name="phone" type="tel" />
      </label>
      <label className="block text-sm font-semibold">
        Organization
        <input className="input mt-1" name="organization" required />
      </label>
      {kind === "register" ? (
        <label className="block text-sm font-semibold">
          Number of sites
          <input className="input mt-1" name="sites" placeholder="e.g. 3" />
        </label>
      ) : (
        <>
          <label className="block text-sm font-semibold">
            Interest
            <select className="input mt-1" name="interest" defaultValue={defaultInterest}>
              <option>Free demo test</option>
              <option>Essentials package</option>
              <option>Operations package</option>
              <option>Vision AI package</option>
              <option>Industry Apps package</option>
              <option>Enterprise Suite package</option>
              <option>Face Biometric Attendance</option>
              <option>Visitor Management</option>
              <option>Vehicle Management</option>
              <option>QR Checkpoint Patrolling</option>
              <option>Hospital Management</option>
              <option>Pharmacy Billing</option>
              <option>WhatsApp Court Booking</option>
              <option>WhatsApp Command Centre</option>
              <option>CCTV AI Analytics</option>
              <option>Custom Web / Mobile / Website</option>
              <option>Base / Pro / Gold guard plans</option>
              <option>Enterprise quote &gt;100 guards</option>
              <option>Custom solution mix</option>
              <option>General enquiry</option>
              <option>Partnership</option>
              <option>Company services</option>
            </select>
          </label>
          <label className="block text-sm font-semibold">
            Message
            <textarea className="input mt-1 min-h-24" name="message" />
          </label>
        </>
      )}
      <button className="btn-primary" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Submitting…" : meta.submit}
      </button>
      {message ? (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            status === "done" ? "bg-emerald-50 text-emerald-900" : "bg-rose-50 text-rose-900"
          }`}
        >
          {message}
        </p>
      ) : null}

      {demo ? (
        <div className="rounded-lg border border-[var(--line)] bg-[#f8fafc] p-4 text-sm">
          <p className="font-bold text-[var(--ink)]">Your demo credentials</p>
          <dl className="mt-3 space-y-2">
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--steel)]">Username</dt>
              <dd className="font-mono font-semibold">{demo.username}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--steel)]">Password</dt>
              <dd className="font-mono font-semibold">
                {demo.password || "Use the password from your earlier email"}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--steel)]">Expires</dt>
              <dd className="font-semibold">{demo.expiresAtLabel} IST</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-[var(--steel)]">Duration</dt>
              <dd className="font-semibold">{demo.durationDays} days</dd>
            </div>
          </dl>
          <a
            href={demo.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-4 inline-flex w-full"
          >
            Download {site.appName} app & sign in
          </a>
          <p className="mt-3 text-xs text-[var(--steel)]">
            After expiry, login is rejected automatically via{" "}
            <code>/api/demo/validate</code>. Subscribe on Pricing to continue.
          </p>
        </div>
      ) : null}
    </form>
  );
}
