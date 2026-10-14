import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Shared homepage section heading with an eyebrow line and optional action. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  action,
  align = "left",
}: {
  id: string;
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 sm:mb-12",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-accent-strong uppercase">{eyebrow}</p>
        )}
        <h2 id={id} className="text-3xl sm:text-4xl">
          {title}
        </h2>
        {intro && <p className="mt-4 text-muted">{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
