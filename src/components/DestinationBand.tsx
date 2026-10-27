import { ArrowRight, Phone } from "lucide-react";
import { telHref, useContent } from "../lib/content";
import Reveal from "./Reveal";

/* Solid-navy Wagah Border feature — the framed photo of the Attari–Wagah
   flag ceremony sits beside the copy, mirroring the hero's Golden Temple
   print. Copy, photo and caption are editable from the admin console. */
export default function DestinationBand({ goBook }: { goBook: () => void }) {
  const { band, business } = useContent();

  return (
    <section className="relative overflow-hidden bg-navy">
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-28">
        {/* ── Copy (right on desktop, first on mobile) ── */}
        <Reveal className="lg:col-start-2 lg:row-start-1">
          <span className="inline-flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.3em]">
            <span className="inline-block h-[2px] w-9 bg-gold" aria-hidden="true" />
            <span className="text-gold">{band.eyebrow}</span>
          </span>

          <h2 className="mt-6 font-display text-3xl leading-[1.12] text-white sm:text-4xl xl:text-5xl">
            {band.pre}{" "}
            <span className="text-gold">{band.accent}</span>
          </h2>

          <p className="mt-6 max-w-xl leading-relaxed text-white/80">{band.text}</p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={goBook}
              className="group flex items-center gap-3 rounded-lg bg-gold px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-gold-deep"
            >
              {band.cta}
              <ArrowRight
                size={16}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </button>
            <a
              href={telHref(business.phoneDisplay)}
              className="group flex items-center gap-3 rounded-lg border border-white/30 px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:border-white"
            >
              <Phone size={16} className="transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-mono text-[13px] tracking-tight">{business.phoneDisplay}</span>
            </a>
          </div>
        </Reveal>

        {/* ── Framed print (left on desktop, after the copy on mobile) ── */}
        <Reveal delay={0.1} className="mx-auto w-full max-w-xl lg:col-start-1 lg:row-start-1 lg:mx-0 lg:max-w-none">
          <figure className="relative">
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.85)]">
              <img
                src={band.img}
                alt={band.imgAlt}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover object-[center_35%]"
              />
            </div>
            {band.caption && (
              <figcaption className="absolute bottom-4 left-4 rounded-md bg-white/95 px-3 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-navy shadow-sm">
                {band.caption}
              </figcaption>
            )}
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
