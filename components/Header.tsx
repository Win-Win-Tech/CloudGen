"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { nav, site } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-white/90 backdrop-blur">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex min-w-0 items-center gap-2.5" aria-label={`${site.company} home`}>
          <Image
            src={site.logo}
            alt="Smart Patrol logo"
            width={44}
            height={44}
            className="h-11 w-11 shrink-0 object-contain"
            priority
          />
          <span className="min-w-0">
            <span className="display block text-lg font-extrabold uppercase tracking-wide text-[var(--ink)]">
              {site.company}
            </span>
            <span className="block truncate text-[11px] font-medium text-[var(--steel)]">
              {site.product} · {site.appName} app
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 md:flex">
          <Link
            href="/"
            className="text-sm font-semibold text-[var(--navy)] hover:text-[var(--teal-deep)]"
          >
            Home
          </Link>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-[var(--navy)] hover:text-[var(--teal-deep)]"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/contact" className="btn-primary">
            Get in touch
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[var(--line)] md:hidden"
          aria-expanded={open}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span className="block h-0.5 w-5 bg-[var(--ink)]" />
            <span className="block h-0.5 w-5 bg-[var(--ink)]" />
          </div>
        </button>
      </div>

      {open ? (
        <div className="border-t border-[var(--line)] bg-white md:hidden">
          <div className="shell flex flex-col gap-1 py-3">
            <Link
              href="/"
              className="rounded-md px-2 py-2 text-sm font-semibold"
              onClick={() => setOpen(false)}
            >
              Home
            </Link>
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-2 py-2 text-sm font-semibold"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="btn-primary mt-2"
              onClick={() => setOpen(false)}
            >
              Get in touch
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
