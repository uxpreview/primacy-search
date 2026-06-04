import { popularSearches } from "@/data/popularSearches";
import { useSearch } from "@/state/SearchProvider";

export function PopularChips({ className = "" }: { className?: string }) {
  const { submit, setQuery } = useSearch();
  return (
    <ul className={`flex flex-wrap items-center gap-2 ${className}`}>
      <li className="label mr-1 hidden sm:block">Try</li>
      {popularSearches.map((term) => (
        <li key={term}>
          <button
            type="button"
            onClick={() => {
              setQuery(term);
              submit(term);
            }}
            className="rounded-full border border-hairline bg-surface/70 px-3.5 py-1.5 text-[13px] text-fg/80 backdrop-blur transition-all hover:border-accent hover:text-accent"
          >
            {term}
          </button>
        </li>
      ))}
    </ul>
  );
}
