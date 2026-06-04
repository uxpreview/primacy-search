import type { HeroVariant } from "@/lib/heroVariant";

const OPTIONS: { value: HeroVariant; label: string }[] = [
  { value: "v6", label: "Organic" },
  { value: "v5", label: "Glass" },
  { value: "v1", label: "Minimal" },
  { value: "v4", label: "Inverse" },
];

export function HeroSwitcher({
  variant,
  setVariant,
}: {
  variant: HeroVariant;
  setVariant: (v: HeroVariant) => void;
}) {
  return (
    <div
      className="fixed bottom-5 left-5 hidden items-center gap-1 rounded-full border border-hairline bg-surface/85 p-1 pl-2.5 shadow-dock backdrop-blur-md sm:flex"
      style={{ zIndex: 65 }}
    >
      <span className="mr-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-faint">
        Hero
      </span>
      {OPTIONS.map((o) => {
        const active = variant === o.value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={active}
            onClick={() => setVariant(o.value)}
            className={`rounded-full px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors ${
              active ? "bg-fg text-bg" : "text-fg/55 hover:text-fg"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
