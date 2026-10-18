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
    `_Booked via arora-travels.vercel.app_`,
  ].join("\n");
}

export function whatsappSendLink(b: SavedBooking): string {
  return `${BUSINESS.whatsapp}?text=${encodeURIComponent(bookingMessage(b))}`;
}

/** Fire-and-forget serverless relay. Silently no-ops when the function or
 *  NOTIFY_EMAIL env is not configured — WhatsApp path still covers the client. */
export async function notifyServer(b: SavedBooking): Promise<void> {
  try {
    await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: b.id,
        name: b.name,
        phone: b.phone,
        pickup: b.pickup,
        drop: b.drop,
        datetime: b.datetime,
        vehicle: b.vehicle,
      }),
    });
  } catch {
    /* offline / not deployed — never block the booking UX */
  }
}
