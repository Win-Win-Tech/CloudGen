import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ShareButtons } from "@/components/ShareButtons";
import {
  SeoCtaBand,
  SeoHero,
  SeoSections,
} from "@/components/SeoPageShell";
import {
  absoluteUrl,
  BLOG_POSTS,
  getBlogPost,
  getProductPillar,
} from "@/lib/seo";
import { site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      url,
      type: "article",
      publishedTime: post.date,
      siteName: site.company,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const pageUrl = absoluteUrl(`/blog/${post.slug}`);
  const related = post.relatedSlugs
    .map((s) => getProductPillar(s))
    .filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        author: { "@type": "Organization", name: site.company, url: site.url },
        publisher: {
          "@type": "Organization",
          name: site.company,
          url: site.url,
        },
        mainEntityOfPage: pageUrl,
        keywords: post.keywords.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: "Guides",
            item: absoluteUrl("/blog"),
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
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
        eyebrow={`${post.date} · ${post.readingMinutes} min read`}
        title={post.title}
        description={post.description}
      />

      <section className="shell max-w-3xl py-12">
        <SeoSections sections={post.sections} />

        <div className="mt-10">
          <ShareButtons url={pageUrl} title={post.title} />
        </div>

        {related.length ? (
          <aside className="mt-12 rounded-xl border border-[var(--line)] bg-[#f7fafc] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[var(--steel)]">
              Related products
            </p>
            <ul className="mt-3 space-y-2">
              {related.map((pillar) =>
                pillar ? (
                  <li key={pillar.slug}>
                    <Link
                      href={`/solutions/${pillar.slug}`}
                      className="font-semibold text-[var(--teal-deep)]"
                    >
                      {pillar.title}
                    </Link>
                  </li>
                ) : null,
              )}
            </ul>
          </aside>
        ) : null}

        <p className="mt-8 text-sm text-[var(--steel)]">
          <Link href="/blog" className="font-semibold text-[var(--teal-deep)]">
            ← All guides
          </Link>
        </p>
      </section>

      <SeoCtaBand
        title="Ready to digitize patrol, attendance or gates?"
        body={`See SmartPatrol packages or talk to ${site.company} about your site.`}
      />
    </div>
  );
}
