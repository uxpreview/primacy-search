import { useSearch } from "@/state/SearchProvider";
import { DotMatrix } from "@/components/ui/DotMatrix";

const HEADLINE = ["Smart experience", "for meaningful", "moments"];
const TAGLINE = "The digital experience agency that does everything.";

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M7 17 17 7M9 7h8v8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WorkWithUs({ className = "" }: { className?: string }) {
  const { setView } = useSearch();
  return (
    <button
      type="button"
      onClick={() => setView("contact")}
      className={`group inline-flex items-center gap-1.5 font-display text-[clamp(1.2rem,1.9vw,1.7rem)] font-bold tracking-[-0.02em] text-accent transition-colors hover:text-accent-ink ${className}`}
    >
      Work With Us
      <ArrowUpRight className="h-[0.8em] w-[0.8em] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </button>
  );
}

// Inverse of Editorial: headline always left-aligned.
function Headline() {
  return (
    <h1 className="text-left font-display text-[clamp(2.3rem,min(5.9vw,10vh),5.6rem)] font-bold uppercase leading-[0.86] tracking-[-0.04em] text-fg">
      {HEADLINE.map((line, i) => (
        <span
          key={line}
          className="block whitespace-normal animate-fade-up lg:whitespace-nowrap"
          style={{ animationDelay: `${0.12 + i * 0.08}s` }}
        >
          {line}
        </span>
      ))}
    </h1>
  );
}

function Tagline({ className = "" }: { className?: string }) {
  return (
    <p
      className={`max-w-[24ch] font-display text-[clamp(0.7rem,0.95vw,0.85rem)] font-bold uppercase leading-[1.55] tracking-[0.16em] text-fg/65 ${className}`}
    >
      {TAGLINE}
    </p>
  );
}

function Mark({ className = "" }: { className?: string }) {
  return (
    <DotMatrix
      className={className}
      intervalMs={2600}
      offOpacity={0}
      dotRadius={0.38}
      shape="square"
      interactive
      intro
    />
  );
}

export function HeroEditorialAlt() {
  const { heroRef, ghostRef } = useSearch();

  // Shared vertical anchors tied to the docked search position (matches Editorial).
  const SEARCH_BASE = "clamp(26px, 7vh, 84px)";
  const COL_BOTTOM = `calc(${SEARCH_BASE} + 104px)`;
  const EYEBROW_BOTTOM = `calc(${SEARCH_BASE} + 72px)`;

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative min-h-[100svh] w-full overflow-hidden px-[var(--gutter)]"
    >
      {/* Atmosphere — wash behind the mark on the right (mirror of Editorial) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 55% at 76% 46%, color-mix(in srgb, var(--accent) 7%, transparent), transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ---------- Desktop: headline (left) + mark (right) on one centered band ---------- */}
      <div className="relative mx-auto hidden h-[100svh] max-w-[1440px] lg:block">
        <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between gap-[clamp(24px,5vw,72px)]">
          {/* HEADLINE cluster — LEFT, left-aligned */}
          <div className="flex flex-col items-start gap-[clamp(10px,1.6vh,22px)] text-left">
            <div className="animate-fade-up" style={{ animationDelay: "0.34s" }}>
              <WorkWithUs />
            </div>
            <Headline />
          </div>

          {/* MARK — RIGHT, square dots, pointer-reactive */}
          <div
            className="aspect-square w-[clamp(150px,17vw,240px)] shrink-0 animate-fade-up"
            style={{ animationDelay: "0.02s" }}
          >
            <Mark className="h-full w-full" />
          </div>
        </div>

        {/* Tagline — bottom-right */}
        <div
          className="absolute right-0 animate-fade-up"
          style={{ bottom: COL_BOTTOM, animationDelay: "0.42s" }}
        >
          <Tagline className="ml-auto text-right" />
        </div>
      </div>

      {/* ---------- Mobile / tablet: stacked flow ---------- */}
      <div className="flex min-h-[100svh] flex-col items-center justify-center gap-7 pb-[150px] pt-[112px] text-center lg:hidden">
        <div
          className="aspect-square w-[clamp(130px,34vw,180px)] animate-fade-up"
          style={{ animationDelay: "0.04s" }}
        >
          <Mark className="h-full w-full" />
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <Headline />
        </div>

        <div className="animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <WorkWithUs />
        </div>
      </div>

      {/* Search eyebrow */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 hidden -translate-x-1/2 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-faint lg:block"
        style={{ bottom: EYEBROW_BOTTOM }}
      >
        Ask Primacy anything
      </span>

      {/* Search ghost — bottom-center, like Editorial */}
      <div
        ref={ghostRef}
        aria-hidden="true"
        className="absolute bottom-[clamp(26px,7vh,84px)] left-1/2 -translate-x-1/2"
        style={{ width: "min(90vw, 620px)", height: 64, opacity: 0 }}
      />
    </section>
  );
}
