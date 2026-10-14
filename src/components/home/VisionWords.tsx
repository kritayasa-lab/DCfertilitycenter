"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";

export interface VisionWord {
  key: string;
  word: string;
  /** Localized meaning shown when the word is selected. */
  meaning: string;
}

/**
 * HOPE · TRUST · MIRACLE. Hover or keyboard focus emphasises a word with a
 * small transform and a champagne underline (no layout shift). Click/tap
 * toggles a persistent, announced selection (the touch equivalent of hover).
 * Transitions are removed under prefers-reduced-motion by the global rule.
 *
 * Variants:
 *  - "stage":   editorial placement around the hero artwork (from lg); a
 *               centred row on smaller screens. `placements` positions items.
 *  - "compact": a single inline row (Why-choose section).
 */
export function VisionWords({
  words,
  label,
  variant = "stage",
  placements = [],
  className,
}: {
  words: VisionWord[];
  label: string;
  variant?: "stage" | "compact";
  placements?: string[];
  className?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const captionId = useId();
  const selected = words.find((w) => w.key === active);
  const stage = variant === "stage";

  return (
    <>
      <ul
        aria-label={label}
        className={cn(
          stage
            ? "mt-8 flex flex-wrap items-end justify-center gap-x-8 gap-y-4 sm:gap-x-12 lg:mt-0"
            : "flex flex-wrap items-center gap-x-3 gap-y-1",
          className,
        )}
      >
        {words.map((w, index) => {
          const isActive = w.key === active;
          return (
            <li key={w.key} className={stage ? cn("flex flex-col", placements[index]) : "flex items-center gap-3"}>
              {stage && (
                <span aria-hidden="true" className="mb-2 flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.3em] text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                  <span className="h-px w-8 bg-cta-gold-deep" />
                </span>
              )}
              {!stage && index > 0 && (
                <span aria-hidden="true" className="text-accent-vivid">
                  ·
                </span>
              )}
              <button
                type="button"
                lang="en"
                aria-pressed={isActive}
                aria-describedby={isActive ? captionId : undefined}
                onClick={() => setActive(isActive ? null : w.key)}
                data-active={isActive || undefined}
                className={
                  stage
                    ? cn(
                        "relative cursor-pointer rounded-md font-semibold leading-none tracking-[-0.035em] text-foreground transition-[transform,color] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)]",
                        "after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:scale-x-0 after:bg-cta-gold-deep after:transition-transform after:duration-500",
                        "hover:scale-[1.06] hover:text-primary hover:after:scale-x-100 focus-visible:scale-[1.06] focus-visible:text-primary focus-visible:after:scale-x-100",
                        "data-[active]:scale-[1.06] data-[active]:text-primary data-[active]:after:scale-x-100",
                        index === 2 ? "text-[clamp(2.1rem,6.4vw,4.4rem)]" : "text-[clamp(1.9rem,5.6vw,3.9rem)]",
                        placements[index]?.includes("text-right")
                          ? "origin-right after:origin-right"
                          : "origin-left after:origin-left max-lg:origin-center",
                      )
                    : cn(
                        // Unchanged compact treatment used in the Why-choose section.
                        "origin-center cursor-pointer rounded-md text-xl font-bold tracking-[-0.03em] transition-[transform,color] duration-300 ease-out will-change-transform sm:text-2xl",
                        "hover:scale-[1.08] focus-visible:scale-[1.08] data-[active]:scale-[1.08]",
                        index === 0 && "text-foreground hover:text-primary data-[active]:text-primary",
                        index === 1 && "text-primary hover:text-foreground data-[active]:text-foreground",
                        index === 2 && "text-accent-vivid hover:text-accent-strong data-[active]:text-accent-strong",
                      )
                }
              >
                {w.word}
              </button>
            </li>
          );
        })}
      </ul>
      <p
        id={captionId}
        aria-live="polite"
        className={cn("text-muted", stage ? "mt-5 min-h-7 text-center text-base lg:mt-2" : "mt-2 min-h-6 text-sm")}
      >
        {selected ? (
          <>
            <span lang="en" className="font-semibold text-foreground">
              {selected.word}
            </span>{" "}
            · {selected.meaning}
          </>
        ) : null}
      </p>
    </>
  );
}
