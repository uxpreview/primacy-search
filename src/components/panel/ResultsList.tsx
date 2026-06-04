import type { SearchResponse, TabKey } from "@/data/types";
import { ResultCard } from "./ResultCard";
import { PopularChips } from "@/components/search/PopularChips";

export function ResultsList({
  response,
  activeTab,
  onAsk,
}: {
  response: SearchResponse;
  activeTab: TabKey;
  onAsk: (q: string) => void;
}) {
  const filtered =
    activeTab === "all"
      ? response.results
      : response.results.filter((r) => r.item.type === activeTab);

  if (response.total === 0) {
    return (
      <div className="py-10">
        <h3 className="font-display text-2xl font-bold text-fg">No direct matches found</h3>
        <p className="mt-2 max-w-md text-muted">
          Try broadening your search
          {response.didYouMean && (
            <>
              {" "}— did you mean{" "}
              <button
                type="button"
                onClick={() => onAsk(response.didYouMean!)}
                className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
              >
                {response.didYouMean}
              </button>
              ?
            </>
          )}{" "}
          Or explore a few starting points:
        </p>
        <PopularChips className="mt-5" />
      </div>
    );
  }

  return (
    <div>
      {response.didYouMean && (
        <p className="mb-2 text-[13.5px] text-muted">
          Did you mean{" "}
          <button
            type="button"
            onClick={() => onAsk(response.didYouMean!)}
            className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
          >
            {response.didYouMean}
          </button>
          ?
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="py-10 text-muted">
          No results in this category for “{response.query}”.
        </p>
      ) : (
        <ul>
          {filtered.map((r) => (
            <li key={r.item.id}>
              <ResultCard result={r} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
