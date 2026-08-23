import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { BUSINESS, HERO_IMG, STATS, type Booking } from "../data";
import { CountUp } from "./Reveal";

/* Live clock pinned to Indian Standard Time */
function IstClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="border-l border-paper/20 pl-3 font-mono text-[11px] tracking-[0.18em] text-gold-soft">
      IST {time || "—"}
    </span>
  );
}

/* Signature line-mask reveal for the headline */
function MaskedLine({ children, delay }: { children: ReactNode; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-1">
      <motion.span
        className="block"
        initial={reduce ? false : { y: "112%" }}
        animate={{ y: 0 }}
        transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

const PICKUP_CHIPS = ["ATQ Airport", "Golden Temple", "Railway Station", "Wagah Border"];
const DROP_CHIPS = ["ATQ Airport", "City Hotel", "Delhi", "Chandigarh"];

const inputCls =
  "w-full border-2 border-paper-2 bg-white px-4 py-3 text-[15px] font-medium text-ink outline-none transition-colors duration-200 placeholder:text-steel/50 focus:border-gold";

export default function Hero({
  booking,
  patch,
  goBook,
}: {
  booking: Booking;
  patch: (p: Partial<Booking>) => void;
  goBook: () => void;
}) {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-ink">
      {/* backdrop */}
      <div className="absolute inset-0">
        <img
          src={HERO_IMG}
          alt="Premium car on an open highway at dusk"
          className="h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/70" />
        <div className="absolute -right-32 top-1/4 h-[520px] w-[520px] rounded-full bg-gold/10 blur-[130px]" />
      </div>
      <div className="grid-lines absolute inset-0 opacity-60" />

      {/* vertical side label */}
      <p className="absolute left-6 top-1/2 hidden -translate-y-1/2 -rotate-90 font-mono text-[10px] tracking-[0.5em] text-paper/35 xl:block">
        GOL BAGH · AMRITSAR · PUNJAB
      </p>

      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-36">
        {/* ── Left: statement ── */}
        <div>
          <div className="mb-7 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2.5 border border-paper/15 bg-navy/60 px-3.5 py-2 backdrop-blur-sm">
              <span className="dot-live h-2 w-2 rounded-full bg-gold" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-paper">
                Open 24×7 · Gol Bagh Taxi Stand
              </span>
            </span>
            <IstClock />
          </div>

          <h1 className="font-display text-[2.75rem] uppercase leading-[0.98] text-paper sm:text-6xl xl:text-7xl">
            <MaskedLine delay={0.05}>Premium Car Rental</MaskedLine>
            <MaskedLine delay={0.18}>&amp; Taxi Services in</MaskedLine>
            <MaskedLine delay={0.31}>
              <span className="text-gold">Amritsar</span>{" "}
              {/* number-plate badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                transition={{ delay: 0.85, duration: 0.45, type: "spring", stiffness: 260 }}
                className="ml-3 inline-block -translate-y-2 border-[3px] border-ink bg-paper px-3 pb-1 pt-0.5 align-middle font-mono text-sm font-bold tracking-[0.2em] text-ink shadow-[4px_4px_0_rgba(246,162,27,0.9)] sm:text-base xl:translate-y-0 xl:text-lg"
              >
                <span className="flex items-center gap-2">
                  <span className="plate-screw h-1.5 w-1.5 rounded-full" />
                  SINCE ’97
                  <span className="plate-screw h-1.5 w-1.5 rounded-full" />
                </span>
              </motion.span>
            </MaskedLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-fog"
          >
            Not just a car — a <span className="font-semibold text-paper">complete, tailor-made
            transportation solution</span> for executives, families and guests. Economical rates,
            reasonable corporate tariffs, professional chauffeurs. Any hour, any road.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={goBook}
              className="group flex items-center gap-3 bg-gold px-7 py-4 text-sm font-bold uppercase tracking-[0.14em] text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-soft hover:shadow-[0_16px_40px_-10px_rgba(246,162,27,0.65)]"
            >
              Book Your Ride Now
              <ArrowRight size={17} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
            <a
              href={BUSINESS.phoneTel}
              className="group flex items-center gap-3 border border-paper/25 px-7 py-4 text-sm font-bold uppercase tracking-[0.14em] text-paper transition-all duration-300 hover:border-gold hover:text-gold"
            >
              <Phone size={16} className="transition-transform duration-300 group-hover:rotate-12" />
              Call Us
            </a>
          </motion.div>

          {/* stats strip */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.8 }}
            className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-paper/15 pt-8 md:grid-cols-4"
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dd className="order-1 font-display text-3xl text-gold sm:text-4xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dd>
                <dt className="order-2 mt-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                  {s.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ── Right: instant booking widget (styled like a taxi receipt) ── */}
        <motion.aside
          initial={{ opacity: 0, y: 40, rotate: 3 }}
          animate={{ opacity: 1, y: 0, rotate: 1.2 }}
          transition={{ delay: 0.4, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md lg:mx-0"
        >
          <div className="hazard h-2.5 w-full" />
          <div className="border border-t-0 border-paper/10 bg-paper text-ink shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)] transition-transform duration-500 hover:rotate-0">
            <div className="flex items-center justify-between bg-navy px-6 py-4">
              <span className="font-display text-xl uppercase tracking-wide text-paper">
                Instant <span className="text-gold">Booking</span>
              </span>
              <span className="font-mono text-[9px] font-semibold tracking-[0.25em] text-gold-soft">
                NO APP NEEDED
              </span>
            </div>

            <div className="space-y-4 px-6 py-6">
              <div>
                <label htmlFor="w-pickup" className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-steel">
                  Pickup point
                </label>
                <input
                  id="w-pickup"
                  className={inputCls}
                  placeholder="e.g. ATQ Airport, Terminal 1"
                  value={booking.pickup}
                  onChange={(e) => patch({ pickup: e.target.value })}
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {PICKUP_CHIPS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => patch({ pickup: c })}
                      className={`border px-2.5 py-1 font-mono text-[10px] font-medium tracking-wide transition-all duration-200 hover:-translate-y-0.5 ${
                        booking.pickup === c
                          ? "border-gold bg-gold text-ink"
                          : "border-paper-2 bg-white text-steel hover:border-gold hover:text-ink"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="w-drop" className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-steel">
                  Drop point
                </label>
                <input
                  id="w-drop"
                  className={inputCls}
                  placeholder="e.g. Hotel near Golden Temple"
                  value={booking.drop}
                  onChange={(e) => patch({ drop: e.target.value })}
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {DROP_CHIPS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => patch({ drop: c })}
                      className={`border px-2.5 py-1 font-mono text-[10px] font-medium tracking-wide transition-all duration-200 hover:-translate-y-0.5 ${
                        booking.drop === c
                          ? "border-gold bg-gold text-ink"
                          : "border-paper-2 bg-white text-steel hover:border-gold hover:text-ink"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="w-when" className="mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-steel">
                  Date &amp; time
                </label>
                <input
                  id="w-when"
                  type="datetime-local"
                  className={inputCls}
                  value={booking.datetime}
                  onChange={(e) => patch({ datetime: e.target.value })}
                />
              </div>

              <button
                onClick={goBook}
                className="group flex w-full items-center justify-center gap-3 bg-navy py-4 text-sm font-bold uppercase tracking-[0.16em] text-paper transition-all duration-300 hover:bg-ink hover:shadow-[inset_0_0_0_2px_var(--color-gold)]"
              >
                Confirm My Ride
                <ArrowRight size={16} strokeWidth={2.5} className="text-gold transition-transform duration-300 group-hover:translate-x-1.5" />
              </button>

              <div className="flex items-center justify-between border-t border-dashed border-steel/30 pt-3.5">
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-steel">
                  <CheckCircle2 size={13} className="text-gold-deep" /> Free cancellation till 1 hr
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-steel">
                  <span className="h-3 w-1 animate-pulse bg-gold-deep" />
                  METER ARMED
                </span>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to About"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-fog transition-colors hover:text-gold md:flex"
      >
        <span className="font-mono text-[9px] tracking-[0.4em]">SCROLL</span>
        <span className="road-line block h-[3px] w-16" />
      </motion.a>
    </section>
  );
}
