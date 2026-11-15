export const site = {
  name: "CloudGen Technologies",
  product: "SmartPatrol",
  appName: "Guards",
  company: "CloudGen Technologies",
  tagline: "Smarter Solutions. Safer Communities.",
  description:
    "CloudGen Technologies’ Guards / SmartPatrol workforce platform — QR Code Checkpoint Scanning, Guard Tour Patrolling, Geofence Face Biometric Attendance, CCTV AI analytics, and custom digital solutions.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://cloudgentechnologies.com",
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

/** Primary nav aligned with cloudgentechnologies.com */
export const nav = [
  { href: "/about", label: "About Us" },
  { href: "/solutions", label: "Product" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

/** Company services listed on cloudgentechnologies.com */
export const COMPANY_SERVICES = [
  {
    title: "Artificial Intelligence",
    body: "AI services for attendance, vision analytics and intelligent automation.",
  },
  {
    title: "Mobile App Development",
    body: "Flutter and native mobile apps for workforce and customer operations.",
  },
  {
    title: "Full Stack Web Development",
    body: "End-to-end web applications for business and public-sector workflows.",
  },
  {
    title: "Cloud Transformation",
    body: "Cloud hosting, migration and managed infrastructure for Madurai and beyond.",
  },
  {
    title: "IoT Integration",
    body: "Connected devices, sensors and gate hardware integrated with your apps.",
  },
  {
    title: "UI & UX Design",
    body: "Product design for clear, usable mobile and web experiences.",
  },
  {
    title: "Automation Testing",
    body: "Web and mobile test automation to ship reliable releases faster.",
  },
  {
    title: "Mobile App Testing",
    body: "Functional and regression testing for Android and iOS apps.",
  },
] as const;

/** Homepage product pillars from cloudgentechnologies.com */
export const GUARDS_PILLARS = [
  {
    title: "Guard Tour Patrolling System",
    points: [
      "Geolocation and GPS monitoring",
      "Real-time alerts and instant scanning reports",
      "QR code checkpoint scanning",
      "Virtual checkpoint scanning",
      "Auto email scanning reports",
      "Single / multi-site management",
      "Shift and checkpoint schedule management",
      "Dynamic auto shift & checkpoint assignation",
      "User management with multilevel role access",
      "Ticket management with auto WhatsApp and IVR alerts",
    ],
  },
  {
    title: "Geofence Face Biometric Attendance",
    points: [
      "Geofence attendance tracking",
      "Face biometric attendance",
      "Advanced customized attendance reporting",
      "Guard photo on reports",
      "Auto payslip generation",
    ],
  },
] as const;
