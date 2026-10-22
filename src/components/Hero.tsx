import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { BUSINESS, STATS } from "../data";
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

/* Right-side featured card removed at client's request — the hero keeps an
   open, empty right column on desktop. */

export default function Hero({ goBook }: { goBook: () => void }) {
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

        {/* Right column intentionally empty — hero card removed at client's request */}
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
