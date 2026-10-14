import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

/** Readable long-form text container. */
export function Prose({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "max-w-prose space-y-5 text-base [&_h2]:mt-12 [&_h2]:text-2xl [&_h3]:mt-8 [&_h3]:text-xl [&_li]:ml-5 [&_li]:list-disc [&_p]:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
