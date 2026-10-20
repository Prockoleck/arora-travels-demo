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
    <section id="fleet" className="relative scroll-mt-20 bg-paper py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <SectionTag light>The fleet &amp; tariffs</SectionTag>
            <Reveal>
              <h2 className="mt-5 text-3xl leading-[1.12] text-navy sm:text-4xl xl:text-5xl">
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

        <div className="mt-14 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {FLEET.map((v, i) => (
            <Reveal key={v.name} delay={i * 0.08}>
              <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-paper-2 bg-white transition-all duration-500 hover:-translate-y-2 hover:border-gold">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <img
                    src={v.img}
                    alt={`${v.name} — ${v.models}`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    loading="lazy"
                  />
                  {v.tag && (
                    <span className="absolute left-3 top-3 rounded-md bg-gold px-2.5 py-1 font-mono text-[9px] font-bold tracking-[0.22em] text-white">
                      {v.tag}
                    </span>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-xl font-bold text-navy">
                    {v.name}
                  </h3>
                  <p className="mt-0.5 font-mono text-[11px] tracking-wide text-fog">{v.models}</p>

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

                  <div className="mt-5 flex items-end justify-between border-t border-paper-2 pt-4">
                    {v.perKm !== null ? (
                      <p className="font-display text-2xl text-navy">
                        ₹{v.perKm}
                        <span className="ml-1 font-mono text-[10px] font-semibold tracking-widest text-fog">
                          /KM
                        </span>
                      </p>
                    ) : (
                      <p className="font-display text-2xl text-navy">
                        ON REQUEST
                      </p>
                    )}
                    <p className="font-mono text-[11px] text-steel">
                      day pack <strong className="text-navy">{v.perDay ?? "custom quote"}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      patch({ vehicle: v.key });
                      goBook();
                    }}
                    className="group/btn mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-navy py-2.5 text-xs font-bold text-white transition-all duration-300 hover:bg-navy-800"
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
          <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-paper-2 pt-6 font-mono text-[11px] tracking-wide text-steel">
            <span className="inline-block h-[2px] w-10 bg-gold" aria-hidden="true" />
            All fares include chauffeur · fuel &amp; tolls at actuals · GST invoices for corporate
            accounts · monthly tariffs on request —{" "}
            <a href={BUSINESS.phoneTel} className="font-bold text-gold-deep underline-offset-4 hover:underline">
              {BUSINESS.phoneDisplay}
            </a>
          </p>
          <p className="mt-3 font-mono text-[9px] leading-relaxed tracking-wide text-fog">
            Fleet photography: Dzire —{" "}
            <a href="https://commons.wikimedia.org/wiki/File:Maruti_Suzuki_Dzire_VXi_VVT_(front).JPG" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">Biswarup Ganguly</a>
            {" "}(<a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">CC BY 3.0</a>) · Amaze —{" "}
            <a href="https://commons.wikimedia.org/wiki/File:Honda_Amaze_India_Side_View.jpg" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">Saiphani02</a>
            {" "}(CC0); Innova Crysta —{" "}
            <a href="https://commons.wikimedia.org/wiki/File:Toyota_Innova_Crysta.jpg" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">Abhishekptlbbk</a>
            {" "}(<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">CC BY-SA 4.0</a>) via Wikimedia Commons · Fortuner, Traveller &amp; minibus via{" "}
            <a href="https://www.pexels.com/" target="_blank" rel="noreferrer" className="underline-offset-2 hover:underline">Pexels</a>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
