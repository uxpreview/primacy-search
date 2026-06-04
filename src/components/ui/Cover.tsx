import { hash } from "@/lib/util";

const PALETTES: [string, string][] = [
  ["#0e7a50", "#072a1f"],
  ["#15140f", "#3b3a30"],
  ["#b65a3f", "#3f1c14"],
  ["#3b5a86", "#121f36"],
  ["#5d7a3e", "#1f2c16"],
  ["#2f6f6a", "#0e2624"],
];

interface CoverProps {
  id: string;
  label?: string;
  className?: string;
  aspect?: string;
  /** When false, renders the gradient only (used for tiny avatars). */
  photo?: boolean;
}

export function Cover({
  id,
  label,
  className = "",
  aspect,
  photo = true,
}: CoverProps) {
  const h = hash(id);
  const [a, b] = PALETTES[Math.floor(h * PALETTES.length) % PALETTES.length];
  const angle = Math.floor(hash(id + "θ") * 110) + 25;
  const src = `https://picsum.photos/seed/primacy-${encodeURIComponent(id)}/800/600?grayscale`;

  return (
    <div
      className={`relative overflow-hidden bg-fg ${className}`}
      style={{ aspectRatio: aspect, background: `linear-gradient(${angle}deg, ${a}, ${b})` }}
      aria-hidden="true"
    >
      {photo && (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-90 grayscale transition duration-[800ms] ease-editorial group-hover:scale-[1.05] group-hover:opacity-100 group-hover:grayscale-0"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
      {label && (
        <span className="absolute bottom-2.5 left-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90">
          {label}
        </span>
      )}
    </div>
  );
}
