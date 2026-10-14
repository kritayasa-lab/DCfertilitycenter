import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { clinicAssets } from "@/config/assets";
import { clinicName } from "@/config/site";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/**
 * The clinic's original logo, displayed unmodified.
 *
 * The source PNG has a wide white margin around the artwork. The frame below
 * only sizes and positions the image with CSS (object-fit/object-position) so
 * the margin falls outside the visible box; the artwork itself is never cut,
 * recoloured, redrawn or distorted (aspect ratio preserved).
 */
export function SiteLogo({ className }: { className?: string }) {
  const t = useTranslations("Common");
  const locale = useLocale() as Locale;
  const name = clinicName(locale);
  const { logo } = clinicAssets;
  return (
    <Link href="/" className={cn("inline-block shrink-0", className)} aria-label={`${name} – ${t("home")}`}>
      <span className="relative block aspect-[1593/640] w-[168px] overflow-hidden sm:w-[210px]">
        <Image
          src={logo.src}
          alt={t("logoAlt", { name })}
          width={logo.width}
          height={logo.height}
          quality={90}
          preload
          sizes="210px"
          className="absolute inset-0 h-full w-full object-cover object-[50%_53%]"
        />
      </span>
    </Link>
  );
}
