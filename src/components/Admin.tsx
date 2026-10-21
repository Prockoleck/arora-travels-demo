import { useEffect, useMemo, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Copy,
  KeyRound,
  MessageCircle,
  Phone,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { Logo } from "./Navbar";
import { clearBookings, loadBookings, removeBooking, whatsappSendLink, type SavedBooking } from "../lib/booking";

/* Matches the sibling taxi sites — session-scoped unlock */
const ADMIN_PIN = "12345678";
const AUTH_KEY = "arora_admin_auth";

const labelCls = "font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-fog";
const cellCls = "mt-1 text-[13.5px] font-medium leading-snug text-ink";

function fmtWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

function fmtTrip(dt: string): string {
  if (!dt) return "Not specified";
  const d = new Date(dt);
  if (Number.isNaN(d.getTime())) return dt;
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
}

/* ── Password gate ─────────────────────────────────────────── */
function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [bad, setBad] = useState(false);

  const submit = (ev: FormEvent) => {
    ev.preventDefault();
    if (pin === ADMIN_PIN) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onUnlock();
    } else {
      setBad(true);
      setPin("");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-5">
      <motion.form
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl border border-paper-2 bg-white p-8"
      >
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <p className="text-center font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-gold-deep">
          Dispatch Console
        </p>
        <label htmlFor="admin-pin" className={`${labelCls} mt-6 block`}>
          Passcode
        </label>
        <input
          id="admin-pin"
          type="password"
          inputMode="numeric"
          autoFocus
          value={pin}
          onChange={(e) => {
            setPin(e.target.value);
            setBad(false);
          }}
          placeholder="••••••••"
          className="mt-2 w-full rounded-lg border border-paper-2 bg-white px-4 py-3 text-center font-mono text-lg tracking-[0.4em] text-ink outline-none transition-colors focus:border-gold"
        />
        <p
          className={`mt-2 h-4 text-center text-xs ${bad ? "text-red-500" : "text-transparent"}`}
          role={bad ? "alert" : undefined}
        >
          Wrong passcode — try again.
        </p>
        <button
          type="submit"
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:bg-navy-800"
        >
          <KeyRound size={16} strokeWidth={2.5} />
          Unlock
        </button>
        <a
          href="#home"
          className="mt-5 flex items-center justify-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-steel transition-colors hover:text-gold-deep"
        >
          <ArrowLeft size={13} /> Back to site
        </a>
      </motion.form>
    </div>
  );
}

/* ── Single booking record ─────────────────────────────────── */
function BookingCard({ b, onDelete }: { b: SavedBooking; onDelete: () => void }) {
  const [copied, setCopied] = useState(false);
  const digits = (b.phone || "").replace(/\D/g, "");
  const waNumber = digits ? (digits.length === 10 ? `91${digits}` : digits) : "";

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(b.phone);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="rounded-xl border border-paper-2 bg-white p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-paper-2 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="rounded-md bg-gold px-2 py-0.5 font-mono text-[10.5px] font-bold tracking-wider text-white">
            {b.id}
          </span>
          <span className="flex items-center gap-1 font-mono text-[10.5px] text-steel">
            <Clock size={11} /> {fmtWhen(b.createdAt)}
          </span>
        </div>
        <button
          onClick={onDelete}
          aria-label={`Delete booking ${b.id}`}
          className="p-1 text-fog transition-colors hover:text-red-500"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <span className={labelCls}>Name</span>
          <p className={cellCls}>{b.name || "—"}</p>
        </div>
        <div>
          <span className={labelCls}>Phone</span>
          <p className="flex items-center gap-2">
            <span className={cellCls}>{b.phone || "—"}</span>
            {b.phone && (
              <button
                onClick={copyPhone}
                className="text-steel transition-colors hover:text-gold-deep"
                aria-label="Copy phone number"
                title="Copy"
              >
                <Copy size={12} className={copied ? "text-wa" : ""} />
              </button>
            )}
          </p>
        </div>
        <div>
          <span className={labelCls}>Vehicle</span>
          <p className={cellCls}>{b.vehicle || "Any"}</p>
        </div>
        <div>
          <span className={labelCls}>Passengers</span>
          <p className={cellCls}>{b.passengers ?? "—"}</p>
        </div>
        <div className="sm:col-span-2">
          <span className={labelCls}>Trip</span>
          <p className={cellCls}>
            <span className="text-gold-deep">▸</span> {b.pickup || "—"}{" "}
            <span className="text-gold-deep">→</span> {b.drop || "—"}
          </p>
        </div>
        <div>
          <span className={labelCls}>When</span>
          <p className={cellCls}>{fmtTrip(b.datetime)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {b.phone && (
          <a
            href={`tel:+${waNumber || digits}`}
            className="flex items-center gap-1.5 rounded-md border border-gold/40 px-3 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-gold-deep transition-colors hover:bg-gold hover:text-white"
          >
            <Phone size={12} /> Call
          </a>
        )}
        <a
          href={whatsappSendLink(b)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 rounded-md border border-wa/50 px-3 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-wa transition-colors hover:bg-wa hover:text-white"
        >
          <MessageCircle size={12} /> Reopen trip
        </a>
      </div>
    </motion.article>
  );
}

/* ── Admin page (hash: #/admin) ────────────────────────────── */
export default function Admin() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");
  const [tick, setTick] = useState(0);
  const bookings = useMemo(() => loadBookings(), [tick]);

  /* react to cross-tab changes */
  useEffect(() => {
    const onStorage = () => setTick((t) => t + 1);
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (!authed) return <Gate onUnlock={() => setAuthed(true)} />;

  const handleDelete = (id: string) => {
    if (!confirm(`Delete record ${id} from this device?`)) return;
    removeBooking(id);
    setTick((t) => t + 1);
  };

  return (
    <div className="min-h-screen bg-paper px-5 py-10 text-ink sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-paper-2 pb-6">
          <div className="flex items-center gap-4">
            <Logo />
            <div className="border-l border-paper-2 pl-4">
              <h1 className="font-display text-2xl text-navy">
                Dispatch <span className="text-gold-deep">Console</span>
              </h1>
              <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-steel">
                <ShieldCheck size={11} className="text-wa" /> Authenticated session
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="rounded-md border border-gold/40 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-deep">
              {bookings.length} booking{bookings.length === 1 ? "" : "s"}
            </span>
            <a
              href="#home"
              className="flex items-center gap-1.5 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-steel transition-colors hover:text-gold-deep"
            >
              <ArrowLeft size={13} /> Site
            </a>
          </div>
        </header>

        <p className="mt-5 rounded-lg border-l-2 border-gold bg-white px-4 py-3 text-[12.5px] leading-relaxed text-steel">
          Live bookings arrive on the business <strong className="text-navy">WhatsApp</strong> and{" "}
          <strong className="text-navy">email</strong> regardless of device. This console logs
          bookings made on <em>this</em> device for review and quick callbacks.
        </p>

        {bookings.length === 0 ? (
          <div className="mt-14 flex flex-col items-center gap-3 py-10 text-center">
            <KeyRound size={30} className="text-fog" />
            <p className="font-display text-xl text-steel">No bookings yet</p>
            <p className="max-w-sm text-sm text-fog">
              Submit a test ride from the contact form — it will appear here instantly.
            </p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            {bookings.map((b) => (
              <BookingCard key={b.id} b={b} onDelete={() => handleDelete(b.id)} />
            ))}
          </div>
        )}

        {bookings.length > 0 && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => {
                if (confirm(`Delete all ${bookings.length} local booking records?`)) {
                  clearBookings();
                  setTick((t) => t + 1);
                }
              }}
              className="flex items-center gap-1.5 rounded-md border border-red-300 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-red-500 transition-colors hover:bg-red-50"
            >
              <X size={13} /> Clear device log
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
