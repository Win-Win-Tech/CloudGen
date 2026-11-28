import type { MetadataRoute } from "next";
import { BLOG_POSTS, PRODUCT_PILLARS, absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Marketing URLs only — keep utility pages (/demo/test, /register, /checkout) out of the sitemap
  const core: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/solutions"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/industries"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: absoluteUrl("/testimonials"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/pricing"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/contact"), lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/app"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/demo"), lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    {
      url: absoluteUrl("/campaigns/visitor-management"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/campaigns/face-biometric-attendance"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
  ];

  const pillars = PRODUCT_PILLARS.map((p) => ({
    url: absoluteUrl(`/solutions/${p.slug}`),
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  const posts = BLOG_POSTS.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.date),
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [...core, ...pillars, ...posts];
}
