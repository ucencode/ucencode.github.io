import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import ProjectModal from "./ProjectModal";
import SectionReveal from "./SectionReveal";

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="py-24 md:py-32 section-alt">
      <div className="max-w-5xl mx-auto px-6">
        <SectionReveal>
          <p className="font-mono text-primary text-sm mb-3 tracking-wide">
            Projects
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Selected Work
          </h2>
          <p className="text-muted-foreground max-w-lg mb-12">
            A selection of projects I've built — from freelance work to
            enterprise systems.
          </p>
        </SectionReveal>

        <div className="space-y-6">
          {projects.map((project, i) => {
            const isReversed = i % 2 !== 0;
            const imageSrc = `${import.meta.env.BASE_URL}${project.image.src.replace(
              /^\//,
              "",
            )}`;

            return (
              <SectionReveal key={project.id} delay={i * 80}>
                <button
                  onClick={() => setSelectedProject(project)}
                  className="group w-full text-left bg-card border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background md:min-h-[280px]"
                >
                  <div
                    className={`flex flex-col md:flex-row md:items-stretch ${
                      isReversed ? "md:flex-row-reverse" : ""
                    }`}
                  >
                    <div className="relative w-full md:w-5/12 h-60 sm:h-64 md:h-auto md:min-h-[280px] overflow-hidden bg-secondary/40">
                      <img
                        src={imageSrc}
                        alt={project.image.alt}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-transparent opacity-70" />
                    </div>

                    <div className="flex-1 p-6 md:p-7">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="font-semibold text-foreground text-base md:text-lg leading-snug group-hover:text-primary transition-colors">
                          {project.title}
                        </h3>
                        <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-1">
                          <ArrowUpRight size={18} />
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                        {project.shortDescription}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack.slice(0, 3).map((tech) => (
                          <span key={tech} className="tech-tag text-[11px]">
                            {tech}
                          </span>
                        ))}
                        {project.techStack.length > 3 && (
                          <span className="tech-tag text-[11px]">
                            +{project.techStack.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              </SectionReveal>
            );
          })}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
};

export default Projects;
