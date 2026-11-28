import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

/** Homepage FAQ — written for clarity + featured-snippet eligibility. */
export const HOME_FAQS = [
  {
    question: "What is SmartPatrol?",
    answer:
      "SmartPatrol by CloudGen Technologies is security operations software for India and beyond. It combines face biometric attendance, QR checkpoint guard tour patrols, visitor management, vehicle gate logs, and ticket tracking in one platform — with the Guards mobile app for field teams.",
  },
  {
    question: "What is a guard tour system?",
    answer:
      "A guard tour system digitally proves that security staff completed patrol rounds. With SmartPatrol, guards scan QR checkpoints on route; time and location are logged automatically so supervisors and clients can audit every visit.",
  },
  {
    question: "Does SmartPatrol include visitor and vehicle management?",
    answer:
      "Yes. SmartPatrol Visitor issues digital visitor passes with host approval. SmartPatrol Vehicle tracks site entry and exit. You can buy modules alone or as Gate Duo / Site Ops Suite.",
  },
  {
    question: "How much does SmartPatrol cost?",
    answer:
      "Published Smart Patrol packages start from USD 49 per month for Attendance or Checkpoint modules. Annual billing is priced at 10× monthly (about two months free). Vision AI and custom builds are quote-only. See Pricing for the full list.",
  },
  {
    question: "Who is SmartPatrol for?",
    answer:
      "Security agencies, factories, apartments and societies, hospitals, campuses, and multi-site facility teams that need clear attendance, patrol proof, and gate control without paper registers.",
  },
  {
    question: "Is CloudGen Technologies only available in Madurai?",
    answer:
      "CloudGen Technologies is based in Madurai, Tamil Nadu, and serves security and workforce teams across India. International deployments are also supported — for example Malaysia customers using SmartPatrol today.",
  },
] as const;

export function homeFaqJsonLd() {
  return {
    "@type": "FAQPage",
    "@id": `${absoluteUrl("/")}#faq`,
    mainEntity: HOME_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function homeServiceListJsonLd() {
  return {
    "@type": "ItemList",
    "@id": `${absoluteUrl("/")}#services`,
    name: `${site.product} core modules`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Face biometric attendance",
        url: absoluteUrl("/solutions/face-biometric-attendance"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "QR checkpoint guard tour",
        url: absoluteUrl("/solutions/qr-checkpoint-guard-tour"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Visitor management system",
        url: absoluteUrl("/solutions/visitor-management-system"),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Vehicle management system",
        url: absoluteUrl("/solutions/vehicle-management-system"),
      },
      {
        "@type": "ListItem",
        position: 5,
        name: "CCTV Vision AI",
        url: absoluteUrl("/solutions/vision-ai-cctv"),
      },
    ],
  };
}
