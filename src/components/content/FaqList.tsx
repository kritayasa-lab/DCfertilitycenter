import { useTranslations } from "next-intl";
import type { FaqItem } from "@/content/types";

/** Accessible FAQ list built on native <details>/<summary> (no JavaScript). */
export function FaqList({ items }: { items: FaqItem[] }) {
  const t = useTranslations("Faq");
  return (
    <div className="divide-y divide-border rounded-lg border border-border bg-surface">
      {items.map((item) => (
        <details key={item.question} className="group px-5 py-1 sm:px-6">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-medium text-foreground [&::-webkit-details-marker]:hidden">
            <span>{item.question}</span>
            <svg aria-hidden="true" viewBox="0 0 20 20" className="h-5 w-5 shrink-0 text-primary transition-transform group-open:rotate-45">
              <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </summary>
          <div className="pb-5 text-muted">
            {item.answer ?? <span className="italic">{t("answerPending")}</span>}
          </div>
        </details>
      ))}
    </div>
  );
}
