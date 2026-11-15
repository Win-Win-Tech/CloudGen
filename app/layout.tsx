import type { Metadata } from "next";
import { Raleway, Source_Sans_3 } from "next/font/google";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { site } from "@/lib/site";
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
    title: `${site.company} — QR checkpoint & face biometric workforce platform`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.company} — QR checkpoint & face biometric workforce platform`,
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
          priceCurrency: "USD",
          price: "79",
          description: "From USD 79 / month for Essentials solution package",
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
      </body>
    </html>
  );
}
