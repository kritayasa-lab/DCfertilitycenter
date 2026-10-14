import { describe, expect, it } from "vitest";
import { parseVideoUrl, videoEmbedUrl } from "@/lib/video";

describe("parseVideoUrl (allow-listed providers only)", () => {
  it.each([
    ["https://www.youtube.com/watch?v=dQw4w9WgXcQ", { provider: "youtube", id: "dQw4w9WgXcQ" }],
    ["https://youtu.be/dQw4w9WgXcQ", { provider: "youtube", id: "dQw4w9WgXcQ" }],
    ["https://youtube.com/shorts/dQw4w9WgXcQ", { provider: "youtube", id: "dQw4w9WgXcQ" }],
    ["https://vimeo.com/123456789", { provider: "vimeo", id: "123456789" }],
  ])("accepts %s", (url, expected) => {
    expect(parseVideoUrl(url)).toEqual(expected);
  });

  it.each([
    "http://www.youtube.com/watch?v=dQw4w9WgXcQ", // not HTTPS
    "https://www.youtube.com.evil.example/watch?v=dQw4w9WgXcQ", // look-alike host
    "https://evil.example/?u=https://youtu.be/dQw4w9WgXcQ",
    "https://www.youtube.com/watch?v=short", // malformed id
    "https://www.tiktok.com/@clinic/video/7234567890123456789", // not allow-listed yet
    "javascript:alert(1)",
    "not a url",
    "",
  ])("rejects %s", (url) => {
    expect(parseVideoUrl(url)).toBeNull();
  });

  it("builds privacy-friendly embed URLs", () => {
    expect(videoEmbedUrl({ provider: "youtube", id: "dQw4w9WgXcQ" })).toBe(
      "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ",
    );
    expect(videoEmbedUrl({ provider: "vimeo", id: "123456789" })).toBe("https://player.vimeo.com/video/123456789?dnt=1");
  });
});
