"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  TerminalWindowIcon,
  TreeStructureIcon,
  WaveformIcon,
} from "@phosphor-icons/react";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: TerminalWindowIcon,
    title: "Orquestación remota",
    body: "Sistema que se conecta vía SSH a entornos VPS para levantar y configurar servidores utilizando Docker Compose.",
  },
  {
    icon: TreeStructureIcon,
    title: "Gestión de tráfico",
    body: "Asignación de puertos y ruteo de dominios personalizados para cada proyecto, de forma completamente automática.",
  },
  {
    icon: WaveformIcon,
    title: "Monitoreo integrado",
    body: "Streaming de logs de los contenedores en vivo desde el hub web: debugging y control de los entornos sin necesidad de acceder a la terminal.",
  },
];

/**
 * Horizontal scroll hijack (canonical skeleton): the wrapper pins at the
 * top of the viewport and vertical scroll pans the track sideways through
 * the deploy story. Collapses to a vertical stack on mobile and under
 * reduced motion.
 */
export function DeployPan() {
  const wrapRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track) return;

    const mm = gsap.matchMedia();
    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        const distance = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={wrapRef}
      className="relative overflow-hidden bg-ink-2"
      aria-label="Automatización de despliegues en Hub central"
    >
      <div
        ref={trackRef}
        className="flex flex-col md:h-[100dvh] md:w-max md:flex-row md:items-center"
      >
        {/* Intro panel */}
        <div className="flex min-h-[70dvh] w-full shrink-0 flex-col justify-center px-5 py-20 md:h-full md:w-[72vw] md:px-16 md:py-0">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent-soft">
            Logro principal
          </p>
          <h3 className="mt-6 max-w-2xl text-4xl font-medium leading-[1.02] tracking-tighter md:text-6xl">
            Automatización de despliegues en el Hub central
          </h3>
          <p className="mt-8 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Desarrollé e integré una funcionalidad clave en el sistema interno
            de gestión de proyectos de la agencia, permitiendo orquestar
            despliegues a producción directamente desde una interfaz web.
          </p>
        </div>

        {/* Feature panels */}
        {features.map((feature) => (
          <div
            key={feature.title}
            className="flex w-full shrink-0 flex-col justify-center border-t border-hairline px-5 py-16 md:h-full md:w-[52vw] md:border-l md:border-t-0 md:px-16 md:py-0"
          >
            <feature.icon
              size={44}
              weight="thin"
              className="text-accent-soft"
            />
            <h4 className="mt-8 text-2xl font-medium tracking-tight md:text-4xl">
              {feature.title}
            </h4>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
              {feature.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
