import { Facebook, Instagram, Mail, MessageCircle, Twitter } from "lucide-react";
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
    <footer className="relative border-t border-paper-2 bg-paper">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-[1.35fr_0.75fr_0.95fr_1fr]">
        {/* brand */}
        <div>
          <Logo />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-steel">
            Premium car rental &amp; taxi hire in Amritsar since {BUSINESS.est}. Executive
            transportation, corporate tariffs and 24×7 airport transfers — the tailor-made way.
          </p>
          <p className="mt-6 inline-block rounded-md border border-gold/40 bg-gold/10 px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-gold-deep">
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
                  className="group flex items-center gap-2 text-sm text-steel transition-colors hover:text-navy"
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
                  className="group flex items-center gap-2 text-sm text-steel transition-colors hover:text-navy"
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
          <p className="mt-5 text-sm leading-relaxed text-steel">{BUSINESS.addressShort}</p>
          <a
            href={BUSINESS.phoneTel}
            className="mt-3 block font-display text-2xl text-navy transition-colors hover:text-gold-deep"
          >
            {BUSINESS.phoneDisplay}
          </a>
          <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] text-steel">
            {BUSINESS.phones.slice(1).map((p) => (
              <a key={p.tel} href={p.tel} className="transition-colors hover:text-gold-deep">
                {p.display}
              </a>
            ))}
          </p>
          <a
            href={`mailto:${BUSINESS.email}`}
            className="mt-3 flex items-center gap-2 text-sm text-steel transition-colors hover:text-navy"
          >
            <Mail size={14} className="shrink-0 text-gold-deep" />
            {BUSINESS.email}
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
                className="grid h-10 w-10 place-items-center rounded-lg border border-paper-2 bg-white text-steel transition-all duration-300 hover:-translate-y-1 hover:border-navy hover:bg-navy hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-paper-2">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-8">
          <p className="font-mono text-[11px] tracking-wide text-fog">
            © {year} {BUSINESS.name}. All rights reserved.
          </p>
          <p className="font-mono text-[11px] tracking-wide text-fog">
            Gol Bagh Taxi Stand Market · Amritsar, Punjab ·{" "}
            <span className="text-gold-deep">on the road since {BUSINESS.est}</span>
          </p>
          <p className="w-full font-mono text-[9px] tracking-wide text-fog/80 lg:w-auto">
            Landmark photos via Wikimedia Commons — Golden Temple © Bernard Gagnon · Wagah
            Border © Tamjeed Ahmed (CC BY-SA 4.0)
          </p>
        </div>
      </div>
    </footer>
  );
}
