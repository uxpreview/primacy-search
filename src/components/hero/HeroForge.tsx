import { useCallback, useRef } from "react";
import { useSearch } from "@/state/SearchProvider";
import { ForgeField } from "./ForgeField";

const HEADLINE = ["Smart experiences", "for meaningful", "moments"];
const TAGLINE = "The digital experience agency that does everything.";

function ArrowUpRight({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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

function Headline() {
  return (
    <h1 className="text-center font-display text-[clamp(2.3rem,min(5.9vw,10vh),5.6rem)] font-bold uppercase leading-[0.86] tracking-[-0.04em] text-fg lg:text-left">
      {HEADLINE.map((line, i) => (
        <span key={line} className="block whitespace-normal animate-fade-up lg:whitespace-nowrap" style={{ animationDelay: `${0.12 + i * 0.08}s` }}>
          {line}
        </span>
      ))}
    </h1>
  );
}

export function HeroForge() {
  const { heroRef, ghostRef } = useSearch();
  const deskClusterRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const mobileTextRef = useRef<HTMLDivElement>(null);

  // Hand the field the live boxes of the hero text so it keeps the green trail
  // from painting behind them — text stays legible no matter how much you draw.
  const getProtectRects = useCallback(() => {
    const els = [deskClusterRef.current, taglineRef.current, mobileTextRef.current];
    const rects: DOMRect[] = [];
    for (const el of els) {
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (r.width > 0 && r.height > 0) rects.push(r);
    }
    return rects;
  }, []);

  const SEARCH_BASE = "clamp(26px, 7vh, 84px)";
  const COL_BOTTOM = `calc(${SEARCH_BASE} + 104px)`;
  const EYEBROW_BOTTOM = `calc(${SEARCH_BASE} + 72px)`;

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative min-h-[100svh] w-full overflow-hidden px-[var(--gutter)]"
    >
      {/* Full-bleed reactive dot field (empty squares + cursor hover); the
          object animation lives in its right-side region. */}
      <ForgeField className="z-0" getProtectRects={getProtectRects} />

      {/* ---------- Desktop: headline left; the forge field carries the right ---------- */}
      <div className="relative z-10 mx-auto hidden h-[100svh] max-w-[1440px] lg:block">
        <div ref={deskClusterRef} className="absolute left-0 top-1/2 flex max-w-[56%] -translate-y-1/2 flex-col items-start gap-[clamp(10px,1.6vh,22px)]">
          <div className="animate-fade-up" style={{ animationDelay: "0.34s" }}>
            <WorkWithUs />
          </div>
          <Headline />
        </div>

        <div className="absolute right-0 z-10 animate-fade-up" style={{ bottom: COL_BOTTOM, animationDelay: "0.42s" }}>
          <p ref={taglineRef} className="ml-auto max-w-[24ch] text-right font-display text-[clamp(0.7rem,0.95vw,0.85rem)] font-bold uppercase leading-[1.55] tracking-[0.16em] text-fg/65">
            {TAGLINE}
          </p>
        </div>
      </div>

      {/* ---------- Mobile / tablet ---------- */}
      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-end pb-[164px] pt-[150px] text-center lg:hidden">
        <div ref={mobileTextRef} className="flex flex-col items-center gap-7">
          <Headline />
          <WorkWithUs />
        </div>
      </div>

      {/* Search eyebrow */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 z-10 hidden -translate-x-1/2 font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-faint lg:block"
        style={{ bottom: EYEBROW_BOTTOM }}
      >
        See what's possible
      </span>

      {/* Search ghost — bottom-center, shared SearchDock anchors here */}
      <div
        ref={ghostRef}
        aria-hidden="true"
        className="absolute bottom-[clamp(26px,7vh,84px)] left-1/2 z-10 -translate-x-1/2"
        style={{ width: "min(90vw, 620px)", height: 64, opacity: 0 }}
      />
    </section>
  );
}
