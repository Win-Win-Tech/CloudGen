"use client";

import { FormEvent, useState } from "react";

type Kind = "register" | "demo" | "demo-test" | "contact";

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
  defaultInterest = "Operations package",
}: {
  kind: Kind;
  defaultInterest?: string;
}) {
  const meta = copy[kind];
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    setStatus("loading");
    setMessage("");
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
      setStatus("done");
      setMessage(data.message || "Submitted successfully.");
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
    </form>
  );
}
