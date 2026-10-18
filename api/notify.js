/**
 * Booking notification relay (Vercel serverless).
 *
 * Emails the dispatcher through FormSubmit.co (zero signup). The configured
 * address receives ONE activation email on the very first submission —
 * the client clicks it once, and every booking after that lands in their
 * inbox automatically.
 *
 * Configuration:  vercel env add NOTIFY_EMAIL production
 * Without it the function responds ok and skips — the visitor-side
 * WhatsApp handoff remains the notification path.
 */

const MAX_LEN = 300;
const clean = (v) => String(v ?? "").slice(0, MAX_LEN).trim();

function buildMessage(b) {
  return [
    "NEW RIDE REQUEST - Arora Travels",
    `Ref: ${clean(b.id) || "-"}`,
    "",
    `Name: ${clean(b.name) || "-"}`,
    `Phone: ${clean(b.phone) || "-"}`,
    `Pickup: ${clean(b.pickup) || "-"}`,
    `Drop: ${clean(b.drop) || "-"}`,
    `When: ${clean(b.datetime) || "-"}`,
    `Vehicle: ${clean(b.vehicle) || "-"}`,
    "",
    "Sent from aroratravels.vercel.app",
  ].join("\n");
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "method-not-allowed" });
  }

  const email = process.env.NOTIFY_EMAIL;
  if (!email) {
    return res.status(200).json({ ok: true, skipped: "NOTIFY_EMAIL not set" });
  }

  const b = typeof req.body === "object" && req.body !== null ? req.body : {};
  const who = clean(b.name) || "website visitor";

  try {
    const r = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(email)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          _subject: `New ride request — ${who}${b.phone ? ` (${clean(b.phone)})` : ""}`,
          message: buildMessage(b),
        }),
      },
    );
    /* relay FormSubmit's verdict back so activation/queue states are visible */
    let detail = "";
    try {
      const j = await r.json();
      detail = String(j.message || j.success || "").slice(0, 200);
    } catch {
      /* non-JSON body */
    }
    return res.status(200).json({ ok: r.ok, relay: r.status, detail });
  } catch {
    /* relay outage must never fail the booking UX */
    return res.status(200).json({ ok: false, error: "relay-unavailable" });
  }
}
