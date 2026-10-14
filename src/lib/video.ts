import type { VideoProvider } from "@/content/types";

/**
 * Parses a success-story video link into an allow-listed provider reference.
 *
 * Only YouTube and Vimeo are accepted. Anything else (other hosts, look-alike
 * domains, non-HTTPS, malformed IDs) returns null so the CMS can reject it.
 * Nothing is fetched: thumbnails and metadata are retrieved later by the
 * admin CMS for human review before publication (docs/ADMIN_CMS_REQUIREMENTS.md).
 */
export function parseVideoUrl(input: string): { provider: VideoProvider; id: string } | null {
  let url: URL;
  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase();

  if (host === "youtu.be") {
    return youtubeId(url.pathname.slice(1));
  }
  if (host === "youtube.com" || host === "www.youtube.com" || host === "m.youtube.com") {
    if (url.pathname === "/watch") return youtubeId(url.searchParams.get("v") ?? "");
    const match = url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)\/?$/);
    return match ? youtubeId(match[1]) : null;
  }
  if (host === "vimeo.com" || host === "www.vimeo.com" || host === "player.vimeo.com") {
    const match = url.pathname.match(/^\/(?:video\/)?(\d{6,12})\/?$/);
    return match ? { provider: "vimeo", id: match[1] } : null;
  }
  return null;
}

function youtubeId(id: string) {
  return /^[A-Za-z0-9_-]{11}$/.test(id) ? { provider: "youtube" as const, id } : null;
}

/** Privacy-friendly embed URL for an already-validated reference. */
export function videoEmbedUrl(video: { provider: VideoProvider; id: string }): string {
  return video.provider === "youtube"
    ? `https://www.youtube-nocookie.com/embed/${video.id}`
    : `https://player.vimeo.com/video/${video.id}?dnt=1`;
}
