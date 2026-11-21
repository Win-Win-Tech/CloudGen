import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { absoluteUrl } from "@/lib/seo";
import { TESTIMONIALS } from "@/lib/testimonials";

export const metadata: Metadata = {
  title: "Customer Testimonials | SmartPatrol Feedback",
  description:
    "Customer feedback on CloudGen SmartPatrol from EverGreen Management System, EOX Secure, Hi-Tech Arai, Indus Garments and Golden Win Solution.",
  keywords: [
    "SmartPatrol testimonials",
    "guard tour software reviews",
    "CloudGen Technologies customers",
    "security patrol app feedback",
  ],
  alternates: { canonical: absoluteUrl("/testimonials") },
};

export default function TestimonialsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: TESTIMONIALS.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Review",
        reviewBody: item.quote,
        author: {
          "@type": "Organization",
          name: item.company,
          address: item.location,
        },
        itemReviewed: {
          "@type": "SoftwareApplication",
          name: "SmartPatrol",
          applicationCategory: "BusinessApplication",
        },
        image: absoluteUrl(item.image),
      },
    })),
  };

  return (
    <div className="pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="border-b border-[var(--line)] bg-white py-12">
        <div className="shell max-w-3xl">
          <p className="eyebrow">Testimonials</p>
          <h1 className="display mt-2 text-4xl font-extrabold sm:text-5xl">
            Customer feedback
          </h1>
          <p className="mt-3 text-[var(--steel)]">
            How security, facility and manufacturing teams use SmartPatrol for
            attendance, patrols, gate control and reporting.
          </p>
        </div>
      </section>

      <section className="shell grid gap-6 py-12 lg:grid-cols-2">
        {TESTIMONIALS.map((item, index) => (
          <article key={item.id} className="card-panel flex flex-col overflow-hidden">
            <div className="relative aspect-[16/9] w-full bg-[#0b2a3d]">
              <Image
                src={item.image}
                alt={item.imageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority={index < 2}
              />
            </div>
            <div className="flex flex-1 flex-col p-6 sm:p-8">
              <p className="text-xs font-bold tracking-[0.14em] text-[var(--teal)]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <blockquote className="mt-3 flex-1 text-[1.05rem] leading-relaxed text-[var(--navy)]">
                “{item.quote}”
              </blockquote>
              <div className="mt-6 border-t border-[var(--line)] pt-5">
                <p className="display text-xl font-bold">{item.company}</p>
                <p className="mt-1 text-sm font-semibold text-[var(--teal-deep)]">
                  {item.location}
                </p>
                <p className="mt-1 text-sm text-[var(--steel)]">{item.role}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {item.focus.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-[var(--line)] bg-[#eef6f7] px-3 py-1 text-xs font-semibold text-[var(--teal-deep)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="shell">
        <div className="card-panel flex flex-col gap-4 bg-[linear-gradient(120deg,#10233a,#0f6b74)] p-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#9be7ee]">
              Join them
            </p>
            <h2 className="display mt-2 text-2xl font-extrabold">
              Ready to see SmartPatrol for your sites?
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/80">
              Book a demo or start a free test with the same modules our customers use.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/demo" className="btn-primary">
              Book a demo
            </Link>
            <Link
              href="/contact"
              className="btn border border-white/40 bg-transparent text-white hover:bg-white/10"
            >
              Contact sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
