import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";

export function PlaceholderBadge() {
  const t = useTranslations("Common");
  return <Badge tone="warning">{t("placeholderBadge")}</Badge>;
}
