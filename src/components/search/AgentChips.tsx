import { agents } from "@/data/agents";
import { AGENT_ICONS } from "@/components/ui/icons";
import { useSearch } from "@/state/SearchProvider";

export function AgentChips({
  className = "",
  limit,
}: {
  className?: string;
  limit?: number;
}) {
  const { submit, setQuery } = useSearch();
  const list = limit ? agents.slice(0, limit) : agents;
  return (
    <ul className={`flex flex-wrap items-center justify-center gap-2.5 ${className}`}>
      {list.map((a) => {
        const Icon = AGENT_ICONS[a.icon];
        return (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => {
                setQuery(a.query);
                submit(a.query);
              }}
              className="group inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/80 py-2 pl-3 pr-4 text-[13px] font-medium text-fg/80 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-fg hover:text-fg"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full bg-bg text-accent transition-colors group-hover:bg-accent group-hover:text-white">
                <Icon className="h-3.5 w-3.5" />
              </span>
              {a.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
