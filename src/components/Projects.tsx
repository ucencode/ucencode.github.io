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

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map((project, i) => (
            <SectionReveal key={project.id} delay={i * 80}>
              <button
                onClick={() => setSelectedProject(project)}
                className="group w-full text-left bg-card border border-border rounded-lg overflow-hidden hover:border-primary/40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
              >
                {/* Card header gradient */}
                <div className="aspect-[16/10] bg-gradient-to-br from-secondary to-muted flex items-center justify-center p-6 relative overflow-hidden">
                  <span className="font-mono text-lg text-muted-foreground/60 text-center leading-tight">
                    {project.title.split(" ").slice(0, 2).join(" ")}
                  </span>
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight size={16} className="text-primary" />
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <h3 className="font-semibold text-foreground text-sm mb-2 group-hover:text-primary transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-4 line-clamp-2">
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
              </button>
            </SectionReveal>
          ))}
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
