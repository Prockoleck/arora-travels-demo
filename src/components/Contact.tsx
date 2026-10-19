import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Loader2,
  MapPin,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import {
  BUSINESS,
  ROUTES,
  VEHICLE_OPTIONS,
  emptyBooking,
  type Booking,
} from "../data";
import Reveal, { SectionTag } from "./Reveal";
import { notifyServer, saveBooking, whatsappSendLink } from "../lib/booking";

const labelCls =
  "mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-steel";
const inputCls =
  "w-full border-2 border-paper-2 bg-white px-4 py-3 text-[15px] font-medium text-ink outline-none transition-colors duration-200 placeholder:text-steel/50 focus:border-gold";

type Errors = Partial<Record<"name" | "phone" | "pickup" | "drop", string>>;

/* Stylised map of Gol Bagh — placeholder for the live Google embed */
function MapPlaceholder() {
  return (
    <div className="relative mt-14 h-80 overflow-hidden border border-paper/12 bg-navy-800">
      <svg viewBox="0 0 900 360" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-label="Map showing Arora Travels at Gol Bagh, Amritsar">
        {/* city blocks */}
        <g fill="#0e1a4d">
          <rect x="0" y="0" width="250" height="120" />
          <rect x="290" y="0" width="280" height="90" />
          <rect x="610" y="0" width="290" height="140" />
          <rect x="0" y="160" width="210" height="200" />
          <rect x="250" y="130" width="180" height="110" />
          <rect x="680" y="180" width="220" height="180" />
          <rect x="300" y="280" width="320" height="80" />
        </g>
        {/* roads */}
        <g stroke="#050c26" strokeWidth="26" strokeLinecap="round">
          <path d="M0 140 H 900" />
          <path d="M230 0 V 360" />
          <path d="M650 0 V 360" />
          <path d="M460 140 L 620 360" />
        </g>
        <g stroke="var(--color-gold)" strokeWidth="2.5" strokeDasharray="16 14" opacity="0.85">
          <path d="M0 140 H 900" />
          <path d="M230 0 V 360" />
          <path d="M650 0 V 360" />
        </g>
        {/* street labels */}
        <g fill="#99a6cf" fontFamily="IBM Plex Mono, monospace" fontSize="13" letterSpacing="3">
          <text x="330" y="128">GT ROAD</text>
          <text x="244" y="60" transform="rotate(90 244 60)">MALL ROAD</text>
          <text x="700" y="330">CIRCULAR ROAD</text>
        </g>
        {/* landmark */}
        <g transform="translate(760 60)">
          <path d="M0 -26 L 14 0 L 0 6 L -14 0 Z" fill="var(--color-gold)" opacity="0.9" />
          <circle cx="0" cy="-8" r="4" fill="#050c26" />
          <text x="22" y="2" fill="#ffc85c" fontFamily="IBM Plex Mono, monospace" fontSize="12" letterSpacing="2">GOLDEN TEMPLE →</text>
        </g>
        {/* pin for Arora Travels */}
        <g transform="translate(450 140)">
          <circle r="46" fill="var(--color-gold)" opacity="0.12" />
          <circle r="26" fill="var(--color-gold)" opacity="0.2" className="ring-ping" style={{ transformBox: "fill-box", transformOrigin: "center" }} />
          <path d="M0 6 C -16 -12 -16 -34 0 -34 C 16 -34 16 -12 0 6 Z" fill="var(--color-gold)" stroke="#050c26" strokeWidth="2.5" />
          <circle cy="-20" r="6" fill="#050c26" />
        </g>
      </svg>

      {/* label chip */}
      <div className="absolute left-1/2 top-[58%] w-max -translate-x-1/2 border-l-4 border-gold bg-ink/92 px-4 py-2.5 shadow-xl backdrop-blur-sm">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-gold">Arora Travels</p>
        <p className="mt-0.5 text-xs text-paper/85">Shop No. 46, Gol Bagh Taxi Stand Market</p>
      </div>

      <a
        href={BUSINESS.mapsUrl}
        target="_blank"
        rel="noreferrer"
        className="group absolute bottom-4 right-4 flex items-center gap-2 bg-gold px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-ink transition-all duration-300 hover:bg-gold-soft hover:shadow-[0_10px_26px_-8px_rgba(246,162,27,0.7)]"
      >
        Open in Google Maps
        <ArrowUpRight size={14} strokeWidth={2.5} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
    </div>
  );
}

export default function Contact({
  booking,
  patch,
}: {
  booking: Booking;
  patch: (p: Partial<Booking>) => void;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState<"ok" | "fail" | null>(null);
  const [waLink, setWaLink] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const reduce = useReducedMotion();

  /* auto-dismiss success toast — the failure variant stays until dismissed
     so the visitor never misses the fallback options */
  useEffect(() => {
    if (toast !== "ok") return;
    const id = setTimeout(() => setToast(null), 10000);
    return () => clearTimeout(id);
  }, [toast]);

  const validate = (): boolean => {
    const e: Errors = {};
    if (!booking.name.trim()) e.name = "Please tell us your name";
    if (!/^[0-9+\-\s]{10,14}$/.test(booking.phone.trim()))
      e.phone = "Enter a valid 10-digit phone number";
    if (!booking.pickup.trim()) e.pickup = "Where should we pick you up?";
    if (!booking.drop.trim()) e.drop = "Where are you headed?";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    if (sending) return;
    if (!validate()) {
      formRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      return;
    }
    setSending(true);
    const keep = { pickup: booking.pickup, drop: booking.drop };

    /* 1. persist the record (local history + admin panel) */
    const record = saveBooking(booking);

    /* 2. AUTOMATIC channel — email relay to the client. The spinner waits
          for a real answer (capped at 4s) so the toast can tell the truth
          about delivery instead of guessing */
    const emailDelivered = await Promise.race([
      notifyServer(record),
      new Promise<boolean>((r) => setTimeout(() => r(false), 4000)),
    ]);

    /* 3. OPTIONAL channel — hand the visitor a prefilled WhatsApp link in
          the toast. No force-opened popup: a real link is both better
          mannered and immune to popup blockers (Safari/iOS especially) */
    setWaLink(whatsappSendLink(record));
    setSending(false);
    setToast(emailDelivered ? "ok" : "fail");
    patch({ ...emptyBooking(), ...keep, name: "", phone: "" });
  };

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden bg-ink py-24 lg:py-32">
      <div className="grid-lines absolute inset-0" />
      <div className="absolute -left-40 bottom-0 h-[460px] w-[460px] rounded-full bg-gold/8 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <SectionTag>Book a ride</SectionTag>
            <Reveal>
              <h2 className="mt-5 font-display text-4xl uppercase leading-[1.02] text-paper sm:text-5xl xl:text-6xl">
                Tell us where.
                <br />
                <span className="text-gold">We’ll be there.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-md leading-relaxed text-fog lg:justify-self-end">
              Request a callback and our dispatcher will confirm your car and fare within{" "}
              <strong className="text-paper">10 minutes</strong> — or skip the form and call the
              stand directly.
            </p>
          </Reveal>
        </div>

        {/* popular routes — tap to fill the form */}
        <Reveal delay={0.15}>
          <div className="mt-12">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-fog">
              Popular routes — tap to fill the form
            </p>
            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {ROUTES.map((r) => {
                const active = booking.pickup === r.from && booking.drop === r.to;
                return (
                  <button
                    key={`${r.from}-${r.to}`}
                    type="button"
                    onClick={() => patch({ pickup: r.from, drop: r.to })}
                    className={`group flex items-center justify-between gap-3 border px-4 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                      active
                        ? "border-gold bg-gold/10 shadow-[0_10px_26px_-14px_rgba(246,162,27,0.5)]"
                        : "border-paper/14 bg-navy/40 hover:border-gold/60"
                    }`}
                  >
                    <span className="text-[13px] leading-snug text-paper/90">
                      {r.from} <span className="text-gold">→</span> {r.to}
                    </span>
                    <span className="shrink-0 font-mono text-xs font-bold text-gold">{r.fare}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 font-mono text-[10px] tracking-wide text-fog/70">
              * Starting fares for a compact sedan, incl. chauffeur. Tolls &amp; state taxes at actuals.
            </p>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          {/* ── info panel ── */}
          <Reveal>
            <aside className="flex h-full flex-col border border-paper/12 bg-navy/50 p-8 backdrop-blur-sm sm:p-10">
              <h3 className="font-display text-2xl uppercase tracking-wide text-paper">
                The stand is <span className="text-gold">always open.</span>
              </h3>

              <div className="mt-8 space-y-7">
                <div className="flex gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center border border-gold/35 bg-navy-800 text-gold">
                    <MapPin size={17} />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-fog">
                      Find us
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-paper/85">{BUSINESS.address}</p>
                    <a
                      href={BUSINESS.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-gold underline-offset-4 hover:underline"
                    >
                      Get directions →
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center border border-gold/35 bg-navy-800 text-gold">
                    <Phone size={17} />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-fog">
                      Call — answered 24×7
                    </p>
                    <a
                      href={BUSINESS.phoneTel}
                      className="mt-1 block font-display text-2xl tracking-wide text-gold transition-colors hover:text-gold-soft sm:text-3xl"
                    >
                      {BUSINESS.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center border border-gold/35 bg-navy-800 text-gold">
                    <Clock size={17} />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-fog">
                      Hours
                    </p>
                    <p className="mt-1.5 flex items-center gap-2.5 text-sm text-paper/85">
                      <span className="dot-live h-2 w-2 rounded-full bg-gold" />
                      Open now — 24 hours, 365 days
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={BUSINESS.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-8 flex w-max items-center gap-2.5 border border-wa/60 px-5 py-3 text-sm font-bold text-wa transition-all duration-300 hover:-translate-y-0.5 hover:bg-wa hover:text-ink"
              >
                <MessageCircle size={17} />
                WhatsApp us instead
              </a>

              {/* how booking works */}
              <div className="mt-10 border-t border-paper/12 pt-8">
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.28em] text-fog">
                  How booking works
                </p>
                <ol className="mt-5 space-y-4">
                  {[
                    "Call or send the form — takes 30 seconds.",
                    "We confirm your car, driver & exact fare within 10 minutes.",
                    "Your chauffeur arrives 10 minutes early. Every time.",
                  ].map((step, i) => (
                    <li key={step} className="flex items-start gap-4">
                      <span className="grid h-7 w-7 shrink-0 place-items-center bg-gold font-mono text-xs font-bold text-ink">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-paper/85">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </Reveal>

          {/* ── booking form ── */}
          <Reveal delay={0.12}>
            <form
              ref={formRef}
              onSubmit={onSubmit}
              noValidate
              className="border border-t-0 border-paper/10 bg-paper text-ink shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)]"
            >
              <div className="hazard h-2.5 w-full" />
              <div className="p-7 sm:p-9">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl uppercase tracking-wide text-navy sm:text-3xl">
                    Request a callback
                  </h3>
                  <span className="font-mono text-[9px] font-semibold tracking-[0.25em] text-gold-deep">
                    FREE · NO OBLIGATION
                  </span>
                </div>

                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className={labelCls}>Your name</label>
                    <input
                      id="c-name"
                      className={`${inputCls} ${errors.name ? "border-red-500" : ""}`}
                      placeholder="e.g. Harpreet Singh"
                      value={booking.name}
                      onChange={(e) => patch({ name: e.target.value })}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="c-phone" className={labelCls}>Phone number</label>
                    <input
                      id="c-phone"
                      type="tel"
                      className={`${inputCls} ${errors.phone ? "border-red-500" : ""}`}
                      placeholder="e.g. 98155 00000"
                      value={booking.phone}
                      onChange={(e) => patch({ phone: e.target.value })}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.phone}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="c-pickup" className={labelCls}>Pickup location</label>
                    <input
                      id="c-pickup"
                      className={`${inputCls} ${errors.pickup ? "border-red-500" : ""}`}
                      placeholder="e.g. ATQ Airport, Terminal 1"
                      value={booking.pickup}
                      onChange={(e) => patch({ pickup: e.target.value })}
                    />
                    {errors.pickup && (
                      <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.pickup}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="c-drop" className={labelCls}>Drop location</label>
                    <input
                      id="c-drop"
                      className={`${inputCls} ${errors.drop ? "border-red-500" : ""}`}
                      placeholder="e.g. Hotel near Golden Temple"
                      value={booking.drop}
                      onChange={(e) => patch({ drop: e.target.value })}
                    />
                    {errors.drop && (
                      <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.drop}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="c-when" className={labelCls}>Date &amp; time</label>
                    <input
                      id="c-when"
                      type="datetime-local"
                      className={inputCls}
                      value={booking.datetime}
                      onChange={(e) => patch({ datetime: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="c-vehicle" className={labelCls}>Vehicle preference</label>
                    <select
                      id="c-vehicle"
                      className={`${inputCls} cursor-pointer`}
                      value={booking.vehicle}
                      onChange={(e) => patch({ vehicle: e.target.value })}
                    >
                      {VEHICLE_OPTIONS.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="group mt-7 flex w-full items-center justify-center gap-3 bg-gold py-4 text-sm font-bold uppercase tracking-[0.16em] text-ink transition-all duration-300 hover:bg-gold-soft hover:shadow-[0_16px_40px_-12px_rgba(246,162,27,0.6)] disabled:cursor-wait disabled:opacity-80"
                >
                  {sending ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Dispatching request…
                    </>
                  ) : (
                    "Request Callback"
                  )}
                </button>

                <p className="mt-4 text-center font-mono text-[11px] text-steel">
                  Prefer talking?{" "}
                  <a href={BUSINESS.phoneTel} className="font-bold text-gold-deep underline-offset-4 hover:underline">
                    {BUSINESS.phoneDisplay}
                  </a>{" "}
                  — answered round the clock.
                </p>
              </div>
            </form>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <MapPlaceholder />
        </Reveal>
      </div>

      {/* success / failure toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            role={toast === "ok" ? "status" : "alert"}
            className={`fixed bottom-6 right-5 z-[70] w-[min(92vw,400px)] overflow-hidden bg-navy shadow-[0_30px_70px_-20px_rgba(0,0,0,0.8)] ${
              toast === "ok" ? "border border-gold/50" : "border border-red-500/60"
            }`}
          >
            <div className="flex items-start gap-3.5 p-5 pr-12">
              {toast === "ok" ? (
                <>
                  <CheckCircle2 size={26} className="mt-0.5 shrink-0 text-gold" />
                  <div>
                    <p className="font-display text-lg uppercase tracking-wide text-paper">
                      Booking request received!
                    </p>
                    <p className="mt-1 text-sm leading-snug text-fog">
                      Our dispatcher has your trip details and will call you back within{" "}
                      <strong className="text-paper">10 minutes</strong>. Prefer to keep it on
                      WhatsApp? Your trip is ready to send:
                    </p>
                    {waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 bg-wa px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink transition-all duration-300 hover:brightness-110"
                      >
                        <MessageCircle size={14} strokeWidth={2.5} />
                        Continue on WhatsApp
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle size={26} className="mt-0.5 shrink-0 text-red-400" />
                  <div>
                    <p className="font-display text-lg uppercase tracking-wide text-paper">
                      Saved — but our email didn’t send
                    </p>
                    <p className="mt-1 text-sm leading-snug text-fog">
                      The connection dropped before the dispatcher was notified. Please call us
                      or send the trip on WhatsApp — don’t let it slip:
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {waLink && (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-wa px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-ink transition-all duration-300 hover:brightness-110"
                        >
                          <MessageCircle size={14} strokeWidth={2.5} />
                          Send on WhatsApp
                        </a>
                      )}
                      <a
                        href={BUSINESS.phoneTel}
                        className="inline-flex items-center gap-2 border border-gold px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gold transition-all duration-300 hover:bg-gold hover:text-ink"
                      >
                        <Phone size={14} strokeWidth={2.5} />
                        Call us
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center text-fog transition-colors hover:bg-paper/10 hover:text-paper"
            >
              <X size={16} />
            </button>
            <div
              className={`h-1 w-full ${toast === "ok" ? "toast-bar bg-gold" : "bg-red-500"}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
