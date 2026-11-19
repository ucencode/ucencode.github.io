import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/** A figure image collected from the page. */
interface Figure {
  src: string;
  alt: string;
  caption: string;
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

/**
 * Fullscreen viewer for the figures inside `[data-figures]`. Clicking a figure image opens it
 * in a native <dialog> with wheel and pinch zoom, drag to pan, and prev/next navigation.
 */
const ImageViewer = () => {
  const [figures, setFigures] = useState<Figure[]>([]);
  const [index, setIndex] = useState(0);
  const [view, setView] = useState<View>(RESET);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const moved = useRef(false);
  const total = figures.length;

  // Collect the figure images rendered from Markdown and open the viewer on click.
  useEffect(() => {
    const imgs = [...document.querySelectorAll<HTMLImageElement>("[data-figures] figure img")];
    const list = imgs.map((img) => ({
      src: img.currentSrc || img.src,
      alt: img.alt,
      caption: img.closest("figure")?.querySelector("figcaption")?.textContent ?? "",
    }));
    const handlers = imgs.map((img, i) => {
      const open = () => {
        setFigures(list);
        setIndex(i);
        setView(RESET);
        dialogRef.current?.showModal();
      };
      img.addEventListener("click", open);
      return () => img.removeEventListener("click", open);
    });
    return () => handlers.forEach((off) => off());
  }, []);

  const goTo = (i: number) => {
    setIndex(((i % total) + total) % total);
    setView(RESET);
  };
  const prev = () => goTo(index - 1);
  const next = () => goTo(index + 1);
  const close = () => dialogRef.current?.close();

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    if (e.key === "ArrowRight") { e.preventDefault(); next(); }
  };

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
    if (!moved.current && e.target === e.currentTarget) close();
  };

  const current = figures[index];

  return (
    <dialog
      ref={dialogRef}
      aria-label={current ? `Figure ${index + 1} of ${total}` : "Figure viewer"}
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
        {current && (
          <img
            src={current.src}
            alt={current.alt}
            draggable={false}
            className="max-h-[calc(100dvh-7rem)] max-w-[calc(100vw-2rem)] object-contain"
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.scale})` }}
          />
        )}
      </div>

      {current?.caption && (
        <p className="absolute bottom-12 inset-x-0 px-6 text-center text-sm text-white/90 pointer-events-none">{current.caption}</p>
      )}

      <button
        onClick={close}
        aria-label="Close fullscreen"
        className="absolute right-4 top-4 z-10 bg-neutral-800/70 hover:bg-neutral-700/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-full p-2.5 transition-colors cursor-pointer"
      >
        <X size={18} />
      </button>

      {total > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous figure"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-neutral-800/70 hover:bg-neutral-700/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-full p-2.5 transition-colors cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={next}
            aria-label="Next figure"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-neutral-800/70 hover:bg-neutral-700/80 backdrop-blur-sm border border-white/20 shadow-lg rounded-full p-2.5 transition-colors cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
          <span className="absolute bottom-4 inset-x-0 text-center text-xs text-white/70 font-mono tabular-nums pointer-events-none">
            {index + 1}/{total}
          </span>
        </>
      )}
    </dialog>
  );
};

export default ImageViewer;
