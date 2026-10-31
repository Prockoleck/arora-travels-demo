import { Clock3, MapPin, ShieldCheck } from "lucide-react";
import { useContent } from "../lib/content";
import Reveal, { SectionTag } from "./Reveal";

/* Welcome band — sits directly under the hero and the ticker tape.
   Heading and paragraph are editable in the admin console. */
export default function Welcome() {
  const { welcome, business } = useContent();

  const facts = [
    { Icon: MapPin, label: `Gol Bagh stand · since ${business.est}` },
    { Icon: Clock3, label: "Dispatch answered 24×7" },
    { Icon: ShieldCheck, label: "Verified chauffeurs, fixed fares" },
  ];

  return (
    <section id="welcome" className="relative scroll-mt-20 overflow-hidden bg-white py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-16">
        <Reveal>
          <SectionTag>Namaste · Sat Sri Akal</SectionTag>
          <h2 className="mt-5 max-w-md font-display text-3xl leading-[1.08] text-navy sm:text-4xl xl:text-[3.15rem]">
            {welcome.heading}
          </h2>
          <span className="mt-6 block h-[3px] w-16 bg-gold" aria-hidden="true" />
        </Reveal>

        <Reveal delay={0.08} className="lg:border-l lg:border-paper-2 lg:pl-14">
          <p className="max-w-2xl text-lg leading-relaxed text-steel sm:text-[19px]">
            {welcome.text}
          </p>
          <ul className="mt-8 flex flex-wrap gap-2.5">
            {facts.map(({ Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-lg border border-paper-2 bg-paper px-3.5 py-2 text-[12px] font-semibold text-navy"
              >
                <Icon size={14} className="shrink-0 text-gold-deep" />
                {label}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
