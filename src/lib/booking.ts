import { type Booking, type Business } from "../data";

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

/** WhatsApp-friendly booking summary (newlines + *bold* render natively). */
export function bookingMessage(b: SavedBooking, business: Business): string {
  return [
    `*NEW RIDE REQUEST* — ${business.name}`,
    `Ref: ${b.id}`,
    ``,
    `Name: ${b.name || "—"}`,
    `Phone: ${b.phone || "—"}`,
    `Passengers: ${b.passengers ?? "—"}`,
    `Pickup: ${b.pickup || "—"}`,
    `Drop: ${b.drop || "—"}`,
    `When: ${fmtWhen(b.datetime)}`,
    `Vehicle: ${b.vehicle || "Any"}`,
    ``,
    `_Booked via aroratravels.vercel.app_`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}

export function whatsappSendLink(b: SavedBooking, business: Business): string {
  return `${business.whatsapp}?text=${encodeURIComponent(bookingMessage(b, business))}`;
}

/** Email relay → FormSubmit's *direct* endpoints at the dispatcher's
 *  addresses. Every address on the booking-notification list gets its own
 *  copy of each trip; one confirmed delivery marks the booking as emailed.
 *
 *  One-time activation caveat: FormSubmit sends a verification link to a new
 *  address on the FIRST submission routed to it; until that inbox clicks the
 *  link, FormSubmit holds those emails and answers success:false — the submit
 *  toast reports delivery honestly (it never claims a delivery it can't
 *  confirm). Dev previews on localhost are gated the same way.
 *  Note: the addresses are visible in the page source (FormSubmit's slug
 *  feature only hides the original setup inbox, so a slug can't route here). */
const FALLBACK_RECIPIENT = "aroratravels46@rediffmail.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Addresses that receive bookings — admin-managed, defensively filtered. */
export function notifyRecipients(business: Business): string[] {
  const listed = Array.isArray(business.notifyEmails) ? business.notifyEmails : [];
  const candidates = (listed.length ? listed : [business.email || FALLBACK_RECIPIENT])
    .map((e) => e.trim())
    .filter((e) => EMAIL_RE.test(e));
  const unique = [...new Set(candidates.map((e) => e.toLowerCase()))];
  return unique.length ? unique : [FALLBACK_RECIPIENT];
}

async function postToFormSubmit(
  email: string,
  b: SavedBooking,
  business: Business,
): Promise<boolean> {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${email}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        _subject: `New ride request — ${b.name || "website visitor"}${b.phone ? ` (${b.phone})` : ""}`,
        /* plain text for email — strip WhatsApp's *bold* /_italic_ markers */
        message: bookingMessage(b, business).replace(/[*_]/g, ""),
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

export async function notifyServer(
  b: SavedBooking,
  business: Business,
): Promise<boolean> {
  /* fan out in parallel — a single confirmed delivery means the booking
     reached the dispatcher, even while another address awaits activation */
  const results = await Promise.all(
    notifyRecipients(business).map((email) => postToFormSubmit(email, b, business)),
  );
  return results.some(Boolean);
}
