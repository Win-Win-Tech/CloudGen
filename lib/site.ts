export const site = {
  name: "CloudGen Technologies",
  product: "SmartPatrol",
  appName: "Guards",
  company: "CloudGen Technologies",
  tagline: "Smarter Solutions. Safer Communities.",
  description:
    "CloudGen Technologies’ Guards / SmartPatrol workforce platform — QR Code Checkpoint Scanning, Guard Tour Patrolling, Geofence Face Biometric Attendance, CCTV AI analytics, and custom digital solutions.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://cloudgentechnologies.com",
  email: "sales@cloudgentechnologies.com",
  supportEmail: "info@smartpatrol.asia",
  phone: "+91 82483 59796",
  phoneHref: "tel:+918248359796",
  whatsappNumber: "918248359796",
  whatsappUrl:
    "https://wa.me/918248359796?text=" +
    encodeURIComponent("Hi CloudGen, I would like to chat about SmartPatrol solutions."),
  /** From live cloudgentechnologies.com embed (override via env if needed). */
  tawkPropertyId:
    process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID || "672866ff2480f5b4f59842aa",
  tawkWidgetId: process.env.NEXT_PUBLIC_TAWK_WIDGET_ID || "1ibqt4mc1",
  address:
    "No. 3/634, Kalvi Nagar North, Alampatti, Nagamalai Pudukottai, Madurai, Tamil Nadu, India",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.guards.app",
  playStoreId: "com.guards.app",
  companyUrl: "https://cloudgentechnologies.com/",
  privacyUrl: "https://smartpatrol.asia/privacy-policy.html",
  appVersion: "1.0.6",
  appSize: "77 MB",
  appRequires: "Android 7.0+",
} as const;

/** Primary nav aligned with cloudgentechnologies.com */
export const nav = [
  { href: "/about", label: "About Us" },
  { href: "/solutions", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;
