import { ArrowRight, Luggage, Snowflake, Users } from "lucide-react";
import { BUSINESS, FLEET, type Booking } from "../data";
import Reveal, { SectionTag } from "./Reveal";

export default function Fleet({
  patch,
  goBook,
}: {
  patch: (p: Partial<Booking>) => void;
  goBook: () => void;
}) {
  return (
    <section id="fleet" className="relative scroll-mt-20 bg-paper py-24 text-ink lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <SectionTag light>The fleet &amp; tariffs</SectionTag>
            <Reveal>
              <h2 className="mt-5 font-display text-4xl uppercase leading-[1.02] text-navy sm:text-5xl xl:text-6xl">
                Pick your ride.
                <br />
                <span className="text-gold-deep">We’ll handle the road.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-md leading-relaxed text-steel lg:justify-self-end">
              Transparent per-kilometre and daily tariffs — every fare includes a professional
              chauffeur. Tap <strong className="text-navy">“Book this”</strong> and your vehicle
              preference lands straight in the booking form.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {FLEET.map((v, i) => (
            <Reveal key={v.name} delay={i * 0.08}>
              <article className="group flex h-full flex-col border border-navy/12 bg-white transition-all duration-500 hover:-translate-y-2 hover:border-gold hover:shadow-[0_30px_60px_-25px_rgba(11,30,51,0.35)]">
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={v.img}
                    alt={`${v.name} — ${v.models}`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/45 to-transparent" />
                  {v.tag && (
                    <span className="absolute left-0 top-4 bg-gold px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.22em] text-ink shadow-md">
                      {v.tag}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 font-mono text-[10px] font-semibold tracking-widest text-paper/90">
                    ARORA FLEET
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display text-2xl uppercase tracking-wide text-navy">
                    {v.name}
                  </h3>
                  <p className="mt-0.5 font-mono text-[11px] tracking-wide text-steel">{v.models}</p>

                  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5 font-mono text-[11px] text-steel">
                    <li className="flex items-center gap-1.5">
                      <Users size={13} className="text-gold-deep" /> {v.seats} seats
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Luggage size={13} className="text-gold-deep" /> {v.bags} bags
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Snowflake size={13} className="text-gold-deep" /> AC
                    </li>
                  </ul>

                  <div className="mt-5 flex items-end justify-between border-t border-dashed border-navy/20 pt-4">
                    <p className="font-display text-3xl text-navy">
                      ₹{v.perKm}
                      <span className="ml-1 font-mono text-[10px] font-semibold tracking-widest text-steel">
                        /KM
                      </span>
                    </p>
                    <p className="font-mono text-[11px] text-steel">
                      day pack <strong className="text-navy">{v.perDay}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      patch({ vehicle: v.key });
                      goBook();
                    }}
                    className="group/btn mt-5 flex w-full items-center justify-center gap-2 border-2 border-navy py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-navy transition-all duration-300 hover:bg-navy hover:text-paper"
                  >
                    Book this
                    <ArrowRight size={14} strokeWidth={2.5} className="transition-transform duration-300 group-hover/btn:translate-x-1" />
                  </button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-navy/15 pt-6 font-mono text-[11px] tracking-wide text-steel">
            <span className="hazard inline-block h-2 w-14" aria-hidden="true" />
            All fares include chauffeur · fuel &amp; tolls at actuals · GST invoices for corporate
            accounts · monthly tariffs on request —{" "}
            <a href={BUSINESS.phoneTel} className="font-bold text-gold-deep underline-offset-4 hover:underline">
              {BUSINESS.phoneDisplay}
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
