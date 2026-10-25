import { Star } from "lucide-react";
import { TESTIMONIAL_ROTATIONS } from "../data";
import { useContent } from "../lib/content";
import Reveal, { SectionTag } from "./Reveal";

/* Word-of-mouth cards — flat, quiet, no gimmicks */
export default function Testimonials() {
  const content = useContent();
  return (
    <section className="relative overflow-hidden bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl">
          <SectionTag light>Word of mouth</SectionTag>
          <Reveal>
            <h2 className="mt-5 text-3xl leading-[1.12] text-navy sm:text-4xl">
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

        <div className="mt-16 grid items-start gap-7 md:grid-cols-3 lg:gap-10">
          {content.testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.12}>
              <figure
                className={`relative h-full rounded-2xl border border-paper-2 bg-white p-7 transition-all duration-500 hover:-translate-y-1.5 hover:border-gold ${
                  TESTIMONIAL_ROTATIONS[i % TESTIMONIAL_ROTATIONS.length]
                }`}
              >
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

                <blockquote className="mt-4 text-[15px] leading-relaxed text-ink">
                  “{t.quote}”
                </blockquote>

                <figcaption className="mt-6 border-t border-paper-2 pt-4">
                  <span className="block font-bold text-navy">{t.name}</span>
                  <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.18em] text-fog">
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
