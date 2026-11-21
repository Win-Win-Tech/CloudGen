import type { NextConfig } from "next";

/** Legacy / dead paths Google still crawls → current canonical pages (clears GSC 404s). */
const legacyRedirects = [
  { source: "/home", destination: "/" },
  { source: "/index.html", destination: "/" },
  { source: "/pricing.html", destination: "/pricing" },
  { source: "/about.html", destination: "/about" },
  { source: "/contact.html", destination: "/contact" },
  { source: "/product", destination: "/solutions" },
  { source: "/products", destination: "/solutions" },
  { source: "/services", destination: "/solutions" },
  { source: "/features", destination: "/solutions" },
  { source: "/package", destination: "/pricing" },
  { source: "/packages", destination: "/pricing" },
  { source: "/plans", destination: "/pricing" },
  { source: "/guard-tour", destination: "/solutions/qr-checkpoint-guard-tour" },
  { source: "/qr-patrol", destination: "/solutions/qr-checkpoint-guard-tour" },
  { source: "/qrpatrol", destination: "/solutions/qr-checkpoint-guard-tour" },
  { source: "/smartpatrol", destination: "/" },
  { source: "/smart-patrol", destination: "/" },
  { source: "/trial", destination: "/demo" },
  { source: "/signup", destination: "/register" },
  { source: "/sign-up", destination: "/register" },
  { source: "/login", destination: "/app" },
  { source: "/cart", destination: "/pricing" },
  { source: "/shop", destination: "/pricing" },
  { source: "/store", destination: "/pricing" },
  { source: "/feed", destination: "/blog" },
  { source: "/rss", destination: "/blog" },
  { source: "/wordpress", destination: "/" },
  { source: "/sitemap_index.xml", destination: "/sitemap.xml" },
  { source: "/sitemap.xml.gz", destination: "/sitemap.xml" },
  { source: "/solutions/guard-tour", destination: "/solutions/qr-checkpoint-guard-tour" },
  { source: "/solutions/qr-patrol", destination: "/solutions/qr-checkpoint-guard-tour" },
  { source: "/solutions/attendance", destination: "/solutions/face-biometric-attendance" },
  { source: "/solutions/visitor", destination: "/solutions/visitor-management-system" },
  { source: "/solutions/vehicle", destination: "/solutions/vehicle-management-system" },
  { source: "/solutions/cctv", destination: "/solutions/vision-ai-cctv" },
  // Case variants Hostinger / old CMS often linked
  { source: "/About", destination: "/about" },
  { source: "/Pricing", destination: "/pricing" },
  { source: "/Contact", destination: "/contact" },
  { source: "/Solutions", destination: "/solutions" },
  { source: "/Blog", destination: "/blog" },
  { source: "/Privacy", destination: "/privacy" },
  { source: "/Demo", destination: "/demo" },
  { source: "/App", destination: "/app" },
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return legacyRedirects.map((r) => ({
      source: r.source,
      destination: r.destination,
      permanent: true,
    }));
  },
};

export default nextConfig;
