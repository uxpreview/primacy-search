import { useEffect, useId, useMemo, useRef, useState, useDeferredValue } from "react";
import { AnimatePresence, motion, useMotionValueEvent } from "framer-motion";
import { useSearch } from "@/state/SearchProvider";
import { useScrollDock } from "@/lib/motion/useScrollDock";
import { suggest, type Suggestion } from "@/lib/search";
import { searchSuggestions } from "@/data/searchSuggestions";
import { menuAgents } from "@/data/agents";
import { AGENT_ICONS } from "@/components/ui/icons";
import { AutocompleteDropdown } from "./AutocompleteDropdown";

function PlusIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="9" y="2.5" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="1.7" />
      <path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function AgentMenu() {
  const { setQuery, submit } = useSearch();
  const [open, setOpen] = useState(false);

  const run = (q: string) => {
    setQuery(q);
    submit(q);
    setOpen(false);
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={open ? "Close tools menu" : "Tools and agents"}
        onClick={() => setOpen((o) => !o)}
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition-colors ${
          open
            ? "border-fg text-fg"
            : "border-transparent text-fg/55 hover:bg-bg hover:text-fg"
        }`}
      >
        {open ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <PlusIcon />
        )}
      </button>
      {open && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div
            role="menu"
            className="absolute bottom-full left-0 z-20 mb-3 w-[272px] rounded-2xl border border-hairline bg-surface p-2 shadow-dock"
          >
            {menuAgents.map((a) => {
              const Icon = AGENT_ICONS[a.icon];
              return (
                <button
                  key={a.id}
                  type="button"
                  role="menuitem"
                  onClick={() => run(a.query)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[14px] font-medium text-fg/85 transition-colors hover:bg-bg"
                >
                  <span className="grid h-6 w-6 shrink-0 place-items-center text-fg/70">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  {a.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

const SCOPES = ["All", "Work", "Services", "Ideas", "People"] as const;

function ScopeSelector() {
  const [open, setOpen] = useState(false);
  const [scope, setScope] = useState<(typeof SCOPES)[number]>("All");
  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={`Search scope: ${scope}`}
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[13px] font-medium text-fg/60 transition-colors hover:bg-bg hover:text-fg"
      >
        {scope}
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="opacity-70">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <>
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <ul
            role="listbox"
            className="absolute bottom-full right-0 z-20 mb-2 min-w-[156px] rounded-2xl border border-hairline bg-surface p-1.5 shadow-dock"
          >
            {SCOPES.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  role="option"
                  aria-selected={scope === s}
                  onClick={() => {
                    setScope(s);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between gap-4 rounded-xl px-3 py-2 text-left text-[13px] font-medium text-fg/80 transition-colors hover:bg-bg"
                >
                  {s}
                  {scope === s && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="text-accent">
                      <path d="M5 12l5 5 9-9" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export function SearchDock() {
  const {
    query,
    phase,
    view,
    results,
    heroRef,
    ghostRef,
    reducedMotion,
    setQuery,
    submit,
    clear,
    expand,
  } = useSearch();

  const forced = phase !== "idle" || view !== "ask";
  const dock = useScrollDock(heroRef, ghostRef, forced, reducedMotion);

  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [openUp, setOpenUp] = useState(false);
  const [lowProgress, setLowProgress] = useState(true);
  const [phIndex, setPhIndex] = useState(0);
  const listboxId = useId();

  // Composer affordances (+, scope, mic) show in the hero and collapse when docked.
  const expanded = !forced && lowProgress;

  useMotionValueEvent(dock.progress, "change", (p) => {
    setOpenUp(p > 0.5);
    setLowProgress(p < 0.32);
  });

  // Rotate placeholder suggestions while the field is idle.
  useEffect(() => {
    if (reducedMotion || focused || query) return;
    const id = window.setInterval(
      () => setPhIndex((p) => (p + 1) % searchSuggestions.length),
      2800
    );
    return () => window.clearInterval(id);
  }, [reducedMotion, focused, query]);

  const deferredQuery = useDeferredValue(query);
  const suggestions = useMemo<Suggestion[]>(
    () => (deferredQuery.trim().length > 0 ? suggest(deferredQuery) : []),
    [deferredQuery]
  );

  const showSuggestions =
    focused && phase === "idle" && suggestions.length > 0 && query.trim().length > 0;

  useEffect(() => {
    if (!showSuggestions) setActiveIndex(-1);
  }, [showSuggestions]);

  // Global "/" to focus search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.metaKey || e.ctrlKey) return;
      const el = document.activeElement;
      const typing =
        el instanceof HTMLInputElement ||
        el instanceof HTMLTextAreaElement ||
        (el as HTMLElement)?.isContentEditable;
      if (typing) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const select = (s: Suggestion) => {
    setQuery(s.label);
    submit(s.label);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      setActiveIndex((i) => {
        const n = suggestions.length;
        if (e.key === "ArrowDown") return i + 1 >= n ? 0 : i + 1;
        return i - 1 < 0 ? n - 1 : i - 1;
      });
      return;
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (showSuggestions && activeIndex >= 0) select(suggestions[activeIndex]);
      else if (query.trim()) submit(query);
      return;
    }
    if (e.key === "Escape") {
      if (showSuggestions) {
        setActiveIndex(-1);
        inputRef.current?.blur();
      } else if (query) {
        clear();
      }
    }
  };

  const collapsed = phase === "collapsed";
  const count = results?.total ?? 0;

  return (
    <motion.div
      className="fixed left-0 top-0"
      style={{
        x: dock.x,
        y: dock.y,
        width: dock.width,
        height: dock.height,
        zIndex: "var(--z-dock)" as unknown as number,
      }}
    >
      <motion.div
        className="relative h-full"
        style={{ fontSize: dock.fontSize, borderRadius: dock.radius }}
      >
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim()) submit(query);
          }}
          onMouseDown={() => collapsed && expand()}
          className="flex h-full items-center gap-2.5 border border-hairline bg-surface pl-2.5 pr-2 shadow-dock"
          style={{ borderRadius: "inherit" }}
        >
          {expanded ? (
            <AgentMenu />
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              className="ml-1.5 shrink-0 text-faint"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
              <path d="m20 20-3.2-3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          )}

          <input
            ref={inputRef}
            type="text"
            value={query}
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls={listboxId}
            aria-activedescendant={
              activeIndex >= 0 ? `${listboxId}-opt-${activeIndex}` : undefined
            }
            aria-autocomplete="list"
            aria-label="Search Primacy's work, services, industries, people, and ideas"
            placeholder={`${searchSuggestions[phIndex]}…`}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={onKeyDown}
            className="h-full flex-1 bg-transparent leading-none text-fg outline-none placeholder:text-faint"
            style={{ fontSize: "inherit" }}
          />

          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => {
                clear();
                inputRef.current?.focus();
              }}
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-faint transition-colors hover:bg-bg hover:text-fg"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}

          <AnimatePresence initial={false}>
            {expanded && (
              <motion.div
                key="composer-extras"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="flex shrink-0 items-center gap-0.5"
              >
                <ScopeSelector />
                <button
                  type="button"
                  aria-label="Voice search"
                  onClick={() => inputRef.current?.focus()}
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-fg/50 transition-colors hover:bg-bg hover:text-fg"
                >
                  <MicIcon />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {collapsed && count > 0 ? (
            <span className="mr-1 flex shrink-0 items-center gap-1.5 rounded-full bg-bg px-3 py-1.5 font-mono text-[11px] font-medium text-fg/70">
              {count} results
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M6 15l6-6 6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          ) : (
            <button
              type="submit"
              aria-label="Search"
              className="grid aspect-square h-[calc(100%-10px)] min-h-9 shrink-0 place-items-center rounded-full bg-accent text-white transition-colors hover:bg-accent-ink disabled:opacity-40"
              disabled={!query.trim()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </form>

        <AnimatePresence>
          {showSuggestions && (
            <AutocompleteDropdown
              listboxId={listboxId}
              suggestions={suggestions}
              activeIndex={activeIndex}
              openUp={openUp}
              onSelect={select}
              onHover={setActiveIndex}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
