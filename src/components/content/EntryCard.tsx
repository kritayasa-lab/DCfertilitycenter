import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

/**
 * Card for listing entries (services, doctors, packages, articles...).
 * When `href` is set the whole card is clickable through the title link.
 */
export function EntryCard({
  title,
  href,
  badges,
  media,
  children,
  footer,
  headingLevel = "h3",
  className,
}: {
  title: string;
  href?: string;
  badges?: ReactNode;
  media?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <article
      className={cn(
        "relative flex h-full flex-col rounded-lg border border-border bg-surface p-6 shadow-card transition-shadow",
        href && "focus-within:shadow-raised hover:shadow-raised",
        className,
      )}
    >
      {media}
      {badges && <div className="mb-3 flex flex-wrap gap-2">{badges}</div>}
      <Heading className="text-xl text-foreground">
        {href ? (
          <Link
            href={href}
            className="after:absolute after:inset-0 after:rounded-lg hover:text-primary focus-visible:outline-none"
          >
            {title}
          </Link>
        ) : (
          title
        )}
      </Heading>
      {children && <div className="mt-3 flex-1 text-sm text-muted">{children}</div>}
      {footer && <div className="mt-5 text-sm font-medium text-primary">{footer}</div>}
    </article>
  );
}
