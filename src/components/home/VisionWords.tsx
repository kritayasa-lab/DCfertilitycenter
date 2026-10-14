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
 *  - "editorial": one typographic group: HOPE and TRUST on a row, MIRACLE
 *                 below as the largest, centred statement (hero).
 *  - "compact":   a single inline row (Why-choose section; unchanged).
 */
export function VisionWords({
  words,
  label,
  variant = "editorial",
  className,
}: {
  words: VisionWord[];
  label: string;
  variant?: "editorial" | "compact";
  className?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const captionId = useId();
  const selected = words.find((w) => w.key === active);
  const editorial = variant === "editorial";

  const editorialWord = (index: number) =>
    cn(
      "relative cursor-pointer rounded-md leading-[0.9] text-foreground transition-[transform,color] duration-500 ease-[cubic-bezier(0.22,0.61,0.36,1)] origin-center",
      "after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-cta-gold-deep after:transition-transform after:duration-500",
      "hover:scale-[1.06] hover:text-primary hover:after:scale-x-100 focus-visible:scale-[1.06] focus-visible:text-primary focus-visible:after:scale-x-100",
      "data-[active]:scale-[1.06] data-[active]:text-primary data-[active]:after:scale-x-100",
      index === 2
        ? // MIRACLE: the strongest statement: larger, lighter, wider-set.
          "font-light tracking-[-0.045em] text-[clamp(3.6rem,15.5vw,9.25rem)] lg:text-[clamp(5.5rem,9.4vw,9.25rem)]"
        : "font-semibold tracking-[-0.035em] text-[clamp(2.1rem,9vw,3.6rem)] lg:text-[clamp(2.6rem,4.2vw,3.9rem)]",
    );

  return (
    <>
      <ul
        aria-label={label}
        className={cn(
          editorial
            ? "flex flex-wrap items-end justify-center gap-x-8 gap-y-2 sm:gap-x-12"
            : "flex flex-wrap items-center gap-x-3 gap-y-1",
          className,
        )}
      >
        {words.map((w, index) => {
          const isActive = w.key === active;
          return (
            <li
              key={w.key}
              className={
                editorial
                  ? cn("flex flex-col items-center", index === 2 && "basis-full")
                  : "flex items-center gap-3"
              }
            >
              {editorial && index < 2 && (
                <span aria-hidden="true" className="mb-1.5 text-[0.68rem] font-semibold tracking-[0.3em] text-accent-strong">
                  {String(index + 1).padStart(2, "0")}
                </span>
              )}
              {!editorial && index > 0 && (
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
                  editorial
                    ? editorialWord(index)
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
              {editorial && index === 2 && (
                <span aria-hidden="true" className="mt-3 flex items-center gap-3 text-[0.68rem] font-semibold tracking-[0.3em] text-accent-strong">
                  <span className="h-px w-10 bg-cta-gold-deep" />
                  03
                  <span className="h-px w-10 bg-cta-gold-deep" />
                </span>
              )}
            </li>
          );
        })}
      </ul>
      <p
        id={captionId}
        aria-live="polite"
        className={cn("text-muted", editorial ? "mt-3 min-h-7 text-center text-base" : "mt-2 min-h-6 text-sm")}
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
