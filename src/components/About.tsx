import { ArrowRight } from "lucide-react";
import { useContent } from "../lib/content";
import Reveal, { CountUp, SectionTag } from "./Reveal";

export default function About() {
  const content = useContent();
  return (
    <section id="about" className="relative scroll-mt-20 bg-paper py-24 lg:py-32">
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:gap-20">
        {/* ── Sticky narrative column ── */}
        <div className="self-start lg:sticky lg:top-28">
          <SectionTag light>Since 1997</SectionTag>
          <Reveal>
            <h2 className="mt-5 text-3xl leading-[1.12] text-navy sm:text-4xl xl:text-5xl">
              Twenty-eight years on{" "}
              <span className="relative inline-block">
                Amritsar’s roads.
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 220 10"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <path d="M2 7 Q 60 1 110 5 T 218 4" fill="none" stroke="var(--color-gold)" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-lg text-lg leading-relaxed text-steel">
              Arora Travels began in <strong className="text-navy">1997</strong> with a single taxi
              at the Gol Bagh taxi stand and one promise — <em>reach on time, every time.</em>{" "}
              Today we run a full fleet for{" "}
              <strong className="text-navy">executive and guest transportation</strong>: not just a
              car, but a complete, tailor-made solution at economical rates and reasonable
              corporate tariffs.
            </p>
          </Reveal>
          <Reveal delay={0.18}>
            <p className="mt-5 max-w-lg leading-relaxed text-steel">
              Three generations of drivers, one phone number that has never changed, and a stand
              that answers at 3 AM because someone’s flight always lands at 3 AM.
            </p>
          </Reveal>

          {/* counters */}
          <Reveal delay={0.24}>
            <dl className="mt-10 grid grid-cols-2 gap-3">
              {content.stats.map((s) => (
                <div
                  key={s.label}
                  className="group rounded-xl border border-paper-2 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold"
                >
                  <dd className="font-display text-3xl text-navy sm:text-4xl">
                    <CountUp to={s.value} suffix={s.suffix} />
                  </dd>
                  <dt className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                    {s.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={0.3}>
            <a
              href="#fleet"
              className="group mt-9 inline-flex items-center gap-3 rounded-lg bg-navy px-6 py-3.5 text-sm font-bold text-white transition-colors duration-300 hover:bg-navy-800"
            >
              Meet the fleet
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>
          </Reveal>
        </div>

        {/* ── Heritage photo + timeline ── */}
        <div>
          <Reveal>
            <figure>
              <div className="overflow-hidden rounded-2xl border border-paper-2">
                <img
                  src={content.about.img}
                  alt={content.about.imgAlt}
                  className="block h-auto w-full"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
                {content.about.caption}
              </figcaption>
            </figure>
          </Reveal>

          {/* timeline */}
          <ol className="relative mt-16 space-y-9 border-l-2 border-paper-2 pl-7">
            {content.timeline.map((t, i) => (
              <li key={t.year} className="relative">
                <span
                  className="absolute -left-[37px] top-1.5 h-3.5 w-3.5 rounded-full border-[3px] border-white bg-gold ring-1 ring-paper-2"
                  aria-hidden="true"
                />
                <Reveal delay={i * 0.06}>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <span className="rounded-md border border-gold/40 bg-gold/10 px-2.5 py-0.5 font-mono text-sm font-bold tracking-wider text-gold-deep">
                      {t.year}
                    </span>
                    <h3 className="text-lg font-bold text-navy">{t.title}</h3>
                  </div>
                  <p className="mt-2 max-w-xl leading-relaxed text-steel">{t.text}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
