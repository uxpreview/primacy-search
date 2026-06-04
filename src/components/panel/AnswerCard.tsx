import type { SearchResponse } from "@/data/types";
import { TYPE_LABEL } from "@/data/types";
import { IconSpark } from "@/components/ui/icons";

export function AnswerCard({
  answer,
  related,
  onSource,
}: {
  answer: NonNullable<SearchResponse["answer"]>;
  related: SearchResponse["related"];
  onSource: (q: string) => void;
}) {
  return (
    <div className="rounded-3xl border border-hairline bg-bg p-6 sm:p-7">
      <div className="flex items-center gap-2.5">
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent/12 text-accent">
          <IconSpark className="h-4 w-4" />
        </span>
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-fg/70">
          Primacy AI
        </span>
        <span className="hidden text-[12px] text-faint sm:inline">
          · synthesized from Primacy content
        </span>
      </div>

      <p className="mt-5 text-[18px] leading-[1.6] text-fg sm:text-[19px]">
        {answer.text}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <span className="label mr-1 !text-faint">Sources</span>
        {answer.sources.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSource(s.title.replace(/—.*$/, "").trim())}
            className="group inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-3 py-1.5 text-[12px] text-fg/80 transition-colors hover:border-accent hover:text-accent"
          >
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-faint group-hover:text-accent">
              {TYPE_LABEL[s.type]}
            </span>
            <span className="max-w-[200px] truncate">
              {s.title.replace(/—.*$/, "").trim()}
            </span>
          </button>
        ))}
      </div>

      {related.topics.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-hairline pt-4">
          <span className="label mr-1 !text-faint">Explore</span>
          {related.topics.slice(0, 5).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onSource(t)}
              className="rounded-full bg-surface px-3 py-1.5 text-[12.5px] capitalize text-fg/75 transition-colors hover:text-accent"
            >
              {t}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
