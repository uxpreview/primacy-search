import { useRef } from "react";
import type { ResultType, SearchResponse, TabKey } from "@/data/types";

const PLURAL: Record<ResultType, string> = {
  work: "Work",
  service: "Services",
  industry: "Industries",
  person: "People",
  idea: "Ideas",
};

const ORDER: ResultType[] = ["work", "service", "industry", "person", "idea"];

export function ResultTabs({
  response,
  activeTab,
  onChange,
}: {
  response: SearchResponse;
  activeTab: TabKey;
  onChange: (t: TabKey) => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const tabs: { key: TabKey; label: string; count: number }[] = [
    { key: "all", label: "All", count: response.total },
    ...ORDER.filter((t) => response.countsByType[t] > 0).map((t) => ({
      key: t as TabKey,
      label: PLURAL[t],
      count: response.countsByType[t],
    })),
  ];

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % tabs.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tabs.length - 1;
    else return;
    e.preventDefault();
    onChange(tabs[next].key);
    refs.current[next]?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Filter results by type"
      className="no-scrollbar flex items-center gap-1 overflow-x-auto"
    >
      {tabs.map((t, i) => {
        const active = t.key === activeTab;
        return (
          <button
            key={t.key}
            ref={(el) => (refs.current[i] = el)}
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(t.key)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors ${
              active ? "bg-fg text-bg" : "text-fg/70 hover:bg-bg hover:text-fg"
            }`}
          >
            {t.label}
            <span
              className={`font-mono text-[10px] ${active ? "text-bg/65" : "text-faint"}`}
            >
              {t.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
