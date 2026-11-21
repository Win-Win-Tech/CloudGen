import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/checkout", "/api/", "/seo-keyword-checklist.txt"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url.replace(/\/$/, ""),
  };
}
