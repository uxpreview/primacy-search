import { UNIVERSE } from "@/data";
import type {
  PersonItem,
  ResultType,
  ScoredResult,
  SearchResponse,
  UniverseItem,
  WorkItem,
} from "@/data/types";
import { normalize, scoreItem, tokenize, levenshtein } from "./scoring";

export interface Suggestion {
  id: string;
  label: string;
  type: ResultType;
}

const EMPTY_COUNTS: Record<ResultType, number> = {
  work: 0,
  service: 0,
  industry: 0,
  person: 0,
  idea: 0,
};

// Build a vocabulary once for did-you-mean.
const VOCAB: string[] = (() => {
  const set = new Set<string>();
  for (const item of UNIVERSE) {
    for (const t of tokenize(item.title)) if (t.length > 2) set.add(t);
    for (const tag of item.tags) {
      for (const w of normalize(tag).split(" ")) if (w.length > 2) set.add(w);
    }
  }
  return [...set];
})();

function nearestVocab(term: string): string | null {
  if (term.length < 4) return null;
  let best: string | null = null;
  let bestD = 3;
  for (const v of VOCAB) {
    if (Math.abs(v.length - term.length) > 2) continue;
    const d = levenshtein(v, term, 2);
    if (d < bestD) {
      bestD = d;
      best = v;
    }
  }
  return bestD <= 2 ? best : null;
}

function buildDidYouMean(query: string, total: number): string | undefined {
  if (total > 0) return undefined;
  const terms = tokenize(query);
  if (terms.length === 0) return undefined;
  let changed = false;
  const corrected = terms.map((term) => {
    const directHit = UNIVERSE.some(
      (i) =>
        i.title.toLowerCase().includes(term) ||
        i.tags.some((t) => t.toLowerCase().includes(term))
    );
    if (directHit) return term;
    const near = nearestVocab(term);
    if (near && near !== term) {
      changed = true;
      return near;
    }
    return term;
  });
  return changed ? corrected.join(" ") : undefined;
}

function buildRelated(
  results: ScoredResult[],
  terms: string[]
): SearchResponse["related"] {
  const top = results.slice(0, 8);
  const termSet = new Set(terms);
  const tagCount = new Map<string, number>();
  for (const r of top) {
    for (const tag of r.item.tags) {
      if (termSet.has(normalize(tag))) continue;
      tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1);
    }
  }
  const topics = [...tagCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([t]) => t);

  const people = results
    .filter((r) => r.item.type === "person")
    .slice(0, 3)
    .map((r) => r.item as PersonItem);

  const workItems = results
    .filter((r) => r.item.type === "work")
    .slice(0, 3)
    .map((r) => r.item as WorkItem);

  return { topics, people, work: workItems };
}

const HEALTHCARE_SUMMARY =
  "Primacy has spent 15+ years helping health systems grow — earning patient trust, simplifying find-care journeys, and unifying brands through mergers. Recent healthcare work includes Dana-Farber (a 62% lift in patient leads), UChicago Medicine's smart find-care platform (2.4× faster booking), and an AI care concierge for Sutter Health. The practice pairs experience design, brand, and performance media, led by Elena Marsh and Sofia Reyes.";

function buildAnswer(
  query: string,
  results: ScoredResult[],
  total: number
): SearchResponse["answer"] {
  if (results.length === 0) return undefined;

  // Curated showcase flow: "work in healthcare".
  if (/health/.test(normalize(query))) {
    const workHits = results
      .filter((r) => r.item.type === "work")
      .slice(0, 4)
      .map((r) => r.item);
    const sources = workHits.length
      ? workHits
      : results.slice(0, 3).map((r) => r.item);
    return { text: HEALTHCARE_SUMMARY, sources };
  }

  if (results[0].score < 7) return undefined;
  const sources = results.slice(0, 3).map((r) => r.item);
  const top = sources[0];
  const second = sources[1];
  const noun =
    total === 1 ? "one place" : `${total} things across our work, services, and ideas`;
  let text = `Across Primacy's universe, "${query}" turns up ${noun}. ${top.title} — ${top.excerpt}`;
  if (second) {
    text += ` You might also look at ${second.title.replace(/—.*$/, "").trim()}.`;
  }
  return { text, sources };
}

export function runSearch(query: string): SearchResponse {
  const terms = tokenize(query);
  const scored: ScoredResult[] = [];

  if (terms.length > 0) {
    for (const item of UNIVERSE) {
      const { score, spans } = scoreItem(item, terms);
      if (score > 0) scored.push({ item, score, spans });
    }
    scored.sort((a, b) => b.score - a.score);
  }

  const countsByType: Record<ResultType, number> = { ...EMPTY_COUNTS };
  for (const r of scored) countsByType[r.item.type] += 1;

  const total = scored.length;

  return {
    query,
    total,
    countsByType,
    results: scored,
    didYouMean: buildDidYouMean(query, total),
    related: buildRelated(scored, terms),
    answer: buildAnswer(query, scored, total),
  };
}

export function suggest(query: string, limit = 6): Suggestion[] {
  const terms = tokenize(query);
  if (terms.length === 0) return [];
  const scored: { item: UniverseItem; score: number }[] = [];
  for (const item of UNIVERSE) {
    const { score } = scoreItem(item, terms);
    if (score > 0) scored.push({ item, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(({ item }) => ({
    id: item.id,
    label: item.title,
    type: item.type,
  }));
}
