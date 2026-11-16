import type { Metadata } from "next";
import { Raleway, Source_Sans_3 } from "next/font/google";
import { ClickToChat } from "@/components/ClickToChat";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { TawkTo } from "@/components/TawkTo";
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
    default: `${site.company} | ${site.product} Guards App`,
    template: `%s | ${site.company}`,
  },
  description: site.description,
  applicationName: site.product,
  keywords: [
    "CloudGen Technologies",
    "SmartPatrol",
    "Guards app",
    "guard tour system",
    "QR checkpoint",
    "geofence attendance",
    "visitor management",
    "security operations",
    "Madurai",
  ],
  authors: [{ name: site.company, url: site.companyUrl }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.company,
    title: `${site.company} — ${site.product} AI-powered smart patrol solutions`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.company} — ${site.product} AI-powered smart patrol solutions`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: site.url,
  },
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
        url: site.companyUrl,
        email: site.email,
        telephone: site.phone,
        address: site.address,
      },
      {
        "@type": "SoftwareApplication",
        name: site.product,
        alternateName: site.appName,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Android, Web",
        offers: {
          "@type": "Offer",
          priceCurrency: "INR",
          price: String(SOLUTION_PACKAGES[0].inrMonthly ?? 2000),
          description:
            "From INR 2,000 / month for Smart Patrol Attendance (Ticket Complaints Tracking included)",
        },
        publisher: {
          "@type": "Organization",
          name: site.company,
          url: site.companyUrl,
        },
      },
    ],
  };

  return (
    <html lang="en">
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
      </body>
    </html>
  );
}
