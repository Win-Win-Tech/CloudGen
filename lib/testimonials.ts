export type Testimonial = {
  id: string;
  personName: string;
  role: string;
  company: string;
  address: string;
  quote: string;
  focus: string[];
  image: string;
  imageAlt: string;
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "evergreen",
    personName: "Mr. ArmStrong",
    role: "HRD & Admin Head",
    company: "EverGreen Management System",
    address: "Chennai, Tamil Nadu, India",
    quote:
      "SmartPatrol helped us digitize multi-site guard attendance and checkpoint rounds. Face biometric with geofencing cut proxy punching, and daily email reports reach our clients without manual follow-ups. The team onboarded quickly on the Guards app.",
    focus: ["Geofence attendance", "QR checkpoint patrol", "Client daily reports"],
    image: "/testimonials/armstrong-evergreen.jpg",
    imageAlt: "Mr. ArmStrong, HRD & Admin Head, EverGreen Management System",
  },
  {
    id: "eox-secure",
    personName: "Mr. Shaiq",
    role: "Managing Director",
    company: "EOX Secure",
    address: "Madurai, Tamil Nadu, India",
    quote:
      "As a Madurai-based security company, we needed live proof of patrols and faster incident escalation. SmartPatrol’s QR checkpoints, tickets with WhatsApp alerts, and real-time visibility have improved accountability across our deployments.",
    focus: ["QR patrols", "Incident tickets", "WhatsApp / IVR alerts"],
    image: "/testimonials/shaiq-eox.jpg",
    imageAlt: "Mr. Shaiq, Managing Director, EOX Secure",
  },
  {
    id: "hi-tech-arai",
    personName: "Mr. Kannan",
    role: "Business Head",
    company: "Hi-Tech Arai",
    address: "Chennai, Tamil Nadu, India",
    quote:
      "We use SmartPatrol for plant-side workforce discipline and gate control. Shift attendance, perimeter checkpoints and vehicle logs are now auditable in one place — much cleaner than paper registers for compliance reviews.",
    focus: ["Shift attendance", "Perimeter checkpoints", "Vehicle gate logs"],
    image: "/testimonials/kannan-hitech.jpg",
    imageAlt: "Mr. Kannan, Business Head, Hi-Tech Arai",
  },
  {
    id: "indus-garments",
    personName: "Mr. Vinoth",
    role: "Managing Director",
    company: "Indus Garments",
    address: "Dhalavaipuram, Tamil Nadu, India",
    quote:
      "For our garment unit, SmartPatrol brought clear guard presence on the floor and yard. Geofenced checkout, scheduled rounds and ticketed issues give supervisors confidence during night shifts and peak production days.",
    focus: ["Manufacturing security", "Night-shift patrols", "Floor incident tickets"],
    image: "/testimonials/vinoth-indus.jpg",
    imageAlt: "Mr. Vinoth, Managing Director, Indus Garments",
  },
  {
    id: "golden-win",
    personName: "Mr. Thammo",
    role: "Managing Director",
    company: "Golden Win Solution",
    address: "Malaysia",
    quote:
      "We evaluated SmartPatrol for cross-border security operations support. The mobile-first Guards workflow, multi-site roles and automated reporting make it practical to standardize patrol SOPs and share status with stakeholders.",
    focus: ["Multi-site operations", "Mobile Guards app", "Automated reporting"],
    image: "/testimonials/thammo-goldenwin.jpg",
    imageAlt: "Mr. Thammo, Managing Director, Golden Win Solution",
  },
];
