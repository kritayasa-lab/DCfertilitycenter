"use client";

import { Children, useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export interface CarouselLabels {
  region: string;
  previous: string;
  next: string;
  /** Template, e.g. "Go to page {page}". */
  goTo: string;
  /** Template, e.g. "Slide {index} of {total}". */
  slide: string;
  roleCarousel: string;
  roleSlide: string;
}

const fill = (template: string, values: Record<string, number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Accessible scroll-snap carousel: one card per view on mobile, two from
 * `md` up. Previous/next buttons and pagination dots stay in sync with
 * manual scrolling; ←/→ keys work when the track has focus. No library.
 */
export function Carousel({
  children,
  labels,
  className,
}: {
  children: ReactNode;
  labels: CarouselLabels;
  className?: string;
}) {
  const slides = Children.toArray(children);
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const metrics = useCallback(() => {
    const track = trackRef.current;
    const first = track?.children[0] as HTMLElement | undefined;
    if (!track || !first) return null;
    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const step = first.offsetWidth + gap;
    const perView = Math.max(1, Math.round((track.clientWidth + gap) / step));
    return { track, step, perView, pageCount: Math.max(1, Math.ceil(slides.length / perView)) };
  }, [slides.length]);

  const sync = useCallback(() => {
    const m = metrics();
    if (!m) return;
    setPages(m.pageCount);
    const maxScroll = m.track.scrollWidth - m.track.clientWidth;
    const atEnd = m.track.scrollLeft >= maxScroll - 2;
    setPage(atEnd ? m.pageCount - 1 : Math.min(m.pageCount - 1, Math.round(m.track.scrollLeft / (m.step * m.perView))));
  }, [metrics]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    // Measure after layout; also re-measure on scroll and resize.
    let frame = requestAnimationFrame(sync);
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(track);
    return () => {
      track.removeEventListener("scroll", onScroll);
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [sync]);

  const goTo = (target: number) => {
    const m = metrics();
    if (!m) return;
    const clamped = Math.max(0, Math.min(m.pageCount - 1, target));
    m.track.scrollTo({ left: clamped * m.step * m.perView, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    setPage(clamped);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(page + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(page - 1);
    }
  };

  const arrowClass =
    "inline-flex h-11 w-11 items-center justify-center rounded-pill border border-border-strong bg-surface text-foreground transition-colors hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface disabled:hover:text-foreground";

  return (
    <section aria-roledescription={labels.roleCarousel} aria-label={labels.region} className={className}>
      <div
        ref={trackRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-label={labels.region}
        className="-mx-1 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-1 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription={labels.roleSlide}
            aria-label={fill(labels.slide, { index: index + 1, total: slides.length })}
            className="w-full shrink-0 snap-start md:w-[calc((100%-1.5rem)/2)]"
          >
            {slide}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1" role="group" aria-label={labels.region}>
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={fill(labels.goTo, { page: i + 1 })}
              aria-current={i === page ? "true" : undefined}
              className="group/dot flex h-11 w-8 items-center justify-center"
            >
              <span
                className={cn(
                  "block h-2.5 rounded-pill transition-all duration-300",
                  i === page ? "w-7 bg-primary" : "w-2.5 bg-border-strong group-hover/dot:bg-muted",
                )}
              />
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => goTo(page - 1)} disabled={page === 0} aria-label={labels.previous} className={arrowClass}>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
              <path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
          <button type="button" onClick={() => goTo(page + 1)} disabled={page >= pages - 1} aria-label={labels.next} className={arrowClass}>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
              <path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
