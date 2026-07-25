export function Footer() {
  return (
    <footer id="contacto" className="hairline-t">
      <div className="mx-auto max-w-[1400px] px-5 py-28 md:px-10 md:py-40">
        <h2 className="text-[13vw] font-medium uppercase leading-[0.95] tracking-tighter md:text-[8vw]">
          Hablemos
        </h2>
        {/* TODO: reemplazar por el email real */}
        <a
          href="mailto:martin@example.com"
          className="mt-8 inline-block font-mono text-base text-accent-soft underline underline-offset-8 transition-colors hover:text-paper md:text-xl"
        >
          martin@example.com
        </a>
      </div>

      <div className="hairline-t">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-8 font-mono text-[11px] uppercase tracking-[0.14em] text-muted md:flex-row md:items-center md:justify-between md:px-10">
          <span>Martín Moloeznik</span>
          <span>Software Developer</span>
          <span>2026</span>
        </div>
      </div>
    </footer>
  );
}
