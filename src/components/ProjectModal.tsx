import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import type { Project } from "@/data/projects";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

const InfoSlide = ({ project }: { project: Project }) => (
  <div className="w-full h-full flex-shrink-0 overflow-y-auto bg-card">
    <div className="p-8 space-y-6 min-h-full">
      <div>
        <p className="font-mono text-xs text-primary mb-1 tracking-wide uppercase">
          Project
        </p>
        <h2 className="text-xl font-semibold text-foreground mb-2">
          {project.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>
      </div>

      {project.additionalInfo && project.additionalInfo.length > 0 && (
        <div className="space-y-5 border-t border-border pt-5">
          {project.additionalInfo.map((section) => (
            <div key={section.title}>
              <h4 className="font-mono text-xs text-primary mb-2 tracking-wide uppercase">
                {section.title}
              </h4>
              <ul className="space-y-1.5 list-disc pl-5 marker:text-primary">
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
        </div>
      )}

      <div className="border-t border-border pt-5">
        <h4 className="font-mono text-xs text-primary mb-2 tracking-wide uppercase">
          Project Stack
        </h4>
        <div className="flex flex-wrap gap-2">
          {project.projectStack.map((tech) => (
            <span key={tech} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>
      </div>

      {project.links && project.links.length > 0 && (
        <div className="flex flex-wrap gap-3 border-t border-border pt-5">
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
  </div>
);

const SlideCarousel = ({ project }: { project: Project }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const total = 1 + project.slides.length;

  const prev = useCallback(
    () => setSlideIndex((i) => (i - 1 + total) % total),
    [total],
  );
  const next = useCallback(
    () => setSlideIndex((i) => (i + 1) % total),
    [total],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Slide track */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${slideIndex * 100}%)` }}
      >
        {/* Slide 0: info */}
        <InfoSlide project={project} />

        {/* Slides 1+: images */}
        {project.slides.map((slide, i) => {
          const src = `${import.meta.env.BASE_URL}${slide.replace(/^\//, "")}`;
          return (
            <div
              key={i}
              className="w-full h-full flex-shrink-0 bg-black flex items-center justify-center"
            >
              <img
                src={src}
                alt={`${project.title} screenshot ${i + 1}`}
                className="w-full h-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          );
        })}
      </div>

      {/* Arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-1.5 transition-colors z-10"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-1.5 transition-colors z-10"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      {/* Dots + counter */}
      <div className="absolute bottom-3 inset-x-0 flex flex-col items-center gap-1.5 z-10 pointer-events-none">
        {total > 1 && (
          <div className="flex gap-1.5 pointer-events-auto">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === slideIndex ? "bg-primary" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}
        <span className="text-[11px] text-white/60 font-mono tabular-nums drop-shadow">
          {slideIndex + 1} / {total}
        </span>
      </div>
    </div>
  );
};

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  if (!project) return null;

  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        key={project.id}
        className="max-w-2xl w-full p-0 bg-card border-border text-card-foreground overflow-hidden h-[85vh] flex flex-col"
      >
        <DialogTitle className="sr-only">{project.title}</DialogTitle>
        <SlideCarousel project={project} />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
