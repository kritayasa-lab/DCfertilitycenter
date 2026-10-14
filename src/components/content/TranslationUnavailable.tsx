import { getTranslations } from "next-intl/server";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

/**
 * Explicit state for content without a published translation in the
 * requested locale. Links to the languages that do exist instead of silently
 * showing another language.
 */
export async function TranslationUnavailable({
  locale,
  path,
  available,
}: {
  locale: Locale;
  path: string;
  available: Locale[];
}) {
  const t = await getTranslations({ locale, namespace: "TranslationUnavailable" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  return (
    <main id={MAIN_CONTENT_ID} className="flex flex-1 items-center py-24">
      <Container width="prose" className="text-center">
        <h1 className="text-3xl sm:text-4xl">{t("title")}</h1>
        <p className="mt-4 text-muted">{t("body")}</p>
        <ul className="mt-6 flex flex-wrap justify-center gap-3">
          {available.map((l) => (
            <li key={l}>
              <Link
                href={path}
                locale={l}
                lang={l}
                hrefLang={l}
                className="inline-flex min-h-11 items-center rounded-pill border border-primary px-5 text-primary hover:bg-primary-soft"
              >
                {tCommon(`languageNames.${l}`)}
              </Link>
            </li>
          ))}
        </ul>
        <ButtonLink href="/" variant="ghost" className="mt-8">
          {t("backHome")}
        </ButtonLink>
      </Container>
    </main>
  );
}
