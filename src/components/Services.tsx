import { ArrowRight } from "lucide-react";
import { SERVICES } from "../data";
import Reveal, { SectionTag } from "./Reveal";

export default function Services({ goBook }: { goBook: () => void }) {
  return (
    <section id="services" className="relative scroll-mt-20 overflow-hidden bg-ink py-24 lg:py-32">
      <div className="grid-lines absolute inset-0" />
      <div className="absolute -left-40 top-0 h-[480px] w-[480px] rounded-full bg-gold/8 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* header */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <SectionTag>What we do</SectionTag>
            <Reveal>
              <h2 className="mt-5 font-display text-4xl uppercase leading-[1.02] text-paper sm:text-5xl xl:text-6xl">
                Not just a car.
                <br />
                A complete <span className="text-gold">transport solution.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-md leading-relaxed text-fog lg:justify-self-end">
              From a single airport pickup to an entire month of executive guest movement — four
              ways to put Arora Travels on your itinerary.
            </p>
          </Reveal>
        </div>

        {/* service grid */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {SERVICES.map((s, i) => {
            const Icon = s.icon;
            return (
              <Reveal key={s.n} delay={i * 0.08}>
                <article className="group relative h-full border border-paper/12 bg-navy/45 p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/70 hover:bg-navy/70 hover:shadow-[0_28px_60px_-25px_rgba(246,162,27,0.25)] sm:p-10">
                  <span className="absolute right-6 top-5 font-display text-5xl text-paper/8 transition-colors duration-500 group-hover:text-gold/20">
                    {s.n}
                  </span>

                  {/* icon on a taxi plate */}
                  <div className="relative h-14 w-14 overflow-hidden border border-paper/15 bg-navy-800 text-gold transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink">
                    <span className="checker absolute inset-x-0 top-0 h-[6px] opacity-70" />
                    <span className="grid h-full w-full place-items-center">
                      <Icon size={24} strokeWidth={2} />
                    </span>
                  </div>

                  <h3 className="mt-6 font-display text-2xl uppercase tracking-wide text-paper sm:text-3xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-md leading-relaxed text-fog">{s.desc}</p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {s.includes.map((inc) => (
                      <li
                        key={inc}
                        className="border border-paper/15 px-2.5 py-1 font-mono text-[10px] font-medium tracking-wide text-fog transition-colors duration-300 group-hover:border-gold/40 group-hover:text-gold-soft"
                      >
                        {inc}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={goBook}
                    className="mt-7 inline-flex items-center gap-2 border-b border-gold/0 pb-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-gold transition-all duration-300 hover:border-gold hover:gap-3.5"
                  >
                    Book this <ArrowRight size={13} strokeWidth={2.5} />
                  </button>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
