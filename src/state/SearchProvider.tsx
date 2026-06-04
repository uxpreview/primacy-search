import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import type { TabKey } from "@/data/types";
import type { View } from "@/data/nav";
import { initialState, reducer, type Phase } from "./searchMachine";
import type { SearchState } from "./searchMachine";

interface SearchContextValue extends SearchState {
  reducedMotion: boolean;
  view: View;
  heroRef: React.RefObject<HTMLElement>;
  ghostRef: React.RefObject<HTMLDivElement>;
  setView: (v: View) => void;
  setQuery: (q: string) => void;
  submit: (q?: string) => void;
  setTab: (t: TabKey) => void;
  minimize: () => void;
  expand: () => void;
  close: () => void;
  clear: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);
const THINK_MS = 1150;

export function SearchProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [view, setViewState] = useState<View>("ask");
  const prefersReduced = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);

  useEffect(() => () => { if (timer.current) window.clearTimeout(timer.current); }, []);

  const setView = useCallback((v: View) => {
    setViewState(v);
    window.scrollTo({ top: 0, behavior: "auto" });
    // Let the new view mount, then re-measure dock/tab ghosts.
    window.setTimeout(() => window.dispatchEvent(new Event("resize")), 60);
  }, []);

  const setQuery = useCallback((q: string) => dispatch({ type: "SET_QUERY", query: q }), []);
  const submit = useCallback(
    (q?: string) => {
      const query = (q ?? "").trim();
      if (!query) return;
      if (timer.current) window.clearTimeout(timer.current);
      dispatch({ type: "SUBMIT_START", query });
      if (prefersReduced) {
        dispatch({ type: "SUBMIT_RESOLVE", query });
      } else {
        timer.current = window.setTimeout(
          () => dispatch({ type: "SUBMIT_RESOLVE", query }),
          THINK_MS
        );
      }
    },
    [prefersReduced]
  );
  const setTab = useCallback((t: TabKey) => dispatch({ type: "SET_TAB", tab: t }), []);
  const minimize = useCallback(() => dispatch({ type: "MINIMIZE" }), []);
  const expand = useCallback(() => dispatch({ type: "EXPAND" }), []);
  const close = useCallback(() => dispatch({ type: "CLOSE" }), []);
  const clear = useCallback(() => dispatch({ type: "CLEAR" }), []);

  const value = useMemo<SearchContextValue>(
    () => ({
      ...state,
      reducedMotion: prefersReduced,
      view,
      heroRef,
      ghostRef,
      setView,
      setQuery,
      submit,
      setTab,
      minimize,
      expand,
      close,
      clear,
    }),
    [state, prefersReduced, view, setView, setQuery, submit, setTab, minimize, expand, close, clear]
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

export function useSearch(): SearchContextValue {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}

export type { Phase };
