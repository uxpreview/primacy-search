import type { SearchResponse, TabKey } from "@/data/types";
import { runSearch } from "@/lib/search";

export type Phase = "idle" | "open" | "collapsed";

export interface SearchState {
  phase: Phase;
  query: string;
  submittedQuery: string;
  results: SearchResponse | null;
  activeTab: TabKey;
  loading: boolean;
}

export const initialState: SearchState = {
  phase: "idle",
  query: "",
  submittedQuery: "",
  results: null,
  activeTab: "all",
  loading: false,
};

export type Action =
  | { type: "SET_QUERY"; query: string }
  | { type: "SUBMIT_START"; query: string }
  | { type: "SUBMIT_RESOLVE"; query: string }
  | { type: "SET_TAB"; tab: TabKey }
  | { type: "MINIMIZE" }
  | { type: "EXPAND" }
  | { type: "CLOSE" }
  | { type: "CLEAR" };

export function reducer(state: SearchState, action: Action): SearchState {
  switch (action.type) {
    case "SET_QUERY":
      return { ...state, query: action.query };

    case "SUBMIT_START": {
      const q = action.query.trim();
      if (!q) return state;
      return {
        ...state,
        phase: "open",
        query: q,
        submittedQuery: q,
        activeTab: "all",
        loading: true,
      };
    }

    case "SUBMIT_RESOLVE": {
      const q = action.query.trim();
      if (!q) return state;
      return { ...state, results: runSearch(q), loading: false };
    }

    case "SET_TAB":
      return { ...state, activeTab: action.tab };

    case "MINIMIZE":
      return state.phase === "open" ? { ...state, phase: "collapsed" } : state;

    case "EXPAND":
      return state.results || state.loading ? { ...state, phase: "open" } : state;

    case "CLOSE":
      return { ...state, phase: "idle" };

    case "CLEAR":
      return { ...state, query: "" };

    default:
      return state;
  }
}
