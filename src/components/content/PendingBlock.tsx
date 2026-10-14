import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";

/**
 * Visible placeholder for content the clinic has not yet supplied or
 * approved. Never replace with invented copy.
 */
export function PendingBlock({ label }: { label?: string }) {
  const t = useTranslations("Common");
  return (
    <div className="rounded-md border border-dashed border-border-strong bg-surface px-5 py-4 text-sm text-muted">
      <Badge tone="warning">{label ?? t("pendingContent")}</Badge>
      <p className="mt-2">{t("pendingContentBody")}</p>
    </div>
  );
}
