"use client";

import { useState } from "react";

/**
 * Google Maps embed that loads only after the visitor asks for it, so no
 * third-party request (or cookie) happens on page view. The query is the
 * clinic's supplied address; no coordinates are hardcoded. A separate link
 * opens the clinic's own Google Maps URL directly.
 */
export function MapEmbed({
  query,
  mapUrl,
  labels,
}: {
  query: string;
  mapUrl: string | null;
  labels: { title: string; load: string; notice: string; open: string };
}) {
  const [loaded, setLoaded] = useState(false);
  const src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="relative min-h-80 flex-1 overflow-hidden rounded-2xl border border-border bg-surface-muted">
        {loaded ? (
          <iframe
            src={src}
            title={labels.title}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
            className="absolute inset-0 h-full w-full border-0"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <svg aria-hidden="true" viewBox="0 0 48 48" className="h-12 w-12 text-primary">
              <path
                d="M24 44s14-13.2 14-24a14 14 0 1 0-28 0c0 10.8 14 24 14 24Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              />
              <circle cx="24" cy="20" r="5" fill="currentColor" />
            </svg>
            <p className="max-w-xs text-sm text-muted">{labels.notice}</p>
            <button
              type="button"
              onClick={() => setLoaded(true)}
              className="inline-flex min-h-11 items-center rounded-pill bg-primary px-5 text-sm font-medium text-on-primary hover:bg-primary-hover"
            >
              {labels.load}
            </button>
          </div>
        )}
      </div>
      {mapUrl && (
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 self-start text-sm font-medium text-primary underline underline-offset-4 hover:text-primary-hover"
        >
          {labels.open} ↗
        </a>
      )}
    </div>
  );
}
