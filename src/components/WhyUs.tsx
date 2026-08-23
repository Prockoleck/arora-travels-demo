import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS, IMAGES, REASONS } from "../data";
import Reveal, { SectionTag } from "./Reveal";

export default function WhyUs() {
  return (
    <section id="why" className="relative scroll-mt-20 overflow-hidden bg-navy py-24 lg:py-32">
      <div className="grid-lines absolute inset-0" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="absolute -right-32 bottom-0 h-[420px] w-[420px] rounded-full bg-gold/8 blur-[110px]" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* sticky promise column */}
        <div className="self-start lg:sticky lg:top-28">
          <SectionTag>The Arora promise</SectionTag>
          <Reveal>
            <h2 className="mt-5 font-display text-4xl uppercase leading-[1.02] text-paper sm:text-5xl xl:text-6xl">
              Why Amritsar
              <br />
              calls us <span className="text-gold">first.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-md leading-relaxed text-fog">
              Anyone can park a car at a stand. Very few can keep a 28-year promise. These are the
              four reasons our phone never stops ringing.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <figure className="mt-10 max-w-xs">
              <div className="relative overflow-hidden border-4 border-paper/10">
                <img
                  src={IMAGES.chauffeur}
                  alt="An Arora Travels chauffeur in uniform beside a sedan"
                  className="h-80 w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
                <span className="checker absolute inset-x-0 bottom-0 h-2" />
              </div>
              <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
                Our chauffeurs · verified &amp; uniformed
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.24}>
            <a
              href={BUSINESS.phoneTel}
              className="group mt-10 inline-flex items-center gap-4 transition-colors"
            >
              <span className="grid h-13 w-13 shrink-0 place-items-center bg-gold p-3.5 text-ink transition-transform duration-300 group-hover:-rotate-6 group-hover:bg-gold-soft">
                <Phone size={20} strokeWidth={2.5} />
              </span>
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-fog">
                  One call, 24×7
                </span>
                <span className="block font-display text-2xl tracking-wide text-gold transition-colors group-hover:text-gold-soft sm:text-3xl">
                  {BUSINESS.phoneDisplay}
                </span>
              </span>
            </a>
          </Reveal>
        </div>

        {/* reason ledger */}
        <div>
          {REASONS.map((r, i) => {
            const Icon = r.icon;
            return (
              <Reveal key={r.title} delay={i * 0.07}>
                <div className="group -mx-4 grid grid-cols-[auto_1fr] items-start gap-5 border-t border-paper/12 px-4 py-8 transition-all duration-500 last:border-b hover:bg-paper/[0.045] sm:grid-cols-[auto_auto_1fr] sm:gap-7">
                  <span className="pt-1 font-mono text-xs font-bold tracking-[0.2em] text-gold">
                    0{i + 1}
                  </span>
                  <span className="hidden h-12 w-12 place-items-center border border-gold/35 bg-navy-800 text-gold transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-ink sm:grid">
                    <Icon size={21} strokeWidth={2} />
                  </span>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl uppercase tracking-wide text-paper sm:text-3xl">
                        {r.title}
                      </h3>
                      <p className="mt-2.5 max-w-xl leading-relaxed text-fog">{r.desc}</p>
                    </div>
                    <ArrowRight
                      size={20}
                      className="mt-2 shrink-0 -translate-x-2 text-gold opacity-0 transition-all duration-400 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}

          <Reveal delay={0.3}>
            <p className="mt-8 font-mono text-[11px] leading-relaxed tracking-wide text-fog/70">
              * Rates reviewed quarterly, never mid-journey. The quote on the phone is the quote on
              the bill.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
