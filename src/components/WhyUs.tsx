import { ArrowRight, Phone } from "lucide-react";
import { REASON_ICONS } from "../data";
import { telHref, useContent } from "../lib/content";
import Reveal, { SectionTag } from "./Reveal";

export default function WhyUs() {
  const content = useContent();
  const { business } = content;
  return (
    <section id="why" className="relative scroll-mt-20 overflow-hidden bg-white py-24 lg:py-32">
      <div className="relative mx-auto grid max-w-7xl gap-16 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        {/* sticky promise column */}
        <div className="self-start lg:sticky lg:top-28">
          <SectionTag>The Arora promise</SectionTag>
          <Reveal>
            <h2 className="mt-5 text-3xl leading-[1.12] text-navy sm:text-4xl xl:text-5xl">
              Why Amritsar
              <br />
              calls us <span className="text-gold-deep">first.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-7 max-w-md leading-relaxed text-steel">
              Anyone can park a car at a stand. Very few can keep a 28-year promise. These are the
              four reasons our phone never stops ringing.
            </p>
          </Reveal>

          <Reveal delay={0.18}>
            <figure className="mt-10 max-w-xs">
              <div className="overflow-hidden rounded-2xl border border-paper-2">
                <img
                  src={content.why.img}
                  alt={content.why.imgAlt}
                  className="h-80 w-full object-cover transition-transform duration-700 hover:scale-105"
                  loading="lazy"
                />
              </div>
              <figcaption className="mt-3 font-mono text-[10px] uppercase tracking-[0.25em] text-fog">
                {content.why.caption}
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={0.24}>
            <a
              href={telHref(business.phoneDisplay)}
              className="group mt-10 inline-flex items-center gap-4 transition-colors"
            >
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-navy text-white transition-transform duration-300 group-hover:-rotate-6">
                <Phone size={20} strokeWidth={2.5} />
              </span>
              <span>
                <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-fog">
                  One call, 24×7
                </span>
                <span className="block font-display text-2xl text-navy transition-colors group-hover:text-gold-deep sm:text-3xl">
                  {business.phoneDisplay}
                </span>
              </span>
            </a>
          </Reveal>
        </div>

        {/* reason ledger */}
        <div>
          {content.reasons.map((r, i) => {
            const Icon = REASON_ICONS[i] ?? REASON_ICONS[REASON_ICONS.length - 1];
            return (
              <Reveal key={r.title} delay={i * 0.07}>
                <div className="group -mx-4 grid grid-cols-[auto_1fr] items-start gap-5 border-t border-paper-2 px-4 py-8 transition-all duration-500 last:border-b hover:bg-paper sm:grid-cols-[auto_auto_1fr] sm:gap-7">
                  <span className="pt-1 font-mono text-xs font-bold tracking-[0.2em] text-gold-deep">
                    0{i + 1}
                  </span>
                  <span className="hidden h-12 w-12 place-items-center rounded-xl border border-paper-2 bg-paper text-navy transition-all duration-500 group-hover:border-gold group-hover:bg-gold group-hover:text-white sm:grid">
                    <Icon size={21} strokeWidth={2} />
                  </span>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-navy sm:text-2xl">
                        {r.title}
                      </h3>
                      <p className="mt-2.5 max-w-xl leading-relaxed text-steel">{r.desc}</p>
                    </div>
                    <ArrowRight
                      size={20}
                      className="mt-2 shrink-0 -translate-x-2 text-gold-deep opacity-0 transition-all duration-400 group-hover:translate-x-0 group-hover:opacity-100"
                    />
                  </div>
                </div>
              </Reveal>
            );
          })}

          <Reveal delay={0.3}>
            <p className="mt-8 font-mono text-[11px] leading-relaxed tracking-wide text-fog">
              * Rates reviewed quarterly, never mid-journey. The quote on the phone is the quote on
              the bill.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
