import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

const G = 11;
const CELL = 100 / G;

// 11x11 glyphs. "#" = active dot. Page, chart, chat bubble, the Primacy "P".
const SHAPES: string[][] = [
  [
    "...........",
    "..#######..",
    "..#######..",
    "..#.....#..",
    "..#.###.#..",
    "..#.....#..",
    "..#.###.#..",
    "..#.....#..",
    "..#.###.#..",
    "..#######..",
    "...........",
  ],
  [
    "...........",
    ".........#.",
    ".......#.#.",
    ".......#.#.",
    ".....#.#.#.",
    ".....#.#.#.",
    "...#.#.#.#.",
    "...#.#.#.#.",
    ".#.#.#.#.#.",
    ".#.#.#.#.#.",
    "...........",
  ],
  [
    "...........",
    ".#########.",
    ".#.......#.",
    ".#.#####.#.",
    ".#.......#.",
    ".#.#####.#.",
    ".#.......#.",
    ".#########.",
    "...##......",
    "..##.......",
    "...........",
  ],
  [
    "...........",
    "..######...",
    "..#....#...",
    "..#....#...",
    "..#....#...",
    "..######...",
    "..#........",
    "..#........",
    "..#........",
    "..#........",
    "...........",
  ],
];

function activeSet(shape: string[]): Set<string> {
  const s = new Set<string>();
  shape.forEach((row, y) =>
    [...row].forEach((c, x) => {
      if (c === "#") s.add(`${x},${y}`);
    })
  );
  return s;
}

const SHAPE_SETS = SHAPES.map(activeSet);

const EMPTY_SET = new Set<string>();

interface DotMatrixProps {
  className?: string;
  variant?: "cycle" | "loading";
  intervalMs?: number;
  /** Opacity of inactive dots. v1 uses a faint grid (0.1); v2 hides them (0). */
  offOpacity?: number;
  /** Tint a scattered subset of active dots with the brand accent. */
  accent?: boolean;
  /** Radius of each dot as a fraction of the cell (0.3 default; bump for mass). */
  dotRadius?: number;
  /** On mount, ripple the first glyph in from blank (signature assemble). */
  intro?: boolean;
  /** When false, hold a single glyph instead of cycling (calm/static mark). */
  cycle?: boolean;
  /** Which glyph to hold when cycle is false (index into SHAPES). */
  glyph?: number;
  /** Dot shape. "square" reads more geometric, matching grotesque display type. */
  shape?: "circle" | "square";
  /** Pointer-reactive: dots near the cursor light up and swell. */
  interactive?: boolean;
}

const INFLUENCE = 28; // viewBox units around the pointer that react

export function DotMatrix({
  className = "",
  variant = "cycle",
  intervalMs = 2400,
  offOpacity = 0.1,
  accent = false,
  dotRadius = 0.3,
  intro = false,
  cycle = true,
  glyph = 0,
  shape = "circle",
  interactive = false,
}: DotMatrixProps) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [mounted, setMounted] = useState(!intro || reduced);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number | null>(null);
  const pendRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (variant !== "cycle" || reduced || !cycle) return;
    const id = window.setInterval(() => setI((p) => (p + 1) % SHAPE_SETS.length), intervalMs);
    return () => window.clearInterval(id);
  }, [variant, reduced, intervalMs, cycle]);

  useEffect(() => {
    if (mounted) return;
    const t = window.setTimeout(() => setMounted(true), 90);
    return () => window.clearTimeout(t);
  }, [mounted]);

  useEffect(() => () => { if (rafRef.current != null) cancelAnimationFrame(rafRef.current); }, []);

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    pendRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    };
    if (rafRef.current == null) {
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        setPointer(pendRef.current);
      });
    }
  };
  const onLeave = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setPointer(null);
  };

  const activeIndex = cycle ? i : glyph % SHAPE_SETS.length;
  const active = mounted ? SHAPE_SETS[activeIndex] : EMPTY_SET;

  const dots = useMemo(() => {
    const out: { x: number; y: number; cx: number; cy: number; dist: number }[] = [];
    for (let y = 0; y < G; y++) {
      for (let x = 0; x < G; x++) {
        out.push({
          x,
          y,
          cx: x * CELL + CELL / 2,
          cy: y * CELL + CELL / 2,
          dist: Math.hypot(x - (G - 1) / 2, y - (G - 1) / 2),
        });
      }
    }
    return out;
  }, []);

  const r = CELL * dotRadius;
  const pointerActive = interactive && pointer != null;

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox="0 0 100 100"
      role="img"
      aria-label={variant === "loading" ? "Loading" : "Primacy"}
      onPointerMove={interactive ? onMove : undefined}
      onPointerLeave={interactive ? onLeave : undefined}
    >
      {dots.map((d) => {
        if (variant === "loading") {
          return (
            <circle
              key={`${d.x},${d.y}`}
              className="dm-dot dm-wave"
              cx={d.cx}
              cy={d.cy}
              r={r}
              fill="var(--fg)"
              style={{ animationDelay: `${((d.x + d.y) / (2 * G)) * 1.3}s` }}
            />
          );
        }
        const on = active.has(`${d.x},${d.y}`);
        const isAccent = accent && on && (d.x + d.y) % 5 === 0;

        let prox = 0;
        if (pointerActive) {
          const dist = Math.hypot(d.cx - pointer!.x, d.cy - pointer!.y);
          prox = Math.max(0, 1 - dist / INFLUENCE);
        }
        const opacity = on ? 1 : Math.max(offOpacity, prox * 0.55);
        const scale = on ? 1 + prox * 0.4 : Math.max(0.42, 0.42 + prox * 0.55);

        const dotStyle: React.CSSProperties = {
          opacity,
          transform: `scale(${scale})`,
          transitionDelay: pointerActive || reduced ? "0s" : `${d.dist * 0.024}s`,
        };
        const fill = isAccent ? "var(--accent)" : "var(--fg)";
        const cls = `dm-dot${interactive ? " dm-interactive" : ""}`;

        return shape === "square" ? (
          <rect
            key={`${d.x},${d.y}`}
            className={cls}
            x={d.cx - r}
            y={d.cy - r}
            width={r * 2}
            height={r * 2}
            rx={r * 0.32}
            fill={fill}
            style={dotStyle}
          />
        ) : (
          <circle
            key={`${d.x},${d.y}`}
            className={cls}
            cx={d.cx}
            cy={d.cy}
            r={r}
            fill={fill}
            style={dotStyle}
          />
        );
      })}
    </svg>
  );
}
