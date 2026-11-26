export const site = {
  name: "CloudGen Technologies",
  product: "SmartPatrol",
  appName: "Guards",
  company: "CloudGen Technologies",
  tagline: "Smarter Solutions. Safer Communities.",
  description:
    "SmartPatrol by CloudGen Technologies — guard tour system, QR checkpoint patrol, face biometric & geofence attendance, visitor & vehicle gate software, and CCTV Vision AI for security teams across India.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.cloudgentechnologies.com",
  /** Primary public contact + automated lead inbox (sales). */
  email: "sales@cloudgentechnologies.com",
  /**
   * Founder / ops contact (mailto on site only).
   * Do NOT auto-CC lead/spam mail here — Hostinger locks the mailbox on volume.
   * Opt in with LEAD_COPY_FOUNDER=true if needed.
   */
  founderEmail: "ravit@cloudgentechnologies.com",
  /** Default automated lead recipients (override with LEAD_INBOX env). */
  leadEmails: ["sales@cloudgentechnologies.com"] as const,
  supportEmail: "info@smartpatrol.asia",
  phone: "+91 82483 59796",
  phoneHref: "tel:+918248359796",
  whatsappNumber: "918248359796",
  whatsappUrl:
    "https://wa.me/918248359796?text=" +
    encodeURIComponent("Hi CloudGen, I would like to chat about SmartPatrol solutions."),
  /**
   * Tawk.to property/widget (override via env if needed).
   * For visitors outside Tamil Nadu / India to appear in Monitoring:
   * Tawk → Administration → Chat Widget → Availability Restriction →
   * Country Restriction must be OFF (and clear any Countries filter in
   * Active → Visitors). Also allow domains: www.cloudgentechnologies.com,
   * cloudgentechnologies.com, and the Vercel preview host if used.
   */
  tawkPropertyId:
    process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || "6afb3da16e876a3cc05f8f42",
  tawkWidgetId: process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "default",
  address:
    "No. 3/634, Kalvi Nagar North, Alampatti, Nagamalai Pudukottai, Madurai, Tamil Nadu, India",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.guards.app",
  playStoreId: "com.guards.app",
  companyUrl: "https://www.cloudgentechnologies.com/",
  privacyUrl: "https://www.cloudgentechnologies.com/privacy",
  appVersion: "1.0.6",
  appSize: "77 MB",
  appRequires: "Android 7.0+",
  logo: "/brand/smartpatrol-logo.jpg",
} as const;

/** Primary nav aligned with cloudgentechnologies.com */
export const nav = [
  { href: "/about", label: "About Us" },
  { href: "/solutions", label: "Product" },
  { href: "/campaigns/visitor-management", label: "Campaign" },
  { href: "/industries", label: "Industries" },
  { href: "/testimonials", label: "Testimonials" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Guides" },
  { href: "/contact", label: "Contact" },
] as const;
