import { useEffect, useRef, useState, type FormEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { BUSINESS, ROUTES, VEHICLE_OPTIONS, emptyBooking, type Booking } from "../data";
import Reveal, { SectionTag } from "./Reveal";
import PassengerStepper from "./PassengerStepper";
import { notifyServer, saveBooking, whatsappSendLink } from "../lib/booking";

const labelCls =
  "mb-1.5 block font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-steel";
const inputCls =
  "w-full rounded-lg border border-paper-2 bg-white px-4 py-3 text-[15px] text-ink outline-none transition-colors duration-200 placeholder:text-fog focus:border-gold";

type Errors = Partial<Record<"name" | "phone" | "pickup" | "drop", string>>;

/* Show-only Google Maps of the stand — a keyless Google Maps embed, no API
   key or billing needed. It's for orientation only: pickup & drop are typed
   by hand in the form, nothing is picked on this map. */
function StandMap() {
  return (
    <div className="mt-14 overflow-hidden rounded-2xl border border-paper-2 bg-paper">
      <iframe
        title="Google map showing Arora Travels at Gol Bagh, Amritsar"
        src={`https://maps.google.com/maps?q=${encodeURIComponent(
          "Arora Travels, Gol Bagh, Amritsar, Punjab 143001",
        )}&z=15&output=embed&hl=en`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-80 w-full border-0"
      />
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-paper-2 bg-white px-5 py-3.5">
        <p className="text-xs text-steel">
          <span className="font-bold text-ink">Arora Travels</span> · Shop No. 46, Gol Bagh Taxi
          Stand Market
        </p>
        <a
          href={BUSINESS.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-1.5 text-xs font-bold text-gold-deep"
        >
          Open in Google Maps
          <ArrowUpRight
            size={13}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </a>
      </div>
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
          for a real answer (capped at 6s — FormSubmit normally replies in
          ~1s; the cap only matters under their per-IP throttle) so the
          toast can tell the truth about delivery instead of guessing */
    const emailDelivered = await Promise.race([
      notifyServer(record),
      new Promise<boolean>((r) => setTimeout(() => r(false), 6000)),
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
    <section id="contact" className="relative scroll-mt-20 overflow-hidden bg-white py-24 lg:py-32">
      <div className="relative mx-auto flex max-w-7xl flex-col px-5 sm:px-8">
        <div className="order-1 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <SectionTag>Book a ride</SectionTag>
            <Reveal>
              <h2 className="mt-5 text-3xl leading-[1.12] text-navy sm:text-4xl xl:text-5xl">
                Tell us where.
                <br />
                <span className="text-gold-deep">We’ll be there.</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.12}>
            <p className="max-w-md leading-relaxed text-steel lg:justify-self-end">
              Request a callback and our dispatcher will confirm your car and fare within{" "}
              <strong className="text-navy">10 minutes</strong> — or skip the form and call the
              stand directly.
            </p>
          </Reveal>
        </div>

        {/* popular routes — tap to fill the form (shown after the form on phones) */}
        <Reveal delay={0.15} className="order-3 lg:order-2">
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
                    className={`group flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-300 hover:-translate-y-0.5 ${
                      active
                        ? "border-gold bg-gold/10"
                        : "border-paper-2 bg-white hover:border-gold"
                    }`}
                  >
                    <span className="text-[13px] leading-snug text-ink">
                      {r.from} <span className="text-gold-deep">→</span> {r.to}
                    </span>
                    <span className="shrink-0 font-mono text-xs font-bold text-gold-deep">{r.fare}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-3 font-mono text-[10px] tracking-wide text-fog">
              * Starting fares for a compact sedan, incl. chauffeur. Tolls &amp; state taxes at actuals.
            </p>
          </div>
        </Reveal>

        <div className="order-2 mt-14 grid gap-6 lg:order-3 lg:grid-cols-[0.95fr_1.05fr]">
          {/* ── info panel ── */}
          <Reveal className="order-2 lg:order-1">
            <aside className="flex h-full scroll-mt-24 flex-col rounded-2xl border border-paper-2 bg-paper p-8 sm:p-10">
              <h3 className="text-xl font-bold text-navy sm:text-2xl">
                The stand is <span className="text-gold-deep">always open.</span>
              </h3>

              <div className="mt-8 space-y-7">
                <div className="flex gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-paper-2 bg-white text-navy">
                    <MapPin size={17} />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-fog">
                      Find us
                    </p>
                    <p className="mt-1.5 text-sm leading-relaxed text-steel">{BUSINESS.address}</p>
                    <a
                      href={BUSINESS.mapsUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-block font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-gold-deep underline-offset-4 hover:underline"
                    >
                      Get directions →
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-paper-2 bg-white text-navy">
                    <Phone size={17} />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-fog">
                      Call — answered 24×7
                    </p>
                    <a
                      href={BUSINESS.phoneTel}
                      className="mt-1 block font-display text-2xl text-navy transition-colors hover:text-gold-deep sm:text-3xl"
                    >
                      {BUSINESS.phoneDisplay}
                    </a>
                    <p className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[12px] text-steel">
                      {BUSINESS.phones.slice(1).map((p) => (
                        <a
                          key={p.tel}
                          href={p.tel}
                          className="transition-colors hover:text-gold-deep"
                        >
                          {p.display}
                        </a>
                      ))}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-paper-2 bg-white text-navy">
                    <Mail size={17} />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-fog">
                      Email
                    </p>
                    <a
                      href={`mailto:${BUSINESS.email}`}
                      className="mt-1.5 block break-all text-sm font-semibold text-navy transition-colors hover:text-gold-deep"
                    >
                      {BUSINESS.email}
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <span className="mt-0.5 grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-paper-2 bg-white text-navy">
                    <Clock size={17} />
                  </span>
                  <div>
                    <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-fog">
                      Hours
                    </p>
                    <p className="mt-1.5 flex items-center gap-2.5 text-sm text-steel">
                      <span className="dot-live h-2 w-2 rounded-full bg-wa" />
                      Open now — 24 hours, 365 days
                    </p>
                  </div>
                </div>
              </div>

              <a
                href={BUSINESS.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="mt-8 flex w-max items-center gap-2.5 rounded-lg border border-wa/60 px-5 py-3 text-sm font-bold text-wa transition-all duration-300 hover:-translate-y-0.5 hover:bg-wa hover:text-white"
              >
                <MessageCircle size={17} />
                WhatsApp us instead
              </a>

              {/* how booking works */}
              <div className="mt-10 border-t border-paper-2 pt-8">
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
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-gold font-mono text-xs font-bold text-white">
                        {i + 1}
                      </span>
                      <span className="text-sm leading-relaxed text-steel">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </Reveal>

          {/* ── booking form ── */}
          <Reveal delay={0.12} className="order-1 lg:order-2">
            <form
              ref={formRef}
              onSubmit={onSubmit}
              noValidate
              className="overflow-hidden rounded-2xl border border-paper-2 bg-white shadow-[0_24px_60px_-45px_rgba(16,35,63,0.4)]"
            >
              <div className="p-7 sm:p-9">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-xl font-bold text-navy sm:text-2xl">
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
                      placeholder="e.g. ATQ Airport"
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
                      placeholder="e.g. Golden Temple"
                      value={booking.drop}
                      onChange={(e) => patch({ drop: e.target.value })}
                    />
                    {errors.drop && (
                      <p className="mt-1.5 text-xs font-semibold text-red-600">{errors.drop}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <PassengerStepper
                      value={booking.passengers}
                      onChange={(n) => patch({ passengers: n })}
                    />
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
                  className="group mt-7 flex w-full items-center justify-center gap-3 rounded-lg bg-navy py-4 text-sm font-bold text-white transition-all duration-300 hover:bg-navy-800 disabled:cursor-wait disabled:opacity-80"
                >
                  {sending ? (
                    <>
                      <Loader2 size={17} className="animate-spin" />
                      Dispatching request…
                    </>
                  ) : (
                    "Request callback"
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

        <Reveal delay={0.1} className="order-4">
          <StandMap />
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
            className={`fixed bottom-6 right-5 z-[70] w-[min(92vw,400px)] overflow-hidden rounded-2xl border bg-white shadow-[0_24px_60px_-25px_rgba(16,35,63,0.35)] ${
              toast === "ok" ? "border-paper-2" : "border-red-300"
            }`}
          >
            <div className="flex items-start gap-3.5 p-5 pr-12">
              {toast === "ok" ? (
                <>
                  <CheckCircle2 size={26} className="mt-0.5 shrink-0 text-wa" />
                  <div>
                    <p className="font-display text-lg text-ink">
                      Booking request received!
                    </p>
                    <p className="mt-1 text-sm leading-snug text-steel">
                      Our dispatcher has your trip details and will call you back within{" "}
                      <strong className="text-navy">10 minutes</strong>. Prefer to keep it on
                      WhatsApp? Your trip is ready to send:
                    </p>
                    {waLink && (
                      <a
                        href={waLink}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-2 rounded-lg bg-wa px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:brightness-110"
                      >
                        <MessageCircle size={14} strokeWidth={2.5} />
                        Continue on WhatsApp
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <AlertTriangle size={26} className="mt-0.5 shrink-0 text-red-500" />
                  <div>
                    <p className="font-display text-lg text-ink">
                      Saved — but our email didn’t send
                    </p>
                    <p className="mt-1 text-sm leading-snug text-steel">
                      The connection dropped before the dispatcher was notified. Please call us
                      or send the trip on WhatsApp — don’t let it slip:
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {waLink && (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 rounded-lg bg-wa px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:brightness-110"
                        >
                          <MessageCircle size={14} strokeWidth={2.5} />
                          Send on WhatsApp
                        </a>
                      )}
                      <a
                        href={BUSINESS.phoneTel}
                        className="inline-flex items-center gap-2 rounded-lg border border-navy px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-navy transition-all duration-300 hover:bg-navy hover:text-white"
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
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-md text-fog transition-colors hover:bg-paper hover:text-ink"
            >
              <X size={16} />
            </button>
            <div
              className={`h-1 w-full ${toast === "ok" ? "toast-bar bg-gold" : "bg-red-400"}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
