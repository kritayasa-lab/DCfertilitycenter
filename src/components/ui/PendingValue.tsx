import { useTranslations } from "next-intl";
import type { ConfigValue } from "@/config/site";
import { Badge } from "./Badge";

/**
 * Renders a clinic fact only when it is verified. Otherwise shows a visible
 * "pending verification" placeholder so unverified data is never presented
 * as fact. Provisional values are shown with a "provisional" badge.
 */
export function PendingValue({
  entry,
  label,
}: {
  entry: ConfigValue<string>;
  label: string;
}) {
  const t = useTranslations("Common");

  if (entry.status === "verified" && entry.value) {
    return <span>{entry.value}</span>;
  }

  if (entry.status === "provisional" && entry.value) {
    return (
      <span className="inline-flex flex-wrap items-center gap-2">
        <span>{entry.value}</span>
        <Badge tone="warning">{t("provisionalName")}</Badge>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 text-muted">
      <span>[{label}]</span>
      <Badge tone="warning">{t("pendingVerification")}</Badge>
    </span>
  );
}
