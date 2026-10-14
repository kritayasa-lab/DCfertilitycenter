import Image from "next/image";
import { clinicAssets } from "@/config/assets";
import { cn } from "@/lib/cn";

/*
 * The original logo PNG (1593×1609) is transparent around the artwork, which
 * occupies the box x 30–1563, y 576–1133. The frame below has that box's
 * aspect ratio; the full image keeps its intrinsic ratio (object-fit:
 * contain) and is offset by percentages so the transparent margin falls
 * outside the frame. No pixels are altered; no background, filter, blend
 * mode or shadow is applied to the image.
 */
const { logo } = clinicAssets;
const box = { x: 30, y: 576, w: 1563 - 30, h: 1133 - 576 };

/** `className` sets the rendered width (e.g. `w-[168px] sm:w-[200px]`); height follows the ratio. */
export function LogoImage({
  alt,
  maxWidth,
  preload = false,
  className,
}: {
  alt: string;
  /** Largest rendered width in CSS px (for responsive image sizing). */
  maxWidth: number;
  preload?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn("relative block overflow-hidden", className)}
      style={{ aspectRatio: `${box.w} / ${box.h}` }}
    >
      <Image
        src={logo.src}
        alt={alt}
        width={logo.width}
        height={logo.height}
        quality={90}
        preload={preload}
        sizes={`${Math.ceil((maxWidth * logo.width) / box.w)}px`}
        className="absolute max-w-none object-contain"
        style={{
          width: `${(logo.width / box.w) * 100}%`,
          height: `${(logo.height / box.h) * 100}%`,
          left: `${(-box.x / box.w) * 100}%`,
          top: `${(-box.y / box.h) * 100}%`,
        }}
      />
    </span>
  );
}
