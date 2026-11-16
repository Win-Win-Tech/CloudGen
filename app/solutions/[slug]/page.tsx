import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  SeoCtaBand,
  SeoFaq,
  SeoHero,
  SeoSections,
} from "@/components/SeoPageShell";
import {
  absoluteUrl,
  getProductPillar,
  PRODUCT_PILLARS,
} from "@/lib/seo";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return PRODUCT_PILLARS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pillar = getProductPillar(slug);
  if (!pillar) return {};

  const url = absoluteUrl(`/solutions/${pillar.slug}`);
  return {
    title: pillar.title,
    description: pillar.description,
    keywords: pillar.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: pillar.title,
      description: pillar.description,
      url,
      type: "article",
      siteName: site.company,
    },
  };
}

export default async function ProductPillarPage({ params }: Props) {
  const { slug } = await params;
  const pillar = getProductPillar(slug);
  if (!pillar) notFound();

  const pageUrl = absoluteUrl(`/solutions/${pillar.slug}`);
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: pillar.title,
        description: pillar.description,
        url: pageUrl,
        isPartOf: { "@type": "WebSite", name: site.company, url: site.url },
      },
      {
        "@type": "FAQPage",
        mainEntity: pillar.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Product",
            item: absoluteUrl("/solutions"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: pillar.title,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="pb-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SeoHero
        eyebrow="SmartPatrol product"
        title={pillar.h1}
        description={pillar.description}
        actions={
          <>
            <Link href={pillar.packageHref} className="btn-primary">
              {pillar.packageHref === "/contact" ? "Request a quote" : "See pricing"}
            </Link>
            <Link href="/demo" className="btn-outline">
              Book a demo
            </Link>
          </>
        }
      />

      <section className="shell py-10">
        <ul className="grid gap-3 sm:grid-cols-3">
          {pillar.highlights.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-[var(--line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--navy)]"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="shell max-w-3xl pb-4">
        <SeoSections sections={pillar.sections} />
        <SeoFaq faqs={pillar.faqs} />
        <p className="mt-10 text-sm text-[var(--steel)]">
          Explore the full catalog on{" "}
          <Link href="/solutions" className="font-semibold text-[var(--teal-deep)]">
            Product
          </Link>{" "}
          or read the{" "}
          <Link href="/blog" className="font-semibold text-[var(--teal-deep)]">
            SmartPatrol guides
          </Link>
          .
        </p>
      </section>

      <SeoCtaBand
        title={`Talk to ${site.company} about ${pillar.title}`}
        body="Tell us your site type — factory, society, campus or multi-site agency — and we will map the right Smart Patrol stack."
      />
    </div>
  );
}
