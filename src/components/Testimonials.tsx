import { Star } from "lucide-react";
import { TESTIMONIALS } from "../data";
import Reveal, { SectionTag } from "./Reveal";

/* Scattered postcards — slight rotations that straighten on hover */
export default function Testimonials() {
  return (
    <section className="relative overflow-hidden bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <SectionTag light>Word of mouth</SectionTag>
          <Reveal>
            <h2 className="mt-5 font-display text-4xl uppercase leading-[1.02] text-navy sm:text-5xl">
              Postcards from <span className="text-gold-deep">our passengers.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 leading-relaxed text-steel">
              Twenty-eight years in this business means most of our bookings come the old way — a
              friend telling a friend.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid items-start gap-10 md:grid-cols-3 md:gap-7 lg:gap-10">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.12} className={i === 1 ? "md:mt-12" : ""}>
              <figure
                className={`relative border border-navy/12 bg-white p-7 pt-9 shadow-[0_22px_50px_-22px_rgba(11,30,51,0.3)] transition-all duration-500 hover:z-10 hover:-translate-y-2 hover:rotate-0 hover:shadow-[0_34px_70px_-26px_rgba(11,30,51,0.42)] ${t.rotate}`}
              >
                {/* tape */}
                <span
                  className="absolute -top-3 left-9 h-6 w-24 -rotate-3 bg-gold/60 shadow-sm"
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute right-4 top-1 font-display text-7xl leading-none text-gold/20"
                  aria-hidden="true"
                >
                  ”
                </span>

                <div className="flex gap-1 text-gold" aria-label="5 star rating">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={14} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>

                <blockquote className="mt-4 text-[15px] leading-relaxed text-navy">
                  “{t.quote}”
                </blockquote>

                <figcaption className="mt-6 border-t border-dashed border-navy/20 pt-4">
                  <span className="block font-bold text-navy">{t.name}</span>
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-steel">
                    {t.role}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
