"use client";

import { cn } from "@/lib/cn";

const fill = (template: string, values: Record<string, number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

export const carouselArrowClass =
  "inline-flex h-11 w-11 items-center justify-center rounded-pill border border-border-strong bg-surface text-foreground transition-colors hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-surface disabled:hover:text-foreground focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-focus";

/**
 * Shared pagination dots + previous/next arrows (Packages, Success stories
 * and the Services arc use the same interaction pattern).
 */
export function CarouselControls({
  count,
  current,
  onSelect,
  onPrevious,
  onNext,
  previousDisabled = false,
  nextDisabled = false,
  labels,
  className,
}: {
  count: number;
  current: number;
  onSelect: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  previousDisabled?: boolean;
  nextDisabled?: boolean;
  /** `goTo` is a template containing `{page}`. */
  labels: { group: string; goTo: string; previous: string; next: string };
  className?: string;
}) {
  return (
    <div className={cn("mt-6 flex items-center justify-between gap-4", className)}>
      <div className="flex items-center gap-1" role="group" aria-label={labels.group}>
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            aria-label={fill(labels.goTo, { page: i + 1 })}
            aria-current={i === current ? "true" : undefined}
            className="group/dot flex h-11 w-8 items-center justify-center"
          >
            <span
              className={cn(
                "block h-2.5 rounded-pill transition-all duration-300",
                i === current ? "w-7 bg-primary" : "w-2.5 bg-border-strong group-hover/dot:bg-muted",
              )}
            />
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button type="button" onClick={onPrevious} disabled={previousDisabled} aria-label={labels.previous} className={carouselArrowClass}>
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
            <path d="M12.5 4.5 7 10l5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </button>
        <button type="button" onClick={onNext} disabled={nextDisabled} aria-label={labels.next} className={carouselArrowClass}>
          <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5">
            <path d="M7.5 4.5 13 10l-5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
