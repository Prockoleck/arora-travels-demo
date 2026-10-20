import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, Phone, X } from "lucide-react";
import { BUSINESS, NAV_LINKS } from "../data";

/* Brand logo: official Arora Travels artwork */
export function Logo() {
  return (
    <a href="#home" className="group flex items-center" aria-label="Arora Travels — home">
      <img
        src="/logo.jpg"
        alt="Arora Travels"
        width={428}
        height={118}
        className="h-7 w-auto md:h-[30px]"
      />
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
      className={`fixed inset-x-0 top-0 z-50 bg-white transition-all duration-300 ${
        scrolled ? "border-b border-paper-2 shadow-[0_2px_12px_-6px_rgba(16,35,63,0.12)]" : ""
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-5 transition-all duration-300 sm:px-8 ${
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
              className="group relative text-sm font-semibold text-steel transition-colors hover:text-ink"
            >
              {l.label}
              <span className="absolute -bottom-1.5 left-0 h-0.5 w-full origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={BUSINESS.phoneTel}
            className="hidden items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-navy-800 md:flex"
          >
            <Phone size={15} strokeWidth={2.5} />
            <span className="font-mono text-[13px] tracking-tight">{BUSINESS.phoneDisplay}</span>
          </a>
          <a
            href={BUSINESS.phoneTel}
            aria-label="Call Arora Travels"
            className="grid h-10 w-10 place-items-center rounded-lg bg-navy text-white transition-colors hover:bg-navy-800 md:hidden"
          >
            <Phone size={17} strokeWidth={2.5} />
          </a>
          <button
            className="grid h-10 w-10 place-items-center rounded-lg border border-paper-2 text-ink transition-colors hover:border-navy lg:hidden"
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
            className="border-t border-paper-2 bg-white px-5 pb-6 pt-2 lg:hidden"
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
                className="flex items-center justify-between border-b border-paper-2 py-4 text-lg font-bold text-ink transition-colors hover:text-gold-deep"
              >
                {l.label}
                <span className="font-mono text-[10px] tracking-[0.3em] text-gold">0{i + 1}</span>
              </motion.a>
            ))}
            <a
              href={BUSINESS.phoneTel}
              className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-navy py-3.5 font-bold text-white"
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
