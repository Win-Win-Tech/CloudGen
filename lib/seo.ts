import { site } from "@/lib/site";

export type SeoSection = {
  heading: string;
  body: string[];
};

export type ProductPillar = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  keywords: string[];
  packageHref: string;
  highlights: string[];
  sections: SeoSection[];
  faqs: { q: string; a: string }[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingMinutes: number;
  keywords: string[];
  relatedSlugs: string[];
  sections: SeoSection[];
};

export const PRODUCT_PILLARS: ProductPillar[] = [
  {
    slug: "face-biometric-attendance",
    title: "Face Biometric Attendance Software India",
    h1: "Face biometric attendance software for sites & security teams",
    description:
      "SmartPatrol face biometric attendance with geofence checks, liveness detection and mobile punch — built for Indian workforce and guard operations.",
    keywords: [
      "face biometric attendance software",
      "face biometric attendance software India",
      "geofence attendance app India",
      "guard attendance system",
      "face recognition attendance app",
      "security guard attendance app",
    ],
    packageHref: "/pricing",
    highlights: [
      "Liveness-aware face punch on Android",
      "Geofence controls for on-site attendance",
      "Ticket Complaints Tracking included",
    ],
    sections: [
      {
        heading: "Why sites switch from registers to face attendance",
        body: [
          "Paper registers and buddy punching waste supervisor time and create disputes. Face biometric attendance captures who punched, when, and whether they were inside the approved geofence.",
          "SmartPatrol Attendance is sold as a focused package for teams that only need workforce punch — or bundled with QR patrol in Workforce Duo and Site Ops Suite.",
        ],
      },
      {
        heading: "Built for Indian security and facility operations",
        body: [
          "Use it for factories, campuses, societies, hospitals and multi-site agencies. Supervisors get clearer attendance trails; finance gets cleaner payroll inputs.",
          "Start from $49/mo for the base Attendance band, then scale users with pro-rata pricing on the published USD rate card.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does face attendance work offline?",
        a: "The Guards Android app is designed for field use with site connectivity patterns typical of Indian deployments. Ask us about your site network during a demo.",
      },
      {
        q: "Can we limit punches to a location?",
        a: "Yes — geofence attendance helps ensure punches happen at the approved site boundary.",
      },
    ],
  },
  {
    slug: "qr-checkpoint-guard-tour",
    title: "QR Checkpoint Guard Tour System India",
    h1: "QR checkpoint guard tour system with time & location proof",
    description:
      "Digitize guard tours with QR checkpoint scanning, route proof and supervisor visibility — SmartPatrol Checkpoint for security agencies across India.",
    keywords: [
      "guard tour system India",
      "QR checkpoint patrol software",
      "security guard patrolling app",
      "QR code checkpoint scanning system",
      "digital guard tour system",
      "patrol management software India",
    ],
    packageHref: "/pricing",
    highlights: [
      "QR scan proof at every checkpoint",
      "Time and location trail for audits",
      "Pairs with attendance in Workforce Duo",
    ],
    sections: [
      {
        heading: "Replace clipboard patrol logs",
        body: [
          "Traditional guard tour books are easy to fake and hard to audit. QR checkpoint scanning creates a digital trail of completed rounds with timestamps.",
          "SmartPatrol Checkpoint is ideal for sites that need patrol proof without buying the full stack — or combine Face + QR in Workforce Duo.",
        ],
      },
      {
        heading: "Supervisor visibility without radio chase",
        body: [
          "Operations leads can see whether checkpoints were hit on schedule and follow up on missed scans instead of guessing from paper notes.",
          "Ticket Complaints Tracking is included on every Smart Patrol package so site issues can be logged alongside patrol work.",
        ],
      },
    ],
    faqs: [
      {
        q: "How many checkpoints can we start with?",
        a: "Smart Patrol Checkpoint starts with a base QR code band and scales with pro-rata pricing when you need more codes.",
      },
      {
        q: "Is this only for security agencies?",
        a: "No — factories, hospitals, campuses and residential communities also use QR patrol for proof of presence.",
      },
    ],
  },
  {
    slug: "visitor-management-system",
    title: "Visitor Management System for Sites & Societies",
    h1: "Visitor management system for gates, societies and campuses",
    description:
      "Digital visitor check-in, passes and host workflows with SmartPatrol Visitor — per-site licensing for Indian residential and commercial gates.",
    keywords: [
      "visitor management system India",
      "visitor management for society",
      "digital visitor pass software",
      "apartment visitor management system",
      "society gate visitor system",
      "visitor management system for residential society",
    ],
    packageHref: "/pricing",
    highlights: [
      "Digital visitor passes at the gate",
      "Per-site licensing for multi-property teams",
      "Combine with Vehicle in Gate Duo",
    ],
    sections: [
      {
        heading: "Faster gate check-in, clearer records",
        body: [
          "Visitor registers get messy during peak hours. A digital visitor management system shortens check-in and keeps a searchable history for security reviews.",
          "SmartPatrol Visitor is priced per site so agencies and facility managers can roll out property by property.",
        ],
      },
      {
        heading: "Pair visitor + vehicle at the same gate",
        body: [
          "If your reception desk also tracks cars, Gate Duo combines Visitor and Vehicle at a bundle rate versus buying both alone.",
          "Every package still includes Ticket Complaints Tracking for resident or tenant issue workflows.",
        ],
      },
    ],
    faqs: [
      {
        q: "Can we deploy one society first?",
        a: "Yes — Visitor is licensed per site, so you can start with a single property and expand later.",
      },
      {
        q: "Do visitors need an app?",
        a: "Gate workflows are designed for staff-led check-in. We can walk through the exact visitor journey in a live demo.",
      },
    ],
  },
  {
    slug: "vehicle-management-system",
    title: "Vehicle Entry Exit Management Software",
    h1: "Vehicle management software for site entry and exit control",
    description:
      "Track vehicle movement at gates with SmartPatrol Vehicle — entry/exit visibility for factories, campuses and parking-controlled sites in India.",
    keywords: [
      "vehicle management system",
      "vehicle entry exit software",
      "gate vehicle tracking India",
      "vehicle entry exit management system",
      "factory gate vehicle management",
    ],
    packageHref: "/pricing",
    highlights: [
      "Entry and exit visibility at the gate",
      "Per-site vehicle operations package",
      "Bundle with Visitor as Gate Duo",
    ],
    sections: [
      {
        heading: "Know what entered and when",
        body: [
          "Sites lose hours reconciling handwritten vehicle logs. Digital vehicle management gives security and admin teams a clearer movement trail.",
          "Use SmartPatrol Vehicle alone, or with Visitor in Gate Duo when both people and cars pass the same boom barrier.",
        ],
      },
      {
        heading: "Scale from one gate to many sites",
        body: [
          "Per-site licensing keeps rollout practical for agencies managing multiple properties. Add Site Ops Suite when you also need Face and QR patrol.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does this include ANPR cameras?",
        a: "ANPR is part of Smart Patrol Vision AI (quote-only). Vehicle management covers operational gate workflows; we can scope cameras separately.",
      },
      {
        q: "Can vehicle and visitor share one package?",
        a: "Yes — Gate Duo is the discounted Visitor + Vehicle bundle.",
      },
    ],
  },
  {
    slug: "vision-ai-cctv",
    title: "CCTV Vision AI Attendance ANPR OCR",
    h1: "CCTV Vision AI for attendance, counting, ANPR and ID OCR",
    description:
      "SmartPatrol Vision AI uses existing cameras for attendance, people counting, ANPR and ID card OCR — scoped per camera set for Indian sites.",
    keywords: [
      "CCTV attendance system",
      "ANPR software India",
      "CCTV people counting",
      "ID card OCR",
      "automatic number plate recognition India",
      "CCTV AI attendance",
    ],
    packageHref: "/contact",
    highlights: [
      "Attendance and counting from CCTV",
      "ANPR number-plate recognition",
      "ID OCR for faster document capture",
    ],
    sections: [
      {
        heading: "Use cameras you already installed",
        body: [
          "Vision AI is for sites with camera infrastructure that want automated attendance, footfall counting, plate reads or ID extraction without rebuilding the whole security stack.",
          "Every Vision AI engagement is quote-scoped around camera count, lighting and the outcomes you need.",
        ],
      },
      {
        heading: "Where Vision AI fits beside mobile Smart Patrol",
        body: [
          "Many customers keep Guards app modules for field patrol and add Vision AI where fixed cameras can automate choke points. We design the mix during discovery.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is Vision AI available as a fixed monthly SKU?",
        a: "It is quote-only because camera sets and accuracy requirements vary. Contact us for a scoped proposal.",
      },
      {
        q: "Can we start with only ANPR?",
        a: "Yes — we can scope a single Vision AI outcome first, then expand.",
      },
    ],
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "how-qr-checkpoint-patrol-works",
    title: "How QR checkpoint guard patrol works",
    description:
      "A practical guide to QR checkpoint patrolling — what guards scan, what supervisors see, and how SmartPatrol Checkpoint proves rounds in India.",
    date: "2026-03-01",
    readingMinutes: 6,
    keywords: ["QR checkpoint patrol", "guard tour system"],
    relatedSlugs: ["qr-checkpoint-guard-tour"],
    sections: [
      {
        heading: "The problem with paper patrol books",
        body: [
          "Clipboard logs are slow to check and easy to fill in after the fact. Supervisors only discover missed rounds when an incident already happened.",
          "QR checkpoint patrol turns each stop into a scan event with time and location context, so missed points show up as operational gaps — not surprises.",
        ],
      },
      {
        heading: "What a good checkpoint route looks like",
        body: [
          "Place codes at doors, stairwells, perimeter corners and high-risk rooms. Keep spacing realistic for the shift length so guards can complete rounds without rushing.",
          "Start with a base code band on Smart Patrol Checkpoint, then add codes as the site matures.",
        ],
      },
      {
        heading: "How SmartPatrol helps",
        body: [
          "Guards scan with the Android app; supervisors review completion trails. Pair with face attendance in Workforce Duo when you also need punch discipline.",
        ],
      },
    ],
  },
  {
    slug: "visitor-management-for-apartments-india",
    title: "Visitor management for apartments and societies in India",
    description:
      "How residential societies digitize gate visitor logs, reduce peak-hour queues and keep cleaner security records with a visitor management system.",
    date: "2026-03-05",
    readingMinutes: 5,
    keywords: ["visitor management for society", "apartment visitor system"],
    relatedSlugs: ["visitor-management-system"],
    sections: [
      {
        heading: "Why societies outgrow paper registers",
        body: [
          "Evening peaks create long queues and incomplete entries. When something goes wrong, finding a name in a notebook is painful.",
          "Digital visitor management keeps gate staff on a consistent checklist and stores records you can actually search later.",
        ],
      },
      {
        heading: "Roll out one property at a time",
        body: [
          "SmartPatrol Visitor is licensed per site, which fits RWAs and facility teams that want to prove value on one tower or campus before expanding.",
          "If parking is equally messy, Gate Duo adds vehicle entry/exit on the same commercial path.",
        ],
      },
    ],
  },
  {
    slug: "face-biometric-attendance-for-security-guards",
    title: "Face biometric attendance for security guards",
    description:
      "Why security agencies adopt face biometric attendance with geofencing — and how it reduces buddy punching on multi-site contracts.",
    date: "2026-03-10",
    readingMinutes: 5,
    keywords: ["face biometric attendance", "guard attendance app"],
    relatedSlugs: ["face-biometric-attendance"],
    sections: [
      {
        heading: "Buddy punching drains agency margins",
        body: [
          "When one guard punches for another, clients get billed for coverage that never happened. Face attendance with liveness checks makes that harder.",
          "Geofencing further ties punches to the contracted site instead of a nearby tea stall.",
        ],
      },
      {
        heading: "Attendance + patrol is the common stack",
        body: [
          "Many agencies buy Smart Patrol Attendance first, then add QR Checkpoint. Workforce Duo discounts that Face + QR combination versus buying both alone.",
        ],
      },
    ],
  },
  {
    slug: "vehicle-entry-exit-software-for-sites",
    title: "Vehicle entry and exit software for industrial sites",
    description:
      "What to track at factory and campus gates — visitor cars, vendor vehicles and movement history — before you invest in ANPR cameras.",
    date: "2026-03-15",
    readingMinutes: 5,
    keywords: ["vehicle entry exit software", "gate vehicle log"],
    relatedSlugs: ["vehicle-management-system", "vision-ai-cctv"],
    sections: [
      {
        heading: "Start with process, then cameras",
        body: [
          "Many sites jump to ANPR before fixing gate workflows. Operational vehicle management clarifies who entered, who authorized them, and when they left.",
          "SmartPatrol Vehicle covers that workflow layer. Add Vision AI ANPR later if camera automation is justified.",
        ],
      },
      {
        heading: "Visitor cars vs fleet vehicles",
        body: [
          "Treat guest vehicles and standing fleet differently. Consistent categories make monthly security reports useful for management reviews.",
        ],
      },
    ],
  },
  {
    slug: "cctv-attendance-vs-mobile-face-attendance",
    title: "CCTV attendance vs mobile face attendance",
    description:
      "Compare CCTV-based attendance and mobile face biometric punch — when to use Vision AI cameras versus the Guards app on site.",
    date: "2026-03-20",
    readingMinutes: 6,
    keywords: ["CCTV attendance", "face biometric attendance comparison"],
    relatedSlugs: ["vision-ai-cctv", "face-biometric-attendance"],
    sections: [
      {
        heading: "Mobile face punch fits distributed posts",
        body: [
          "Guards moving across a campus often need phone-based punch with geofence rules. That is the SmartPatrol Attendance model.",
        ],
      },
      {
        heading: "CCTV attendance fits fixed choke points",
        body: [
          "If everyone passes a well-lit camera gate, Vision AI can automate attendance without a phone interaction. Lighting, camera angle and privacy policy matter.",
        ],
      },
      {
        heading: "Many sites use both",
        body: [
          "Use mobile modules for patrol and field staff; use Vision AI where cameras already cover entry lanes. CloudGen scopes the mix during discovery.",
        ],
      },
    ],
  },
  {
    slug: "guard-tour-compliance-checklist-india",
    title: "Guard tour compliance checklist for Indian sites",
    description:
      "A practical compliance-minded checklist for guard tours in India — checkpoints, escalation, evidence retention and supervisor review cadence.",
    date: "2026-03-25",
    readingMinutes: 7,
    keywords: ["guard tour compliance", "security patrol checklist India"],
    relatedSlugs: ["qr-checkpoint-guard-tour"],
    sections: [
      {
        heading: "Define the round before you buy software",
        body: [
          "List high-risk zones, required visit frequency and who escalates a miss. Software only helps if the operating procedure is clear.",
        ],
      },
      {
        heading: "Evidence you should be able to produce",
        body: [
          "Timestamped checkpoint completion, missed-scan follow-up notes and complaint tickets for site issues. SmartPatrol Checkpoint plus included Ticket Complaints Tracking covers that loop.",
        ],
      },
      {
        heading: "Review weekly, not only after incidents",
        body: [
          "A short weekly review of missed checkpoints catches process drift early — before a client audit or insurance discussion.",
        ],
      },
    ],
  },
  {
    slug: "smart-patrol-packages-explained",
    title: "SmartPatrol packages explained: modules, duos and Site Ops",
    description:
      "Plain-English guide to Smart Patrol Attendance, Checkpoint, Visitor, Vehicle, Duo bundles and Site Ops Suite — plus what is quote-only.",
    date: "2026-04-01",
    readingMinutes: 6,
    keywords: ["SmartPatrol pricing", "Smart Patrol packages"],
    relatedSlugs: [
      "face-biometric-attendance",
      "qr-checkpoint-guard-tour",
      "visitor-management-system",
    ],
    sections: [
      {
        heading: "Buy only what the site needs",
        body: [
          "Single modules cover Attendance, Checkpoint, Visitor or Vehicle. Duos discount common pairs. Site Ops Suite stacks Face + QR + Visitor + Vehicle.",
        ],
      },
      {
        heading: "Included on every package",
        body: [
          "Ticket Complaints Tracking / Availability Command Centre is included across paid Smart Patrol packages so issue workflows are not a separate upsell.",
        ],
      },
      {
        heading: "Quote-only specialties",
        body: [
          "Vision AI, Industry Suite and Custom Build are scoped per engagement because camera counts and vertical workflows vary.",
        ],
      },
    ],
  },
  {
    slug: "security-operations-software-madurai",
    title: "Security operations software from Madurai, India",
    description:
      "How CloudGen Technologies in Madurai builds SmartPatrol for guard tour, attendance, visitor and vehicle operations across Tamil Nadu and India.",
    date: "2026-04-05",
    readingMinutes: 4,
    keywords: [
      "security software Madurai",
      "guard management Tamil Nadu",
      "CloudGen Technologies",
    ],
    relatedSlugs: ["qr-checkpoint-guard-tour", "face-biometric-attendance"],
    sections: [
      {
        heading: "Local builders, India-wide deployments",
        body: [
          `${site.company} is based in Madurai and ships SmartPatrol / Guards for workforce and security operations teams across India.`,
          "Buyers get competitive USD packaging, Razorpay checkout in INR, and hands-on demos — not a generic overseas template.",
        ],
      },
      {
        heading: "Talk to us about your site type",
        body: [
          "Factories, hospitals, societies and multi-site agencies each need a different module mix. Start with a demo or WhatsApp conversation and we will map the stack.",
        ],
      },
    ],
  },
];

export function getProductPillar(slug: string) {
  return PRODUCT_PILLARS.find((p) => p.slug === slug);
}

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function absoluteUrl(path = "") {
  const base = site.url.replace(/\/$/, "");
  if (!path) return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
