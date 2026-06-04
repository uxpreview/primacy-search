import { motion } from "framer-motion";
import type { View } from "@/data/nav";
import { work, services, industries, ideas } from "@/data";
import { Cover } from "@/components/ui/Cover";
import { useSearch } from "@/state/SearchProvider";
import { formatDate } from "@/lib/util";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
};

const META: Record<Exclude<View, "ask">, { title: string; lede: string }> = {
  work: {
    title: "Work",
    lede: "Selected work for health systems, universities, financial brands, and the teams behind them.",
  },
  services: {
    title: "Services",
    lede: "Strategy, creative, technology, and media, working as one to move the metrics that matter.",
  },
  insights: {
    title: "Insights",
    lede: "Field notes on AI, experience design, and growth from the people doing the work.",
  },
  about: {
    title: "About Primacy",
    lede: "A digital experience agency built around elevating your vision into striking reality.",
  },
  contact: {
    title: "Let's talk",
    lede: "Tell us what you're building. We'll bring the right team to the table.",
  },
};

function PageHeader({ view }: { view: Exclude<View, "ask"> }) {
  const m = META[view];
  return (
    <motion.header {...fade} className="max-w-3xl">
      <h1 className="font-display text-[clamp(2.4rem,6vw,4.25rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-fg">
        {m.title}
      </h1>
      <p className="mt-5 max-w-xl text-[17px] leading-relaxed text-muted">{m.lede}</p>
    </motion.header>
  );
}

function WorkView() {
  return (
    <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
      {work.map((w, i) => (
        <motion.a
          key={w.id}
          href={w.href}
          {...fade}
          transition={{ ...fade.transition, delay: (i % 3) * 0.05 }}
          className="group block"
        >
          <Cover id={w.id} label={w.industry} aspect="4 / 3" className="rounded-xl" />
          <div className="mt-4 flex items-baseline justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              {w.client}
            </p>
            <p className="font-mono text-[11px] text-faint">{w.year}</p>
          </div>
          <h3 className="mt-2 font-display text-xl font-semibold leading-snug tracking-[-0.015em] text-fg transition-colors group-hover:text-accent">
            {w.title}
          </h3>
          {w.metric && <p className="mt-2 text-sm font-semibold text-accent">{w.metric}</p>}
        </motion.a>
      ))}
    </div>
  );
}

function ServicesView() {
  const { submit, setQuery } = useSearch();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2">
      {services.map((s, i) => (
        <motion.button
          key={s.id}
          {...fade}
          transition={{ ...fade.transition, delay: (i % 2) * 0.05 }}
          onClick={() => {
            setQuery(s.title);
            submit(s.title);
          }}
          className="group flex items-start gap-5 border-b border-hairline py-7 text-left transition-colors hover:bg-surface/60 md:px-6 md:[&:nth-child(odd)]:border-r"
        >
          <span className="mt-1 font-mono text-xs text-faint">{String(i + 1).padStart(2, "0")}</span>
          <span className="flex-1">
            <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="font-display text-2xl font-semibold tracking-[-0.015em] text-fg transition-colors group-hover:text-accent">
                {s.title}
              </h3>
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-faint">
                {s.category}
              </span>
            </span>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{s.excerpt}</p>
          </span>
        </motion.button>
      ))}
    </div>
  );
}

function InsightsView() {
  return (
    <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
      {ideas.map((idea, i) => (
        <motion.a
          key={idea.id}
          href={idea.href}
          {...fade}
          transition={{ ...fade.transition, delay: (i % 3) * 0.05 }}
          className="group flex flex-col border-t border-hairline pt-5"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-accent">
              {idea.format}
            </span>
            <span className="font-mono text-[11px] text-faint">{idea.readTime} min</span>
          </div>
          <h3 className="mt-4 font-display text-xl font-semibold leading-tight tracking-[-0.02em] text-fg transition-colors group-hover:text-accent">
            {idea.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{idea.excerpt}</p>
          <span className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
            {formatDate(idea.date)}
          </span>
        </motion.a>
      ))}
    </div>
  );
}

function AboutView() {
  return (
    <div className="space-y-16">
      <motion.div {...fade} className="grid gap-10 md:grid-cols-3">
        {[
          { n: "300", l: "Crafted brands" },
          { n: "200", l: "Digital products" },
          { n: "100", l: "Ventures funded" },
        ].map((s) => (
          <div key={s.l}>
            <p className="font-display text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-none tracking-[-0.03em] text-fg">
              <span className="text-accent">+</span>
              {s.n}
            </p>
            <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-faint">{s.l}</p>
          </div>
        ))}
      </motion.div>
      <motion.p {...fade} className="max-w-2xl text-[19px] leading-[1.7] text-fg">
        We're storytellers, technologists, and strategists who help universities,
        health systems, and financial brands grow. Trusted for 10+ years by the
        institutions we serve, we pair deep industry understanding with the craft
        to make experiences people remember.
      </motion.p>
      <motion.div {...fade} className="flex flex-wrap gap-3">
        {industries.map((ind) => (
          <span key={ind.id} className="rounded-full border border-hairline px-4 py-2 text-sm text-fg/75">
            {ind.title}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

function ContactView() {
  return (
    <motion.div {...fade} className="space-y-14">
      <a
        href="mailto:hello@primacy.com"
        className="inline-block font-display text-[clamp(1.8rem,5vw,3.25rem)] font-semibold tracking-[-0.02em] text-fg underline decoration-accent decoration-2 underline-offset-[8px] transition-colors hover:text-accent"
      >
        hello@primacy.com
      </a>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3">
        {[
          { city: "Boston", line: "60 South Street, MA" },
          { city: "Farmington", line: "200 Day Hill Rd, CT" },
          { city: "Jupiter", line: "1200 Town Center, FL" },
        ].map((o) => (
          <div key={o.city}>
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-fg">{o.city}</p>
            <p className="mt-2 text-sm text-muted">{o.line}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export function PageView({ view }: { view: Exclude<View, "ask"> }) {
  return (
    <div className="min-h-[100svh] px-[var(--gutter)] pb-44 pt-32">
      <div className="mx-auto max-w-[1200px]">
        <PageHeader view={view} />
        <div className="mt-16">
          {view === "work" && <WorkView />}
          {view === "services" && <ServicesView />}
          {view === "insights" && <InsightsView />}
          {view === "about" && <AboutView />}
          {view === "contact" && <ContactView />}
        </div>
      </div>
    </div>
  );
}
