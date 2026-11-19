export interface Testimonial {
  name: string;
  /** LinkedIn recommendation; empty when no public link exists. */
  url: string;
  title: string;
  subtitle: string;
  /** Working relationship to Husein. */
  relation: string;
  /** One key line with the name replaced by "[He]"; `phrase` is highlighted. */
  highlight: { before: string; phrase: string; after: string };
  /** True when `highlight` is translated from the original language. */
  translatedFrom?: string;
  paragraphs?: string[];
}

export const testimonials: Testimonial[] = [
  {
    name: "Trio Sutardi",
    url: "",
    title: "Lead QA Engineer",
    subtitle: "",
    relation: "same team at NoscAi",
    highlight: {
      before: "[He] was someone ",
      phrase: "others relied on",
      after: " because of his strong understanding of the product, engineering, and quality.",
    },
    paragraphs: [
      "I joined NoscAi as a QA engineer with access to the tools but very little context about the product, and Husein helped me get up to speed. He walked me through ClinicOS, its tech stack, the end-to-end automated testing setup, and the team's coding practices, helping me become productive much faster. During our time working together, his code rarely came back to QA with bugs, and he often caught and reported issues elsewhere in the system before they reached production.",
      "As the team grew, I became Lead QA. Even with fewer years of experience than many of his teammates, Husein was someone others relied on because of his strong understanding of the product, engineering, and quality. He looked beyond his own tasks and cared about the quality of the system as a whole. I came to see him as a natural technical lead for the team.",
    ],

  },
  {
    name: "Surya Surakhman",
    url: "https://www.linkedin.com/in/suryasurakhman/",
    title: "Senior Software Engineer",
    subtitle: "Ex-Coupang & HOOQ",
    relation: "managed Husein directly",
    highlight: {
      before: "[He] is the kind of engineer ",
      phrase: "you want in your corner",
      after: " when building complex, high-performance systems.",
    },
    paragraphs: [
      "I had the privilege of leading Husein at Nosc AI, where he served as a Backend Engineer. Husein is the kind of engineer you want in your corner when building complex, high-performance systems. He built the billing, invoicing system and many core functionalities which were crucial for us. He is a fantastic asset to any engineering team that values code quality and integrity.",
    ],

  },
  {
    name: "Abdurrahman Al Hanif",
    url: "https://www.linkedin.com/in/abdurrahman-alhanif/",
    title: "UI/UX Designer & Frontend Developer",
    subtitle: "",
    relation: "different team",
    highlight: {
      before: "[He] dove in, found the issue in the database query, and optimized it. That ",
      phrase: "18-second lag dropped to just 1–2 seconds",
      after: ".",
    },
  },
  {
    name: "Aftar Fadilah",
    url: "https://www.linkedin.com/in/aftarfadilah/en/",
    title: "Frontend Engineer / QA",
    subtitle: "",
    relation: "same team, 2 years",
    highlight: {
      before: "He worked under heavy pressure, ",
      phrase: "stabilized the system",
      after: ", and contributed greatly to saving the company.",
    },
    translatedFrom: "Indonesian",
  },
];
