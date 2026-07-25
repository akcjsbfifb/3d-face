"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useI18n } from "@/lib/i18n";

const FaceSplatCanvas = dynamic(
  () =>
    import("./face-splat-canvas").then((m) => ({
      default: m.FaceSplatCanvas,
    })),
  { ssr: false },
);

export function FaceSplatSection() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setReadyTrue = useCallback(() => setReady(true), []);
  const onError = useCallback((message: string) => setError(message), []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMounted(true);
          setActive(true);
        } else {
          setActive(false);
        }
      },
      { threshold: 0.1, rootMargin: "200px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="scan"
      className="relative min-h-[100dvh] w-full overflow-hidden bg-[#111]"
      aria-label={t("splat.label")}
    >
      {!ready && !error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#111]">
          <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
            {t("splat.loading")}
          </p>
          <div className="h-1 w-48 overflow-hidden rounded-full bg-zinc-800">
            <motion.div
              className="h-full bg-emerald-500"
              initial={false}
              animate={{ width: `${Math.round(progress * 100)}%` }}
              transition={{ duration: reduceMotion ? 0 : 0.2 }}
            />
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-[#111] px-6 text-center">
          <p className="text-sm text-zinc-300">Could not load the 3D scan.</p>
          <p className="font-mono text-xs text-zinc-500">{error}</p>
          <a
            href="/legacy.html"
            className="text-sm text-emerald-400 underline underline-offset-4"
          >
            Open legacy demo
          </a>
        </div>
      )}

      {mounted && (
        <FaceSplatCanvas
          active={active}
          onProgress={setProgress}
          onReady={setReadyTrue}
          onError={onError}
        />
      )}

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-[#111] via-[#111]/60 to-transparent px-6 pb-10 pt-24">
        <p className="max-w-xl font-mono text-xs uppercase tracking-widest text-zinc-500">
          {t("splat.label")}
        </p>
        <a
          href="/legacy.html"
          className="pointer-events-auto mt-2 inline-block font-mono text-[11px] text-zinc-600 underline underline-offset-2 hover:text-zinc-400"
        >
          legacy viewer
        </a>
      </div>
    </section>
  );
}
