import { useTranslations } from "next-intl";
import { displayValue, siteConfig } from "@/config/site";
import { Link } from "@/i18n/navigation";

/**
 * Text-based placeholder logo. Replace with the clinic's approved logo asset.
 * The working name is provisional; the full label is available to assistive tech.
 */
export function SiteLogo() {
  const t = useTranslations("Common");
  const name = displayValue(siteConfig.name) ?? "[Clinic Name]";
  const mark = displayValue(siteConfig.shortName) ?? "—";
  return (
    <Link href="/" className="group inline-flex items-center gap-3" aria-label={`${name} – ${t("home")}`}>
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-pill bg-primary font-display text-base text-on-primary"
      >
        {mark}
      </span>
      <span className="flex flex-col leading-tight">
        <span className="font-display text-lg text-primary group-hover:text-primary-hover sm:text-xl">
          {name}
        </span>
        {siteConfig.name.status !== "verified" && (
          <span className="text-[0.7rem] text-warning">{t("provisionalName")}</span>
        )}
      </span>
    </Link>
  );
}
