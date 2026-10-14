import { getTranslations } from "next-intl/server";
import { Notice } from "@/components/ui/Notice";
import { Button } from "@/components/ui/Button";
import { Link } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

/**
 * Inquiry form layout (Phase 2). NOT CONNECTED: every control is disabled,
 * the form has no action and nothing is sent or stored. Phase 6 replaces
 * this with a validated Server Action after the backend is approved.
 *
 * Fields are limited to what is needed for initial contact. No medical
 * history, diagnosis, ID numbers or file uploads are collected.
 */
export async function InquiryFormPreview({
  locale,
  services,
}: {
  locale: Locale;
  services: { slug: string; title: string }[];
}) {
  const t = await getTranslations({ locale, namespace: "Contact" });
  const tCommon = await getTranslations({ locale, namespace: "Common" });
  const field = "mt-2 block min-h-11 w-full rounded-md border border-border-strong bg-surface px-3 disabled:bg-surface-muted";
  const label = "block text-sm font-medium text-foreground";

  return (
    <div>
      <Notice tone="warning" role="note" className="mb-6">
        <p className="font-medium">{t("formNotConnected")}</p>
        <p className="mt-1">{t("formNotBooking")}</p>
      </Notice>

      <form aria-describedby="inquiry-not-connected">
        <p id="inquiry-not-connected" className="sr-only">{t("formNotConnected")}</p>
        <fieldset disabled className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="inq-name" className={label}>{t("fields.name")}</label>
            <input id="inq-name" name="name" type="text" autoComplete="name" required className={field} />
          </div>
          <div>
            <label htmlFor="inq-phone" className={label}>{t("fields.phone")}</label>
            <input
              id="inq-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              inputMode="tel"
              required
              aria-describedby="inq-phone-hint"
              className={field}
            />
            <p id="inq-phone-hint" className="mt-1 text-xs text-muted">{t("fields.phoneHint")}</p>
          </div>
          <div>
            <label htmlFor="inq-email" className={label}>{t("fields.email")}</label>
            <input id="inq-email" name="email" type="email" autoComplete="email" className={field} />
          </div>
          <div>
            <label htmlFor="inq-language" className={label}>{t("fields.preferredLanguage")}</label>
            <select id="inq-language" name="preferredLanguage" defaultValue={locale} className={field}>
              {locales.map((l) => (
                <option key={l} value={l}>{tCommon(`languageNames.${l}`)}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="inq-service" className={label}>{t("fields.service")}</label>
            <select id="inq-service" name="service" defaultValue="" className={field}>
              <option value="">{t("fields.serviceNone")}</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>{s.title}</option>
              ))}
            </select>
          </div>
          <fieldset className="sm:col-span-2">
            <legend className={label}>{t("fields.contactMethod")}</legend>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2">
              {(["phone", "line", "email"] as const).map((method) => (
                <label key={method} className="inline-flex min-h-11 items-center gap-2 text-sm">
                  <input type="radio" name="contactMethod" value={method} defaultChecked={method === "phone"} className="h-4 w-4 accent-primary" />
                  {t(`fields.contactMethods.${method}`)}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="sm:col-span-2">
            <label htmlFor="inq-callback" className={label}>{t("fields.callbackTime")}</label>
            <select id="inq-callback" name="callbackTime" defaultValue="any" className={`${field} sm:max-w-xs`}>
              {(["any", "morning", "afternoon", "evening"] as const).map((slot) => (
                <option key={slot} value={slot}>{t(`fields.callbackTimes.${slot}`)}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-muted sm:col-span-2">{t("fields.dataMinimization")}</p>
          <div className="sm:col-span-2">
            <label className="flex items-start gap-3 text-sm">
              <input type="checkbox" name="privacyConsent" required className="mt-1 h-4 w-4 accent-primary" />
              <span>
                {t.rich("fields.privacy", {
                  privacyLink: (chunks) => (
                    <Link href="/privacy" className="text-primary underline underline-offset-2">
                      {chunks}
                    </Link>
                  ),
                })}
              </span>
            </label>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" size="lg">
              {t("submitDisabled")}
            </Button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
