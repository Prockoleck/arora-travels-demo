import { Minus, Plus, Users } from "lucide-react";
import { PASSENGERS_MAX, PASSENGERS_MIN } from "../data";

/* One-line hint mapping party size to the fleet's smallest fit. */
function fitHint(n: number): string {
  if (n <= 4) return "Fits a sedan or SUV (Dzire · Amaze · Innova · Fortuner)";
  if (n <= 12) return "Tempo Traveller (12-seater) fits this group";
  return "Mini Bus (25–30 seats) fits this group";
}

const QUICK = [1, 2, 4, 6, 12];

/** Compact −/+ stepper with quick-pick chips for the booking form. */
export default function PassengerStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  const clamp = (n: number) =>
    Math.min(PASSENGERS_MAX, Math.max(PASSENGERS_MIN, n));

  return (
    <div>
      <span className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-steel">
        Passengers
      </span>

      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-paper-2 bg-white">
          <button
            type="button"
            onClick={() => onChange(clamp(value - 1))}
            disabled={value <= PASSENGERS_MIN}
            aria-label="One fewer passenger"
            className="grid h-[46px] w-11 place-items-center rounded-l-lg text-steel transition-colors hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:text-fog disabled:hover:bg-white"
          >
            <Minus size={16} strokeWidth={2.5} />
          </button>

          <span className="flex w-14 items-center justify-center gap-1 border-x border-paper-2 text-[15px] font-bold tabular-nums text-ink">
            <Users size={15} className="text-gold-deep" />
            {value}
          </span>

          <button
            type="button"
            onClick={() => onChange(clamp(value + 1))}
            disabled={value >= PASSENGERS_MAX}
            aria-label="One more passenger"
            className="grid h-[46px] w-11 place-items-center rounded-r-lg text-steel transition-colors hover:bg-paper hover:text-ink disabled:cursor-not-allowed disabled:text-fog disabled:hover:bg-white"
          >
            <Plus size={16} strokeWidth={2.5} />
          </button>
        </div>

        {/* quick pick */}
        <div className="flex flex-wrap gap-1.5">
          {QUICK.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onChange(clamp(n))}
              className={`rounded-md border px-2.5 py-1.5 font-mono text-[11px] font-medium transition-all ${
                value === n
                  ? "border-navy bg-navy text-white"
                  : "border-paper-2 bg-white text-steel hover:border-gold hover:text-ink"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-2 font-mono text-[10px] tracking-wide text-fog">
        {fitHint(value)} · min {PASSENGERS_MIN} · max {PASSENGERS_MAX}
      </p>
    </div>
  );
}
