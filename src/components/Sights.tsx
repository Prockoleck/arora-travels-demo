import { ArrowRight, Compass } from "lucide-react";
import { useContent } from "../lib/content";
import Reveal, { SectionTag } from "./Reveal";

/* Sightseeing mosaic — six places worth building a day around.
   Copy and photos live in the site content (SIGHTS defaults). */
export default function Sights({ goBook }: { goBook: () => void }) {
  const { sights } = useContent();

  const spans = [
    "lg:col-span-7 lg:row-span-2",
    "lg:col-span-5",
    "lg:col-span-5",
    "lg:col-span-4",
    "lg:col-span-4",
    "lg:col-span-4",
  ];

  return (
    <section id="sights" className="relative scroll-mt-20 overflow-hidden bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <Reveal>
            <SectionTag>Sightseeing</SectionTag>
            <h2 className="mt-5 text-3xl leading-[1.1] text-navy sm:text-4xl xl:text-5xl">
              Amritsar,{" "}
              <span className="text-gold-deep">beyond the postcard.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1} className="lg:justify-self-end">
            <p className="max-w-md leading-relaxed text-steel">
              The Golden Temple is only the beginning. Give us a morning, an afternoon or a
              full day — we’ll string these places together around your darshan timings.
            </p>
            <button
              onClick={goBook}
              className="group mt-5 flex items-center gap-2.5 rounded-lg bg-navy px-5 py-3 text-sm font-bold text-white transition-all duration-300 hover:bg-navy-800"
            >
              <Compass size={16} className="text-gold" />
              Plan a city tour
              <ArrowRight
                size={15}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </Reveal>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[230px]">
          {sights.map((sight, i) => (
            <Reveal
              key={`${sight.title}-${i}`}
              delay={Math.min(0.08 * i, 0.4)}
              className={spans[i] ?? "lg:col-span-4"}
            >
              <article className="group relative h-full min-h-[260px] overflow-hidden rounded-2xl bg-navy lg:min-h-0">
                <img
                  src={sight.img}
                  alt={sight.imgAlt}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1100ms] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/92 via-navy/35 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="font-mono text-[9px] font-semibold uppercase tracking-[0.24em] text-gold-soft">
                    {sight.kicker}
                  </p>
                  <h3 className="mt-2 font-display text-xl leading-tight text-white sm:text-2xl">
                    {sight.title}
                  </h3>
                  <p className="mt-2 max-w-md text-[13px] leading-relaxed text-white/80 line-clamp-2">
                    {sight.text}
                  </p>
                </div>
                <span className="absolute right-5 top-5 h-2 w-2 rounded-full bg-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </article>
            </Reveal>
          ))}
        </div>

        <p className="mt-6 font-mono text-[10px] tracking-wide text-fog">
          Landmark photos via Wikimedia Commons — full credits in the footer.
        </p>
      </div>
    </section>
  );
}
