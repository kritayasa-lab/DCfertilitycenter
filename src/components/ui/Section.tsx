import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const tones = {
  default: "bg-background",
  muted: "bg-surface-muted",
  accent: "bg-surface-accent",
  surface: "bg-surface",
} as const;

export function Section({
  className,
  tone = "default",
  ...props
}: ComponentProps<"section"> & { tone?: keyof typeof tones }) {
  return (
    <section className={cn("py-16 sm:py-20", tones[tone], className)} {...props} />
  );
}
