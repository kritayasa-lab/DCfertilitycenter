"use client";

import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import type { ServiceIcon as Icon } from "@/content/types";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";
import { CarouselControls } from "./CarouselControls";
import { ServiceIcon } from "./ServiceIcon";

export interface ArcService {
  slug: string;
  title: string;
  icon: Icon;
}

export interface ServiceArcLabels {
  region: string;
  previous: string;
  next: string;
  /** Template "… {index} … {total}". */
  position: string;
  selected: string;
  open: string;
  imagePending: string;
  hint: string;
  /** Template "… {page} …" for the pagination dots. */
  goTo: string;
}

const fill = (template: string, values: Record<string, number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

/** Signed shortest distance from `active` to `index` on a ring of `n`. */
function offset(index: number, active: number, n: number) {
  let d = (index - active) % n;
  if (d > n / 2) d -= n;
  if (d < -n / 2) d += n;
  return d;
}

/**
 * Curved, overlapping service carousel. Cards sit on an invisible arc: each
 * card's position comes from its signed distance d to the active card
 * (translate along the arc, drop, tilt, scale, z-order), so movement is pure
 * CSS transforms. Controls (shared with the Packages carousel): previous/next
 * arrows and pagination dots; plus ←/→ keys, one-card-per-gesture drag/swipe,
 * clicking a side card, or tabbing to a card's link (focus brings it to the
 * centre). The ring wraps around, so the arrows are never disabled.
 * The active card is marked by position, size, a "Showing" label and
 * aria-current, not by colour alone. Reduced motion removes the transitions.
 */
export function ServiceArc({ services, labels }: { services: ArcService[]; labels: ServiceArcLabels }) {
  const n = services.length;
  const [active, setActive] = useState(0);
  const drag = useRef<{ x: number; id: number; moved: boolean } | null>(null);

  const go = (target: number) => setActive(((target % n) + n) % n);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      go(active + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      go(active - 1);
    }
  };

  // Drag/swipe: one card per gesture once the pointer travels past a sensible
  // threshold; the click that ends a drag is suppressed.
  const SWIPE_THRESHOLD = 50;
  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag.current = { x: event.clientX, id: event.pointerId, moved: false };
  };
  const onPointerMove = (event: PointerEvent) => {
    const state = drag.current;
    if (!state || state.id !== event.pointerId || state.moved) return;
    const dx = event.clientX - state.x;
    if (Math.abs(dx) > SWIPE_THRESHOLD) {
      state.moved = true;
      go(active + (dx < 0 ? 1 : -1));
    }
  };
  const endDrag = () => {
    // Keep `moved` until the click that follows a drag has been suppressed.
    setTimeout(() => (drag.current = null), 0);
  };

  return (
    <section aria-roledescription="carousel" aria-label={labels.region} className="relative">
      <p className="sr-only" aria-live="polite">
        {labels.selected}: {services[active].title} ({fill(labels.position, { index: active + 1, total: n })})
      </p>

      <div
        tabIndex={0}
        role="group"
        aria-label={labels.hint}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          "relative mx-auto h-[25rem] touch-pan-y select-none rounded-3xl sm:h-[27rem] lg:h-[29rem]",
          // Arc geometry (per breakpoint): horizontal step, vertical drop, tilt.
          "[--drop:1.1rem] [--step:min(64vw,15.5rem)] [--tilt:5deg]",
          "sm:[--drop:1.6rem] sm:[--step:15rem] sm:[--tilt:7deg]",
          "lg:[--drop:2.2rem] lg:[--step:14.5rem] lg:[--tilt:9deg]",
        )}
      >
        {services.map((service, index) => {
          const d = offset(index, active, n);
          const ad = Math.abs(d);
          const isActive = d === 0;
          const hidden = ad > 2;
          return (
            <article
              key={service.slug}
              data-service-card
              data-active={isActive || undefined}
              aria-current={isActive ? "true" : undefined}
              aria-roledescription="slide"
              aria-label={fill(labels.position, { index: index + 1, total: n })}
              onClick={(event) => {
                if (drag.current?.moved) {
                  event.preventDefault();
                  return;
                }
                if (!isActive) {
                  event.preventDefault();
                  go(index);
                }
              }}
              style={
                {
                  zIndex: 10 - ad,
                  transform: `translateX(calc(-50% + ${d} * var(--step))) translateY(calc(${ad * ad} * var(--drop))) rotate(calc(${d} * var(--tilt))) scale(${1 - ad * 0.1})`,
                } as CSSProperties
              }
              className={cn(
                "absolute top-4 left-1/2 w-[min(78vw,19rem)] sm:w-[19rem] lg:w-[20rem]",
                "origin-bottom transition-[transform,opacity,filter] duration-700 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                // Depth comes from position, scale, tilt, shadow and z-order; visible
                // cards stay fully opaque so their text keeps WCAG contrast.
                hidden ? "pointer-events-none opacity-0" : "opacity-100",
                !isActive && !hidden && "cursor-pointer",
              )}
            >
              <div
                className={cn(
                  "overflow-hidden rounded-[1.75rem] border bg-surface transition-shadow duration-700",
                  isActive ? "border-cta-gold-deep shadow-raised" : "border-border shadow-card",
                )}
              >
                {/* Neutral placeholder image area: no real photograph supplied yet. */}
                <div className="relative flex aspect-[4/3] items-center justify-center bg-[linear-gradient(160deg,var(--color-cornsilk-100),var(--color-gold-100)_55%,var(--color-olive-100))]">
                  <ServiceIcon icon={service.icon} className="h-20 w-20 text-primary/70" />
                  <span className="absolute bottom-3 left-3 rounded-pill bg-surface/85 px-2.5 py-1 text-[0.7rem] text-muted">
                    {labels.imagePending}
                  </span>
                  <span
                    aria-hidden="true"
                    className="absolute top-3 right-3 rounded-pill bg-surface/85 px-2.5 py-1 text-xs font-semibold tabular-nums text-accent-strong"
                  >
                    {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
                  </span>
                </div>
                <div className="flex items-end justify-between gap-4 p-5">
                  <div className="min-w-0">
                    {isActive && (
                      <p className="mb-1 text-[0.7rem] font-semibold tracking-[0.16em] text-accent-strong uppercase">
                        {labels.selected}
                      </p>
                    )}
                    <h3 className="text-base leading-snug sm:text-lg">{service.title}</h3>
                  </div>
                  <Link
                    href={`/services/${service.slug}`}
                    onFocus={() => go(index)}
                    aria-label={`${labels.open}: ${service.title}`}
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-pill border transition-colors",
                      isActive
                        ? "btn-gold border-transparent"
                        : "border-border-strong bg-surface text-foreground hover:bg-primary-soft",
                    )}
                  >
                    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
                      <path d="M5 15 15 5M8 5h7v7" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <CarouselControls
        count={n}
        current={active}
        onSelect={go}
        onPrevious={() => go(active - 1)}
        onNext={() => go(active + 1)}
        labels={{ group: labels.region, goTo: labels.goTo, previous: labels.previous, next: labels.next }}
        className="mx-auto max-w-xl"
      />
    </section>
  );
}
