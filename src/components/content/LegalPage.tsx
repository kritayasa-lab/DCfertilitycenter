import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { MAIN_CONTENT_ID } from "@/components/SkipLink";
import { Badge } from "@/components/ui/Badge";
import { Container } from "@/components/ui/Container";
import { Notice } from "@/components/ui/Notice";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/i18n/routing";
import { PageHeader } from "./PageHeader";

export interface LegalSection {
  id: string;
  heading: string;
  /** Draft body text, or null when content is pending legal review. */
  body: ReactNode | null;
}

/**
 * Template for legal/information pages. Always rendered as a DRAFT until the
 * clinic's legal counsel approves the final text.
 */
export async function LegalPage({
  locale,
  title,
  sections,
}: {
  locale: Locale;
  title: string;
  sections: LegalSection[];
}) {
  const [t, tCommon] = await Promise.all([
    getTranslations({ locale, namespace: "Legal" }),
    getTranslations({ locale, namespace: "Common" }),
  ]);

  return (
    <main id={MAIN_CONTENT_ID} className="flex-1">
      <PageHeader
        title={title}
        breadcrumbs={[{ label: title }]}
        badges={<Badge tone="warning">{tCommon("draftBadge")}</Badge>}
      >
        <p className="mt-4 text-sm text-muted">
          {t("lastUpdated")}: {t("pendingDate")}
        </p>
      </PageHeader>
      <Section>
        <Container width="prose">
          <Notice tone="warning" role="note" className="mb-10">{t("draftNotice")}</Notice>
          <nav aria-label={title} className="mb-10">
            <ol className="list-decimal space-y-1 pl-5 text-sm">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-primary underline-offset-4 hover:underline">{s.heading}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="space-y-10">
            {sections.map((s) => (
              <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="scroll-mt-32">
                <h2 id={`${s.id}-h`} className="text-2xl">{s.heading}</h2>
                <div className="mt-3">
                  {s.body ?? <p className="text-muted italic">{t("pendingSection")}</p>}
                </div>
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </main>
  );
}
