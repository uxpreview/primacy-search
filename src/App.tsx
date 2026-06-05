import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SearchProvider, useSearch } from "@/state/SearchProvider";
import { TopNav } from "@/components/layout/TopNav";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { HeroEditorialAlt } from "@/components/hero/HeroEditorialAlt";
import { HeroAiSearch } from "@/components/hero/HeroAiSearch";
import { HeroGoo } from "@/components/hero/HeroGoo";
import { HeroForge } from "@/components/hero/HeroForge";
import { UniverseScroll } from "@/components/editorial/UniverseScroll";
import { PageView } from "@/components/views/PageView";
import { SearchDock } from "@/components/search/SearchDock";
import { ResultsPanel } from "@/components/panel/ResultsPanel";
import { HeroSwitcher } from "@/components/ui/HeroSwitcher";
import { useHeroVariant } from "@/lib/heroVariant";

function AppShell() {
  const { phase, view } = useSearch();
  const { variant, setVariant } = useHeroVariant();
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = pageRef.current;
    if (el) (el as unknown as { inert: boolean }).inert = phase === "open";
  }, [phase]);

  return (
    <div className="relative min-h-screen">
      <div ref={pageRef} id="page">
        <TopNav variant={variant} />
        <main>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={view}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            >
              {view === "ask" ? (
                <>
                  {variant === "v4" ? (
                    <HeroEditorialAlt />
                  ) : variant === "v5" ? (
                    <HeroAiSearch />
                  ) : variant === "v6" ? (
                    <HeroGoo />
                  ) : variant === "v7" ? (
                    <HeroForge />
                  ) : (
                    <Hero />
                  )}
                  <UniverseScroll />
                </>
              ) : (
                <PageView view={view} />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
        {view === "ask" && <Footer />}
      </div>

      {/* Persistent overlays — always mounted, outside the inert page.
          v5 (AI Search) renders its own search, so the shared dock is suppressed there. */}
      {!(view === "ask" && variant === "v5") && <SearchDock />}
      <ResultsPanel />
      {view === "ask" && phase === "idle" && (
        <HeroSwitcher variant={variant} setVariant={setVariant} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <SearchProvider>
      <AppShell />
    </SearchProvider>
  );
}
