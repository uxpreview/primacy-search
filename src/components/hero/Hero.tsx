import { motion, useScroll, useTransform } from "framer-motion";
import { useSearch } from "@/state/SearchProvider";
import { AgentChips } from "@/components/search/AgentChips";
import { DotMatrix } from "@/components/ui/DotMatrix";

export function Hero() {
  const { heroRef, ghostRef } = useSearch();
  const { scrollY } = useScroll();
  const pillsOpacity = useTransform(scrollY, [0, 150], [1, 0]);
  const pillsPointer = useTransform(scrollY, (v) => (v > 130 ? "none" : "auto"));

  return (
    <section
      id="top"
      ref={heroRef}
      className="relative flex min-h-[100svh] flex-col items-center justify-center px-[var(--gutter)] pb-16 pt-[88px] text-center"
    >
      <div className="relative w-full max-w-[900px]">
        {/* Dot-matrix mark: dots assemble into a page, chart, chat, the Primacy P */}
        <div
          className="mx-auto mb-7 h-[88px] w-[88px] animate-fade-up"
          style={{ animationDelay: "0.04s" }}
        >
          <DotMatrix className="h-full w-full" />
        </div>

        <h1
          className="mx-auto max-w-[18ch] animate-fade-up font-display text-[clamp(2.4rem,6.6vw,4.6rem)] font-semibold leading-[1.04] tracking-[-0.03em] text-fg"
          style={{ animationDelay: "0.1s" }}
        >
          Smarter experiences for{" "}
          <span className="text-accent">meaningful moments</span>
        </h1>

        {/* Search ghost — the fixed SearchDock measures + anchors here.
            Not animated: a transformed wrapper would yield a stale measured rect. */}
        <div className="mx-auto mt-10">
          <div
            ref={ghostRef}
            aria-hidden="true"
            className="mx-auto"
            style={{ width: "min(88vw, 680px)", height: 66, opacity: 0 }}
          />
        </div>

        <motion.div
          initial={{ y: 8 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          style={{ opacity: pillsOpacity, pointerEvents: pillsPointer }}
          className="mt-7"
        >
          <AgentChips limit={4} />
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: pillsOpacity }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 items-center gap-3 sm:flex"
      >
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-faint">
          Scroll to explore
        </span>
        <span className="h-8 w-px bg-gradient-to-b from-faint to-transparent" />
      </motion.div>
    </section>
  );
}
