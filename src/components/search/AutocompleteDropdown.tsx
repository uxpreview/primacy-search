import { motion } from "framer-motion";
import type { Suggestion } from "@/lib/search";
import { TYPE_LABEL } from "@/data/types";

interface Props {
  listboxId: string;
  suggestions: Suggestion[];
  activeIndex: number;
  openUp: boolean;
  onSelect: (s: Suggestion) => void;
  onHover: (i: number) => void;
}

export function AutocompleteDropdown({
  listboxId,
  suggestions,
  activeIndex,
  openUp,
  onSelect,
  onHover,
}: Props) {
  if (suggestions.length === 0) return null;
  return (
    <motion.ul
      id={listboxId}
      role="listbox"
      initial={{ opacity: 0, y: openUp ? 6 : -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: openUp ? 6 : -6 }}
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-x-0 overflow-hidden rounded-2xl border border-hairline bg-surface p-1.5 shadow-dock"
      style={{
        [openUp ? "bottom" : "top"]: "calc(100% + 10px)",
      }}
    >
      {suggestions.map((s, i) => (
        <li key={s.id} role="presentation">
          <button
            type="button"
            id={`${listboxId}-opt-${i}`}
            role="option"
            aria-selected={i === activeIndex}
            onMouseEnter={() => onHover(i)}
            onMouseDown={(e) => {
              e.preventDefault();
              onSelect(s);
            }}
            className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
              i === activeIndex ? "bg-bg" : "bg-transparent"
            }`}
          >
            <span className="flex items-center gap-2.5 truncate">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-faint">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <span className="truncate text-[14px] text-fg">{s.label}</span>
            </span>
            <span className="label shrink-0 !text-[10px] !text-faint">
              {TYPE_LABEL[s.type]}
            </span>
          </button>
        </li>
      ))}
    </motion.ul>
  );
}
