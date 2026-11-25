import Image from "next/image";
import type { ImageAsset } from "@/content/types";
import { cn } from "@/lib/utils";

/**
 * Optional photograph behind a dark section, dimmed under the section colour so
 * text stays readable. Renders nothing when no image is set in the content file.
 * Place as the first child of a `relative overflow-hidden` section.
 */
export function SectionBackdrop({ image, overlay = "bg-navy/85" }: { image?: ImageAsset; overlay?: string }) {
  if (!image) return null;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <Image src={image.src} alt="" fill sizes="100vw" className="object-cover" style={{ objectPosition: image.position }} />
      <div className={cn("absolute inset-0", overlay)} />
    </div>
  );
}
