import { Fragment } from "react";

interface Span {
  start: number;
  end: number;
}

/** Renders `text` with matched spans wrapped in <mark>. Spans are merged. */
export function Highlight({ text, spans }: { text: string; spans: Span[] }) {
  if (!spans || spans.length === 0) return <>{text}</>;

  const sorted = [...spans].sort((a, b) => a.start - b.start);
  const merged: Span[] = [];
  for (const s of sorted) {
    const last = merged[merged.length - 1];
    if (last && s.start <= last.end) last.end = Math.max(last.end, s.end);
    else merged.push({ ...s });
  }

  const out: React.ReactNode[] = [];
  let i = 0;
  merged.forEach((m, k) => {
    const start = Math.max(0, Math.min(m.start, text.length));
    const end = Math.max(start, Math.min(m.end, text.length));
    if (start > i) out.push(<Fragment key={`t${k}`}>{text.slice(i, start)}</Fragment>);
    out.push(<mark key={`m${k}`}>{text.slice(start, end)}</mark>);
    i = end;
  });
  if (i < text.length) out.push(<Fragment key="end">{text.slice(i)}</Fragment>);
  return <>{out}</>;
}
