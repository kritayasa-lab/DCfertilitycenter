import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Container({
  className,
  width = "content",
  ...props
}: ComponentProps<"div"> & { width?: "content" | "prose" }) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8",
        width === "content" ? "max-w-content" : "max-w-prose",
        className,
      )}
      {...props}
    />
  );
}
