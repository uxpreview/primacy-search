import { useEffect, useLayoutEffect, useRef } from "react";
import {
  animate,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { clamp, lerp } from "@/lib/util";

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const DOCK_HEIGHT = 60;
const HERO_FONT = 21;
const DOCK_FONT = 16;
const DOCK_MARGIN = 22;
const HERO_RADIUS = 18;

function computeDocked(): Rect {
  const vw = window.innerWidth;
  const vp = window.visualViewport;
  const vh = vp ? vp.height : window.innerHeight;
  const offsetTop = vp ? vp.offsetTop : 0;
  const gutter = vw < 640 ? 18 : 40;
  const width = Math.min(vw - gutter * 2, 560);
  return {
    left: (vw - width) / 2,
    top: offsetTop + vh - DOCK_MARGIN - DOCK_HEIGHT,
    width,
    height: DOCK_HEIGHT,
  };
}

function fallbackStart(): Rect {
  const vw = window.innerWidth;
  const width = Math.min(vw - 48, 660);
  return {
    left: (vw - width) / 2,
    top: Math.max(160, window.innerHeight * 0.42),
    width,
    height: 70,
  };
}

export interface DockMotion {
  x: MotionValue<number>;
  y: MotionValue<number>;
  width: MotionValue<number>;
  height: MotionValue<number>;
  fontSize: MotionValue<number>;
  radius: MotionValue<number>;
  progress: MotionValue<number>;
}

export function useScrollDock(
  heroRef: React.RefObject<HTMLElement>,
  ghostRef: React.RefObject<HTMLElement>,
  forced: boolean,
  reduced: boolean
): DockMotion {
  const startRef = useRef<Rect>(fallbackStart());
  const dockedRef = useRef<Rect>(
    typeof window !== "undefined" ? computeDocked() : fallbackStart()
  );

  const dockP = useMotionValue(reduced ? 1 : 0);
  const version = useMotionValue(0);

  const forcedRef = useRef(forced);
  const reducedRef = useRef(reduced);
  forcedRef.current = forced;
  reducedRef.current = reduced;
  const releaseAnim = useRef<ReturnType<typeof animate> | null>(null);

  const heroProgress = () => {
    const el = heroRef.current;
    if (!el) return dockP.get();
    const h = el.offsetHeight || window.innerHeight;
    return clamp(window.scrollY / h, 0, 1);
  };

  const measure = () => {
    dockedRef.current = computeDocked();
    const ghost = ghostRef.current;
    if (ghost) {
      const r = ghost.getBoundingClientRect();
      if (r.width > 0) {
        startRef.current = {
          left: r.left,
          top: r.top + window.scrollY,
          width: r.width,
          height: r.height,
        };
      }
    }
    version.set(version.get() + 1);
    if (!forcedRef.current) {
      const v = heroProgress();
      dockP.set(reducedRef.current ? (v > 0.08 ? 1 : 0) : v);
    }
  };

  useLayoutEffect(() => {
    measure();
    const onResize = () => measure();
    const onScroll = () => {
      if (forcedRef.current) return;
      releaseAnim.current?.stop();
      releaseAnim.current = null;
      const v = heroProgress();
      dockP.set(reducedRef.current ? (v > 0.08 ? 1 : 0) : v);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.visualViewport?.addEventListener("resize", onResize);
    window.visualViewport?.addEventListener("scroll", onResize);
    if (document.fonts?.ready) document.fonts.ready.then(measure);
    const t = window.setTimeout(measure, 120);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
      window.visualViewport?.removeEventListener("resize", onResize);
      window.visualViewport?.removeEventListener("scroll", onResize);
      window.clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Forced override (panel open/collapsed, or non-ask view) springs to docked;
  // release returns to the current hero scroll position.
  useEffect(() => {
    releaseAnim.current?.stop();
    if (forced) {
      if (reduced) dockP.set(1);
      else releaseAnim.current = animate(dockP, 1, { type: "spring", stiffness: 280, damping: 34 });
    } else {
      const v = heroProgress();
      const target = reduced ? (v > 0.08 ? 1 : 0) : v;
      if (reduced) dockP.set(target);
      else releaseAnim.current = animate(dockP, target, { type: "spring", stiffness: 280, damping: 34 });
    }
    return () => releaseAnim.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forced, reduced]);

  const x = useTransform([dockP, version], ([p]) =>
    lerp(startRef.current.left, dockedRef.current.left, p as number)
  );
  const y = useTransform([dockP, version], ([p]) =>
    lerp(startRef.current.top, dockedRef.current.top, p as number)
  );
  const width = useTransform([dockP, version], ([p]) =>
    lerp(startRef.current.width, dockedRef.current.width, p as number)
  );
  const height = useTransform([dockP, version], ([p]) =>
    lerp(startRef.current.height, dockedRef.current.height, p as number)
  );
  const fontSize = useTransform(dockP, [0, 1], [HERO_FONT, DOCK_FONT]);
  const radius = useTransform(dockP, [0, 1], [HERO_RADIUS, 999]);

  return { x, y, width, height, fontSize, radius, progress: dockP };
}
