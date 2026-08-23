import { Facebook, Instagram, MessageCircle, Twitter } from "lucide-react";
import { BUSINESS, NAV_LINKS, SERVICES } from "../data";
import { Logo } from "./Navbar";

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com", Icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com", Icon: Instagram },
  { label: "X (Twitter)", href: "https://www.x.com", Icon: Twitter },
  { label: "WhatsApp", href: BUSINESS.whatsapp, Icon: MessageCircle },
];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-ink">
      <div className="hazard h-2.5 w-full" aria-hidden="true" />

      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_0.95fr_1fr]">
        {/* brand */}
        <div>
          <Logo />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-fog">
            Premium car rental &amp; taxi hire in Amritsar since {BUSINESS.est}. Executive
            transportation, corporate tariffs and 24×7 airport transfers — the tailor-made way.
          </p>
          <p className="mt-6 inline-block border border-gold/40 bg-gold/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
            Est. {BUSINESS.est} · Amritsar
          </p>
        </div>

        {/* quick links */}
        <nav aria-label="Footer">
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-fog">
            Quick links
          </h3>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group flex items-center gap-2 text-sm text-paper/75 transition-colors hover:text-gold"
                >
                  <span className="h-px w-4 bg-gold/40 transition-all duration-300 group-hover:w-6 group-hover:bg-gold" />
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* services */}
        <div>
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-fog">
            Services
          </h3>
          <ul className="mt-5 space-y-3">
            {SERVICES.map((s) => (
              <li key={s.n}>
                <a
                  href="#services"
                  className="group flex items-center gap-2 text-sm text-paper/75 transition-colors hover:text-gold"
                >
                  <span className="h-px w-4 bg-gold/40 transition-all duration-300 group-hover:w-6 group-hover:bg-gold" />
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* contact */}
        <div>
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-fog">
            Contact
          </h3>
          <p className="mt-5 text-sm leading-relaxed text-paper/75">{BUSINESS.addressShort}</p>
          <a
            href={BUSINESS.phoneTel}
            className="mt-3 block font-display text-2xl tracking-wide text-gold transition-colors hover:text-gold-soft"
          >
            {BUSINESS.phoneDisplay}
          </a>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.22em] text-fog">
            Available 24×7 · 365 days
          </p>

          <div className="mt-6 flex gap-2.5">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center border border-paper/15 text-fog transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:bg-gold hover:text-ink"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-8">
          <p className="font-mono text-[11px] tracking-wide text-fog/70">
            © {year} {BUSINESS.name}. All rights reserved.
          </p>
          <p className="font-mono text-[11px] tracking-wide text-fog/70">
            Gol Bagh Taxi Stand Market · Amritsar, Punjab ·{" "}
            <span className="text-gold/80">on the road since {BUSINESS.est}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
