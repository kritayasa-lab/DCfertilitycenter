"use client";

import { Children, useCallback, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { CarouselControls } from "./CarouselControls";

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

      <CarouselControls
        count={pages}
        current={page}
        onSelect={goTo}
        onPrevious={() => goTo(page - 1)}
        onNext={() => goTo(page + 1)}
        previousDisabled={page === 0}
        nextDisabled={page >= pages - 1}
        labels={{ group: labels.region, goTo: labels.goTo, previous: labels.previous, next: labels.next }}
      />
    </section>
  );
}
