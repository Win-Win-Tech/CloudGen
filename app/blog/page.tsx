import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS, absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Guides & SEO resources",
  description: `Practical guides on guard tour, face attendance, visitor and vehicle management from ${site.company} — builders of SmartPatrol in Madurai, India.`,
  alternates: { canonical: absoluteUrl("/blog") },
};

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="pb-16">
      <section className="border-b border-[var(--line)] bg-white py-12">
        <div className="shell max-w-3xl">
          <p className="eyebrow">Resources</p>
          <h1 className="display mt-2 text-4xl font-extrabold sm:text-5xl">
            SmartPatrol guides
          </h1>
          <p className="mt-4 text-lg text-[var(--steel)]">
            Field-focused articles on QR patrol, attendance, visitor/vehicle gates
            and Vision AI — written to help security and facility buyers in India
            choose the right stack.
          </p>
        </div>
      </section>

      <section className="shell py-12">
        <div className="grid gap-5 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="rounded-xl border border-[var(--line)] bg-white p-6 shadow-[0_10px_30px_rgba(26,31,44,0.04)]"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--steel)]">
                {post.date} · {post.readingMinutes} min read
              </p>
              <h2 className="display mt-2 text-xl font-extrabold">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-[var(--teal-deep)]"
                >
                  {post.title}
                </Link>
              </h2>
              <p className="mt-2 text-sm text-[var(--steel)]">{post.description}</p>
              <Link
                href={`/blog/${post.slug}`}
                className="mt-4 inline-flex text-sm font-bold text-[var(--teal-deep)]"
              >
                Read guide →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-12 max-w-2xl rounded-xl border border-[var(--line)] bg-[#f7fafc] p-6">
          <h2 className="display text-xl font-extrabold">Product landing pages</h2>
          <p className="mt-2 text-sm text-[var(--steel)]">
            Prefer a direct product overview? Jump to SEO landing pages for Face
            Attendance, QR Guard Tour, Visitor, Vehicle and Vision AI.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
            <Link href="/solutions/face-biometric-attendance" className="text-[var(--teal-deep)]">
              Face attendance
            </Link>
            <Link href="/solutions/qr-checkpoint-guard-tour" className="text-[var(--teal-deep)]">
              QR guard tour
            </Link>
            <Link href="/solutions/visitor-management-system" className="text-[var(--teal-deep)]">
              Visitor
            </Link>
            <Link href="/solutions/vehicle-management-system" className="text-[var(--teal-deep)]">
              Vehicle
            </Link>
            <Link href="/solutions/vision-ai-cctv" className="text-[var(--teal-deep)]">
              Vision AI
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
