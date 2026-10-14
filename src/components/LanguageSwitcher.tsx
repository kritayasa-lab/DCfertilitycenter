"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition, type ChangeEvent } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

/**
 * Switches language while staying on the equivalent page.
 *
 * Phase 1 pages exist in every locale. Once CMS content arrives (Phase 2/4),
 * content pages without a published translation render an explicit
 * "not available in this language" state rather than another language.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    startTransition(() => {
      // `pathname` is the current path without its locale prefix.
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <label className={className}>
      <span className="sr-only">{t("languageLabel")}</span>
      <select
        value={locale}
        onChange={onChange}
        disabled={isPending}
        aria-label={t("languageLabel")}
        className="min-h-11 rounded-pill border border-border-strong bg-surface px-4 text-sm text-foreground"
      >
        {locales.map((value) => (
          <option key={value} value={value} lang={value}>
            {t(`languageNames.${value}`)}
          </option>
        ))}
      </select>
    </label>
  );
}
