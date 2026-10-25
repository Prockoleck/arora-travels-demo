import { type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Phone } from "lucide-react";
import { telHref, useContent } from "../lib/content";
import { CountUp } from "./Reveal";

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

/* Navy hero with the Golden Temple washed into the background — the same
   photo-behind-navy treatment as the Wagah band, so landmarks carry the page. */
export default function Hero({ goBook }: { goBook: () => void }) {
  const { hero, business, stats } = useContent();

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-navy">
      {/* landmark backdrop */}
      <img
        src={hero.img}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover object-[center_38%] opacity-60"
      />
      {/* navy wash — horizontal keeps the copy side dark, vertical grounds the stats */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/88 to-navy/35" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-transparent to-navy/55" />

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-20 pt-32 sm:px-8 lg:pt-40">
        <div className="max-w-3xl">
          <div className="mb-7 flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2.5 rounded-lg border border-white/20 bg-white/10 px-3.5 py-2 backdrop-blur-sm">
              <span className="dot-live h-2 w-2 rounded-full bg-wa" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.24em] text-white/85">
                {hero.eyebrow}
              </span>
            </span>
          </div>

          <h1 className="font-display text-[2.4rem] leading-[1.04] text-white sm:text-5xl xl:text-6xl">
            <MaskedLine delay={0.05}>{hero.line1}</MaskedLine>
            <MaskedLine delay={0.18}>{hero.line2}</MaskedLine>
            <MaskedLine delay={0.31}>
              <span className="text-gold">{hero.accent}</span>{" "}
              {/* number-plate badge */}
              <motion.span
                initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
                animate={{ opacity: 1, scale: 1, rotate: -2 }}
                transition={{ delay: 0.85, duration: 0.45, type: "spring", stiffness: 260 }}
                className="ml-3 inline-block -translate-y-2 rounded-md border-2 border-white/70 bg-white px-3 pb-1 pt-0.5 align-middle font-mono text-sm font-bold tracking-[0.2em] text-navy sm:text-base xl:translate-y-0 xl:text-lg"
              >
                {hero.badge}
              </motion.span>
            </MaskedLine>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-white/75"
          >
            {hero.subA}{" "}
            {hero.subBold && <span className="font-semibold text-white">{hero.subBold}</span>}{" "}
            {hero.subEnd}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <button
              onClick={goBook}
              className="group flex items-center gap-3 rounded-lg bg-gold px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-gold-deep"
            >
              {hero.cta}
              <ArrowRight size={17} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
            <a
              href={telHref(business.phoneDisplay)}
              className="group flex items-center gap-3 rounded-lg border border-white/30 px-7 py-4 text-sm font-bold text-white transition-all duration-300 hover:border-white"
            >
              <Phone size={16} className="transition-transform duration-300 group-hover:rotate-12" />
              <span className="font-mono tracking-tight">{business.phoneDisplay}</span>
            </a>
          </motion.div>

          {/* stats strip */}
          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95, duration: 0.8 }}
            className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-8 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4"
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col">
                <dd className="order-1 font-display text-3xl text-white sm:text-4xl">
                  <CountUp to={s.value} suffix={s.suffix} />
                </dd>
                <dt className="order-2 mt-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
                  {s.label}
                </dt>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      {/* photo credit, bottom-right over the wash */}
      {hero.caption && (
        <span className="absolute bottom-24 right-8 hidden font-mono text-[9px] uppercase tracking-[0.25em] text-white/50 lg:block">
          {hero.caption}
        </span>
      )}

      {/* scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to About"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition-colors hover:text-gold md:flex"
      >
        <span className="font-mono text-[9px] tracking-[0.4em]">SCROLL</span>
        <span className="road-line block h-[3px] w-16" />
      </motion.a>
    </section>
  );
}
