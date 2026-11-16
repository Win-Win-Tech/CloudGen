import Link from "next/link";
import type { ReactNode } from "react";
import type { SeoSection } from "@/lib/seo";

export function SeoHero({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <section className="border-b border-[var(--line)] bg-white py-12">
      <div className="shell max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="display mt-2 text-3xl font-extrabold sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 text-lg text-[var(--steel)]">{description}</p>
        {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </section>
  );
}

export function SeoSections({ sections }: { sections: SeoSection[] }) {
  return (
    <div className="space-y-10">
      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="display text-2xl font-extrabold text-[var(--ink)]">
            {section.heading}
          </h2>
          <div className="mt-3 space-y-3 text-[var(--steel)]">
            {section.body.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export function SeoFaq({
  faqs,
}: {
  faqs: { q: string; a: string }[];
}) {
  if (!faqs.length) return null;
  return (
    <section className="mt-12 border-t border-[var(--line)] pt-10">
      <h2 className="display text-2xl font-extrabold">Frequently asked questions</h2>
      <div className="mt-6 space-y-5">
        {faqs.map((faq) => (
          <div key={faq.q}>
            <h3 className="font-bold text-[var(--ink)]">{faq.q}</h3>
            <p className="mt-1 text-[var(--steel)]">{faq.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function SeoCtaBand({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <section className="border-t border-[var(--line)] bg-[#f7fafc] py-12">
      <div className="shell max-w-3xl">
        <h2 className="display text-2xl font-extrabold">{title}</h2>
        <p className="mt-2 text-[var(--steel)]">{body}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/pricing" className="btn-primary">
            View pricing
          </Link>
          <Link href="/demo" className="btn-outline">
            Book a demo
          </Link>
          <Link href="/contact" className="btn-outline">
            Contact sales
          </Link>
        </div>
      </div>
    </section>
  );
}
