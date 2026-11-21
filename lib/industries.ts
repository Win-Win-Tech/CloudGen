export type Industry = {
  slug: string;
  title: string;
  summary: string;
  leverage: string[];
  modules: string[];
};

/**
 * Domain verticals — how SmartPatrol / Guards can be leveraged.
 */
export const INDUSTRIES: Industry[] = [
  {
    slug: "security-management-company",
    title: "Security Management Company",
    summary:
      "Run multi-client guard operations from one control desk with proof of presence, live alerts and client-ready reports.",
    leverage: [
      "Digitize guard tours with QR / NFC / virtual checkpoints across every site you manage",
      "Prove attendance with geofence + face biometric — reduce proxy punching and payroll disputes",
      "Raise and escalate incidents with photo, voice and video evidence to your SOC",
      "Share automated daily reports with clients at 7:00 AM without manual consolidation",
      "Scale the same playbook across cities with role-based multi-site access",
    ],
    modules: ["Smart Patrol Checkpoint", "Smart Patrol Attendance", "Ticket Complaints Tracking"],
  },
  {
    slug: "security-consultant",
    title: "Security Consultant",
    summary:
      "Recommend a measurable operating model — audits, SOPs and live dashboards your clients can adopt quickly.",
    leverage: [
      "Benchmark patrol compliance, missed scans and response times with hard data",
      "Design site-specific checkpoint maps, shift rules and escalation matrices",
      "Pilot Base / Pro / Gold-style packages aligned to client risk and budget",
      "Hand over a configured SmartPatrol instance instead of paper SOPs alone",
      "Use Vision AI and gate modules where consultants advise layered security",
    ],
    modules: ["Smart Patrol Site Ops Suite", "Smart Patrol Vision AI", "Custom Build"],
  },
  {
    slug: "facility-management-company",
    title: "Facility Management Company",
    summary:
      "Connect security staff, soft-services tickets and site compliance under one workforce stack.",
    leverage: [
      "Track FM security and housekeeping rounds with scheduled checkpoint scans",
      "Capture facility complaints as tickets with WhatsApp / IVR alerts to supervisors",
      "Verify contractor attendance inside geofenced campuses",
      "Maintain audit trails for SLA reviews with building owners",
      "Unify visitor and vehicle logs at towers, parks and industrial parks you operate",
    ],
    modules: [
      "Smart Patrol Checkpoint",
      "Ticket Complaints Tracking",
      "Smart Patrol Visitor",
      "Smart Patrol Vehicle",
    ],
  },
  {
    slug: "property-management-company",
    title: "Property Management Company",
    summary:
      "Give property managers visibility of guards, visitors and vehicles across portfolios.",
    leverage: [
      "Standardize night patrols and lobby coverage for managed properties",
      "Digitize visitor pre-registration, host approval and QR passes for tenants",
      "Control vehicle entry/exit with plate capture and whitelist / blacklist rules",
      "Alert on overstay, restricted zones and SOS from the ground team",
      "Export portfolio-level attendance and incident packs for owners",
    ],
    modules: ["Smart Patrol Gate Duo", "Smart Patrol Attendance", "Smart Patrol Checkpoint"],
  },
  {
    slug: "healthcare",
    title: "Healthcare",
    summary:
      "Secure hospitals and clinics with controlled access, ward patrols and rapid incident response.",
    leverage: [
      "Enforce staff and outsourced-guard attendance at hospital geofences",
      "Schedule ward, pharmacy, parking and critical-area patrol checkpoints",
      "Manage patient / visitor entry with ID capture and timed QR passes",
      "Escalate security or safety tickets to the control room with media evidence",
      "Support CCTV attendance and people-counting where Vision AI is approved",
    ],
    modules: [
      "Smart Patrol Attendance",
      "Smart Patrol Checkpoint",
      "Smart Patrol Visitor",
      "Smart Patrol Vision AI",
    ],
  },
  {
    slug: "education",
    title: "Education",
    summary:
      "Protect campuses, hostels and gates with accountable patrols and visitor controls.",
    leverage: [
      "Geofence campus and hostel attendance for security and support staff",
      "Patrol hostels, labs, playgrounds and perimeter with timed QR scans",
      "Register parent / vendor visitors with host approval and exit verification",
      "Log vehicle movement at school / college gates",
      "Keep principal and admin offices informed via daily automated reports",
    ],
    modules: ["Smart Patrol Checkpoint", "Smart Patrol Visitor", "Smart Patrol Vehicle"],
  },
  {
    slug: "it-sector",
    title: "IT Sector",
    summary:
      "Meet corporate campus security expectations with digital proof, access control and SLA reporting.",
    leverage: [
      "Align guard tours to corporate SOPs with digital checklists at every checkpoint",
      "Face biometric + geofence attendance for contract security teams",
      "Integrate visitor workflows for employees’ guests and vendors",
      "Vehicle ANPR-style capture and parking / dock controls",
      "Feed SOC dashboards with real-time alerts, tickets and audit trails",
    ],
    modules: ["Smart Patrol Site Ops Suite", "Smart Patrol Vision AI", "API / Custom Build"],
  },
  {
    slug: "industries-manufacturing",
    title: "Industries / Manufacturing Unit",
    summary:
      "Secure plants, sheds and yards with shift-proof attendance, patrol proof and gate discipline.",
    leverage: [
      "Auto checkout when guards leave plant geofences or miss shift buffers",
      "Checkpoint hazardous zones, warehouses inside the plant and perimeter loops",
      "Gate visitor and material vehicle movements with blacklist controls",
      "Raise safety / security incidents with photos from the floor",
      "Roll-call and working-hour tracking for multi-shift manufacturing security",
    ],
    modules: [
      "Smart Patrol Attendance",
      "Smart Patrol Checkpoint",
      "Smart Patrol Vehicle",
      "Ticket Complaints Tracking",
    ],
  },
  {
    slug: "malls",
    title: "Malls",
    summary:
      "Coordinate mall security across floors, parking and service corridors in real time.",
    leverage: [
      "Schedule floor-wise and parking-level patrol routes with QR proof",
      "Handle crowd / incident tickets with instant WhatsApp and IVR alerts",
      "Manage visitor contractors and VIP passes at mall control rooms",
      "Track vehicle entry, exit and overstay in parking basements",
      "Use people-counting / CCTV AI options for peak-hour visibility",
    ],
    modules: [
      "Smart Patrol Checkpoint",
      "Smart Patrol Gate Duo",
      "Smart Patrol Vision AI",
      "Ticket Complaints Tracking",
    ],
  },
  {
    slug: "airport",
    title: "Airport",
    summary:
      "Support airport landside and restricted-area discipline with verified presence and escalation.",
    leverage: [
      "Verify patrols in terminals, cargo and perimeter with time/location checks",
      "Enforce geofenced attendance for contracted security shifts",
      "Control visitor / contractor passes for airside-adjacent work zones",
      "Log vehicle movements at landside gates and service roads",
      "Escalate SOS and missed-checkpoint alerts to the airport SOC immediately",
    ],
    modules: ["Smart Patrol Checkpoint", "Smart Patrol Attendance", "Smart Patrol Gate Duo"],
  },
  {
    slug: "train-station",
    title: "Train Station",
    summary:
      "Keep station platforms, circulating areas and yards under scheduled, auditable watch.",
    leverage: [
      "Define platform, concourse and parking patrol loops with digital checklists",
      "Capture incidents (theft, crowd surge, trespass) with media evidence",
      "Track contractor attendance for station facility security teams",
      "Manage service vehicle and vendor access at station gates",
      "Deliver shift reports to station managers without paper logbooks",
    ],
    modules: ["Smart Patrol Checkpoint", "Ticket Complaints Tracking", "Smart Patrol Vehicle"],
  },
  {
    slug: "apartments",
    title: "Apartments",
    summary:
      "Modernize society / apartment security with visitor apps, patrol proof and gate control.",
    leverage: [
      "Replace paper visitor registers with ID capture, QR passes and host approval",
      "Whitelist resident vehicles and flag unknown plates at the gate",
      "Ensure night guards complete tower and common-area rounds on schedule",
      "Alert association admins on SOS, overstay or missed checkpoints",
      "Provide transparent monthly attendance and incident packs to residents’ committees",
    ],
    modules: ["Smart Patrol Gate Duo", "Smart Patrol Checkpoint", "Smart Patrol Attendance"],
  },
  {
    slug: "warehouses",
    title: "Warehouses",
    summary:
      "Protect inventory yards and docks with geofenced staffing, patrols and vehicle logs.",
    leverage: [
      "Geofence warehouse boundaries so attendance and auto-checkout stay accurate",
      "Patrol dock doors, racking aisles and outer fencing on a fixed schedule",
      "Log inbound / outbound trucks with registration capture",
      "Raise theft, damage or safety tickets with photo evidence from the floor",
      "Give 3PL and brand owners shared visibility through daily automated reports",
    ],
    modules: [
      "Smart Patrol Attendance",
      "Smart Patrol Checkpoint",
      "Smart Patrol Vehicle",
      "Ticket Complaints Tracking",
    ],
  },
];
