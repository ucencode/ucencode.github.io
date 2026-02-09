export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  techStack: string[];
  problem: string;
  solution: string;
  outcome: string;
  links?: { label: string; url: string }[];
}

export const projects: Project[] = [
  // {
  //   id: "serenity",
  //   title: "PT. Serenity Indonesia",
  //   shortDescription:
  //     "Company profile and product catalog website for an Indonesian enterprise.",
  //   techStack: ["PHP", "CodeIgniter 3", "Bootstrap 4", "MySQL"],
  //   problem:
  //     "The company needed an online presence to showcase their products, catalogs, and company information to clients and partners.",
  //   solution:
  //     "Built a full company profile website with a dynamic product catalog system, allowing the team to manage and display products with detailed specifications.",
  //   outcome:
  //     "Enabled digital product showcase, improving client engagement and reducing the need for physical catalogs.",
  // },
  // {
  //   id: "smk-pgri",
  //   title: "SMK PGRI 3 Information Website",
  //   shortDescription:
  //     "School information portal built as a high school final project.",
  //   techStack: ["PHP", "Custom MVC Framework", "MySQL", "CSS"],
  //   problem:
  //     "The vocational high school needed a centralized web platform for distributing school information, announcements, and resources.",
  //   solution:
  //     "Designed and built a custom MVC-based information website from scratch, implementing a clean architecture pattern similar to CodeIgniter.",
  //   outcome:
  //     "Served as the school's primary information portal. Demonstrated strong architectural understanding as a final project.",
  // },
  {
    id: "digital-mtq",
    title: "Digital MTQ",
    shortDescription:
      "Online Quran recitation competition system for regional events.",
    techStack: ["CodeIgniter", "Bootstrap 4", "MySQL", "jQuery"],
    problem:
      "Regional Quran recitation competitions needed to transition from in-person to digital format for broader accessibility.",
    solution:
      "Built a full online competition management system with participant registration, scoring, scheduling, and result tracking.",
    outcome:
      "Successfully digitized regional competitions, enabling remote participation across multiple districts.",
    links: [{ label: "Live Site", url: "https://digitalmtq.com" }],
  },
  {
    id: "forum-bkk",
    title: "Forum BKK Jawa Timur",
    shortDescription:
      "Vocational school job board and organizational blog platform.",
    techStack: ["WordPress", "Custom Theme", "PHP"],
    problem:
      "BKK (Bursa Kerja Khusus) organizations across East Java needed a centralized platform for job postings and community updates.",
    solution:
      "Built a WordPress-based forum and blog with custom theming, enabling organizations to publish and archive posts efficiently.",
    outcome:
      "Served as a central hub for job postings and communication across vocational schools in the region.",
  },
  {
    id: "pitcar",
    title: "Pitcar Service Management System",
    shortDescription:
      "Operations management system for a car service company.",
    techStack: ["Odoo", "Python", "Custom Addons", "PostgreSQL"],
    problem:
      "Pitcar, a car service company, needed to digitize and streamline their service operations, scheduling, and customer management.",
    solution:
      "Developed custom Odoo addons to handle service scheduling, customer tracking, invoice management, and operational reporting.",
    outcome:
      "Streamlined day-to-day operations, reducing manual tracking and improving service delivery efficiency.",
    links: [{ label: "Company", url: "https://pitcar.co.id" }],
  },
  {
    id: "book-your-gp",
    title: "Book Your GP",
    shortDescription:
      "Web application for booking General Practitioner appointments in the UK.",
    techStack: ["Laravel", "Bootstrap 3", "PHP", "MySQL"],
    problem:
      "UK GP practices needed an accessible online system for patients to book appointments without phone calls.",
    solution:
      "Built a web application with appointment scheduling, doctor availability management, and patient registration workflows.",
    outcome:
      "Simplified the appointment booking process for patients and reduced administrative overhead for GP practices.",
  },
];

export interface Client {
  name: string;
  url: string;
  logoUrl?: string;
}

export const clients: Client[] = [
  { name: "BBS TV", url: "https://www.bbstv.id/" },
  { name: "Theta Momentum", url: "https://thetamomentum.com/" },
  { name: "Digital MTQ", url: "https://digitalmtq.com/" },
  { name: "Pitcar", url: "https://pitcar.co.id/" },
];

export const socialLinks = {
  email: "ahmadhuseinh.03@gmail.com",
  github: "https://github.com/ucencode",
  linkedin: "https://www.linkedin.com/in/ahmadhuseinhambali03/",
  whatsapp: "http://bit.ly/a_husein",
  instagram: "https://www.instagram.com/ucenintheworld/",
  facebook: "https://www.facebook.com/ahmad.husein.hambali/",
};

export const coreStrengths = [
  "Backend Development — Node.js, TypeScript, Express.js",
  "System Design — API architecture, Database design, Scalable systems",
  "Database — PostgreSQL, Redis, Query optimization, Data modeling",
  "DevOps — Docker, Git, CI/CD workflows",
];
