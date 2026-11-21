export type Testimonial = {
  id: string;
  company: string;
  location: string;
  role: string;
  quote: string;
  focus: string[];
};

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "evergreen",
    company: "EverGreen Management System",
    location: "Chennai",
    role: "Operations leadership",
    quote:
      "SmartPatrol helped us digitize multi-site guard attendance and checkpoint rounds. Face biometric with geofencing cut proxy punching, and daily email reports reach our clients without manual follow-ups. The team onboarded quickly on the Guards app.",
    focus: ["Geofence attendance", "QR checkpoint patrol", "Client daily reports"],
  },
  {
    id: "eox-secure",
    company: "EOX Secure",
    location: "Madurai",
    role: "Security management",
    quote:
      "As a Madurai-based security company, we needed live proof of patrols and faster incident escalation. SmartPatrol’s QR checkpoints, tickets with WhatsApp alerts, and real-time visibility have improved accountability across our deployments.",
    focus: ["QR patrols", "Incident tickets", "WhatsApp / IVR alerts"],
  },
  {
    id: "hi-tech-arai",
    company: "Hi-Tech Arai",
    location: "Chennai",
    role: "Facility & security coordination",
    quote:
      "We use SmartPatrol for plant-side workforce discipline and gate control. Shift attendance, perimeter checkpoints and vehicle logs are now auditable in one place — much cleaner than paper registers for compliance reviews.",
    focus: ["Shift attendance", "Perimeter checkpoints", "Vehicle gate logs"],
  },
  {
    id: "indus-garments",
    company: "Indus Garments",
    location: "Dhalavaipuram",
    role: "Manufacturing unit administration",
    quote:
      "For our garment unit, SmartPatrol brought clear guard presence on the floor and yard. Geofenced checkout, scheduled rounds and ticketed issues give supervisors confidence during night shifts and peak production days.",
    focus: ["Manufacturing security", "Night-shift patrols", "Floor incident tickets"],
  },
  {
    id: "golden-win",
    company: "Golden Win Solution",
    location: "Malaysia",
    role: "Regional operations",
    quote:
      "We evaluated SmartPatrol for cross-border security operations support. The mobile-first Guards workflow, multi-site roles and automated reporting make it practical to standardize patrol SOPs and share status with stakeholders.",
    focus: ["Multi-site operations", "Mobile Guards app", "Automated reporting"],
  },
];
