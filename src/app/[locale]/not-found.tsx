import { useTranslations } from "next-intl";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export default function LocaleNotFound() {
  const t = useTranslations("NotFound");
  return (
    <main id={MAIN_CONTENT_ID} className="flex flex-1 items-center py-24">
      <Container width="prose" className="text-center">
        <h1 className="text-4xl">{t("title")}</h1>
        <p className="mt-4 text-muted">{t("body")}</p>
        <ButtonLink href="/" className="mt-8">
          {t("backHome")}
        </ButtonLink>
      </Container>
    </main>
  );
}
