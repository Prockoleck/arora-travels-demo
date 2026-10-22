import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Luggage, Phone, Users } from "lucide-react";
import { BUSINESS, FLEET, STATS, type Booking } from "../data";
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
    <span className="border-l border-paper-2 pl-3 font-mono text-[11px] tracking-[0.18em] text-fog">
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

/* Featured car for the hero card — the flagship SUV (executive class).
   Its photo is the client's own; fares are the published tariff only. */
const FEATURED = FLEET.find((v) => v.tag === "EXECUTIVE") ?? FLEET[0];

export default function Hero({
  patch,
  goBook,
}: {
  patch: (p: Partial<Booking>) => void;
  goBook: () => void;
}) {
  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-white">
      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:pt-36">
        {/* ── Left: statement ── */}
        <div>
          <div className="mb-7 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2.5 rounded-lg border border-paper-2 bg-white px-3.5 py-2">
              <span className="dot-live h-2 w-2 rounded-full bg-wa" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-steel">
                Open 24×7 · Gol Bagh Taxi Stand
              </span>
            </span>
            <IstClock />
          </div>

          <h1 className="font-display text-[2.4rem] leading-[1.04] text-ink sm:text-5xl xl:text-6xl">
            <MaskedLine delay={0.05}>Premium car rental</MaskedLine>
            <MaskedLine delay={0.18}>&amp; taxi services in</MaskedLine>
            <MaskedLine delay={0.31}>
              <span className="text-gold-deep">Amritsar</span>{" "}
              {/* number-plate badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                transition={{ delay: 0.85, duration: 0.45, type: "spring", stiffness: 260 }}
                className="ml-3 inline-block -translate-y-2 rounded-md border-2 border-navy bg-white px-3 pb-1 pt-0.5 align-middle font-mono text-sm font-bold tracking-[0.2em] text-navy sm:text-base xl:translate-y-0 xl:text-lg"
              >
                SINCE ’97
              </motion.span>
            </MaskedLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-steel"
          >
            Not just a car — a{" "}
            <span className="font-semibold text-ink">
              complete, tailor-made transportation solution
            </span>{" "}
            for executives, families and guests. Economical rates, reasonable corporate tariffs,
            professional chauffeurs. Any hour, any road.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={goBook}
              className="group flex items-center gap-3 rounded-lg bg-navy px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-navy-800"
            >
              Book your ride now
              <ArrowRight size={17} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
            <a
              href={BUSINESS.phoneTel}
              className="group flex items-center gap-3 rounded-lg border border-paper-2 px-7 py-4 text-sm font-bold text-ink transition-all duration-300 hover:border-navy"
            >
              <Phone size={16} className="transition-transform duration-300 group-hover:rotate-12" />
              Call us
            </a>
          </motion.div>

          {/* stats strip */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.8 }}
            className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-paper-2 pt-8 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
          >
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dd className="order-1 font-display text-3xl text-ink sm:text-4xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dd>
                <dt className="order-2 mt-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                  {s.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ── Right: featured fleet card ── */}
        <motion.aside
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md lg:mx-0"
        >
          <div className="overflow-hidden rounded-2xl border border-paper-2 bg-white shadow-[0_24px_60px_-40px_rgba(16,35,63,0.35)]">
            <div className="flex items-center justify-between border-b border-paper-2 bg-paper px-6 py-4">
              <span className="font-display text-lg text-ink">
                Meet the <span className="text-gold-deep">fleet</span>
              </span>
              <a
                href="#fleet"
                className="group flex items-center gap-1.5 font-mono text-[9px] font-semibold tracking-[0.25em] text-gold-deep"
              >
                ALL FARES
                <ArrowRight
                  size={11}
                  strokeWidth={2.5}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </a>
            </div>

            {/* brand logo panel (client's request — replaces the car photo) */}
            <div className="relative">
              <img
                src="/logo.jpg"
                alt="Arora Travels logo"
                className="aspect-[16/9] w-full object-contain p-6 sm:p-8"
              />
              <span className="absolute left-4 top-4 rounded-md bg-navy px-2.5 py-1 font-mono text-[9px] font-semibold tracking-[0.2em] text-white">
                {FEATURED.tag ?? "THE FLEET"}
              </span>
              <span className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 font-mono text-[9px] font-semibold tracking-[0.16em] text-steel shadow-sm">
                <span className="dot-live h-1.5 w-1.5 rounded-full bg-wa" />
                LIVE DISPATCH
              </span>
            </div>

            {/* car details + quick book */}
            <div className="px-6 py-5">
              <div className="flex items-baseline justify-between gap-3">
                <h2 className="font-display text-xl text-ink">{FEATURED.name}</h2>
                <span className="shrink-0 font-mono text-[11px] font-semibold tracking-wide text-gold-deep">
                  ₹{FEATURED.perKm}/km · {FEATURED.perDay}/day
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5 rounded-md border border-paper-2 px-2.5 py-1 text-[11px] text-steel">
                  <Users size={12} className="text-gold-deep" /> {FEATURED.seats} seats
                </span>
                <span className="flex items-center gap-1.5 rounded-md border border-paper-2 px-2.5 py-1 text-[11px] text-steel">
                  <Luggage size={12} className="text-gold-deep" /> {FEATURED.bags} bags
                </span>
                <span className="rounded-md border border-paper-2 px-2.5 py-1 text-[11px] text-steel">
                  Chauffeur-driven
                </span>
              </div>

              <button
                onClick={() => {
                  patch({ vehicle: FEATURED.key });
                  goBook();
                }}
                className="group mt-5 flex w-full items-center justify-center gap-3 rounded-lg bg-navy py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-navy-800"
              >
                Book this car
                <ArrowRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </button>

              <div className="mt-3.5 flex items-center justify-between gap-2 border-t border-paper-2 pt-3.5">
                <span className="flex items-center gap-1.5 font-mono text-[10px] text-steel">
                  <CheckCircle2 size={13} className="text-gold-deep" /> Free cancellation till 1 hr
                </span>
                <a
                  href={BUSINESS.phoneTel}
                  className="flex shrink-0 items-center gap-1.5 font-mono text-[10px] text-steel transition-colors hover:text-gold-deep"
                >
                  <Phone size={12} /> {BUSINESS.phoneDisplay}
                </a>
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
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-fog transition-colors hover:text-gold-deep md:flex"
      >
        <span className="font-mono text-[9px] tracking-[0.4em]">SCROLL</span>
        <span className="road-line block h-[3px] w-16" />
      </motion.a>
    </section>
  );
}
