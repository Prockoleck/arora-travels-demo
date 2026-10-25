import { ArrowRight } from "lucide-react";
import { SERVICE_ICONS } from "../data";
import { useContent } from "../lib/content";
import Reveal, { SectionTag } from "./Reveal";

export default function Services({ goBook }: { goBook: () => void }) {
  const content = useContent();
  return (
    <section id="services" className="relative scroll-mt-20 overflow-hidden bg-white py-24 lg:py-32">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        {/* header */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div>
            <SectionTag>What we do</SectionTag>
            <Reveal>
              <h2 className="mt-5 text-3xl leading-[1.12] text-navy sm:text-4xl xl:text-5xl">
                Not just a car.
                <br />
                A complete <span className="text-gold-deep">transport solution.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-md leading-relaxed text-steel lg:justify-self-end">
              From a single airport pickup to an entire month of executive guest movement — four
              ways to put Arora Travels on your itinerary.
            </p>
          </Reveal>
        </div>

        {/* service grid */}
        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {content.services.map((s, i) => {
            const Icon = SERVICE_ICONS[i] ?? SERVICE_ICONS[SERVICE_ICONS.length - 1];
            return (
              <Reveal key={s.n} delay={i * 0.08}>
                <article className="group relative h-full rounded-2xl border border-paper-2 bg-white p-8 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold sm:p-10">
                  <span className="absolute right-6 top-5 font-display text-5xl text-paper-2 transition-colors duration-500 group-hover:text-gold/25">
                    {s.n}
                  </span>

                  {/* icon tile */}
                  <div className="relative grid h-14 w-14 place-items-center rounded-xl bg-paper text-navy transition-all duration-500 group-hover:bg-gold group-hover:text-white">
                    <Icon size={24} strokeWidth={2} />
                  </div>

                  <h3 className="mt-6 text-xl font-bold text-navy sm:text-2xl">
                    {s.title}
                  </h3>
                  <p className="mt-3 max-w-md leading-relaxed text-steel">{s.desc}</p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {s.includes.map((inc) => (
                      <li
                        key={inc}
                        className="rounded-md border border-paper-2 px-2.5 py-1 font-mono text-[10px] font-medium tracking-wide text-fog transition-colors duration-300 group-hover:border-gold/40 group-hover:text-gold-deep"
                      >
                        {inc}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={goBook}
                    className="mt-7 inline-flex items-center gap-2 border-b border-transparent pb-0.5 text-sm font-bold text-ink transition-all duration-300 hover:border-gold hover:gap-3.5"
                  >
                    Book this <ArrowRight size={14} strokeWidth={2.5} />
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
