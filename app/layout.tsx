import type { Metadata } from "next";
import { Raleway, Source_Sans_3 } from "next/font/google";
import { Analytics } from "@/components/Analytics";
import { ClickToChat } from "@/components/ClickToChat";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TawkTo } from "@/components/TawkTo";
import { GA_ID } from "@/lib/analytics";
import { absoluteUrl } from "@/lib/seo";
import { PRIMARY_META_KEYWORDS } from "@/lib/seoKeywords";
import { site } from "@/lib/site";
import { SOLUTION_PACKAGES } from "@/lib/solutions";
import "./globals.css";

const display = Raleway({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const body = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `Guard Tour & Attendance Software India | ${site.product} by ${site.company}`,
    template: `%s | ${site.company}`,
  },
  description: site.description,
  applicationName: site.product,
  keywords: PRIMARY_META_KEYWORDS,
  authors: [{ name: site.company, url: site.companyUrl }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.company,
    title: `Guard Tour, QR Patrol & Face Attendance | ${site.product}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `Guard Tour, QR Patrol & Face Attendance | ${site.product}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: site.url,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: site.company,
        url: site.url,
        email: site.email,
        telephone: site.phone,
        sameAs: [site.playStoreUrl, site.companyUrl],
        address: {
          "@type": "PostalAddress",
          streetAddress: "No. 3/634, Kalvi Nagar North, Alampatti, Nagamalai Pudukottai",
          addressLocality: "Madurai",
          addressRegion: "Tamil Nadu",
          postalCode: "625019",
          addressCountry: "IN",
        },
      },
      {
        "@type": "LocalBusiness",
        name: site.company,
        image: absoluteUrl("/opengraph-image"),
        url: site.url,
        telephone: site.phone,
        email: site.email,
        address: {
          "@type": "PostalAddress",
          streetAddress: "No. 3/634, Kalvi Nagar North, Alampatti, Nagamalai Pudukottai",
          addressLocality: "Madurai",
          addressRegion: "Tamil Nadu",
          addressCountry: "IN",
        },
        areaServed: "IN",
        priceRange: "$$",
      },
      {
        "@type": "SoftwareApplication",
        name: site.product,
        alternateName: site.appName,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Android, Web",
        offers: {
          "@type": "Offer",
          priceCurrency: "USD",
          price: String(SOLUTION_PACKAGES[0].usdMonthly ?? 49),
          description:
            "From USD 49 / month for Smart Patrol Attendance (Ticket Complaints Tracking included)",
        },
        publisher: {
          "@type": "Organization",
          name: site.company,
          url: site.url,
        },
      },
      {
        "@type": "WebSite",
        name: site.company,
        url: site.url,
      },
    ],
  };

  return (
    <html lang="en-IN">
      <head>
        {/* Raw Google tag — must NOT use next/script (that wraps in self.__next_s and GA cannot detect it) */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        />
        <script
          id="google-tag-gtag"
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${GA_ID}');
`,
          }}
        />
      </head>
      <body className={`${display.variable} ${body.variable} antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
        <ClickToChat />
        <TawkTo />
        <Analytics />
      </body>
    </html>
  );
}
