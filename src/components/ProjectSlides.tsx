import { useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import type { Project } from "@/data/projects";

interface ProjectSlidesProps {
  title: Project["title"];
  slides: Project["slides"];
}

const ZOOM_STEP = 0.25;
const ZOOM_MIN = 0.5;
const ZOOM_MAX = 3;

/** Screenshot carousel shown on a project's detail page. */
const ProjectSlides = ({ title, slides }: ProjectSlidesProps) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const total = slides.length;

  const goTo = useCallback((i: number) => {
    setSlideIndex(((i % total) + total) % total);
    setZoom(1);
  }, [total]);

  const prev = () => goTo(slideIndex - 1);
  const next = () => goTo(slideIndex + 1);

  const zoomOut = () => setZoom((z) => Math.max(ZOOM_MIN, +(z - ZOOM_STEP).toFixed(2)));
  const zoomIn = () => setZoom((z) => Math.min(ZOOM_MAX, +(z + ZOOM_STEP).toFixed(2)));
  const zoomReset = () => setZoom(1);

  // Arrow keys work only while the carousel has focus, so they never
  // hijack page scrolling for the rest of the case study.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
  };

  if (total === 0) return null;

  return (
    <div
      className="relative w-full aspect-video overflow-hidden rounded-xl border border-border bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label={`${title} screenshots`}
      onKeyDown={onKeyDown}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${slideIndex * 100}%)` }}
      >
        {slides.map((slide, i) => {
          const src = `${import.meta.env.BASE_URL}${slide.path.replace(/^\//, "")}`;
          return (
            <div
              key={slide.path}
              className="relative w-full h-full flex-shrink-0 flex items-center justify-center overflow-hidden"
              aria-hidden={i !== slideIndex}
            >
              <img
                src={src}
                alt={slide.caption ?? `${title} screenshot ${i + 1}`}
                className="w-full h-full object-contain"
                style={{
                  transform: `scale(${i === slideIndex ? zoom : 1})`,
                  transition: "transform 0.2s ease",
                }}
                loading={i === 0 ? "eager" : "lazy"}
              />
              {slide.caption && (
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent px-5 pb-14 pt-10 pointer-events-none">
                  <p className="text-sm text-white/90 leading-snug">{slide.caption}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous screenshot"
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/65 text-white rounded-full p-2.5 transition-colors z-10 cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next screenshot"
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/65 text-white rounded-full p-2.5 transition-colors z-10 cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

      <div className="absolute bottom-4 inset-x-0 flex items-center justify-center z-10 pointer-events-none px-4">
        {total > 1 && (
          <div className="inline-flex items-center gap-2.5 bg-black/40 backdrop-blur-sm rounded-full px-3 py-1.5 pointer-events-auto">
            {slides.map((slide, i) => (
              <button
                key={slide.path}
                onClick={() => goTo(i)}
                aria-label={`Go to screenshot ${i + 1}`}
                aria-current={i === slideIndex}
                className={`w-2 h-2 rounded-full transition-colors cursor-pointer p-0 ${i === slideIndex ? "bg-primary" : "bg-white/50"}`}
              />
            ))}
            <span className="text-[10px] text-white/70 font-mono tabular-nums leading-none pl-1 border-l border-white/20">
              {slideIndex + 1}/{total}
            </span>
          </div>
        )}

        <div className="absolute right-4 inline-flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2 py-1 pointer-events-auto">
          <button
            onClick={zoomOut}
            disabled={zoom <= ZOOM_MIN}
            aria-label="Zoom out"
            className="p-1.5 text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ZoomOut size={15} />
          </button>
          <button
            onClick={zoomReset}
            aria-label="Reset zoom"
            className="px-2 text-xs font-mono text-white/80 hover:text-white transition-colors cursor-pointer min-w-[2.25rem] text-center"
          >
            {zoom === 1 ? "1×" : `${zoom}×`}
          </button>
          <button
            onClick={zoomIn}
            disabled={zoom >= ZOOM_MAX}
            aria-label="Zoom in"
            className="p-1.5 text-white/80 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ZoomIn size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSlides;
