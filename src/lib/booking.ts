import { BUSINESS, type Booking } from "../data";

/* Booking records — persisted locally + routed to the client via two
   independent notification paths (see submit flow in Contact.tsx):
   1. WhatsApp handoff: wa.me opens with the details prefilled (instant).
   2. Serverless relay: POST /api/notify emails the dispatcher
      (env NOTIFY_EMAIL via FormSubmit.co) — works even if the visitor
      never sends the WhatsApp message. */

export type SavedBooking = Booking & {
  id: string;
  createdAt: string;
};

const STORE_KEY = "arora_bookings";
const MAX_RECORDS = 200;

export function loadBookings(): SavedBooking[] {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? (list as SavedBooking[]) : [];
  } catch {
    return [];
  }
}

export function saveBooking(b: Booking): SavedBooking {
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  const record: SavedBooking = {
    ...b,
    id: `AT-${Date.now().toString(36).toUpperCase()}${rand}`,
    createdAt: new Date().toISOString(),
  };
  try {
    const list = loadBookings();
    list.unshift(record);
    localStorage.setItem(STORE_KEY, JSON.stringify(list.slice(0, MAX_RECORDS)));
  } catch {
    /* storage blocked/full — notification paths still run */
  }
  return record;
}

export function removeBooking(id: string) {
  try {
    localStorage.setItem(
      STORE_KEY,
      JSON.stringify(loadBookings().filter((b) => b.id !== id)),
    );
  } catch {
    /* ignore */
  }
}

export function clearBookings() {
  try {
    localStorage.removeItem(STORE_KEY);
  } catch {
    /* ignore */
  }
}

const fmtWhen = (iso: string): string => {
  if (!iso) return "Not specified";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
};

/** WhatsApp-friendly booking summary (newlines + *bold* render natively). */
export function bookingMessage(b: SavedBooking): string {
  return [
    `*NEW RIDE REQUEST* — ${BUSINESS.name}`,
    `Ref: ${b.id}`,
    ``,
    `Name: ${b.name || "—"}`,
    `Phone: ${b.phone || "—"}`,
    `Pickup: ${b.pickup || "—"}`,
    `Drop: ${b.drop || "—"}`,
    `When: ${fmtWhen(b.datetime)}`,
    `Vehicle: ${b.vehicle || "Any"}`,
    ``,
    `_Booked via aroratravels.vercel.app_`,
  ].join("\n");
}

export function whatsappSendLink(b: SavedBooking): string {
  return `${BUSINESS.whatsapp}?text=${encodeURIComponent(bookingMessage(b))}`;
}

/** Fire-and-forget email relay, sent straight from the visitor's browser to
 *  FormSubmit's /ajax endpoint (built for browser calls — serverless egress
 *  gets edge-blocked). Swap the address when handing over to the client. */
const NOTIFY_EMAIL = "proshorts71@gmail.com";

export async function notifyServer(b: SavedBooking): Promise<void> {
  try {
    await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(NOTIFY_EMAIL)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `New ride request — ${b.name || "website visitor"}${b.phone ? ` (${b.phone})` : ""}`,
        /* plain text for email — strip WhatsApp's *bold* /_italic_ markers */
        message: bookingMessage(b).replace(/[*_]/g, ""),
      }),
      /* let the request outlive any immediate navigation */
      keepalive: true,
    });
  } catch {
    /* offline / blocked — WhatsApp path still covers the client */
  }
}
