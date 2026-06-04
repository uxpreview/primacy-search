import { navTabs } from "@/data/nav";
import { useSearch } from "@/state/SearchProvider";

export function Footer() {
  const { setView } = useSearch();
  return (
    <footer className="relative border-t border-hairline bg-fg px-[var(--gutter)] pb-32 pt-20 text-bg">
      <div className="mx-auto max-w-[1200px]">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-bg/50">
          Let's build something
        </p>
        <h2 className="mt-4 max-w-3xl font-display text-[clamp(2rem,5vw,3.5rem)] font-semibold leading-[1.02] tracking-[-0.03em]">
          Smarter experiences for{" "}
          <span className="text-accent">meaningful moments.</span>
        </h2>
        <button
          type="button"
          onClick={() => setView("contact")}
          className="mt-8 inline-flex items-center gap-2 text-xl text-bg underline decoration-accent decoration-2 underline-offset-[6px] transition-colors hover:text-accent"
        >
          hello@primacy.com
        </button>

        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-bg/15 pt-10 md:grid-cols-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-bg/45">Sitemap</p>
            <ul className="mt-4 space-y-2">
              {navTabs.map((l) => (
                <li key={l.label}>
                  <button
                    type="button"
                    onClick={() => setView(l.view)}
                    className="text-sm text-bg/70 transition-colors hover:text-bg"
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          {[
            { city: "Boston", line: "60 South Street, MA" },
            { city: "Farmington", line: "200 Day Hill Rd, CT" },
            { city: "Jupiter", line: "1200 Town Center, FL" },
          ].map((o) => (
            <div key={o.city}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-bg/45">{o.city}</p>
              <p className="mt-4 text-sm text-bg/70">{o.line}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 border-t border-bg/15 pt-6 text-xs text-bg/45">
          <span className="font-mono uppercase tracking-[0.14em]">
            © 2026 Primacy · A digital experience agency
          </span>
        </div>
      </div>
    </footer>
  );
}
