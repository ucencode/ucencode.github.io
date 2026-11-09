import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import type { Project } from "@/data/projects";

interface ProjectSlidesProps {
  title: Project["title"];
  slides: Project["slides"];
}

/** Zoom level and pan offset (px) of the fullscreen image. */
interface View {
  scale: number;
  x: number;
  y: number;
}

const MIN_SCALE = 1;
const MAX_SCALE = 5;
const RESET: View = { scale: 1, x: 0, y: 0 };

/** Converts a client point to coordinates relative to the centre of `el`, where the image sits. */
const toStage = (el: HTMLElement, clientX: number, clientY: number) => {
  const r = el.getBoundingClientRect();
  return { x: clientX - r.left - r.width / 2, y: clientY - r.top - r.height / 2 };
};

/** Scales the view by `factor` while keeping the image point under (px, py) in place. */
const zoomAt = (v: View, factor: number, px: number, py: number): View => {
  const scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, v.scale * factor));
  if (scale === MIN_SCALE) return RESET;
  const k = scale / v.scale;
  return { scale, x: px - (px - v.x) * k, y: py - (py - v.y) * k };
};

/** Screenshot carousel shown on a project's detail page. */
const ProjectSlides = ({ title, slides }: ProjectSlidesProps) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [view, setView] = useState<View>(RESET);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const moved = useRef(false);
  const total = slides.length;

  const goTo = useCallback((i: number) => {
    setSlideIndex(((i % total) + total) % total);
    setView(RESET);
  }, [total]);

  const prev = () => goTo(slideIndex - 1);
  const next = () => goTo(slideIndex + 1);

  // The native <dialog> supplies the top layer, focus trapping and Esc-to-close.
  const openFullscreen = () => {
    setView(RESET);
    dialogRef.current?.showModal();
  };
  const closeFullscreen = () => dialogRef.current?.close();

  // Wheel zoom needs a non-passive listener so it can stop the page from scrolling.
  // Trackpad pinch arrives here too, as wheel events with ctrlKey set.
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      const p = toStage(el, e.clientX, e.clientY);
      setView((v) => zoomAt(v, Math.exp(-delta * 0.002), p.x, p.y));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // One pointer pans a zoomed image; two pointers pinch-zoom around their midpoint.
  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointers.current.size === 0) moved.current = false;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const pts = pointers.current;
    const last = pts.get(e.pointerId);
    if (!last) return;
    const now = { x: e.clientX, y: e.clientY };

    if (pts.size === 1) {
      const dx = now.x - last.x;
      const dy = now.y - last.y;
      if (dx !== 0 || dy !== 0) moved.current = true;
      setView((v) => (v.scale === MIN_SCALE ? v : { ...v, x: v.x + dx, y: v.y + dy }));
    } else if (pts.size === 2) {
      const other = [...pts.entries()].find(([id]) => id !== e.pointerId)![1];
      const before = Math.hypot(last.x - other.x, last.y - other.y);
      const after = Math.hypot(now.x - other.x, now.y - other.y);
      const midBefore = toStage(e.currentTarget, (last.x + other.x) / 2, (last.y + other.y) / 2);
      const midAfter = toStage(e.currentTarget, (now.x + other.x) / 2, (now.y + other.y) / 2);
      moved.current = true;
      if (before > 0) {
        setView((v) =>
          zoomAt(
            { ...v, x: v.x + midAfter.x - midBefore.x, y: v.y + midAfter.y - midBefore.y },
            after / before,
            midAfter.x,
            midAfter.y,
          ),
        );
      }
    }
    pts.set(e.pointerId, now);
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(e.pointerId);
  };

  // A plain click on the dark area closes the viewer; the end of a drag or pinch does not.
  const onStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!moved.current && e.target === e.currentTarget) closeFullscreen();
  };

  // Arrow keys work only while the carousel has focus, so they never
  // hijack page scrolling for the rest of the case study.
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
  };

  if (total === 0) return null;

  const srcOf = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
  const current = slides[slideIndex];

  return (
    <>
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
            const src = srcOf(slide.path);
            return (
              <div
                key={slide.path}
                className="relative w-full h-full flex-shrink-0 flex items-center justify-center overflow-hidden"
                aria-hidden={i !== slideIndex}
              >
                <img
                  src={src}
                  alt={slide.caption ?? `${title} screenshot ${i + 1}`}
                  className="w-full h-full object-contain cursor-zoom-in"
                  onClick={openFullscreen}
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

          <button
            onClick={openFullscreen}
            aria-label="View fullscreen"
            className="absolute right-4 bg-black/40 hover:bg-black/65 backdrop-blur-sm text-white/80 hover:text-white rounded-full p-2 transition-colors pointer-events-auto cursor-pointer"
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={`${title} screenshot ${slideIndex + 1} of ${total}`}
        onKeyDown={onKeyDown}
        className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-black/95 p-0 text-white backdrop:bg-black/80"
      >
        <div
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={onStageClick}
          className={`absolute inset-0 flex items-center justify-center touch-none select-none ${view.scale > MIN_SCALE ? "cursor-grab active:cursor-grabbing" : ""}`}
        >
          <img
            src={srcOf(current.path)}
            alt={current.caption ?? `${title} screenshot ${slideIndex + 1}`}
            draggable={false}
            className="max-h-[calc(100dvh-6rem)] max-w-[calc(100vw-2rem)] object-contain"
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
          />
        </div>

        {current.caption && (
          <p className="absolute bottom-14 inset-x-0 px-6 text-center text-sm text-white/90 pointer-events-none">{current.caption}</p>
        )}

        <button
          onClick={closeFullscreen}
          aria-label="Close fullscreen"
          className="absolute right-4 top-4 bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {total > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous screenshot"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              aria-label="Next screenshot"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-2.5 transition-colors cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>
            <span className="absolute bottom-4 inset-x-0 text-center text-xs text-white/70 font-mono tabular-nums pointer-events-none">
              {slideIndex + 1}/{total}
            </span>
          </>
        )}
      </dialog>
    </>
  );
};

export default ProjectSlides;
