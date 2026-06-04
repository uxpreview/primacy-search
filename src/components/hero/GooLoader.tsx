import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

const VB = 340;
const C = { x: 170, y: 175 };

type Blob =
  | { kind: "core"; r: number; wob: number; fx: number; fy: number; pull: number }
  | { kind: "sat"; r: number; orb: number; sp: number; ph: number; rw: number; pull: number }
  | { kind: "ptr"; r: number };

const BLOBS: Blob[] = [
  { kind: "core", r: 90, wob: 9, fx: 0.00021, fy: 0.00026, pull: 0.1 },
  { kind: "sat", r: 52, orb: 74, sp: 0.00022, ph: 0.4, rw: 9, pull: 0.15 },
  { kind: "sat", r: 46, orb: 80, sp: 0.00018, ph: 2.4, rw: 8, pull: 0.15 },
  { kind: "sat", r: 44, orb: 70, sp: 0.00025, ph: 4.3, rw: 8, pull: 0.15 },
  { kind: "ptr", r: 42 },
];

// Organic indeterminate "goo" — idle drift + cursor reach.
export function GooLoader({ className = "" }: { className?: string }) {
  const reduce = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const elRefs = useRef<(SVGCircleElement | null)[]>([]);
  const mouse = useRef<{ x: number | null; y: number | null }>({ x: null, y: null });
  const ptr = useRef({ x: C.x, y: C.y });

  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => (mouse.current = { x: e.clientX, y: e.clientY });
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) mouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onTouch, { passive: true });

    const loop = (t: number) => {
      const T = { x: C.x, y: C.y };
      const svg = svgRef.current;
      if (svg && mouse.current.x != null && mouse.current.y != null) {
        const rect = svg.getBoundingClientRect();
        const pad = 48;
        const mx = ((mouse.current.x - rect.left) / rect.width) * VB;
        const my = ((mouse.current.y - rect.top) / rect.height) * VB;
        T.x = Math.max(pad, Math.min(VB - pad, mx));
        T.y = Math.max(pad, Math.min(VB - pad, my));
      }
      ptr.current.x += (T.x - ptr.current.x) * 0.12;
      ptr.current.y += (T.y - ptr.current.y) * 0.12;

      BLOBS.forEach((b, i) => {
        const el = elRefs.current[i];
        if (!el) return;
        let x: number, y: number, r: number;
        if (b.kind === "core") {
          x = C.x + Math.sin(t * b.fx) * b.wob + (ptr.current.x - C.x) * b.pull;
          y = C.y + Math.cos(t * b.fy) * b.wob + (ptr.current.y - C.y) * b.pull;
          r = b.r;
        } else if (b.kind === "sat") {
          const a = b.ph + t * b.sp;
          x = C.x + Math.cos(a) * b.orb + (ptr.current.x - C.x) * b.pull;
          y = C.y + Math.sin(a) * b.orb + (ptr.current.y - C.y) * b.pull;
          r = b.r + Math.sin(t * b.sp * 3 + b.ph) * b.rw;
        } else {
          x = ptr.current.x;
          y = ptr.current.y;
          const d = Math.hypot(ptr.current.x - C.x, ptr.current.y - C.y);
          r = b.r + Math.min(d * 0.14, 18);
        }
        el.setAttribute("cx", x.toFixed(1));
        el.setAttribute("cy", y.toFixed(1));
        el.setAttribute("r", r.toFixed(1));
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [reduce]);

  return (
    <svg
      ref={svgRef}
      className={className}
      viewBox={`0 0 ${VB} ${VB}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="Primacy"
    >
      <defs>
        <filter id="gooF" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
      <g filter="url(#gooF)">
        {BLOBS.map((b, i) => {
          const cx = b.kind === "sat" ? C.x + Math.cos(b.ph) * b.orb : C.x;
          const cy = b.kind === "sat" ? C.y + Math.sin(b.ph) * b.orb : C.y;
          return (
            <circle
              key={i}
              ref={(el) => {
                elRefs.current[i] = el;
              }}
              cx={cx}
              cy={cy}
              r={b.r}
              fill="var(--fg)"
            />
          );
        })}
      </g>
    </svg>
  );
}
