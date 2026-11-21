import type { NextConfig } from "next";

/**
 * Legacy Hostinger/WordPress paths Google still crawls → current pages.
 * Do NOT add case-only redirects (e.g. /About → /about): Vercel matching is
 * case-insensitive and that creates infinite 308 loops.
 */
const legacyRedirects = [
  // Generic old paths
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

  // GSC “Not found (404)” — old WordPress URLs
  { source: "/comments/feed", destination: "/blog" },
  { source: "/comments/feed/:path*", destination: "/blog" },
  { source: "/about-us", destination: "/about" },
  { source: "/sample-page", destination: "/" },
  { source: "/amenities", destination: "/" },
  { source: "/full-stack-web-development", destination: "/solutions" },
  { source: "/best-ui-ux-design-services-in-madurai", destination: "/contact" },
  { source: "/best-artificial-intelligence-services-in-madurai", destination: "/solutions/vision-ai-cctv" },
  { source: "/custom-flutter-app-development-in-madurai", destination: "/solutions" },
  { source: "/top-mobile-app-development-services-in-madurai", destination: "/solutions" },
  { source: "/best-automation-testing-services-in-madurai", destination: "/contact" },
  { source: "/cloud-transformation-services-in-madurai", destination: "/solutions" },
  { source: "/top-cloud-service-providers-in-madurai", destination: "/solutions" },
  { source: "/best-iot-integration-services-in-madurai", destination: "/solutions" },
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
