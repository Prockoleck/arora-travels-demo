import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS } from "../data";
import Reveal from "./Reveal";

/* Full-bleed Wagah Border band — the evening border retreat ceremony is the
   other Amritsar landmark every guest asks about. Navy overlay keeps the copy
   legible over the photo at every width. */
export default function DestinationBand({ goBook }: { goBook: () => void }) {
  return (
    <section className="relative overflow-hidden bg-navy">
      <img
        src="/dest/wagah.jpg"
        alt="The India gate at the Attari-Wagah border with the tricolour flying over a packed stadium"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover object-[center_35%] opacity-50"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/75 to-navy/25" />

      <div className="relative mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
        <Reveal className="max-w-2xl">
          <span className="inline-flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.3em]">
            <span className="inline-block h-[2px] w-9 bg-gold" aria-hidden="true" />
            <span className="text-gold">Explore Amritsar</span>
          </span>

          <h2 className="mt-6 font-display text-3xl leading-[1.12] text-white sm:text-4xl xl:text-5xl">
            From the Golden Temple to the{" "}
            <span className="text-gold">Wagah Border</span>
          </h2>

          <p className="mt-6 max-w-xl leading-relaxed text-white/80">
            Airport drops, city darshan and evening trips to the border retreat ceremony —
            our chauffeurs have run every one of these roads, at every hour of the night.
            Tell us where; we’ll take you there.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <button
              onClick={goBook}
              className="group flex items-center gap-3 rounded-lg bg-gold px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-gold-deep"
            >
              Book your ride
              <ArrowRight
                size={16}
                strokeWidth={2.5}
                className="transition-transform duration-300 group-hover:translate-x-1.5"
              />
            </button>
            <a
              href={BUSINESS.phoneTel}
              className="group flex items-center gap-3 rounded-lg border border-white/30 px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:border-white"
            >
              <Phone size={16} className="transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-mono text-[13px] tracking-tight">{BUSINESS.phoneDisplay}</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
