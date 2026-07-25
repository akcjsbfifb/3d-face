"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const DESCRIPTION =
  "LambdaWorks es un estudio especializado en el desarrollo acelerado de productos digitales: SaaS, marketplaces y software a medida, con un stack moderno basado en Next.js, NestJS y PostgreSQL.";

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      gsap.to(el.querySelectorAll(".fill-word"), {
        opacity: 1,
        ease: "none",
        stagger: 0.4,
        scrollTrigger: {
          trigger: el.querySelector(".fill-copy"),
          start: "top 78%",
          end: "top 30%",
          scrub: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  const words = DESCRIPTION.split(" ");

  return (
    <section
      id="experiencia"
      ref={sectionRef}
      className="hairline-t relative mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40"
    >
      <div className="flex flex-col gap-6">
        <Image
          src="/images/lambdaworks.svg"
          alt="LambdaWorks"
          width={408}
          height={132}
          className="h-14 w-auto self-start md:h-20"
        />
        <h2 className="max-w-3xl text-3xl font-medium tracking-tight md:text-5xl">
          Software Developer en LambdaWorks
        </h2>
      </div>

      <p className="fill-copy mt-14 max-w-4xl text-2xl font-normal leading-snug tracking-tight text-paper md:mt-20 md:text-4xl">
        {words.map((word, i) => (
          <span key={i} className="fill-word inline opacity-20">
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </p>
    </section>
  );
}
