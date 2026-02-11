import { ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg sm:max-w-xl bg-card border-border text-card-foreground max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-foreground pr-6">
            {project.title}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-sm">
            {project.shortDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {project.additionalInfo?.map((section) => (
            <div key={section.title}>
              <h4 className="font-mono text-xs text-primary mb-2 tracking-wide uppercase">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.bullets.map((bullet, index) => (
                  <li
                    key={`${section.title}-${index}`}
                    className="text-sm text-muted-foreground leading-relaxed"
                  >
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Tech Stack */}
          <div>
            <h4 className="font-mono text-xs text-primary mb-2 tracking-wide uppercase">
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {project.links && project.links.length > 0 && (
            <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
              {project.links.map((link) => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-primary hover:opacity-80 transition-opacity font-medium"
                >
                  <ExternalLink size={14} />
                  {link.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
