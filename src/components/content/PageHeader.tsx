import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export function PageHeader({
  title,
  intro,
  breadcrumbs,
  badges,
  children,
}: {
  title: string;
  intro?: ReactNode;
  breadcrumbs?: Crumb[];
  badges?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-border bg-surface-muted">
      <Container className="py-12 sm:py-16">
        {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
        {badges && <div className="mt-6 flex flex-wrap gap-2">{badges}</div>}
        <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl">{title}</h1>
        {intro && <p className="mt-5 max-w-prose text-lg text-muted">{intro}</p>}
        {children}
      </Container>
    </div>
  );
}
