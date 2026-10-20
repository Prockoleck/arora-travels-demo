import { DESTINATIONS } from "../data";

/* Destination-board marquee — a quiet strip of everywhere we drive */
export default function Ticker() {
  const items = [...DESTINATIONS, ...DESTINATIONS];
  return (
    <div
      className="relative overflow-hidden border-y border-paper-2 bg-paper py-3.5"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max items-center">
        {items.map((d, i) => (
          <span
            key={`${d}-${i}`}
            className="flex items-center gap-7 pr-7 text-base font-semibold tracking-tight text-steel sm:text-lg"
          >
            {d}
            <svg width="10" height="10" viewBox="0 0 12 12" className="shrink-0 text-gold">
              <rect x="2.2" y="2.2" width="7.6" height="7.6" transform="rotate(45 6 6)" fill="currentColor" />
            </svg>
          </span>
        ))}
      </div>
    </div>
  );
}
