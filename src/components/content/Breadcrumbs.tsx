import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const t = useTranslations("Common");
  const all: Crumb[] = [{ label: t("home"), href: "/" }, ...items];
  return (
    <nav aria-label={t("breadcrumbLabel")}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
        {all.map((crumb, index) => {
          const last = index === all.length - 1;
          return (
            <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
              {crumb.href && !last ? (
                <Link href={crumb.href} className="underline-offset-4 hover:text-primary hover:underline">
                  {crumb.label}
                </Link>
              ) : (
                <span aria-current={last ? "page" : undefined} className="text-foreground">
                  {crumb.label}
                </span>
              )}
              {!last && <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
