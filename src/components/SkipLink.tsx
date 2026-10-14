import { useTranslations } from "next-intl";

export const MAIN_CONTENT_ID = "main-content";

export function SkipLink() {
  const t = useTranslations("Common");
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:text-primary focus:shadow-raised"
    >
      {t("skipToContent")}
    </a>
  );
}
