import type { ScoredResult } from "@/data/types";
import { TYPE_LABEL } from "@/data/types";
import { Highlight } from "@/components/ui/Highlight";
import { Cover } from "@/components/ui/Cover";
import { formatDate } from "@/lib/util";

function context(item: ScoredResult["item"]): string {
  switch (item.type) {
    case "work":
      return `In ${item.industry} · ${item.disciplines.join(", ")}`;
    case "service":
      return `Service · ${item.category}`;
    case "industry":
      return item.sectors.join(" · ");
    case "person":
      return `${item.role}${item.location ? ` · ${item.location}` : ""}`;
    case "idea":
      return `${item.format} · ${formatDate(item.date)}`;
  }
}

function initials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
}

export function ResultCard({ result }: { result: ScoredResult }) {
  const { item, spans } = result;
  const titleSpans = spans.filter((s) => s.field === "title");
  const excerptSpans = spans.filter((s) => s.field === "excerpt");
  const showThumb = item.type === "work" || item.type === "idea";
  const isPerson = item.type === "person";

  return (
    <a
      href={item.href}
      className="group flex items-start gap-5 border-b border-hairline py-6 transition-colors hover:bg-surface/70"
    >
      {isPerson && (
        <div className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full">
          <Cover id={item.id} photo={false} className="absolute inset-0 h-12 w-12 rounded-full" />
          <span className="relative font-mono text-xs font-semibold text-white">
            {initials(item.title)}
          </span>
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="label !text-[10px] !text-accent">{TYPE_LABEL[item.type]}</span>
          <span className="truncate text-[12px] text-faint">{context(item)}</span>
        </div>

        <h3 className="mt-1.5 font-display text-[1.3rem] font-semibold leading-snug tracking-[-0.015em] text-fg transition-colors group-hover:text-accent">
          <Highlight text={item.title} spans={titleSpans} />
        </h3>

        <p className="mt-1.5 line-clamp-2 max-w-2xl text-[14.5px] leading-relaxed text-muted">
          <Highlight text={item.excerpt} spans={excerptSpans} />
        </p>

        {item.type === "work" && item.metric && (
          <p className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent">
            <span className="h-1 w-1 rounded-full bg-accent" />
            {item.metric}
          </p>
        )}
      </div>

      {showThumb ? (
        <Cover
          id={item.id}
          aspect="1 / 1"
          className="hidden h-[88px] w-[88px] shrink-0 rounded-lg sm:block"
        />
      ) : (
        !isPerson && (
          <span className="mt-2 hidden shrink-0 text-faint transition-all group-hover:translate-x-1 group-hover:text-accent sm:block">
            →
          </span>
        )
      )}
    </a>
  );
}
