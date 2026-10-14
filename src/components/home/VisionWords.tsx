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
 * HOPE · TRUST · MIRACLE. Hover or keyboard focus enlarges a word (CSS
 * transform only, so layout never shifts). Click/tap toggles a persistent,
 * announced selection: the touch/keyboard equivalent of hover. Motion is
 * disabled under prefers-reduced-motion by the global rule.
 */
export function VisionWords({
  words,
  label,
  variant = "hero",
  className,
}: {
  words: VisionWord[];
  label: string;
  variant?: "hero" | "compact";
  className?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const captionId = useId();
  const selected = words.find((w) => w.key === active);
  const hero = variant === "hero";

  return (
    <div className={className}>
      <ul
        aria-label={label}
        className={cn(
          "flex",
          hero ? "flex-col items-start gap-1 sm:gap-0" : "flex-wrap items-center gap-x-3 gap-y-1",
        )}
      >
        {words.map((w, index) => {
          const isActive = w.key === active;
          return (
            <li key={w.key} className="flex items-center gap-3">
              {!hero && index > 0 && (
                <span aria-hidden="true" className="text-accent-vivid">
                  ·
                </span>
              )}
              <button
                type="button"
                aria-pressed={isActive}
                aria-describedby={isActive ? captionId : undefined}
                onClick={() => setActive(isActive ? null : w.key)}
                data-active={isActive || undefined}
                className={cn(
                  "group/word cursor-pointer rounded-md font-bold tracking-[-0.03em] transition-[transform,color] duration-300 ease-out will-change-transform",
                  "hover:scale-[1.08] focus-visible:scale-[1.08] data-[active]:scale-[1.08]",
                  hero
                    ? "origin-left text-[clamp(2.75rem,9vw,6.25rem)] leading-[0.95]"
                    : "origin-center text-xl sm:text-2xl",
                  index === 0 && "text-foreground hover:text-primary data-[active]:text-primary",
                  index === 1 && "text-primary hover:text-foreground data-[active]:text-foreground",
                  index === 2 && "text-accent-vivid hover:text-accent-strong data-[active]:text-accent-strong",
                )}
                lang="en"
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
        className={cn("text-muted transition-opacity", hero ? "mt-4 min-h-7 text-lg" : "mt-2 min-h-6 text-sm")}
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
    </div>
  );
}
