"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FaceSplatCanvas = dynamic(
  () =>
    import("./face-splat-canvas").then((m) => ({
      default: m.FaceSplatCanvas,
    })),
  { ssr: false },
);

function SplitLine({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`block overflow-hidden pb-[0.06em] ${className ?? ""}`}>
      <span className="hero-line block will-change-transform">{text}</span>
    </span>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(true);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setReadyTrue = useCallback(() => setReady(true), []);
  const onError = useCallback((message: string) => setError(message), []);

  // Pause the render loop when the hero is offscreen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Intro reveal + scroll-out parallax
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el.querySelectorAll(".hero-line"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.09,
          delay: 0.15,
        },
      );
      gsap.to(el.querySelector(".hero-copy"), {
        yPercent: -18,
        opacity: 0.15,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      className="relative min-h-[100dvh] w-full overflow-hidden"
      aria-label="Martín Moloeznik, Software Developer"
    >
      {/* 3D face splat, full bleed, nudged right on desktop */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 md:left-[8%] ${
          ready ? "opacity-100" : "opacity-0"
        }`}
      >
        <FaceSplatCanvas
          active={active}
          onProgress={setProgress}
          onReady={setReadyTrue}
          onError={onError}
        />
      </div>

      {/* Loading state */}
      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
              Cargando escaneo 3D
            </p>
            <div className="h-px w-40 overflow-hidden bg-paper/10">
              <div
                className="h-full bg-accent transition-[width] duration-200"
                style={{ width: `${Math.round(progress * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="font-mono text-xs text-muted">
            No se pudo cargar el escaneo 3D.
          </p>
        </div>
      )}

      {/* Legibility scrim over the lower third */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink via-ink/50 to-transparent" />

      {/* Copy */}
      <div className="hero-copy absolute inset-x-0 bottom-0 z-10 mx-auto max-w-[1400px] px-5 pb-12 md:px-10 md:pb-16">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.24em] text-accent-soft">
          <SplitLine text="Software Developer" />
        </p>
        <h1 className="text-[13.5vw] font-medium uppercase leading-[0.92] tracking-tighter md:text-[9vw]">
          <SplitLine text="Martín" />
          <SplitLine text="Moloeznik" />
        </h1>
      </div>
    </section>
  );
}
