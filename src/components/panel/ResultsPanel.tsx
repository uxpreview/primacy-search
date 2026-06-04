import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSearch } from "@/state/SearchProvider";
import { useBodyScrollLock } from "@/lib/motion/useBodyScrollLock";
import { Scrim } from "./Scrim";
import { ResultTabs } from "./ResultTabs";
import { ResultsList } from "./ResultsList";
import { AnswerCard } from "./AnswerCard";
import { DotMatrix } from "@/components/ui/DotMatrix";

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="h-24 w-24">
        <DotMatrix variant="loading" className="h-full w-full" />
      </div>
      <div className="mt-10 w-full max-w-[640px] space-y-3" aria-hidden="true">
        {[0.9, 0.7, 0.8].map((w, i) => (
          <div
            key={i}
            className="h-3.5 animate-pulse rounded-full bg-hairline"
            style={{ width: `${w * 100}%`, animationDelay: `${i * 0.12}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ResultsPanel() {
  const {
    phase,
    results,
    loading,
    submittedQuery,
    activeTab,
    reducedMotion,
    setTab,
    minimize,
    close,
    submit,
    setQuery,
  } = useSearch();

  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<number | null>(null);

  const open = phase === "open";
  const mounted = phase !== "idle" && (results !== null || loading);

  useBodyScrollLock(open);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [submittedQuery, activeTab, loading]);

  const ask = (q: string) => {
    setQuery(q);
    submit(q);
  };

  const sheetTransition = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 38 };

  return (
    <>
      <AnimatePresence>{open && <Scrim onClick={minimize} />}</AnimatePresence>

      <div aria-live="polite" className="sr-only">
        {open && !loading && results
          ? `${results.total} ${results.total === 1 ? "result" : "results"} for ${submittedQuery}`
          : ""}
      </div>

      <AnimatePresence>
        {mounted && (
          <motion.section
            role="dialog"
            aria-modal={open}
            aria-label={`Search results for ${submittedQuery}`}
            initial={{ y: "130%" }}
            animate={{ y: phase === "collapsed" ? "130%" : 0 }}
            exit={{ y: "130%" }}
            transition={sheetTransition}
            onKeyDown={(e) => {
              if (e.key === "Escape") minimize();
            }}
            className="fixed inset-x-0 bottom-0 z-[80] mx-auto flex h-[100svh] w-full flex-col overflow-hidden rounded-t-2xl border border-hairline bg-surface shadow-sheet sm:bottom-[94px] sm:h-[min(86svh,920px)] sm:w-[min(96vw,1080px)] sm:rounded-[28px]"
          >
            <header className="shrink-0 border-b border-hairline bg-surface px-5 pt-2 sm:px-8">
              <div
                className="mx-auto mb-1 h-1 w-10 cursor-grab touch-none rounded-full bg-hairline sm:hidden"
                onPointerDown={(e) => {
                  dragStart.current = e.clientY;
                  (e.target as HTMLElement).setPointerCapture(e.pointerId);
                }}
                onPointerMove={(e) => {
                  if (dragStart.current !== null && e.clientY - dragStart.current > 64) {
                    dragStart.current = null;
                    minimize();
                  }
                }}
                onPointerUp={() => (dragStart.current = null)}
                aria-hidden="true"
              />
              <div className="flex items-start justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="label !text-faint">Asking Primacy</p>
                  <h2 className="truncate font-display text-2xl font-bold tracking-[-0.02em] text-fg sm:text-[1.75rem]">
                    {submittedQuery}
                  </h2>
                </div>
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    ref={closeRef}
                    type="button"
                    aria-label="Minimize results"
                    onClick={minimize}
                    className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-fg/70 transition-colors hover:bg-bg hover:text-fg"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label="Close results"
                    onClick={close}
                    className="grid h-9 w-9 place-items-center rounded-full border border-hairline text-fg/70 transition-colors hover:bg-bg hover:text-fg"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
              {results && !loading && (
                <div className="pb-3">
                  <ResultTabs response={results} activeTab={activeTab} onChange={setTab} />
                </div>
              )}
            </header>

            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain px-5 py-7 sm:px-8">
              <div className="mx-auto max-w-[800px]">
                {loading || !results ? (
                  <Loader />
                ) : (
                  <>
                    {activeTab === "all" && results.answer && (
                      <AnswerCard
                        answer={results.answer}
                        related={results.related}
                        onSource={ask}
                      />
                    )}
                    <div className="mt-9">
                      <p className="label mb-1">
                        {activeTab === "all" ? "Results" : null}
                      </p>
                      <ResultsList response={results} activeTab={activeTab} onAsk={ask} />
                    </div>
                  </>
                )}
              </div>
              <div className="h-10" />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </>
  );
}
