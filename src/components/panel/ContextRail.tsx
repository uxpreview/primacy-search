import type { SearchResponse } from "@/data/types";
import { Cover } from "@/components/ui/Cover";

function RailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-hairline pt-5">
      <p className="label mb-3">{title}</p>
      {children}
    </div>
  );
}

export function ContextRail({
  related,
  onAsk,
}: {
  related: SearchResponse["related"];
  onAsk: (q: string) => void;
}) {
  const { topics, people, work } = related;
  if (!topics.length && !people.length && !work.length) return null;

  return (
    <aside className="space-y-6">
      {topics.length > 0 && (
        <RailSection title="Related topics">
          <div className="flex flex-wrap gap-2">
            {topics.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onAsk(t)}
                className="rounded-full border border-hairline bg-surface px-3 py-1.5 text-[12.5px] capitalize text-fg/75 transition-colors hover:border-accent hover:text-accent"
              >
                {t}
              </button>
            ))}
          </div>
        </RailSection>
      )}

      {people.length > 0 && (
        <RailSection title="People at Primacy">
          <ul className="space-y-3">
            {people.map((p) => (
              <li key={p.id}>
                <a href={p.href} className="group flex items-center gap-3">
                  <span className="relative grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-full">
                    <Cover id={p.id} photo={false} className="absolute inset-0 h-9 w-9" />
                    <span className="relative font-mono text-[10px] font-semibold text-white">
                      {p.title.split(" ").slice(0, 2).map((w) => w[0]).join("")}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-medium text-fg group-hover:text-accent">
                      {p.title}
                    </span>
                    <span className="block truncate text-[12px] text-faint">{p.role}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </RailSection>
      )}

      {work.length > 0 && (
        <RailSection title="Relevant work">
          <ul className="space-y-3">
            {work.map((w) => (
              <li key={w.id}>
                <a href={w.href} className="group block">
                  <span className="block text-[13.5px] font-medium leading-snug text-fg group-hover:text-accent">
                    {w.client}
                  </span>
                  {w.metric && (
                    <span className="block text-[12px] text-accent">{w.metric}</span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </RailSection>
      )}
    </aside>
  );
}
