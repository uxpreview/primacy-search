import { useEffect, useRef, useState } from "react";
import { useSearch } from "@/state/SearchProvider";

const FUSTAT = "'Fustat', system-ui, sans-serif";
const SCHIBSTED = "'Schibsted Grotesk', system-ui, sans-serif";

const VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260329_050842_be71947f-f16e-4a14-810c-06e83d23ddb5.mp4";

const TOOLS = [
  { label: "Content Audit", query: "Run a content audit of our website", icon: "content" },
  { label: "SEO Evaluation", query: "Evaluate our SEO performance", icon: "chart" },
  { label: "Vision Creator", query: "Help me create a brand vision", icon: "vision" },
  { label: "Competitor Scan", query: "Analyze our competitors and how we compare", icon: "target" },
  { label: "Website Scoring", query: "Score our website for UX and performance", icon: "browser" },
  { label: "Optimize AI", query: "Show me how Primacy can optimize our marketing with AI", icon: "optimize" },
] as const;

const SUGGESTIONS = [
  "What does Primacy do?",
  "Show me your UX & web work",
  "How can you help my healthcare brand?",
  "What's your approach to SEO?",
];

const sw = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
function ToolIcon({ name }: { name: string }) {
  const c = "h-3.5 w-3.5";
  switch (name) {
    case "content":
      return <svg viewBox="0 0 24 24" {...sw} className={c}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13l2 2 3.5-3.5" /></svg>;
    case "chart":
      return <svg viewBox="0 0 24 24" {...sw} className={c}><path d="M3 17l6-6 4 4 8-8" /><path d="M17 7h4v4" /></svg>;
    case "vision":
      return <svg viewBox="0 0 24 24" {...sw} className={c}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>;
    case "target":
      return <svg viewBox="0 0 24 24" {...sw} className={c}><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" /><path d="M12 1v3M12 20v3M1 12h3M20 12h3" /></svg>;
    case "browser":
      return <svg viewBox="0 0 24 24" {...sw} className={c}><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 9h18" /><path d="M6.5 6.5h.01M9.5 6.5h.01" /></svg>;
    default:
      return <svg viewBox="0 0 24 24" {...sw} className={c}><path d="M4 21v-6M4 11V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 15h6M9 8h6M17 16h6" /></svg>;
  }
}

function VideoBackground() {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (v) v.play().catch(() => {});
  }, []);
  return (
    <>
      {/* Always-present gradient fallback (and base for the frosted panel) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(120% 90% at 50% -10%, #dfe7ee 0%, #eef0f1 45%, #e7ebef 100%)",
        }}
      />
      <video
        ref={ref}
        className="absolute left-1/2 top-0 z-0 h-[115%] w-[115%] -translate-x-1/2 object-cover object-top transition-opacity duration-700"
        style={{ opacity: ready ? 1 : 0 }}
        muted
        loop
        playsInline
        preload="auto"
        onCanPlay={() => setReady(true)}
        src={VIDEO_SRC}
      />
    </>
  );
}

export function HeroAiSearch() {
  const { submit } = useSearch();
  const [value, setValue] = useState("");

  const run = (q: string) => {
    const query = q.trim();
    if (!query) return;
    submit(query);
    setValue("");
  };

  return (
    <section id="top" className="relative flex min-h-[100svh] w-full flex-col overflow-hidden">
      <VideoBackground />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-[var(--gutter)] pb-12 pt-[clamp(96px,12vh,150px)]">
        <div className="-mt-6 flex w-full flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-6 text-center">
            <h1
              className="animate-fade-up text-[clamp(2.6rem,7vw,5rem)] font-bold leading-[1] text-black"
              style={{ fontFamily: FUSTAT, letterSpacing: "-0.05em", textWrap: "balance" }}
            >
              How can we help you?
            </h1>
            <p
              className="max-w-[542px] animate-fade-up text-[clamp(1rem,1.6vw,1.25rem)] leading-[1.45] text-[#505050]"
              style={{ fontFamily: FUSTAT, animationDelay: "0.08s" }}
            >
              Search our work, services, and ideas — or just ask. Our AI surfaces the
              right answers and the right team in seconds.
            </p>
          </div>

          {/* Frosted search panel */}
          <div
            className="w-full max-w-[728px] animate-fade-up rounded-[18px] p-4 shadow-[0_24px_60px_rgba(0,0,0,0.18)]"
            style={{
              background: "rgba(0,0,0,0.24)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
              animationDelay: "0.16s",
            }}
          >
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(value);
              }}
              className="flex items-center gap-2.5 rounded-[12px] bg-white py-3 pl-[18px] pr-3 shadow-[0_6px_18px_rgba(0,0,0,0.10)]"
            >
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Ask about our work, services, or ideas…"
                className="min-w-0 flex-1 bg-transparent text-[16px] text-black outline-none placeholder:text-black/55"
                style={{ fontFamily: SCHIBSTED, letterSpacing: "-0.1px" }}
                aria-label="Ask Primacy"
              />
              <button
                type="submit"
                disabled={!value.trim()}
                aria-label="Send"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-black text-white transition active:translate-y-px disabled:opacity-40"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            </form>

            <div className="mt-3.5 flex flex-wrap items-center justify-center gap-2">
              {TOOLS.map((t) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => run(t.query)}
                  className="inline-flex items-center gap-1.5 rounded-md bg-white/[0.14] px-2.5 py-[7px] text-[13px] font-medium text-white transition-colors hover:bg-white/25"
                  style={{ fontFamily: SCHIBSTED, letterSpacing: "-0.1px" }}
                >
                  <ToolIcon name={t.icon} />
                  <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => run(s)}
                className="rounded-full bg-black/[0.28] px-3.5 py-2 text-[13px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black/40"
                style={{ fontFamily: SCHIBSTED }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
