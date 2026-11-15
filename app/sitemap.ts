import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/about",
    "/solutions",
    "/pricing",
    "/contact",
    "/app",
    "/demo",
    "/demo/test",
    "/register",
    "/checkout",
  ];
  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "/pricing" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
