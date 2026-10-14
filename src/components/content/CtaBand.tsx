import { useTranslations } from "next-intl";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

/** Shared "contact the clinic" call to action. Never implies a booking. */
export function CtaBand() {
  const t = useTranslations("Home");
  return (
    <section aria-labelledby="cta-heading" className="bg-surface-accent py-16">
      <Container className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="max-w-prose">
          <h2 id="cta-heading" className="text-3xl">{t("ctaHeading")}</h2>
          <p className="mt-3 text-muted">{t("ctaBody")}</p>
        </div>
        <ButtonLink href="/contact" size="lg" className="shrink-0">
          {t("primaryCta")}
        </ButtonLink>
      </Container>
    </section>
  );
}
