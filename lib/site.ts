export const site = {
  name: "SmartPatrol",
  company: "CloudGen Technologies",
  tagline: "AI-powered smart patrol solutions",
  description:
    "One connected platform for guard attendance, QR checkpoint patrolling, incident response, and visitor & vehicle access — with real-time visibility and automated reporting.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://smartpatrol.asia",
  email: "ravit@cloudgentechnologies.com",
  supportEmail: "info@smartpatrol.asia",
  phone: "+91 82483 59796",
  phoneHref: "tel:+918248359796",
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

export const nav = [
  { href: "/solutions", label: "Solutions" },
  { href: "/pricing", label: "Pricing" },
  { href: "/app", label: "Get the App" },
  { href: "/demo", label: "Demo" },
  { href: "/register", label: "Register" },
] as const;
