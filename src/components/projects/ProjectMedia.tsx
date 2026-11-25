"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import type { GalleryImage, GalleryPhase, ProjectVideo } from "@/content/projects";
import { cn } from "@/lib/utils";
import { projectsPage } from "@/content/pages/projects";

const labels = projectsPage.detail.phases;
const PHASES: { key: GalleryPhase; label: string }[] = [
  { key: "before", label: labels.before },
  { key: "during", label: labels.during },
  { key: "after", label: labels.after },
];

/**
 * Case-study gallery: phase filters (only for phases supplied), a large primary
 * image with thumbnails, and a full-screen viewer (native <dialog>: focus is
 * trapped and restored, Esc closes, arrow keys move). Approved videos follow.
 */
export function ProjectMedia({ images, videos = [], name }: { images: GalleryImage[]; videos?: ProjectVideo[]; name: string }) {
  const phases = PHASES.filter((p) => images.some((i) => i.phase === p.key));
  const [phase, setPhase] = useState<GalleryPhase | "all">("all");
  const [index, setIndex] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const list = phase === "all" ? images : images.filter((i) => i.phase === phase);
  const current = list[Math.min(index, list.length - 1)];
  const phaseLabel = (k: GalleryPhase) => PHASES.find((p) => p.key === k)!.label;

  const move = (d: number) => setIndex((i) => (i + d + list.length) % list.length);

  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % list.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + list.length) % list.length);
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [list.length]);

  return (
    <div>
      {images.length > 0 && (
        <>
          {phases.length > 1 && (
            <div role="group" aria-label="Project stage" className="mb-6 inline-flex border border-navy/15 bg-white p-0.5">
              {[{ key: "all" as const, label: labels.all }, ...phases].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  aria-pressed={phase === p.key}
                  onClick={() => {
                    setPhase(p.key);
                    setIndex(0);
                  }}
                  className={cn(
                    "h-9 px-4 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] transition-colors",
                    phase === p.key ? "bg-navy text-white" : "text-navy hover:bg-ivory",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_9rem]">
            <figure>
              <button
                type="button"
                onClick={() => dialog.current?.showModal()}
                className="group relative block aspect-[16/10] w-full overflow-hidden bg-navy"
                aria-label={`Open full screen: ${current.alt}`}
              >
                <Image key={current.src + index} src={current.src} alt={current.alt} fill sizes="(min-width: 1024px) 70vw, 100vw" className="animate-panel-in object-cover" style={{ objectPosition: current.position }} />
                <span className="absolute top-4 left-4 bg-navy-deep/80 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white">{phaseLabel(current.phase)}</span>
                <span className="absolute right-4 bottom-4 grid size-10 place-items-center bg-white/90 text-navy transition-transform group-hover:scale-105">
                  <Expand aria-hidden className="size-4" />
                </span>
              </button>
              {current.caption && <figcaption className="mt-3 text-sm text-slate">{current.caption}</figcaption>}
            </figure>

            {list.length > 1 && (
              <ul aria-label="Gallery images" className="flex gap-3 overflow-x-auto pb-1 [scrollbar-width:thin] lg:flex-col lg:overflow-visible">
                {list.map((img, i) => (
                  <li key={img.src + i} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Show image ${i + 1}: ${img.alt}`}
                      aria-current={i === index ? "true" : undefined}
                      className={cn("relative block aspect-[4/3] w-28 overflow-hidden ring-offset-2 transition lg:w-full", i === index ? "ring-2 ring-gold" : "opacity-70 hover:opacity-100")}
                    >
                      <Image src={img.src} alt="" fill sizes="144px" className="object-cover" style={{ objectPosition: img.position }} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <dialog
            ref={dialog}
            aria-label={`${name} — gallery`}
            className="m-0 h-dvh max-h-none w-screen max-w-none bg-navy-deep/97 p-0 text-white backdrop:bg-black/60"
            onClick={(e) => {
              if (e.target === e.currentTarget) dialog.current?.close();
            }}
          >
            <div className="flex h-full flex-col px-4 pt-4 pb-[calc(1rem+var(--safe-bottom))] sm:px-8 sm:pt-6">
              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/70 tabular-nums">
                  {phaseLabel(current.phase)} · {Math.min(index, list.length - 1) + 1} / {list.length}
                </p>
                <button type="button" autoFocus onClick={() => dialog.current?.close()} className="grid size-11 place-items-center text-white/80 hover:text-white" aria-label="Close gallery">
                  <X aria-hidden className="size-6" />
                </button>
              </div>
              <div className="relative mt-4 min-h-0 flex-1">
                <Image key={current.src + index} src={current.src} alt={current.alt} fill sizes="100vw" className="animate-panel-in object-contain" />
              </div>
              <div className="mt-4 flex items-center justify-between gap-4">
                <button type="button" onClick={() => move(-1)} disabled={list.length < 2} className="grid size-11 place-items-center border border-white/25 hover:border-gold-pale disabled:opacity-30" aria-label="Previous image">
                  <ChevronLeft aria-hidden className="size-5" />
                </button>
                <p className="max-w-2xl text-center text-sm text-white/75">{current.caption ?? current.alt}</p>
                <button type="button" onClick={() => move(1)} disabled={list.length < 2} className="grid size-11 place-items-center border border-white/25 hover:border-gold-pale disabled:opacity-30" aria-label="Next image">
                  <ChevronRight aria-hidden className="size-5" />
                </button>
              </div>
            </div>
          </dialog>
        </>
      )}

      {videos.length > 0 && (
        <ul className={cn("grid gap-6 md:grid-cols-2", images.length > 0 && "mt-12")}>
          {videos.map((v) => (
            <li key={v.title}>
              <figure>
                <div className="relative aspect-video overflow-hidden bg-navy">
                  {v.kind === "file" ? (
                    <video controls preload="none" poster={v.poster} className="absolute inset-0 size-full object-cover">
                      <source src={v.src} />
                    </video>
                  ) : (
                    <iframe src={v.url} title={v.title} loading="lazy" allow="encrypted-media; picture-in-picture; fullscreen" className="absolute inset-0 size-full" />
                  )}
                </div>
                <figcaption className="mt-3 text-sm text-slate">
                  {v.title}
                  {v.phase && <span className="ml-2 text-xs font-semibold uppercase tracking-[0.12em] text-gold-ink">{phaseLabel(v.phase)}</span>}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
