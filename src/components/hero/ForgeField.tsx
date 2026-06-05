import { useEffect, useRef } from "react";

/* Full-bleed reactive dot field. A faint grid of "empty squares" covers the
 * whole hero and reacts to the cursor (shove + brighten). A right-side (or, on
 * mobile, top-centre) 11x11 region cycles through Primacy "objects" in solid
 * dots — the kept Forge animation, now living inside the background field. */

const OBJECT_GLYPHS = [
  // Websites
  ["...........", ".#########.", ".#.#.#...#.", ".#########.", ".#.......#.", ".#.......#.", ".#.......#.", ".#.......#.", ".#.......#.", ".#########.", "..........."],
  // Apps
  ["...........", "...#####...", "...#...#...", "...#...#...", "...#...#...", "...#...#...", "...#...#...", "...#...#...", "...#.#.#...", "...#####...", "..........."],
  // Analytics
  ["...........", ".........#.", ".........#.", ".....#...#.", ".....#...#.", ".#...#...#.", ".#...#...#.", ".#...#...#.", ".#...#...#.", ".#########.", "..........."],
  // Growth
  ["...........", ".....#.....", "....###....", "...#####...", "..#######..", ".....#.....", ".....#.....", ".....#.....", ".....#.....", ".....#.....", "..........."],
  // Brand
  ["...........", "..######...", "..#....#...", "..#....#...", "..#....#...", "..######...", "..#........", "..#........", "..#........", "..#........", "..........."],
];
const OBJ_SETS = OBJECT_GLYPHS.map((g) => {
  const s = new Set<string>();
  g.forEach((row, y) => [...row].forEach((c, x) => c === "#" && s.add(`${x},${y}`)));
  return s;
});

const OBJ = 11; // object region is 11x11 cells
const FG = "#15171a";
const EMPTY_A = 0.08;
const ON_A = 0.95;
const RADIUS = 120; // cursor influence (px)
const PUSH = 13;
const BRIGHT = 0.42;
const CYCLE_MS = 1600;

interface Cell { cx: number; cy: number; ox: number; oy: number } // ox/oy: object coord or -1

export function ForgeField({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursor = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let cells: Cell[] = [];
    let dx = new Float32Array(0);
    let dy = new Float32Array(0);
    let av = new Float32Array(0); // current alpha
    let sv = new Float32Array(0); // current scale
    let cell = 30;
    let W = 0;
    let H = 0;

    const build = () => {
      const r = wrap.getBoundingClientRect();
      W = Math.max(1, r.width);
      H = Math.max(1, r.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const cols = Math.max(20, Math.min(70, Math.round(W / 30)));
      cell = W / cols;
      const rows = Math.max(8, Math.round(H / cell));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // object region placement
      const wide = W >= 1024;
      const startCol = wide
        ? Math.max(0, Math.min(cols - OBJ, Math.round((W * 0.92) / cell) - OBJ))
        : Math.round((cols - OBJ) / 2);
      const startRow = wide
        ? Math.round((rows - OBJ) / 2)
        : Math.max(1, Math.round(rows * 0.16));

      cells = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const ox = col - startCol;
          const oy = row - startRow;
          const inObj = ox >= 0 && ox < OBJ && oy >= 0 && oy < OBJ;
          cells.push({ cx: col * cell + cell / 2, cy: row * cell + cell / 2, ox: inObj ? ox : -1, oy: inObj ? oy : -1 });
        }
      }
      dx = new Float32Array(cells.length);
      dy = new Float32Array(cells.length);
      av = new Float32Array(cells.length).fill(EMPTY_A);
      sv = new Float32Array(cells.length).fill(0.5);
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(wrap);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      cursor.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    let glyph = 0;
    let lastCycle = 0;
    const side = () => cell * 0.5;

    const frame = (t: number) => {
      if (t - lastCycle > CYCLE_MS) { glyph = (glyph + 1) % OBJ_SETS.length; lastCycle = t; }
      const set = OBJ_SETS[glyph];
      const c = cursor.current;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = FG;
      const s = side();
      const r = s * 0.3;

      for (let i = 0; i < cells.length; i++) {
        const cl = cells[i];
        const on = cl.ox >= 0 && set.has(`${cl.ox},${cl.oy}`);
        let baseA = on ? ON_A : EMPTY_A;
        let baseS = on ? 1 : 0.5;
        let tx = 0, ty = 0, bright = 0;
        if (c) {
          const ddx = cl.cx - c.x, ddy = cl.cy - c.y;
          const dist = Math.hypot(ddx, ddy);
          if (dist < RADIUS && dist > 0.01) {
            const f = 1 - dist / RADIUS;
            tx = (ddx / dist) * f * PUSH;
            ty = (ddy / dist) * f * PUSH;
            bright = f * BRIGHT;
          }
        }
        const lp = reduce ? 1 : 0.18;
        dx[i] += (tx - dx[i]) * lp;
        dy[i] += (ty - dy[i]) * lp;
        av[i] += (Math.min(1, baseA + bright) - av[i]) * lp;
        sv[i] += ((baseS + bright * 0.5) - sv[i]) * lp;

        const a = av[i];
        if (a < 0.015) continue;
        const half = (s * sv[i]) / 2;
        const x = cl.cx + dx[i] - half;
        const y = cl.cy + dy[i] - half;
        const w = s * sv[i];
        ctx.globalAlpha = a;
        ctx.beginPath();
        ctx.roundRect(x, y, w, w, r);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
