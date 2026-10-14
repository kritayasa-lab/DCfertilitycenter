import type { ServiceIcon as Icon } from "@/content/types";

/** Simple original line icons; decorative only (titles carry the meaning). */
const paths: Record<Icon, React.ReactNode> = {
  consultation: (
    <>
      <path d="M8 10h22a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H18l-7 6v-6H8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4Z" />
      <path d="M12 18h14M12 22h9" />
      <path d="M38 18h2a4 4 0 0 1 4 4v8a4 4 0 0 1-4 4h-1v5l-6-5h-8" />
    </>
  ),
  iui: (
    <>
      <path d="M24 6c6 8 11 14 11 21a11 11 0 0 1-22 0c0-7 5-13 11-21Z" />
      <path d="M19 28a5 5 0 0 0 5 5" />
    </>
  ),
  ivf: (
    <>
      <circle cx="24" cy="24" r="16" />
      <circle cx="24" cy="24" r="9" />
      <path d="M8 24H3M45 24h-5" />
    </>
  ),
  "sperm-retrieval": (
    <>
      <circle cx="17" cy="20" r="6" />
      <path d="M22 24c4 4 6 4 9 2s5-2 7 1 4 4 7 3" />
      <path d="M10 38h28" />
    </>
  ),
  pgt: (
    <>
      <path d="M16 4c0 10 16 12 16 22S16 34 16 44" />
      <path d="M32 4c0 10-16 12-16 22s16 8 16 18" />
      <path d="M18 12h12M17 20h14M17 30h14M18 38h12" />
    </>
  ),
  obgyn: (
    <>
      <path d="M24 41S7 31 7 19a9 9 0 0 1 17-4 9 9 0 0 1 17 4c0 12-17 22-17 22Z" />
      <path d="M24 20v10M19 25h10" />
    </>
  ),
};

export function ServiceIcon({ icon, className }: { icon: Icon; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[icon]}
    </svg>
  );
}
