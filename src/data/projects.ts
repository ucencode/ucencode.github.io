interface Metadata {
  title: string; // e.g. "Problem", "Solution", "Outcome"
  bullets: string[];
}
export interface Project {
  id: string;
  title: string;
  shortDescription: string;
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
    id: "book-your-gp",
    title: "Book Your GP",
    shortDescription:
      "Web application for booking General Practitioner appointments in the UK.",
    image: {
      src: "/projects/book-your-gp.svg",
      alt: "Book Your GP project preview",
    },
    techStack: ["Laravel", "Bootstrap", "PHP", "MySQL"],
    additionalInfo: [
      {
        title: "Problem",
        bullets: [
          "UK GP practices needed an accessible online system for patients to book appointments without phone calls.",
        ],
      },
      {
        title: "What I Built",
        bullets: [
          "Built a web application with appointment scheduling, doctor availability management, and patient registration workflows.",
        ],
      },
      {
        title: "Outcome",
        bullets: [
          "Simplified the appointment booking process for patients and reduced administrative overhead for GP practices.",
        ],
      },
    ],
  },
  {
    id: "pitcar",
    title: "Pitcar Service Management System",
    shortDescription:
      "Operations management system for a car service company.",
    image: {
      src: "/projects/clinic-os.svg",
      alt: "ClinicOS project preview",
    },
    techStack: ["Odoo", "Python", "Custom Addons", "PostgreSQL"],
    additionalInfo: [
      {
        title: "Problem",
        bullets: [
          "Pitcar, a car service company, needed to digitize and streamline their service operations, scheduling, and customer management.",
        ],
      },
      {
        title: "What I Built",
        bullets: [
          "Developed custom Odoo addons to handle service scheduling, customer tracking, invoice management, and operational reporting.",
        ],
      },
      {
        title: "Outcome",
        bullets: [
          "Streamlined day-to-day operations, reducing manual tracking and improving service delivery efficiency.",
        ],
      },
    ],
    links: [{ label: "Company", url: "https://pitcar.co.id" }],
  },
  {
    id: "clinic-os",
    title: "ClinicOS",
    shortDescription:
      "Operations management system for a car service company.",
    image: {
      src: "/projects/pitcar.svg",
      alt: "Pitcar service management system preview",
    },
    techStack: ["Odoo", "Python", "Custom Addons", "PostgreSQL"],
    additionalInfo: [
      {
        title: "Problem",
        bullets: [
          "Pitcar, a car service company, needed to digitize and streamline their service operations, scheduling, and customer management.",
        ],
      },
      {
        title: "What I Built",
        bullets: [
          "Developed custom Odoo addons to handle service scheduling, customer tracking, invoice management, and operational reporting.",
        ],
      },
      {
        title: "Outcome",
        bullets: [
          "Streamlined day-to-day operations, reducing manual tracking and improving service delivery efficiency.",
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
