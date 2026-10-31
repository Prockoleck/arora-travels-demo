import { useContent } from "../lib/content";

/* Customizable ticker tape — the thin strip that replaced the old
   “Open 24×7 · Gol Bagh Taxi Stand” hero eyebrow. Items and loop
   duration are edited in the admin console (Content → Ticker tape). */
export default function Ticker() {
  const { ticker } = useContent();
  const items = [...ticker.items, ...ticker.items];
  const seconds = Math.min(180, Math.max(5, ticker.seconds || 30));
  return (
    <div
      className="relative overflow-hidden border-y border-paper-2 bg-paper py-3.5"
      aria-hidden="true"
    >
      <div
        className="marquee-track flex w-max items-center hover:[animation-play-state:paused]"
        style={{ animationDuration: `${seconds}s` }}
      >
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
