/** A single image slide for the project modal carousel. */
interface Slide {
  /** Path relative to `public/`, e.g. `"slides/clinic-os/slide-01.webp"`. */
  path: string;
  /** Optional caption overlaid at the bottom of the slide image. */
  caption?: string;
}

/** A named section of additional project detail, rendered as a bullet list. */
interface Metadata {
  /** Section heading, e.g. "Problem", "My Role", "What I Built", "Outcome". */
  title: string;
  /** One bullet point per list item. */
  bullets: string[];
}

/** A single portfolio project entry. */
export interface Project {
  /** Unique slug used as a React key and for slide directory naming (`public/slides/{id}/`). */
  id: string;

  /** Display name shown on the card and in the modal header. */
  title: string;

  /** Short summary shown on the card and as the modal subtitle. */
  description: string;

  /** Preview image displayed on the project card. */
  image: {
    /** Path relative to `public/`, e.g. `/projects/clinicos-preview.webp`. */
    src: string;
    alt: string;
  };

  /**
   * Ordered list of slides shown in the modal carousel.
   * Every entry must be declared explicitly — no glob inference.
   * Files live at `public/slides/{id}/slide-NN.[jpg|png|webp]`.
   * An optional `caption` is overlaid at the bottom of the slide when present.
   */
  slides: Slide[];

  /** Tech stack labels shown as pill tags on the card and in the modal. */
  projectStack: string[];

  /** Optional external links rendered in the modal info slide. */
  links?: { label: string; url: string }[];

  /** Optional deep-dive sections (Problem, My Role, etc.) shown in the modal info slide. */
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
    slides: [
      { path: "slides/clinic-os/slide-01.webp", caption: "ClinicOS dashboard overview" },
    ],
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
    slides: [
      { path: "slides/book-your-gp/slide-01.webp", caption: "BookYourGP interface" },
    ],
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
    description:
      "End-to-end operations management system for a car repair service company, built on Odoo to centralize service operations, inventory, customer management, and financial reporting.",
    image: {
      src: "/projects/pitcar-preview.webp",
      alt: "Pitcar project preview",
    },
    slides: [
      { path: "slides/pitcar/slide-01.webp", caption: "Pitcar sale table overview" },
    ],
    projectStack: ["Odoo", "Python", "Custom Addons", "PostgreSQL"],
    additionalInfo: [
      {
        title: "Problem",
        bullets: [
          "The company's existing tools could no longer support growing operational needs across service, inventory, customer management, and finance.",
          "Business data was spread across separate workflows, making it harder to track service history, sparepart stock, transactions, and operational reports in real time.",
          "The company needed a maintainable ERP-based system that could be handed off without requiring a dedicated in-house engineering team.",
        ],
      },
      {
        title: "What I Built",
        bullets: [
          "Implemented an Odoo-based ERP system covering sales, service operations, customer management, inventory, and accounting workflows.",
          "Built custom addons and configurations to support Pitcar's car service business processes.",
          "Created an admin dashboard so leadership could monitor operations, service activity, inventory, and financial data from one place.",
          "Prepared documentation and a handoff plan for future maintenance by the client's internal or external maintainer.",
        ],
      },
      {
        title: "Outcome",
        bullets: [
          "Replaced fragmented operational tools with a centralized ERP system for day-to-day business management.",
          "Enabled real-time visibility across service history, inventory, transactions, and reporting.",
          "Supported operations at around 400+ service units per month with a system that could be maintained after project handoff.",
        ],
      },
    ],
    links: [{ label: "Company Website", url: "https://pitcar.co.id" }],
  },{
    id: "study-ai-tools",
    title: "Study AI Toolkit",
    description:
      "A local-first document pipeline that turns lecture slides into structured Markdown and a curriculum into a generated textbook. Job-based backend over a local Ollama: submit, get an id, poll, read the output — with checkpointed resume, a content-addressed OCR cache, and a single-worker queue that keeps one GPU honest.",
    image: {
      src: "/projects/study-ai-tools-preview.webp",
      alt: "Study AI Toolkit job detail view",
    },
    slides: [
      // { path: "slides/study-ai-tools/slide-01.webp", caption: "Job detail — named stages, live output, chapter outline" },
      // { path: "slides/study-ai-tools/slide-02.webp", caption: "Jobs rail — 1 running · N waiting, the queue the backend actually has" },
      // { path: "slides/study-ai-tools/slide-03.webp", caption: "Curriculum form with saved presets" },
      // { path: "slides/study-ai-tools/slide-04.webp", caption: "Generated chapter — dependencies declared, Obsidian-ready Markdown" },
      // { path: "slides/study-ai-tools/slide-05.webp", caption: "Architecture — the API enqueues, a single worker executes, the CLI bypasses both" },
    ],
    projectStack: [
      "Python",
      "FastAPI",
      "Pydantic",
      "asyncio",
      "Ollama",
      "Vision LLM / OCR",
      "pypdfium2",
      "React",
      "Vite",
      "Tailwind CSS",
      "pytest",
      "uv",
    ],
    additionalInfo: [
      {
        title: "Problem",
        bullets: [
          "Lecture slides and syllabi arrive as PDFs and PPTX — text trapped in images, no structure, nothing searchable or linkable in a note system.",
          "Long-running local model work is the awkward case: an OCR pass over 200 pages or a 20-chapter textbook takes far longer than a request should live, and a crash halfway through should not cost the whole run.",
          "Sending course material and personal notes to a hosted model was not something I wanted to do by default, so everything had to be able to run against a local Ollama.",
        ],
      },
      {
        title: "What I Built",
        bullets: [
          "Two pipelines on one job-based backend: slides → render → per-page OCR → refinement into Markdown, and curriculum → study plan → outline → generated textbook.",
          "A FastAPI service where submitting returns 202 and a job id; a single FIFO asyncio worker executes jobs and writes progress into job.json, which the UI polls. Uploads are streamed to disk and capped, so an oversized file is rejected while it is still arriving.",
          "Crash-resumable runs: job.json — not the files on disk — is the resume authority, so a half-written chapter from a killed process is ignored and rewritten rather than counted as done.",
          "A content-addressed OCR cache keyed on the SHA-256 of the upload plus model and dpi, so re-running a deck with different refinement settings skips the expensive pass entirely and two different files named lecture.pdf never collide.",
          "Full textbook mode makes exactly one model call per chapter: an outline stage distills the curriculum once into {topic, scope, depends_on}, and each chapter closes with a machine-read ledger of the terms it established, so the raw curriculum is never resent and the context stays flat as chapter count grows. That stage does not appear anywhere in the original design sketch — it exists because the obvious implementation resends the whole curriculum per chapter, and costs grow with chapters multiplied by curriculum size.",
          "A React + Vite + Tailwind UI on a deliberate six-dependency budget — no state library, no component library, no icon pack, and a hand-written API module — that polls instead of streaming and stops polling when a job is terminal.",
          "A CLI that calls the same service layer directly, with no HTTP and no worker in the path, so the pipelines are usable headless.",
        ],
      },
      {
        title: "Design Decisions",
        bullets: [
          "Dropped the database the plan called for. The design sketch had SQLite alongside local storage and job metadata in a separate directory from the artifacts; what shipped is one directory per job holding job.json and every file the run produced. A database would have been a second source of truth to keep in sync with the files, for one user on one machine — and keeping the record beside its artifacts is what makes delete a single rmtree, resume a matter of reading the directory, and the path-traversal check one line.",
          "Deleted the complicated version. An earlier implementation (tag legacy-web) used a JSONL event log, SSE with replay cursors, and subscriber de-duplication. It worked, and it bought resilience a single-user offline tool does not need — so it was replaced with polling a status field in a JSON file, and the reasoning is written down rather than lost.",
          "Model output is treated as an untrusted upstream, not as data. Invented and forward-referencing chapter dependencies are pruned before use, a page that fails OCR becomes [missing page N] instead of killing the run, and every saved document goes through a normalizer that repairs the LaTeX delimiters, unescaped currency, and unquoted Mermaid labels that a prompt asks for but cannot guarantee.",
          "One worker, on purpose. There is one GPU; two queues feeding it would only make every job slower while looking like throughput. The constraint is documented as an invariant and surfaced in the UI as '1 running · N waiting' rather than hidden behind a generic 'active' count.",
          "Cost is a design input. The stable prefix of every chapter prompt is byte-identical across a job so Ollama's prompt cache actually hits; breaking that silently doubles the cost of a full run, so it is an invariant with a stated reason.",
          "Every stored record is immutable after creation and validated with extra=\"forbid\", which turns schema drift into a loud failure instead of a quiet one — with the migration cost of that choice written down next to it.",
          "The architecture document is a table of invariants, each with the failure it prevents. Anything deliberately not built — job cancellation, frontend test tooling — is listed with the cost that kept it out, so the reader can tell a decision from an omission.",
        ],
      },
      {
        title: "Outcome",
        bullets: [
          "A finished, runnable tool: one setup script, one process serving both the API and the built UI, and two pipelines usable from a browser or a terminal across 21 output languages.",
          "73 tests covering both pipelines end to end, resume, the OCR cache, the conflict responses, the repository rules and presets — running in well under a second, because the model layer is stubbed at the module boundary instead of over the transport.",
          "Interrupted textbook runs resume from the next chapter rather than the first, and repeat OCR of an already-transcribed deck costs nothing.",
          "Roughly 2,800 lines of Python and 2,400 of frontend, with the reasoning for the shape of it — including what was removed and why — kept in the repository.",
        ],
      },
    ],
    links: [
      { label: "Source", url: "https://github.com/ucencode/study-ai-tools" },
      { label: "Architecture & invariants", url: "https://github.com/ucencode/study-ai-tools/blob/main/CLAUDE.md" },
    ],
  },
];

export interface Client {
  name: string;
  url: string;
  logoUrl?: string;
}
