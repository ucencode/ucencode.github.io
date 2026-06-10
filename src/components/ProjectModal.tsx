import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
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

const SlideCarousel = ({ project }: { project: Project }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const slides = project.slides;
  const total = slides.length;

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
    <div className="relative w-full aspect-video bg-black flex-shrink-0 overflow-hidden">
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${slideIndex * 100}%)` }}
      >
        {slides.map((slide, i) => {
          const src = `${import.meta.env.BASE_URL}${slide.replace(/^\//, "")}`;
          return (
            <img
              key={i}
              src={src}
              alt={`${project.title} slide ${i + 1}`}
              className="w-full h-full object-cover flex-shrink-0"
              loading={i === 0 ? "eager" : "lazy"}
            />
          );
        })}
      </div>

      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-1.5 transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-1.5 transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      <div className="absolute bottom-3 inset-x-0 flex flex-col items-center gap-1.5">
        {total > 1 && (
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
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
        <span className="text-[11px] text-white/60 font-mono tabular-nums">
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
        className="max-w-2xl w-full p-0 bg-card border-border text-card-foreground overflow-hidden max-h-[90vh] flex flex-col"
      >
        <SlideCarousel project={project} />

        <div className="overflow-y-auto flex-1 min-h-0">
          <div className="p-6 space-y-5">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold text-foreground pr-6">
                {project.title}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                {project.description}
              </DialogDescription>
            </DialogHeader>

            {project.additionalInfo?.map((section) => (
              <div key={section.title}>
                <h4 className="font-mono text-xs text-primary mb-2 tracking-wide uppercase">
                  {section.title}
                </h4>
                <ul className="space-y-2 list-disc pl-5 marker:text-primary">
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

            <div>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
