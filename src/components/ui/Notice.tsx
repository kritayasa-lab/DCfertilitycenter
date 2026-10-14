import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

const tones = {
  info: "border-olive-200 bg-primary-soft text-foreground",
  warning: "border-warning/30 bg-warning-soft text-warning",
  danger: "border-danger/30 bg-danger-soft text-danger",
  success: "border-success/30 bg-success-soft text-success",
} as const;

/**
 * Inline status message. Use role="status" for non-urgent updates and
 * role="alert" only for errors that need immediate attention.
 */
export function Notice({
  className,
  tone = "info",
  ...props
}: ComponentProps<"div"> & { tone?: keyof typeof tones }) {
  return (
    <div
      className={cn("rounded-md border px-4 py-3 text-sm", tones[tone], className)}
      {...props}
    />
  );
}
