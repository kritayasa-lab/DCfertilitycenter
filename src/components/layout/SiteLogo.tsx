import { useLocale, useTranslations } from "next-intl";
import { clinicName } from "@/config/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";
import { LogoImage } from "./LogoImage";

/** The clinic's original logo, displayed unmodified on the header surface. */
export function SiteLogo({ className }: { className?: string }) {
  const t = useTranslations("Common");
  const locale = useLocale() as Locale;
  const name = clinicName(locale);
  return (
    <Link href="/" className={cn("inline-block shrink-0 rounded-md", className)} aria-label={`${name} – ${t("home")}`}>
      <LogoImage alt={t("logoAlt", { name })} maxWidth={172} preload className="w-[136px] sm:w-[152px] lg:w-[172px]" />
    </Link>
  );
}
