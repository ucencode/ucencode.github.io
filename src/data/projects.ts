interface Metadata {
  title: string; // e.g. "Problem", "Solution", "Outcome"
  bullets: string[];
}
export interface Project {
  id: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  projectStack: string[];
  links?: { label: string; url: string }[];
  additionalInfo?: Metadata[];
}

export const projects: Project[] = [
  {
    id: "clinic-os",
    title: "ClinicOS",
    description:
      "ClinicOS is an AI-assisted healthcare operations platform for medical practices, built to streamline documentation, appointments, billing, patient communication, integrations, and administrative workflows in one cloud-based system.",
    image: {
      src: "/projects/clinicos-preview.webp",
      alt: "ClinicOS project preview",
    },
    projectStack: [
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Express.js",
      "Redis",
      "BullMQ",
      "Pub/Sub",
      "Google Cloud",
      "ArgoCD",
      "Sentry",
      "Grafana",
      "JWT",
      "RBAC",
    ],
    additionalInfo: [
      {
        title: "Problem",
        bullets: [
          "Medical teams often relied on fragmented tools for documentation, billing, lab submissions, insurance workflows, and patient data management.",
          "Manual forms and disconnected systems slowed clinical operations and increased the risk of data-entry errors.",
        ],
      },
      {
        title: "My Role",
        bullets: [
          "Backend Engineer leading backend development across invoicing, billing workflows, third-party integrations, and backend architecture.",
          "Established backend standards around code reviews, testing, linting, formatting, and onboarding as the team scaled.",
        ],
      },
      {
        title: "What I Built",
        bullets: [
          "Owned invoicing workflows and integrations with third-party billing, external lab, medication-data, insurance, and liquidation systems.",
          "Built an appointment-driven invoice lifecycle where draft invoices sync with appointment changes before being finalized into immutable invoices.",
          "Automated lab and insurance data submission, replacing manual multi-step forms with one-click clinician confirmation.",
          "Redesigned the plugin-based backend architecture to reduce coupling and improve modularity.",
        ],
      },
      {
        title: "Outcome",
        bullets: [
          "Reduced manual clinical data-entry work and minimized submission errors.",
          "Improved backend modularity and reduced build time by 25%, accelerating CI/CD and team-wide feature delivery.",
          "Helped shorten doctor documentation workflows through AI-assisted drafts and OCR-based health record extraction.",
          "Streamlined patient, insurance, lab, and billing workflows across the wider ClinicOS platform.",
        ],
      },
    ],
    links: [
      { label: "Product Snapshot During My Work", url: "https://web.archive.org/web/20251210015016/https://www.clinicos.de/" },
      { label: "Current Product Page", url: "https://clinicos.de" },
    ]
  },

  {
    id: "book-your-gp",
    title: "BookYourGP",
    description:
      "BookYourGP is an automated recall and appointment coordination system for UK GP practices, helping surgeries manage long-term condition reviews, patient recalls, questionnaires, and follow-up communication.",
    image: {
      src: "/projects/bygp-preview.webp",
      alt: "BookYourGP project preview",
    },
    projectStack: [
      "Laravel",
      "PHP",
      "MySQL",
      "Blade Templates",
      "JavaScript",
      "jQuery",
      "Bootstrap",
      "GOV.UK Notify",
      "Twilio",
    ],
    additionalInfo: [
      {
        title: "Problem",
        bullets: [
          "The existing legacy PHP system supported core appointment, recall, and patient communication workflows, but became harder to maintain, extend, and scale over time.",
          "Performance bottlenecks in database queries and legacy implementation patterns affected responsiveness during real clinic usage.",
          "The product needed modernization and essential improvements such as better performance, translation support, and support for imported-file inputs while preserving production stability.",
        ],
      },
      {
        title: "My Role",
        bullets: [
          "Full Stack Developer contributing as one of two engineers on the modernization from legacy PHP to Laravel.",
          "Focused on backend development, SQL performance optimization, production stability, and communication workflow integrations.",
        ],
      },
      {
        title: "What I Built",
        bullets: [
          "Migrated and refactored core backend functionality from legacy PHP to Laravel while keeping existing clinical workflows stable.",
          "Optimized SQL queries and added database indexes to improve system responsiveness.",
          "Extended existing workflows with essential improvements such as translation support and imported-file input handling.",
          "Improved patient communication integrations using GOV.UK Notify and Twilio for recall and appointment-related messaging.",
          "Maintained and enhanced existing appointment, recall, and follow-up workflows without disrupting live clinic operations.",
        ],
      },
      {
        title: "Outcome",
        bullets: [
          "Reduced page load times by 60–75% through SQL optimization and database indexing.",
          "Improved maintainability and scalability by modernizing the backend architecture with Laravel.",
          "Reduced missed appointments and improved follow-up reliability by strengthening automated reminders, recall notifications, and patient communication workflows.",
        ],
      },
    ],
    links: [
      {
        label: "Product Page Snapshot",
        url: "https://web.archive.org/web/20231219084755/https://www.hummingbirdsmedical.com/",
      }, {
        label: "Current Website",
        url: "https://www.hummingbirdsmedical.com/",
      },
    ],
  },
  {
    id: "pitcar",
    title: "Pitcar Service Management System",
    description: "End-to-end operations management system for a car repair service company, built from scratch on Odoo.",
    image: {
      src: "/projects/pitcar-preview.webp",
      alt: "Pitcar project preview",
    },
    projectStack: ["Odoo", "Python", "Custom Addons", "PostgreSQL"],
    additionalInfo: [
      {
        title: "Problem",
        bullets: [
          "CEO's existing tool wasn't cutting it and needed proper system for the whole business.",
          "Required lead management, service workflows, customer/membership tracking, technician reports, inventory, and finance in one place.",
          "No technical staff to maintain a custom system after build.",
        ],
      },
      {
        title: "What I Built",
        bullets: [
          "Full Odoo implementation covering sales, service operations, customer management, inventory, and accounting.",
          "Admin dashboard so CEO could check anything, anytime.",
          "Handoff plan and documentation for future maintainer.",
        ],
      },
      {
        title: "Outcome",
        bullets: [
          "Replaced patchwork tools with one system running the entire operation.",
          "Freelance project completed; they hired someone for ongoing maintenance.",
        ],
      },
    ],
    links: [{ label: "Company", url: "https://pitcar.co.id" }],
  },
];

export interface Client {
  name: string;
  url: string;
  logoUrl?: string;
}
