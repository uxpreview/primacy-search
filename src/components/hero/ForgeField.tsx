import { useEffect, useRef } from "react";

/* Full-bleed reactive dot field. A faint grid of "empty squares" covers the
 * whole hero and reacts to the cursor (shove + a green paint trail). A
 * right-side (or, on mobile, top-centre) 11x11 region cycles through Primacy
 * "objects" in solid dots — the kept Forge animation, now living inside the
 * background field.
 *
 * Green trail: dots the cursor passes over take on the brand green and hold it
 * for a few seconds before fading back, so you can almost "draw" on the hero
 * without it staying loud. */

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
const EMPTY_A = 0.08;
const ON_A = 0.95;
const RADIUS = 120; // cursor shove influence (px)
const PUSH = 13;
const CYCLE_MS = 1600;

// Green paint trail
const PAINT_RADIUS = 92; // brush size for the green trail (px)
const GREEN_ALPHA = 0.82; // extra opacity at full green charge
const GREEN_FADE = 0.95; // decay rate /sec — lower = lingers longer (~3-4s)
const GREEN_POP = 0.32; // extra scale at full charge
const PROTECT_PAD = 6; // px padding around protected text boxes
const PROTECT_FEATHER = 32; // px soft ramp from text edge back to full green

// Colour ramp: dark dot -> Primacy green (#028538). Precomputed so the render
// loop never allocates colour strings.
const DARK = { r: 21, g: 23, b: 26 };
const ACCENT = { r: 2, g: 133, b: 56 };
const LUT_N = 28;
const COLOR_LUT = Array.from({ length: LUT_N }, (_, i) => {
  const t = i / (LUT_N - 1);
  const r = Math.round(DARK.r + (ACCENT.r - DARK.r) * t);
  const g = Math.round(DARK.g + (ACCENT.g - DARK.g) * t);
  const b = Math.round(DARK.b + (ACCENT.b - DARK.b) * t);
  return `rgb(${r},${g},${b})`;
});

interface Cell { cx: number; cy: number; ox: number; oy: number } // ox/oy: object coord or -1

export function ForgeField({ className = "", getProtectRects }: { className?: string; getProtectRects?: () => DOMRect[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursor = useRef<{ x: number; y: number } | null>(null);
  const protectRef = useRef(getProtectRects);
  protectRef.current = getProtectRects;

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
    let av = new Float32Array(0); // current base alpha (empty/on)
    let sv = new Float32Array(0); // current base scale
    let gv = new Float32Array(0); // green charge 0..1
    let pf = new Float32Array(0); // green-allowed factor (0 behind text)
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
      gv = new Float32Array(cells.length);

      // Protect text: suppress the green trail behind the headline/tagline so it
      // never reduces their contrast. pf[i] = 0 inside a text box, ramping back
      // to 1 over PROTECT_FEATHER px outside it (soft edge, no visible seam).
      pf = new Float32Array(cells.length).fill(1);
      const rects = protectRef.current?.() ?? [];
      if (rects.length) {
        const wr = wrap.getBoundingClientRect();
        const boxes = rects.map((b) => ({
          l: b.left - wr.left - PROTECT_PAD,
          t: b.top - wr.top - PROTECT_PAD,
          r: b.right - wr.left + PROTECT_PAD,
          btm: b.bottom - wr.top + PROTECT_PAD,
        }));
        for (let i = 0; i < cells.length; i++) {
          const { cx, cy } = cells[i];
          let f = 1;
          for (let j = 0; j < boxes.length; j++) {
            const b = boxes[j];
            const ox = Math.max(b.l - cx, 0, cx - b.r);
            const oy = Math.max(b.t - cy, 0, cy - b.btm);
            const d = Math.hypot(ox, oy);
            const bf = d >= PROTECT_FEATHER ? 1 : d / PROTECT_FEATHER;
            if (bf < f) f = bf;
          }
          pf[i] = f;
        }
      }
    };

    build();
    const ro = new ResizeObserver(build);
    ro.observe(wrap);
    // Re-measure protected boxes after fonts load and the entrance animation
    // settles — both reflow the headline metrics.
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => build()).catch(() => {});
    }
    const settle = window.setTimeout(build, 900);

    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      cursor.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    let glyph = 0;
    let lastCycle = 0;
    let lastT = 0;
    const side = () => cell * 0.5;
    const paintR2 = PAINT_RADIUS * PAINT_RADIUS;

    const frame = (t: number) => {
      const dt = lastT ? Math.min(0.05, (t - lastT) / 1000) : 0;
      lastT = t;
      const greenDecay = Math.exp(-dt * GREEN_FADE);

      if (t - lastCycle > CYCLE_MS) { glyph = (glyph + 1) % OBJ_SETS.length; lastCycle = t; }
      const set = OBJ_SETS[glyph];
      const c = cursor.current;
      ctx.clearRect(0, 0, W, H);
      const s = side();
      const r = s * 0.3;
      let curStyle = "";

      for (let i = 0; i < cells.length; i++) {
        const cl = cells[i];
        const on = cl.ox >= 0 && set.has(`${cl.ox},${cl.oy}`);
        const baseA = on ? ON_A : EMPTY_A;
        const baseS = on ? 1 : 0.5;

        let tx = 0, ty = 0;
        // fade the green charge, then re-paint it where the cursor is now
        gv[i] *= greenDecay;
        if (c) {
          const ddx = cl.cx - c.x, ddy = cl.cy - c.y;
          const d2 = ddx * ddx + ddy * ddy;
          if (d2 < RADIUS * RADIUS && d2 > 0.01) {
            const dist = Math.sqrt(d2);
            const f = 1 - dist / RADIUS;
            tx = (ddx / dist) * f * PUSH;
            ty = (ddy / dist) * f * PUSH;
          }
          if (!reduce && d2 < paintR2) {
            const ps = 1 - Math.sqrt(d2) / PAINT_RADIUS;
            if (ps > gv[i]) gv[i] = ps;
          }
        }

        const lp = reduce ? 1 : 0.18;
        dx[i] += (tx - dx[i]) * lp;
        dy[i] += (ty - dy[i]) * lp;
        av[i] += (baseA - av[i]) * lp;
        sv[i] += (baseS - sv[i]) * lp;

        const green = gv[i] * pf[i];
        const a = green > 0.002 ? Math.min(1, av[i] + green * GREEN_ALPHA) : av[i];
        if (a < 0.015) continue;
        const scale = sv[i] + green * GREEN_POP;
        const w = s * scale;
        const half = w / 2;
        const x = cl.cx + dx[i] - half;
        const y = cl.cy + dy[i] - half;

        const want = green > 0.002 ? COLOR_LUT[Math.round(green * (LUT_N - 1))] : COLOR_LUT[0];
        if (want !== curStyle) { ctx.fillStyle = want; curStyle = want; }
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
      window.clearTimeout(settle);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <div ref={wrapRef} className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}
