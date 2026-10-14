import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Doctor } from "@/content/types";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/cn";

/** Authorized photograph, or a neutral placeholder until one is supplied. */
export function DoctorAvatar({
  doctor,
  locale,
  className,
}: {
  doctor: Doctor;
  locale: Locale;
  className?: string;
}) {
  const t = useTranslations("Doctors");
  if (doctor.photo) {
    return (
      <Image
        src={doctor.photo.src}
        width={doctor.photo.width}
        height={doctor.photo.height}
        alt={doctor.photoAlt?.[locale] ?? ""}
        className={cn("aspect-[4/5] w-full rounded-md object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex aspect-[4/5] w-full flex-col items-center justify-center gap-3 rounded-md bg-surface-muted text-olive-600",
        className,
      )}
    >
      <svg aria-hidden="true" viewBox="0 0 48 48" className="h-16 w-16">
        <circle cx="24" cy="17" r="8" fill="currentColor" opacity="0.5" />
        <path d="M8 42c2-9 9-14 16-14s14 5 16 14" fill="currentColor" opacity="0.5" />
      </svg>
      <span className="text-xs text-muted">{t("photoPending")}</span>
    </div>
  );
}
