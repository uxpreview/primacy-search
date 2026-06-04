import type { MatchSpan, UniverseItem } from "@/data/types";

export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const STOPWORDS = new Set([
  "the", "a", "an", "of", "for", "to", "in", "on", "and", "or", "with", "our",
  "my", "your", "me", "we", "show", "how", "can", "you", "what", "does", "do",
  "is", "are", "about", "tell", "help", "i", "us", "at", "by",
]);

export function tokenize(s: string): string[] {
  const n = normalize(s);
  if (!n) return [];
  return n
    .split(" ")
    .filter((t) => (t.length > 1 || /[0-9]/.test(t)) && !STOPWORDS.has(t));
}

/** Bounded Levenshtein — returns a distance, early-exits past `max`. */
export function levenshtein(a: string, b: string, max = 2): number {
  if (a === b) return 0;
  const al = a.length;
  const bl = b.length;
  if (Math.abs(al - bl) > max) return max + 1;
  let prev = Array.from({ length: bl + 1 }, (_, i) => i);
  let curr = new Array(bl + 1).fill(0);
  for (let i = 1; i <= al; i++) {
    curr[0] = i;
    let rowMin = curr[0];
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + cost);
      if (curr[j] < rowMin) rowMin = curr[j];
    }
    if (rowMin > max) return max + 1;
    [prev, curr] = [curr, prev];
  }
  return prev[bl];
}

/** All non-overlapping occurrences of `term` within `text` (case-insensitive). */
function findSpans(
  text: string,
  term: string,
  field: MatchSpan["field"]
): MatchSpan[] {
  const spans: MatchSpan[] = [];
  if (!term) return spans;
  const hay = text.toLowerCase();
  const needle = term.toLowerCase();
  let from = 0;
  let idx = hay.indexOf(needle, from);
  while (idx !== -1) {
    spans.push({ field, start: idx, end: idx + needle.length });
    from = idx + needle.length;
    idx = hay.indexOf(needle, from);
  }
  return spans;
}

export interface ItemScore {
  score: number;
  spans: MatchSpan[];
  matchedTerms: number;
}

const YEAR_BASELINE = 2022;

export function scoreItem(item: UniverseItem, terms: string[]): ItemScore {
  if (terms.length === 0) return { score: 0, spans: [], matchedTerms: 0 };

  const titleTokens = tokenize(item.title);
  const tagTokens = item.tags.map((t) => normalize(t));
  const excerptLower = item.excerpt.toLowerCase();

  let score = 0;
  let matchedTerms = 0;
  const spans: MatchSpan[] = [];

  for (const term of terms) {
    let termScore = 0;

    // Title — strongest signal
    for (const tok of titleTokens) {
      if (tok === term) termScore = Math.max(termScore, 10);
      else if (tok.startsWith(term)) termScore = Math.max(termScore, 6);
    }
    if (termScore < 4 && item.title.toLowerCase().includes(term)) {
      termScore = Math.max(termScore, 4);
    }

    // Tags
    for (const tag of tagTokens) {
      if (tag === term) termScore += 5;
      else if (tag.split(" ").some((w) => w === term)) termScore += 4;
      else if (tag.startsWith(term)) termScore += 3;
    }

    // Excerpt — weak signal
    if (excerptLower.includes(term)) termScore += 1;

    // Fuzzy fallback — typo tolerance for longer terms
    if (termScore === 0 && term.length >= 4) {
      let best = 99;
      for (const tok of [...titleTokens, ...tagTokens.flatMap((t) => t.split(" "))]) {
        if (Math.abs(tok.length - term.length) > 2) continue;
        const d = levenshtein(tok, term, 2);
        if (d < best) best = d;
      }
      if (best <= 1) termScore += 4;
      else if (best === 2) termScore += 2;
    }

    if (termScore > 0) {
      matchedTerms += 1;
      score += termScore;
      spans.push(...findSpans(item.title, term, "title"));
      spans.push(...findSpans(item.excerpt, term, "excerpt"));
    }
  }

  if (score === 0) return { score: 0, spans: [], matchedTerms: 0 };

  // Multi-term coverage bonus
  if (matchedTerms > 1) score += (matchedTerms - 1) * 3;

  // Light recency boost for dated content
  if (item.type === "work") score += Math.max(0, item.year - YEAR_BASELINE) * 0.25;
  if (item.type === "idea") {
    const y = Number(item.date.slice(0, 4));
    score += Math.max(0, y - YEAR_BASELINE) * 0.2;
  }

  return { score, spans: dedupeSpans(spans), matchedTerms };
}

function dedupeSpans(spans: MatchSpan[]): MatchSpan[] {
  const seen = new Set<string>();
  const out: MatchSpan[] = [];
  for (const s of spans) {
    const k = `${s.field}:${s.start}:${s.end}`;
    if (!seen.has(k)) {
      seen.add(k);
      out.push(s);
    }
  }
  return out;
}
