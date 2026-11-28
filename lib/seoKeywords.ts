/**
 * Target keywords for organic ranking + manual SERP checks.
 * Prefer exact-match searches in an incognito window (India / English).
 */

export type KeywordCluster = {
  cluster: string;
  intent: "brand" | "product" | "local" | "comparison" | "guide";
  keywords: string[];
  primaryUrl: string;
};

export const SEO_KEYWORD_CLUSTERS: KeywordCluster[] = [
  {
    cluster: "Brand",
    intent: "brand",
    primaryUrl: "/",
    keywords: [
      "CloudGen Technologies",
      "CloudGen Technologies Madurai",
      "SmartPatrol",
      "Smart Patrol app",
      "Guards app CloudGen",
      "com.guards.app",
      "cloudgentechnologies.com",
    ],
  },
  {
    cluster: "Guard tour / QR checkpoint",
    intent: "product",
    primaryUrl: "/solutions/qr-checkpoint-guard-tour",
    keywords: [
      "guard tour system India",
      "QR checkpoint patrol software",
      "security guard patrolling app",
      "QR code checkpoint scanning system",
      "guard tour patrolling software",
      "digital guard tour system",
      "security patrol checkpoint app",
      "guard monitoring system India",
      "NFC QR guard tour",
      "patrol management software India",
    ],
  },
  {
    cluster: "Face biometric attendance",
    intent: "product",
    primaryUrl: "/solutions/face-biometric-attendance",
    keywords: [
      "face biometric attendance software",
      "face biometric attendance software India",
      "geofence attendance app India",
      "guard attendance system",
      "face recognition attendance app",
      "mobile face attendance system",
      "geofence face attendance",
      "security guard attendance app",
      "biometric attendance for security staff",
      "workforce attendance app India",
    ],
  },
  {
    cluster: "Visitor management",
    intent: "product",
    primaryUrl: "/solutions/visitor-management-system",
    keywords: [
      "visitor management system India",
      "visitor management for society",
      "digital visitor pass software",
      "apartment visitor management system",
      "society gate visitor system",
      "visitor management system for residential society",
      "visitor entry management software",
      "digital visitor register India",
    ],
  },
  {
    cluster: "Vehicle / gate",
    intent: "product",
    primaryUrl: "/solutions/vehicle-management-system",
    keywords: [
      "vehicle management system",
      "vehicle entry exit software",
      "gate vehicle tracking India",
      "vehicle entry exit management system",
      "parking vehicle log software",
      "factory gate vehicle management",
      "campus vehicle entry system",
    ],
  },
  {
    cluster: "CCTV Vision AI",
    intent: "product",
    primaryUrl: "/solutions/vision-ai-cctv",
    keywords: [
      "CCTV attendance system",
      "ANPR software India",
      "CCTV people counting",
      "ID card OCR",
      "automatic number plate recognition India",
      "CCTV AI attendance",
      "vision AI security cameras India",
    ],
  },
  {
    cluster: "Local Madurai / Tamil Nadu",
    intent: "local",
    primaryUrl: "/blog/security-operations-software-madurai",
    keywords: [
      "security operations Madurai",
      "security software Madurai",
      "guard management Tamil Nadu",
      "visitor management Madurai",
      "CloudGen Madurai",
      "SmartPatrol Madurai",
      "security company software Tamil Nadu",
      "guard tour system Madurai",
    ],
  },
  {
    cluster: "Packages / commercial",
    intent: "product",
    primaryUrl: "/pricing",
    keywords: [
      "SmartPatrol pricing",
      "Smart Patrol packages",
      "guard tour software pricing India",
      "security workforce software subscription",
      "Site Ops Suite SmartPatrol",
      "Workforce Duo SmartPatrol",
    ],
  },
  {
    cluster: "Guides / comparison",
    intent: "guide",
    primaryUrl: "/blog",
    keywords: [
      "how QR checkpoint patrol works",
      "guard tour compliance checklist India",
      "CCTV attendance vs mobile face attendance",
      "visitor management for apartments India",
      "face biometric attendance for security guards",
      "best guard tour app India",
      "security guard management software India",
    ],
  },
  {
    cluster: "Category / competitor-style",
    intent: "comparison",
    primaryUrl: "/blog/security-guard-management-software-india",
    keywords: [
      "security guard management software India",
      "workforce security app India",
      "facility security software India",
      "security operations software India",
      "patrol management system for security agencies",
      "best guard tour app India",
      "best visitor management system for society India",
    ],
  },
];

/** Flat unique list for meta keywords + checklists. */
export const ALL_SEO_KEYWORDS: string[] = Array.from(
  new Set(SEO_KEYWORD_CLUSTERS.flatMap((c) => c.keywords)),
);

/** High-priority terms for <meta name="keywords"> (keep focused). */
export const PRIMARY_META_KEYWORDS: string[] = [
  "CloudGen Technologies",
  "SmartPatrol",
  "Guards app",
  "guard tour system India",
  "QR checkpoint patrol software",
  "face biometric attendance software India",
  "geofence attendance app India",
  "visitor management system India",
  "visitor management for society",
  "vehicle entry exit software",
  "CCTV attendance system",
  "ANPR software India",
  "security operations Madurai",
  "guard management Tamil Nadu",
  "security guard management software India",
];
