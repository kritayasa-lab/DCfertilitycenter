import { useFormatter, useTranslations } from "next-intl";
import type { Package } from "@/content/types";

/** Approved price and validity window; explicit placeholders otherwise. */
export function PackageMeta({ pkg }: { pkg: Package }) {
  const t = useTranslations("Packages");
  const format = useFormatter();
  const date = (iso: string) =>
    format.dateTime(new Date(`${iso}T00:00:00+07:00`), { dateStyle: "medium", timeZone: "Asia/Bangkok" });

  return (
    <dl className="grid gap-1 text-sm">
      <div className="flex gap-2">
        <dt className="text-muted">{t("priceLabel")}:</dt>
        <dd className="font-medium text-foreground">
          {pkg.price
            ? format.number(pkg.price.amount, { style: "currency", currency: pkg.price.currency })
            : t("pricePending")}
        </dd>
      </div>
      <div>
        <dt className="sr-only">{t("validityPending")}</dt>
        <dd className="text-muted">
          {pkg.validFrom && pkg.validUntil
            ? t("validity", { from: date(pkg.validFrom), until: date(pkg.validUntil) })
            : pkg.validUntil
              ? t("validUntil", { until: date(pkg.validUntil) })
              : t("validityPending")}
        </dd>
      </div>
    </dl>
  );
}
