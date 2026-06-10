import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, ZoomIn, ZoomOut } from "lucide-react";
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

const ZOOM_STEP = 0.25;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;

const InfoSlide = ({ project }: { project: Project }) => (
  <div className="w-full flex-shrink-0 self-stretch overflow-y-auto bg-card">
    <div className="p-6 sm:p-8 pb-14 flex flex-col gap-5">
      {/* Header — full width */}
      <div>
        <p className="font-mono text-xs text-primary mb-1 tracking-wide uppercase">
          Project
        </p>
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
          {project.title}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {project.description}
        </p>
      </div>

      {/* Body — 2 columns on desktop */}
      <div className="border-t border-border pt-5 sm:grid sm:grid-cols-[3fr_2fr] sm:gap-x-8 sm:items-start">
        {/* Left: additionalInfo */}
        {project.additionalInfo && project.additionalInfo.length > 0 && (
          <div className="space-y-4">
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

        {/* Right: Stack + Links */}
        <div className="mt-5 sm:mt-0 space-y-5 sm:border-l sm:border-border sm:pl-8">
          <div>
            <h4 className="font-mono text-xs text-primary mb-2 tracking-wide uppercase">
              Stack
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
            <div className="flex flex-col gap-2 border-t border-border pt-4">
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
    </div>
  </div>
);

const SlideCarousel = ({ project }: { project: Project }) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const total = 1 + project.slides.length;

  // Reset zoom when navigating between slides (derived state pattern)
  const [prevSlideIndex, setPrevSlideIndex] = useState(slideIndex);
  if (slideIndex !== prevSlideIndex) {
    setPrevSlideIndex(slideIndex);
    setZoom(1);
  }

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

  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)));
  const zoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)));
  const zoomReset = () => setZoom(1);

  const isImageSlide = slideIndex > 0;

  return (
    <div className="relative w-full flex-1 min-h-0 overflow-hidden">
      {/* Slide track */}
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${slideIndex * 100}%)` }}
      >
        <InfoSlide project={project} />

        {project.slides.map((slide, i) => {
          const src = `${import.meta.env.BASE_URL}${slide.replace(/^\//, "")}`;
          return (
            <div
              key={i}
              className="w-full flex-shrink-0 self-stretch bg-black flex items-center justify-center overflow-hidden"
            >
              <img
                src={src}
                alt={`${project.title} screenshot ${i + 1}`}
                className="w-full h-full object-contain"
                style={{ transform: `scale(${zoom})`, transition: "transform 0.2s ease" }}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          );
        })}
      </div>

      {/* Prev / Next arrows */}
      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/65 text-white rounded-full p-2 transition-colors z-10 cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/65 text-white rounded-full p-2 transition-colors z-10 cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </>
      )}

      {/* Bottom overlay row */}
      <div className="absolute bottom-4 inset-x-0 flex items-center justify-center z-10 pointer-events-none px-4">
        {/* Dots + counter — centered */}
        {total > 1 && (
          <div className="inline-flex items-center gap-2.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 pointer-events-auto">
            {Array.from({ length: total }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${
                  i === slideIndex ? "bg-primary" : "bg-white/50"
                }`}
              />
            ))}
            <span className="text-[10px] text-white/70 font-mono tabular-nums leading-none pl-1 border-l border-white/20">
              {slideIndex + 1}/{total}
            </span>
          </div>
        )}

        {/* Zoom controls — bottom-right, only on image slides */}
        {isImageSlide && (
          <div className="absolute right-4 inline-flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 pointer-events-auto">
            <button
              onClick={zoomOut}
              disabled={zoom <= ZOOM_MIN}
              aria-label="Zoom out"
              className="p-1 text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={zoomReset}
              aria-label="Reset zoom"
              className="px-1.5 text-[10px] font-mono text-white/80 hover:text-white transition-colors cursor-pointer min-w-[2rem] text-center"
            >
              {zoom === 1 ? "1×" : `${zoom}×`}
            </button>
            <button
              onClick={zoomIn}
              disabled={zoom >= ZOOM_MAX}
              aria-label="Zoom in"
              className="p-1 text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ZoomIn size={14} />
            </button>
          </div>
        )}
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
        className="left-0 top-0 translate-x-0 translate-y-0 w-full h-dvh max-w-none rounded-none p-0 gap-0 bg-card border-border text-card-foreground overflow-hidden flex flex-col"
      >
        <DialogTitle className="sr-only">{project.title}</DialogTitle>
        <SlideCarousel project={project} />
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
