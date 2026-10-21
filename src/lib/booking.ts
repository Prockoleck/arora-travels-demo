import { BUSINESS, gmapsLink, type Booking, type Coord } from "../data";

/* Booking records — persisted locally + routed to the client via two
   *independent* paths (see submit flow in Contact.tsx):
   1. Email relay (AUTOMATIC): the visitor's browser POSTs the trip to
      FormSubmit.co, which emails the dispatcher — fires on every submit,
      so the client is notified even if the visitor never messages.
   2. WhatsApp handoff (OPTIONAL): an explicit link offered after submit —
      wa.me opens with the trip prefilled. Never force-opened. */

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

/** Google Maps link for a chosen coordinate, formatted for a human. */
const coordLine = (prefix: string, c?: Coord): string =>
  c
    ? `${prefix}: ${c.label} — ${gmapsLink(c)} (${c.lat.toFixed(5)}, ${c.lng.toFixed(5)})`
    : "";

/** WhatsApp-friendly booking summary (newlines + *bold* render natively). */
export function bookingMessage(b: SavedBooking): string {
  return [
    `*NEW RIDE REQUEST* — ${BUSINESS.name}`,
    `Ref: ${b.id}`,
    ``,
    `Name: ${b.name || "—"}`,
    `Phone: ${b.phone || "—"}`,
    `Passengers: ${b.passengers ?? "—"}`,
    `Pickup: ${b.pickup || "—"}`,
    b.pickupCoords ? coordLine("Pickup pin", b.pickupCoords) : "",
    `Drop: ${b.drop || "—"}`,
    b.dropCoords ? coordLine("Drop pin", b.dropCoords) : "",
    `When: ${fmtWhen(b.datetime)}`,
    `Vehicle: ${b.vehicle || "Any"}`,
    ``,
    `_Booked via aroratravels.vercel.app_`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function whatsappSendLink(b: SavedBooking): string {
  return `${BUSINESS.whatsapp}?text=${encodeURIComponent(bookingMessage(b))}`;
}

/** Email relay → FormSubmit's *direct* endpoint at the CLIENT's address
 *  (aroratravels46@rediffmail.com) — every booking is emailed there.
 *  One-time caveat: FormSubmit sends a verification link to that inbox on the
 *  FIRST submission; the client must click it once before emails flow. Until
 *  then FormSubmit holds them and answers success:false — which the submit
 *  toast reports truthfully (it never claims delivery it can't confirm).
 *  Dev previews on localhost are gated the same way.
 *  Note: the address is visible in the page source (FormSubmit's slug feature
 *  only hides the original setup inbox, so a slug can't route here). */
const NOTIFY_ENDPOINT = "formsubmit.co/ajax/aroratravels46@rediffmail.com";

export async function notifyServer(b: SavedBooking): Promise<boolean> {
  try {
    const res = await fetch(`https://${NOTIFY_ENDPOINT}`, {
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
    /* FormSubmit answers HTTP 200 even for HELD submissions — the body's
       `success` field is the only honest signal of actual delivery */
    if (!res.ok) return false;
    const data = (await res.json().catch(() => null)) as
      | { success?: boolean | string }
      | null;
    return data?.success === true || data?.success === "true";
  } catch {
    /* offline / blocked */
    return false;
  }
}
