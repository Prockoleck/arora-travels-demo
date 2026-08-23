import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { BUSINESS, NAV_LINKS } from "../data";

/* Brand mark: amber plate with taxi-checker strip */
export function Logo() {
  return (
    <a href="#home" className="group flex items-center gap-3" aria-label="Arora Travels — home">
      <span className="relative grid h-10 w-10 place-items-center overflow-hidden bg-gold font-display text-2xl leading-none text-ink transition-transform duration-300 group-hover:-rotate-6">
        A
        <span className="checker absolute inset-x-0 bottom-0 h-[7px]" />
      </span>
      <span className="leading-none">
        <span className="block font-display text-xl tracking-wide text-paper">
          ARORA <span className="text-gold">TRAVELS</span>
        </span>
        <span className="mt-1 block font-mono text-[9px] font-medium tracking-[0.32em] text-fog">
          EST. 1997 · AMRITSAR
        </span>
      </span>
    </a>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-paper/10 bg-ink/90 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.8)] backdrop-blur-md"
          : "bg-gradient-to-b from-ink/80 to-transparent"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-500 sm:px-8 ${
          scrolled ? "py-3" : "py-4"
        }`}
      >
        <Logo />

        {/* desktop links */}
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-fog transition-colors hover:text-paper"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={BUSINESS.phoneTel}
            className="hidden items-center gap-2 bg-gold px-5 py-2.5 text-sm font-bold text-ink transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-soft hover:shadow-[0_10px_30px_-8px_rgba(246,162,27,0.55)] md:flex"
          >
            <Phone size={15} strokeWidth={2.5} />
            <span className="font-mono tracking-tight">{BUSINESS.phoneDisplay}</span>
          </a>
          <a
            href={BUSINESS.phoneTel}
            aria-label="Call Arora Travels"
            className="grid h-10 w-10 place-items-center bg-gold text-ink transition-colors hover:bg-gold-soft md:hidden"
          >
            <Phone size={17} strokeWidth={2.5} />
          </a>
          <button
            className="grid h-10 w-10 place-items-center border border-paper/20 text-paper transition-colors hover:border-gold hover:text-gold lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      {/* mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={reduce ? false : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="border-t border-paper/10 bg-ink/95 px-5 pb-6 pt-2 backdrop-blur-md lg:hidden"
            aria-label="Mobile"
          >
            {NAV_LINKS.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={reduce ? false : { opacity: 0, x: -14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i, duration: 0.25 }}
                className="flex items-center justify-between border-b border-paper/10 py-4 font-display text-2xl uppercase tracking-wide text-paper transition-colors hover:text-gold"
              >
                {l.label}
                <span className="font-mono text-[10px] tracking-[0.3em] text-gold">0{i + 1}</span>
              </motion.a>
            ))}
            <a
              href={BUSINESS.phoneTel}
              className="mt-5 flex items-center justify-center gap-2 bg-gold py-3.5 font-bold text-ink"
            >
              <Phone size={16} strokeWidth={2.5} />
              <span className="font-mono">{BUSINESS.phoneDisplay}</span>
            </a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
