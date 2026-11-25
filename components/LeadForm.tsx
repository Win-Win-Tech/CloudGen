"use client";

import { FormEvent, useEffect, useState } from "react";
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

export function LeadForm({
  kind,
  defaultInterest = "Smart Patrol Site Ops Suite",
}: {
  kind: Kind;
  defaultInterest?: string;
}) {
  const meta = copy[kind];
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");
  const [demo, setDemo] = useState<DemoPayload | null>(null);
  const [formStartedAt, setFormStartedAt] = useState(() => Date.now());

  useEffect(() => {
    setFormStartedAt(Date.now());
  }, [kind]);

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
        body: JSON.stringify({
          ...payload,
          kind,
          formStartedAt,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");

      setStatus("done");
      setMessage(
        data.message ||
          (kind === "contact"
            ? "Message received. Our team will follow up shortly."
            : kind === "register"
              ? "Registration received. Our team will share onboarding next steps shortly."
              : "Demo request received. We will contact you to schedule a walkthrough."),
      );
      if (data.demo) setDemo(data.demo as DemoPayload);
      formEl.reset();
      setFormStartedAt(Date.now());
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form className="card-panel space-y-4 p-6" onSubmit={onSubmit} autoComplete="on">
      <h2 className="display text-2xl font-bold">{meta.title}</h2>

      {/* Honeypot — hidden from humans; bots often fill it. */}
      <div
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 overflow-hidden opacity-0"
        tabIndex={-1}
      >
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
        <label>
          Company URL
          <input
            type="url"
            name="companyUrl"
            tabIndex={-1}
            autoComplete="off"
            defaultValue=""
          />
        </label>
      </div>

      <label className="block text-sm font-semibold">
        Full name
        <input className="input mt-1" name="fullName" required minLength={2} autoComplete="name" />
      </label>
      <label className="block text-sm font-semibold">
        Work email
        <input
          className="input mt-1"
          name="email"
          type="email"
          required
          autoComplete="email"
        />
      </label>
      <label className="block text-sm font-semibold">
        Mobile
        <input
          className="input mt-1"
          name="phone"
          type="tel"
          required
          minLength={10}
          autoComplete="tel"
          placeholder="+91 …"
        />
      </label>
      <label className="block text-sm font-semibold">
        Organization
        <input
          className="input mt-1"
          name="organization"
          required
          minLength={2}
          autoComplete="organization"
        />
      </label>
      {kind === "register" ? (
        <label className="block text-sm font-semibold">
          Number of sites
          <input
            className="input mt-1"
            name="sites"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="e.g. 3"
          />
        </label>
      ) : (
        <>
          <label className="block text-sm font-semibold">
            Interest
            <select className="input mt-1" name="interest" defaultValue={defaultInterest}>
              <option>Free demo test</option>
              <option>Smart Patrol Attendance</option>
              <option>Smart Patrol Checkpoint</option>
              <option>Smart Patrol Visitor</option>
              <option>Smart Patrol Vehicle</option>
              <option>Smart Patrol Workforce Duo</option>
              <option>Smart Patrol Gate Duo</option>
              <option>Smart Patrol Site Ops Suite</option>
              <option>Smart Patrol Vision AI quote</option>
              <option>Smart Patrol Industry Suite quote</option>
              <option>Smart Patrol Custom Build quote</option>
              <option>Face Biometric Attendance</option>
              <option>Visitor Management</option>
              <option>Vehicle Management</option>
              <option>QR Checkpoint Patrolling</option>
              <option>Hospital Management</option>
              <option>Pharmacy Billing</option>
              <option>AI Chatbot Doctor Appointment Booking</option>
              <option>Ticket Complaints Tracking System</option>
              <option>Smart Patrol Vision AI</option>
              <option>Custom Web / Mobile / Website</option>
              <option>Enterprise quote</option>
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
