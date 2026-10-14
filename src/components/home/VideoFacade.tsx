"use client";

import { useState } from "react";
import type { VideoProvider } from "@/content/types";
import { videoEmbedUrl } from "@/lib/video";

/**
 * Click-to-load player for an approved, allow-listed video. No third-party
 * request happens until the visitor presses play.
 */
export function VideoFacade({
  video,
  title,
  playLabel,
}: {
  video: { provider: VideoProvider; id: string };
  title: string;
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);
  if (playing) {
    return (
      <iframe
        src={`${videoEmbedUrl(video)}${video.provider === "youtube" ? "?autoplay=1" : "&autoplay=1"}`}
        title={title}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
        className="aspect-video w-full border-0"
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className="flex aspect-video w-full items-center justify-center bg-surface-inverse text-on-inverse"
    >
      <span className="sr-only">
        {playLabel}: {title}
      </span>
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-12 w-12 fill-current">
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
}
