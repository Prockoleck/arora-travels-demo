import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
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

/* Solid-navy hero with a framed Amritsar slideshow beside the copy — the
   landmarks stand on their own instead of sitting behind the text. */
export default function Hero({ goBook }: { goBook: () => void }) {
  const { hero, business, stats } = useContent();
  const slides = hero.slides;
  const seconds = Math.min(60, Math.max(2, hero.slideSeconds || 7));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      seconds * 1000,
    );
    return () => window.clearInterval(id);
  }, [slides.length, seconds]);

  const active = slides[Math.min(index, slides.length - 1)];

  return (
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden bg-navy">
      <div className="relative mx-auto grid w-full max-w-7xl gap-14 px-5 pb-16 pt-32 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        {/* ── Left: statement ── */}
        <div className="lg:col-start-1 lg:row-start-1">
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
            className="mt-7 max-w-xl text-lg leading-relaxed text-white/80"
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
        </div>

        {/* ── Right: Amritsar landmark slideshow, framed like a signature print ── */}
        <motion.figure
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md lg:col-start-2 lg:row-span-2 lg:mx-0 lg:max-w-none"
        >
          <div
            className="hero-slides relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.85)]"
            style={{ "--hero-slide-sec": `${seconds}s` } as CSSProperties}
          >
            {slides.map((slide, i) => (
              <div
                key={`${slide.src}-${i}`}
                className={`hero-slide absolute inset-0 ${i === index ? "is-active" : ""}`}
                aria-hidden={i !== index}
              >
                <img
                  src={slide.src}
                  alt={slide.alt}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}

            {/* readability gradient for the caption */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-2/5 bg-gradient-to-t from-navy/80 via-navy/25 to-transparent" />

            {active?.caption && (
              <figcaption className="absolute bottom-4 left-4 right-24 z-10 rounded-md bg-white/95 px-3 py-2 font-mono text-[9px] font-semibold uppercase tracking-[0.22em] text-navy shadow-sm sm:right-28">
                <motion.span
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.45 }}
                  className="line-clamp-2"
                >
                  {active.caption}
                </motion.span>
              </figcaption>
            )}

            {slides.length > 1 && (
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 rounded-full bg-navy/45 px-2.5 py-2 backdrop-blur-sm">
                {slides.map((slide, i) => (
                  <button
                    key={`${slide.src}-dot-${i}`}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show slide ${i + 1}${slide.caption ? `: ${slide.caption}` : ""}`}
                    aria-current={i === index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === index ? "w-5 bg-gold" : "w-1.5 bg-white/55 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.figure>

        {/* stats strip — under the photo on mobile, back in the left column on desktop */}
        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.95, duration: 0.8 }}
          className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-white/15 pt-8 md:grid-cols-4 lg:col-start-1 lg:row-start-2 lg:mt-0 lg:grid-cols-2"
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

      {/* scroll cue */}
      <motion.a
        href="#about"
        aria-label="Scroll to About"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/70 transition-colors hover:text-gold md:flex"
      >
        <span className="font-mono text-[9px] tracking-[0.4em]">SCROLL</span>
        <span className="road-line block h-[3px] w-16" />
      </motion.a>
    </section>
  );
}
