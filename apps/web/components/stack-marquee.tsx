import {
  siOmarchy,
  siCursor,
  siLinear,
  siNextdotjs,
  siNestjs,
  siPostgresql,
  siDocker,
  siTypescript,
} from "simple-icons";

const stack = [
  siOmarchy,
  siCursor,
  siLinear,
  siNextdotjs,
  siNestjs,
  siPostgresql,
  siDocker,
  siTypescript,
];

function BrandIcon({ path, title }: { path: string; title: string }) {
  return (
    <svg
      role="img"
      aria-label={title}
      viewBox="0 0 24 24"
      className="h-8 w-8 fill-paper/80 md:h-10 md:w-10"
    >
      <path d={path} />
    </svg>
  );
}

export function StackMarquee() {
  return (
    <section id="stack" className="hairline-t overflow-hidden py-28 md:py-40">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10">
        <h2 className="max-w-2xl text-3xl font-medium tracking-tight md:text-5xl">
          Stack y herramientas
        </h2>
      </div>

      <div className="relative mt-16 md:mt-24">
        <div className="marquee-track flex w-max items-center">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex items-center"
            >
              {stack.map((icon) => (
                <div
                  key={`${copy}-${icon.slug}`}
                  className="flex items-center gap-4 border-l border-hairline px-10 py-6 md:px-14"
                >
                  <BrandIcon path={icon.path} title={icon.title} />
                  <span className="whitespace-nowrap text-lg text-paper/80 md:text-xl">
                    {icon.title}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
