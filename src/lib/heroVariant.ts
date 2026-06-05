import { useEffect, useState } from "react";

export type HeroVariant = "v1" | "v4" | "v5" | "v6" | "v7";

const KEY = "primacy-hero-variant";
const DEFAULT: HeroVariant = "v7";
const ALL: HeroVariant[] = ["v1", "v4", "v5", "v6", "v7"];

function isVariant(v: string | null): v is HeroVariant {
  return v !== null && (ALL as string[]).includes(v);
}

function readInitial(): HeroVariant {
  if (typeof window === "undefined") return DEFAULT;
  const url = new URLSearchParams(window.location.search).get("hero");
  if (isVariant(url)) return url;
  const stored = window.localStorage.getItem(KEY);
  if (isVariant(stored)) return stored;
  return DEFAULT;
}

export function useHeroVariant() {
  const [variant, setVariantState] = useState<HeroVariant>(readInitial);

  const sync = (v: HeroVariant) => {
    try {
      window.localStorage.setItem(KEY, v);
    } catch {
      /* ignore */
    }
    const u = new URL(window.location.href);
    u.searchParams.set("hero", v);
    window.history.replaceState({}, "", u);
  };

  const setVariant = (v: HeroVariant) => {
    setVariantState(v);
    sync(v);
    // The hero swaps, moving the search ghost. Let the new hero mount, then
    // nudge the persistent SearchDock to re-measure (same trick as setView).
    window.setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
  };

  useEffect(() => {
    sync(variant);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { variant, setVariant };
}
