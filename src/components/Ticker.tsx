import { DESTINATIONS } from "../data";

/* Destination-board marquee — like the boards at a Punjabi taxi stand */
export default function Ticker() {
  const items = [...DESTINATIONS, ...DESTINATIONS];
  return (
    <div
      className="relative overflow-hidden border-y-[3px] border-ink bg-gold py-3.5"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max items-center">
        {items.map((d, i) => (
          <span
            key={`${d}-${i}`}
            className="flex items-center gap-7 pr-7 font-display text-lg uppercase tracking-wide text-ink sm:text-xl"
          >
            {d}
            <svg width="11" height="11" viewBox="0 0 12 12" className="shrink-0 text-ink/70">
              <rect x="2.2" y="2.2" width="7.6" height="7.6" transform="rotate(45 6 6)" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
