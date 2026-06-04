import { useEffect, useState } from "react";
import { navTabs } from "@/data/nav";
import { useSearch } from "@/state/SearchProvider";
import type { HeroVariant } from "@/lib/heroVariant";

const sections = navTabs.filter((t) => t.view !== "ask");

export function TopNav({ variant = "v1" }: { variant?: HeroVariant }) {
  const { view, setView } = useSearch();
  const [condensed, setCondensed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const editorial = variant === "v4" || variant === "v6";

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0"
      style={{ zIndex: "var(--z-nav)" as unknown as number }}
    >
      <div
        className={`relative flex items-center justify-between px-[var(--gutter)] transition-all duration-300 ${
          condensed
            ? "h-[64px] border-b border-hairline bg-bg/85 backdrop-blur-md"
            : "h-[76px] border-b border-transparent bg-transparent"
        }`}
      >
        <button
          type="button"
          onClick={() => setView("ask")}
          className="group flex items-center gap-2.5"
          aria-label="Primacy — home"
        >
          <img src={`${import.meta.env.BASE_URL}primacy.svg`} alt="" width="28" height="28" className="h-7 w-7 rounded-[7px]" />
          <span className="font-display text-[21px] font-semibold leading-none tracking-[-0.02em] text-fg">
            Primacy
          </span>
        </button>

        <nav
          aria-label="Sections"
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 lg:flex"
        >
          {sections.map((t) => {
            const active = view === t.view;
            return (
              <button
                key={t.label}
                type="button"
                aria-current={active ? "page" : undefined}
                onClick={() => setView(t.view)}
                className={`relative font-medium transition-colors after:absolute after:-bottom-1.5 after:left-0 after:h-[2px] after:bg-accent after:transition-all ${
                  editorial
                    ? "text-[13px] uppercase tracking-[0.12em]"
                    : "text-[14px]"
                } ${
                  active
                    ? "text-fg after:w-full"
                    : "text-fg/55 hover:text-fg after:w-0 hover:after:w-full"
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {!editorial && (
            <a
              href="#signin"
              className="hidden text-[14px] font-medium text-fg/70 transition-colors hover:text-fg sm:inline"
            >
              Sign In
            </a>
          )}
          <button
            type="button"
            onClick={() => setView("contact")}
            className={`hidden rounded-full bg-fg px-4 py-2 font-semibold text-bg transition-colors hover:bg-accent sm:inline-block ${
              editorial ? "text-[13px] uppercase tracking-[0.08em]" : "text-[14px]"
            }`}
          >
            Get Started
          </button>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center lg:hidden"
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 block h-[1.5px] w-5 bg-fg transition-all ${menuOpen ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 block h-[1.5px] w-5 bg-fg transition-all ${menuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 block h-[1.5px] w-5 bg-fg transition-all ${menuOpen ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-b border-hairline bg-bg/95 px-[var(--gutter)] py-4 backdrop-blur-md lg:hidden">
          <nav className="flex flex-col gap-1">
            {sections.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={() => {
                  setView(t.view);
                  setMenuOpen(false);
                }}
                className={`border-b border-hairline/60 py-3 text-left font-display text-xl font-semibold ${
                  view === t.view ? "text-accent" : "text-fg"
                }`}
              >
                {t.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setView("contact");
                setMenuOpen(false);
              }}
              className="mt-3 inline-block w-fit rounded-full bg-fg px-5 py-2.5 text-sm font-semibold text-bg"
            >
              Get Started
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
