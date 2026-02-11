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
  techStack: string[];
  links?: { label: string; url: string }[];
  additionalInfo?: Metadata[];
}

export const projects: Project[] = [
  {
    id: "clinic-os",
    title: "ClinicOS",
    description:
      "AI-assisted healthcare operations platform; I owned the invoicing domain and billing workflow architecture.",
    image: {
      src: "/projects/clinicos-preview.webp",
      alt: "ClinicOS project preview",
    },
    techStack: [
      "Node.js",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "React",
      "Vite",
      "Sentry",
      "Grafana",
      "JWT",
      "RBAC",
    ],
    additionalInfo: [
      {
        title: "Problem",
        bullets: [
          "Medical teams spent excessive time on most clinic operations due to fragmented workflows.",
        ],
      },
      {
        title: "My Role",
        bullets: ["Backend Engineer owning invoicing domain."],
      },
      {
        title: "What I Built",
        bullets: [
          "Invoice lifecycle: appointment-driven drafts that sync with changes, finalized into immutable invoices.",
          "Integration with insurance/liquidation workflows for downstream billing.",
        ],
      },
      {
        title: "Outcome",
        bullets: [
          "Cut operational time with robust billing that reduced manual corrections.",
          "Streamlined patient and insurance workflows across the platform.",
        ],
      },
    ],
    links: [{ label: "Landing Page", url: "https://clinicos.de" }],
  },

  {
    id: "book-your-gp",
    title: "BookYourGP",
    description:
      "Clinical recall + appointment booking system for UK GP practices, with automated patient follow-ups.",
    image: {
      src: "/projects/bygp-preview.webp",
      alt: "BookYourGP project preview",
    },
    techStack: [
      "Laravel",
      "PHP",
      "MySQL",
      "jQuery",
      "Bootstrap",
      "GOV.UK Notify",
    ],
    additionalInfo: [
      {
        title: "Problem",
        bullets: [
          "Fragmented tools and manual workflows slowed down clinical operations and created inconsistent patient data.",
          "Clinics needed structured workflows across appointments, records, and documentation—often from unstructured inputs.",
          "System required security, auditability, and maintainability for real-world clinical use at scale.",
        ],
      },
      {
        title: "What I Built",
        bullets: [
          "Patient appointment scheduling and booking workflows.",
          "Clinical recall automation with GOV.UK Notify for follow-up messaging.",
          "Incremental legacy modernization while maintaining production stability.",
        ],
      },
      {
        title: "Outcome",
        bullets: [
          "Reduced manual admin work, improving operational flow for GP practices.",
          "Enabled earlier detection of severe hypertension and uncontrolled conditions through screening recalls.",
        ],
      },
    ],
    links: [
      { label: "Landing Page", url: "https://www.hummingbirdsmedical.com/" },
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
    techStack: ["Odoo", "Python", "Custom Addons", "PostgreSQL"],
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
