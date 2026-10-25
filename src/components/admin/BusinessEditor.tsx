import { telHref } from "../../lib/content";
import {
  Card,
  ListEditor,
  SectionTitle,
  TextField,
  TextAreaField,
  type DraftProps,
} from "./ui";

/* ── Business — the facts that appear in header, footer, CTAs ── */

export default function BusinessEditor({ draft, update }: DraftProps) {
  const b = draft.business;

  const set = (patch: Partial<typeof b>) => update({ business: { ...b, ...patch } });

  const setPhones = (displays: string[]) =>
    set({
      phones: displays.map((display) => ({ display, tel: telHref(display) })),
    });

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Business"
        accent="details"
        desc="Phone numbers and links power every call / WhatsApp button on the site."
      />

      <Card>
        <div className="grid gap-3 sm:grid-cols-2">
          <TextField
            label="Business name"
            value={b.name}
            onChange={(v) => set({ name: v })}
          />
          <TextField
            label="Established"
            type="number"
            value={String(b.est)}
            onChange={(v) => set({ est: Number(v) || b.est })}
            hint="Shown as “SINCE …” in the footer."
          />
          <TextField
            label="Primary phone (display)"
            value={b.phoneDisplay}
            onChange={(v) => set({ phoneDisplay: v, phoneTel: telHref(v) })}
            hint="Used by the sticky call button."
          />
          <TextField
            label="Email"
            type="email"
            value={b.email}
            onChange={(v) => set({ email: v })}
          />
          <TextField
            className="sm:col-span-2"
            label="WhatsApp link"
            value={b.whatsapp}
            onChange={(v) => set({ whatsapp: v })}
            hint="https://wa.me/91XXXXXXXXXX"
          />
        </div>
      </Card>

      <Card>
        <SectionTitle
          title="Phone"
          accent="numbers"
          desc="Each number becomes a tappable line — the tel: link is generated automatically."
        />
        <ListEditor
          items={b.phones.map((p) => p.display)}
          onChange={setPhones}
          itemLabel="phone number"
          placeholder="+91 99144 04090"
          addLabel="Add number"
        />
      </Card>

      <Card>
        <SectionTitle title="Address &" accent="map" />
        <div className="grid gap-3">
          <TextAreaField
            label="Full address"
            rows={3}
            value={b.address}
            onChange={(v) => set({ address: v })}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <TextField
              label="Short address"
              value={b.addressShort}
              onChange={(v) => set({ addressShort: v })}
              hint="Used where space is tight (footer, cards)."
            />
            <TextField
              label="Google Maps URL"
              value={b.mapsUrl}
              onChange={(v) => set({ mapsUrl: v })}
              hint="Opens the “Get directions” link."
            />
          </div>
        </div>
      </Card>
    </div>
  );
}
