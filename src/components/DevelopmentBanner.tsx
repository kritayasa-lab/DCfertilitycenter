import { useTranslations } from "next-intl";

/** Shown on every page until the clinic approves real content for launch. */
export function DevelopmentBanner() {
  const t = useTranslations("Common");
  return (
    <div
      role="note"
      className="border-b border-warning/20 bg-warning-soft px-5 py-2 text-center text-xs text-warning sm:text-sm"
    >
      {t("developmentBanner")}
    </div>
  );
}
