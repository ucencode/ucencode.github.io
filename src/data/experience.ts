export interface ExperienceEntry {
  year: string;
  /** Start and end month as "YYYY-MM"; used by the timeline. */
  start: string;
  end: string;
  company: string;
  /** Short company name for timeline lanes. */
  short: string;
  position: string;
  mode: string;
  duration: string;
  /** Related project id in the `projects` collection. */
  project?: string;
  bullets: string[];
}

export const experience: ExperienceEntry[] = [
  {
    year: "Jan 2024 - Dec 2025",
    company: "NoscAi GmbH",
    short: "NoscAi",
    position: "Founding Engineer",
    start: "2024-01",
    end: "2025-12",
    mode: "Remote",
    duration: "2 years",
    project: "clinic-os",
    bullets: [
      "Joined as the first full-time engineer on ClinicOS, an AI-powered clinic management system, and helped scale the engineering team to 9 engineers.",
      "Established foundational backend practices including code review standards, testing, formatting conventions, CI/CD workflows, and onboarding support for new engineers.",
      "Reworked the generic Medusa.js admin into a clinic-specific interface, designing role-based navigation around clinical workflows to keep core tasks within three clicks.",
      "Owned core clinical workflows across invoicing, insurance, billing-provider submissions, external lab integrations, appointment flows, and sensitive medical data processing.",
      "Reduced data-entry errors to near zero and eliminated manual submissions by developing asynchronous API and event-driven workflows across invoicing, insurance, external labs, and wearable devices.",
      "Proposed and led a plugin architecture refactor that eliminated a deeply coupled inheritance chain and reduced build times by 25%.",
      "Built dedicated microservices for document processing, XML-based billing integrations, and GDPR-conscious medical imaging metadata anonymization.",
      "Supported AI-driven features, including LLM diagnostic workflows, doctor-letter generation, and OCR-to-health-record pipelines, through code review, testing, and local iteration.",
    ],
  },
  {
    year: "Aug 2023 - Oct 2024",
    company: "PITCAR Service",
    short: "PITCAR",
    position: "Backend Developer - Freelance Project",
    start: "2023-08",
    end: "2024-10",
    mode: "Remote · freelance",
    duration: "1 year 3 months",
    project: "pitcar",
    bullets: [
      "Migrated workshop operations from fragmented SaaS tools and spreadsheets into a centralized Odoo 16 ERP system.",
      "Built custom Odoo modules for service workflows, invoicing, vehicle records, mechanic tracking, and operational audit trails.",
      "Supported 400–450 monthly service units by centralizing service, inventory, and financial workflows into a single system.",
      "Optimized vehicle lookup using PostgreSQL search improvements, enabling fast multi-parameter search by brand, model, plate number, and customer.",
      "Extended Sales, Inventory, and Accounting modules to propagate vehicle and service data across work orders and invoices.",
    ],
  },
  {
    year: "Sep 2021 - Jan 2024",
    company: "CV. Indokoding Sukses Makmur",
    short: "Indokoding",
    position: "Full Stack Developer",
    start: "2021-09",
    end: "2024-01",
    mode: "On-site",
    duration: "2 years 5 months",
    project: "book-your-gp",
    bullets: [
      "Co-owned technical delivery of BookYourGP as one of two engineers, a Laravel-based clinical oversight platform used by NHS-associated GP surgeries in the UK.",
      "Enabled life-critical patient recall workflows by integrating GovNotify and Twilio for automated appointment reminders across GP clinics.",
      "Reduced complex request load times by 60–75% through SQL query optimization and targeted database indexing.",
      "Improved long-term maintainability by helping rewrite a legacy PHP system into Laravel.",
      "Worked directly with the CEO and client stakeholders to translate clinical requirements into production-ready features.",
    ],
  },
  {
    year: "Jun 2020 - Jul 2021",
    company: "PT. Bama Berita Sarana Televisi (BBS TV)",
    short: "BBS TV",
    position: "Web Developer",
    start: "2020-06",
    end: "2021-07",
    mode: "On-site",
    duration: "1 year 2 months",
    bullets: [
      "Maintained and improved a WordPress-based media website, ensuring stability, compatibility, and reliable production operation.",
      "Built a CodeIgniter-based online competition platform with up to 1500 participant registrations, submission workflows, and an admin portal for managing entries and follow-ups.",
    ],
  },
  {
    year: "Jul 2018 - Jun 2019",
    company: "PT. Hyperdata Solusindo Mandiri",
    short: "Hyperdata",
    position: "Software Engineer Intern",
    start: "2018-07",
    end: "2019-06",
    mode: "On-site",
    duration: "1 year",
    bullets: [
      "Developed and maintained backend logic for web applications using PHP and CodeIgniter.",
      "Built a client website from scratch using CodeIgniter and PostgreSQL for backend services and data storage.",
    ],
  },
];


export const experienceSummary = {
  title: "Professional Experience",
  subtitle: "Backend depth, fullstack delivery, product-minded decisions.",
  points: [
    "Scalable backend systems and integrations",
    "Performance tuning and query optimization",
    "Production readiness and incident response",
    "Clear communication with stakeholders",
  ],
  note: "Open to backend-focused fullstack roles on product teams building SaaS and AI-enabled products.",
};
