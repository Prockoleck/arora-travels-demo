import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, Copy, KeyRound, MessageCircle, Phone, Trash2, X } from "lucide-react";
import {
  clearBookings,
  loadBookings,
  removeBooking,
  whatsappSendLink,
  type SavedBooking,
} from "../../lib/booking";
import type { Business } from "../../data";
import { Btn, Card, SectionTitle, micro } from "./ui";

/* ── Bookings — the local device log (port of the v1 console) ── */

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

function BookingCard({
  b,
  business,
  onDelete,
}: {
  b: SavedBooking;
  business: Business;
  onDelete: () => void;
}) {
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
          <span className={micro}>Name</span>
          <p className={cellCls}>{b.name || "—"}</p>
        </div>
        <div>
          <span className={micro}>Phone</span>
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
          <span className={micro}>Vehicle</span>
          <p className={cellCls}>{b.vehicle || "Any"}</p>
        </div>
        <div>
          <span className={micro}>Passengers</span>
          <p className={cellCls}>{b.passengers ?? "—"}</p>
        </div>
        <div className="sm:col-span-2">
          <span className={micro}>Trip</span>
          <p className={cellCls}>
            <span className="text-gold-deep">▸</span> {b.pickup || "—"}{" "}
            <span className="text-gold-deep">→</span> {b.drop || "—"}
          </p>
        </div>
        <div>
          <span className={micro}>When</span>
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
          href={whatsappSendLink(b, business)}
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

export default function BookingsPanel({
  business,
  onRefresh,
}: {
  business: Business;
  /** changes whenever the device log is touched — forces a re-read */
  tick: number;
  onRefresh: () => void;
}) {
  const bookings = loadBookings();

  const handleDelete = (id: string) => {
    if (!confirm(`Delete record ${id} from this device?`)) return;
    removeBooking(id);
    onRefresh();
  };

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Device"
        accent="bookings"
        desc="Live bookings arrive on the business WhatsApp and email regardless of device. This log shows bookings made on this device for quick callbacks."
        right={
          bookings.length > 0 ? (
            <Btn
              kind="danger"
              onClick={() => {
                if (confirm(`Delete all ${bookings.length} local booking records?`)) {
                  clearBookings();
                  onRefresh();
                }
              }}
            >
              <X size={13} /> Clear device log
            </Btn>
          ) : undefined
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-md border border-gold/40 px-3 py-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-gold-deep">
          {bookings.length} booking{bookings.length === 1 ? "" : "s"}
        </span>
        <span className="text-[12px] text-steel">on this device · newest first</span>
      </div>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-paper-2 bg-white py-14 text-center">
          <KeyRound size={30} className="text-fog" />
          <p className="font-display text-xl text-steel">No bookings yet</p>
          <p className="max-w-sm text-sm text-fog">
            Submit a test ride from the contact form — it will appear here instantly.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {bookings.map((b) => (
            <BookingCard key={b.id} b={b} business={business} onDelete={() => handleDelete(b.id)} />
          ))}
        </div>
      )}

      <Card>
        <p className="text-[12.5px] leading-relaxed text-steel">
          Live enquiries also reach <strong className="text-navy">aroratravels46@rediffmail.com</strong>{" "}
          automatically — this panel is only the local mirror kept in this browser.
        </p>
      </Card>
    </div>
  );
}
