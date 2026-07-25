"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Education() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.fromTo(
        el.querySelectorAll(".edu-card"),
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
          },
        },
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      id="educacion"
      ref={sectionRef}
      className="hairline-t mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40"
    >
      <h2 className="max-w-2xl text-3xl font-medium tracking-tight md:text-5xl">
        Formación y certificación
      </h2>

      <div className="mt-14 grid grid-cols-1 gap-6 md:mt-20 md:grid-cols-12">
        {/* Instituto Politécnico Superior */}
        <article className="edu-card flex flex-col justify-between gap-16 bg-gradient-to-br from-accent/25 via-ink-2 to-ink-2 p-8 md:col-span-7 md:p-12">
          <span
            aria-hidden
            className="flex h-16 w-16 items-center justify-center border border-paper/25 font-mono text-lg tracking-tight text-paper"
          >
            IPS
          </span>
          <div>
            <h3 className="text-2xl font-medium tracking-tight md:text-3xl">
              Técnico Informático
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
              Graduado del Instituto Politécnico Superior.
            </p>
          </div>
        </article>

        {/* Cambridge */}
        <article className="edu-card flex flex-col justify-between gap-16 bg-ink-2 p-8 md:col-span-5 md:p-12">
          <div className="flex h-16 w-28 items-center justify-center bg-white p-2">
            <Image
              src="/images/cambridge.jpg"
              alt="Cambridge Assessment English"
              width={225}
              height={225}
              className="h-full w-auto object-contain"
            />
          </div>
          <div>
            <h3 className="text-2xl font-medium tracking-tight md:text-3xl">
              Cambridge FCE, Grado A
            </h3>
            <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
              Certificación de inglés, nivel C1.
            </p>
          </div>
        </article>
      </div>
    </section>
  );
}
