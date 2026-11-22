import { aboutStory } from "@/data/about";

/** Who we are: statement and narrative in two equal columns, then the lifecycle ADIDEV connects. */
export function AboutStory() {
  return (
    <section data-nav-theme="light" className="section-y bg-ivory">
      <div className="container-page">
        <p className="eyebrow flex items-center gap-3 text-gold-ink" data-reveal>
          <span className="tabular-nums">01</span>
          <span aria-hidden className="h-px w-10 bg-gold/60" />
          Who we are
        </p>
        <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-16" data-reveal>
          <h2 className="display text-[2.5rem] text-navy sm:text-5xl lg:text-[3.5rem]">{aboutStory.statement}</h2>
          <div className="lg:pt-2">
            <p className="text-[1.0625rem] leading-relaxed text-charcoal">{aboutStory.body}</p>
            <blockquote className="mt-8 border-l-2 border-gold pl-6">
              <p className="font-display text-[1.625rem] leading-snug text-navy italic lg:text-[1.875rem]">“{aboutStory.howWeWork}”</p>
              <footer className="mt-3 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-gold-ink">How we work</footer>
            </blockquote>
          </div>
        </div>

        <div className="mt-12 lg:mt-16" data-reveal>
          <p className="text-center text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-slate">One team across the whole project lifecycle</p>
          <ol className="mt-5 grid grid-cols-1 border-t border-l border-line bg-white sm:grid-cols-3 lg:grid-cols-9">
            {aboutStory.lifecycle.map((step, i) => (
              <li key={step} className="flex items-baseline gap-3 border-r border-b border-line px-4 py-4 lg:flex-col lg:gap-2">
                <span className="font-display text-sm text-gold-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-sm leading-snug font-medium text-navy">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
