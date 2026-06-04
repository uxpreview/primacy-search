import { useSearch } from "@/state/SearchProvider";
import { GooLoader } from "./GooLoader";

const STATS = [
  { n: "300", l: "Industry\nAwards" },
  { n: "200", l: "Digital\nProducts" },
  { n: "100", l: "Ventures\nFunded" },
];
const HEADLINE = ["Smart", "Experiences", "Meaningful", "Moments"];
const TAGLINE = "The digital marketing agency that does everything.";

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 7h10v10M7 17 17 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stats({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-start gap-6 sm:gap-9 ${className}`}>
      {STATS.map((s, i) => (
        <div key={s.l} className="animate-fade-up text-left" style={{ animationDelay: `${0.24 + i * 0.12}s` }}>
          <p className="font-display text-[clamp(1.9rem,5vw,3.4rem)] font-semibold leading-none tracking-[-0.03em] text-fg">
            <span className="align-top text-[0.5em] font-semibold text-accent">+</span>
            {s.n}
          </p>
          <p className="mt-2 whitespace-pre-line text-[10px] font-bold uppercase leading-[1.35] tracking-[0.16em] text-fg/70">
            {s.l}
          </p>
        </div>
      ))}
    </div>
  );
}

function WorkWithUs({ className = "" }: { className?: string }) {
  const { setView } = useSearch();
  return (
    <button
      type="button"
      onClick={() => setView("contact")}
      className={`group inline-flex animate-fade-up items-center gap-1.5 font-display text-[clamp(1.2rem,2vw,1.9rem)] font-bold tracking-[-0.02em] text-accent transition-colors hover:text-accent-ink ${className}`}
      style={{ animationDelay: "0.72s" }}
    >
      Work With Us
      <ArrowUpRight className="h-[0.8em] w-[0.8em] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  );
}

function Headline({ align }: { align: "right" | "center" }) {
  return (
    <h1
      className={`font-display text-[clamp(2.4rem,7vw,5.8rem)] font-bold uppercase leading-[0.9] tracking-[-0.035em] text-fg ${
        align === "center" ? "text-center" : "text-right"
      }`}
    >
      {HEADLINE.map((word, i) => (
        <span key={word} className="block animate-fade-up" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
          {word}
        </span>
      ))}
    </h1>
  );
}

export function HeroGoo() {
  const { heroRef, ghostRef } = useSearch();

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative min-h-[100svh] w-full overflow-hidden px-[var(--gutter)]"
    >
      {/* ---------- Desktop ---------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[var(--gutter)] top-[16vh] z-0 hidden h-[52vh] w-[min(50vw,640px)] lg:block"
      >
        <GooLoader className="h-full w-full" />
      </div>

      <div className="relative z-10 mx-auto hidden min-h-[100svh] max-w-[1440px] flex-col pt-[clamp(92px,12vh,140px)] lg:flex">
        <div className="flex flex-1 items-center justify-end">
          <Stats />
        </div>
        <div className="flex flex-col gap-[clamp(20px,4vh,52px)] pb-[clamp(150px,20vh,230px)]">
          <div className="flex items-center justify-end">
            <WorkWithUs />
          </div>
          <div className="flex items-end justify-between gap-4">
            <p
              className="w-[clamp(130px,22vw,300px)] shrink-0 animate-fade-up font-display text-[clamp(0.62rem,1vw,0.85rem)] font-bold uppercase leading-[1.4] tracking-[0.14em] text-fg/75"
              style={{ animationDelay: "0.84s" }}
            >
              {TAGLINE}
            </p>
            <Headline align="right" />
          </div>
        </div>
      </div>

      {/* ---------- Mobile / tablet: stacked ---------- */}
      <div className="flex min-h-[100svh] flex-col items-center justify-center gap-7 pb-[150px] pt-[104px] text-center lg:hidden">
        <div className="aspect-square w-[clamp(150px,42vw,220px)] animate-fade-up" style={{ animationDelay: "0.04s" }}>
          <GooLoader className="h-full w-full" />
        </div>
        <Stats className="justify-center" />
        <Headline align="center" />
        <WorkWithUs />
        <p
          className="mx-auto max-w-[24ch] animate-fade-up font-display text-[clamp(0.62rem,2.6vw,0.78rem)] font-bold uppercase leading-[1.5] tracking-[0.14em] text-fg/75"
          style={{ animationDelay: "0.84s" }}
        >
          {TAGLINE}
        </p>
      </div>

      {/* Search ghost — shared SearchDock anchors here, bottom-center */}
      <div
        ref={ghostRef}
        aria-hidden="true"
        className="absolute bottom-[clamp(24px,5vh,40px)] left-1/2 -translate-x-1/2"
        style={{ width: "min(92vw, 760px)", height: 60, opacity: 0 }}
      />
    </section>
  );
}
