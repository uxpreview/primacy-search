import { motion } from "framer-motion";
import { work, services, industries, ideas } from "@/data";
import { Cover } from "@/components/ui/Cover";
import { useSearch } from "@/state/SearchProvider";
import { formatDate } from "@/lib/util";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function SectionHead({
  index,
  title,
  href,
}: {
  index: string;
  title: string;
  href: string;
}) {
  return (
    <div className="mb-12 flex items-end justify-between gap-6 border-b border-hairline pb-5">
      <div className="flex items-end gap-4 sm:gap-6">
        <span className="font-display text-[clamp(2.4rem,5vw,4rem)] font-semibold leading-[0.7] tracking-[-0.05em] text-hairline">
          {index}
        </span>
        <h2 className="pb-0.5 font-display text-[clamp(1.9rem,4.4vw,3.4rem)] font-semibold leading-[0.96] tracking-[-0.025em]">
          {title}
        </h2>
      </div>
      <a
        href={href}
        className="hidden shrink-0 items-center gap-1.5 text-[13px] font-semibold text-fg/70 transition-colors hover:text-accent sm:flex"
      >
        View all <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}

export function UniverseScroll() {
  const { submit, setQuery } = useSearch();
  const ask = (q: string) => {
    setQuery(q);
    submit(q);
  };

  return (
    <div className="relative bg-bg px-[var(--gutter)] pb-40">
      <div className="mx-auto max-w-[1200px]">
        {/* STATS — bold statement + metrics, not a centered SaaS band */}
        <section className="grid gap-10 border-b border-hairline py-16 md:grid-cols-[1.15fr_1fr] md:items-end">
          <h2 className="max-w-xl font-display text-[clamp(2.2rem,5.5vw,3.8rem)] font-semibold leading-[0.92] tracking-[-0.035em]">
            Proof in the <span className="text-accent">numbers.</span>
          </h2>
          <div className="flex divide-x divide-hairline">
            {[
              { n: "300", l: "Crafted brands" },
              { n: "200", l: "Digital products" },
              { n: "100", l: "Ventures funded" },
            ].map((s) => (
              <div key={s.l} className="flex-1 px-5 first:pl-0">
                <p className="font-display text-[clamp(1.7rem,4vw,2.9rem)] font-semibold leading-none tracking-[-0.03em] text-fg">
                  <span className="text-accent">+</span>
                  {s.n}
                </p>
                <p className="mt-2.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-faint">
                  {s.l}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* WORK */}
        <section id="work" className="pt-24">
          <SectionHead index="01" title="Outcomes, boldly made." href="#work" />
          <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {work.slice(0, 6).map((w, i) => (
              <motion.a
                key={w.id}
                href={w.href}
                {...reveal}
                transition={{ ...reveal.transition, delay: (i % 3) * 0.06 }}
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
        </section>

        {/* SERVICES */}
        <section id="services" className="pt-32">
          <SectionHead index="02" title="Five ways we move the needle." href="#services" />
          <div className="grid grid-cols-1 md:grid-cols-2">
            {services.slice(0, 6).map((s, i) => (
              <motion.button
                key={s.id}
                {...reveal}
                transition={{ ...reveal.transition, delay: (i % 2) * 0.06 }}
                onClick={() => ask(s.title)}
                className="group flex items-start gap-5 border-b border-hairline py-7 text-left transition-colors hover:bg-surface/60 md:px-6 md:[&:nth-child(odd)]:border-r"
              >
                <span className="mt-1 font-mono text-xs text-faint">
                  {String(i + 1).padStart(2, "0")}
                </span>
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
                <span className="mt-1.5 text-faint opacity-0 transition-all group-hover:translate-x-1 group-hover:text-accent group-hover:opacity-100">
                  →
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* INDUSTRIES */}
        <section id="industries" className="pt-32">
          <SectionHead index="03" title="Built for regulated, complex worlds." href="#industries" />
          <div className="flex flex-wrap gap-3">
            {industries.map((ind, i) => (
              <motion.button
                key={ind.id}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.05 }}
                onClick={() => ask(ind.title)}
                className="group rounded-2xl border border-hairline bg-surface px-6 py-5 text-left transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-card"
              >
                <h3 className="font-display text-xl font-semibold text-fg transition-colors group-hover:text-accent">
                  {ind.title}
                </h3>
                <p className="mt-1 max-w-[15rem] text-[13px] leading-snug text-muted">
                  {ind.sectors.join(" · ")}
                </p>
              </motion.button>
            ))}
          </div>
        </section>

        {/* IDEAS */}
        <section id="ideas" className="pt-32">
          <SectionHead index="04" title="What we're thinking about." href="#ideas" />
          <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {ideas.slice(0, 6).map((idea, i) => (
              <motion.a
                key={idea.id}
                href={idea.href}
                {...reveal}
                transition={{ ...reveal.transition, delay: (i % 3) * 0.06 }}
                className="group flex flex-col border-t-2 border-fg pt-5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-accent">
                    {idea.format}
                  </span>
                  <span className="font-mono text-[11px] text-faint">
                    {idea.readTime}
                    {idea.format === "Podcast" ? " min" : " min read"}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-2xl font-semibold leading-tight tracking-[-0.02em] text-fg transition-colors group-hover:text-accent">
                  {idea.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{idea.excerpt}</p>
                <span className="mt-4 font-mono text-[11px] uppercase tracking-[0.12em] text-faint">
                  {formatDate(idea.date)}
                </span>
              </motion.a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
