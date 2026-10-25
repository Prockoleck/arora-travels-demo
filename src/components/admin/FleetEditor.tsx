import { Plus, Trash2 } from "lucide-react";
import type { Vehicle } from "../../data";
import {
  Btn,
  Card,
  IconBtn,
  ImagePicker,
  ListEditor,
  MoveBtns,
  SectionTitle,
  TextField,
  micro,
  type DraftProps,
  type MediaApi,
} from "./ui";

/* ── Fleet — vehicles, tariffs and the booking-form choices ──── */

const numOrStr = (raw: string): number | string => {
  const t = raw.trim();
  if (t === "") return "";
  return /^\d+$/.test(t) ? Number(t) : t;
};

function newVehicle(prev: { key: string } | undefined): Vehicle {
  return {
    key: prev?.key ?? "",
    name: "New vehicle",
    models: "",
    img: "",
    seats: 4,
    bags: 2,
    perKm: null,
    perDay: null,
    tag: "",
  };
}

export default function FleetEditor({
  draft,
  update,
  updateFleet,
  media,
}: DraftProps & { updateFleet: (i: number, patch: Partial<Vehicle>) => void; media: MediaApi }) {
  const fleet = draft.fleet;
  const options = draft.vehicleOptions;

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= fleet.length) return;
    const next = [...fleet];
    const tmp = next[i];
    next[i] = next[j];
    next[j] = tmp;
    update({ fleet: next });
  };

  const remove = (i: number) => {
    const v = fleet[i];
    if (!confirm(`Remove "${v.name}" from the fleet?`)) return;
    update({ fleet: fleet.filter((_, idx) => idx !== i) });
  };

  const uploadImg = (i: number, file: File) =>
    media.upload(file, {
      maxWidth: 1600,
      apply: (path) => updateFleet(i, { img: path }),
    });

  return (
    <div className="space-y-5">
      <SectionTitle
        title="The"
        accent="fleet"
        desc="Cards appear on the site in this order. Per-km / per-day left empty show as “ON REQUEST” to visitors."
        right={
          <Btn kind="primary" onClick={() => update({ fleet: [...fleet, newVehicle(fleet[0])] })}>
            <Plus size={14} /> Add vehicle
          </Btn>
        }
      />

      {fleet.length === 0 && (
        <Card>
          <p className="text-[13px] text-steel">
            No vehicles yet — add one to start building the fleet section.
          </p>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {fleet.map((v, i) => {
          const inOptions = options.includes(v.key);
          return (
            <Card key={i} className="relative">
              <div className="mb-4 flex items-start justify-between gap-3 border-b border-paper-2 pb-3">
                <div className="min-w-0">
                  <span className={micro}>
                    Vehicle {String(i + 1).padStart(2, "0")}
                    {v.tag ? ` · ${v.tag}` : ""}
                  </span>
                  <p className="mt-1 truncate font-display text-base text-navy">
                    {v.name || "Untitled vehicle"}
                  </p>
                </div>
                <div className="flex shrink-0 items-start gap-2">
                  <MoveBtns
                    atTop={i === 0}
                    atBottom={i === fleet.length - 1}
                    onUp={() => move(i, -1)}
                    onDown={() => move(i, 1)}
                  />
                  <IconBtn
                    label={`Delete ${v.name || "vehicle"}`}
                    onClick={() => remove(i)}
                    className="text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </IconBtn>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <TextField
                  className="sm:col-span-2"
                  label="Display name"
                  value={v.name}
                  onChange={(s) => updateFleet(i, { name: s })}
                  placeholder="Suzuki Dzire"
                />
                <TextField
                  className="sm:col-span-2"
                  label="Models / subtitle"
                  value={v.models}
                  onChange={(s) => updateFleet(i, { models: s })}
                  placeholder="Maruti Suzuki Dzire · compact sedan"
                />
                <TextField
                  label="Seats"
                  value={String(v.seats ?? "")}
                  onChange={(s) => updateFleet(i, { seats: numOrStr(s) })}
                  placeholder="4"
                  hint="Number, or a range like 25–30"
                />
                <TextField
                  label="Bags"
                  value={String(v.bags ?? "")}
                  onChange={(s) => updateFleet(i, { bags: numOrStr(s) })}
                  placeholder="2"
                />
                <TextField
                  label="Per km (₹)"
                  type="number"
                  value={v.perKm === null || v.perKm === undefined ? "" : String(v.perKm)}
                  onChange={(s) =>
                    updateFleet(i, { perKm: s.trim() === "" ? null : Number(s) })
                  }
                  placeholder="12"
                  hint="Empty = ON REQUEST"
                />
                <TextField
                  label="Per day (₹)"
                  value={v.perDay ?? ""}
                  onChange={(s) => updateFleet(i, { perDay: s.trim() === "" ? null : s })}
                  placeholder="₹1,500"
                  hint="Empty = ON REQUEST"
                />
                <TextField
                  className="sm:col-span-2"
                  label="Tag"
                  value={v.tag ?? ""}
                  onChange={(s) => updateFleet(i, { tag: s })}
                  placeholder="MOST BOOKED (optional)"
                />

                <label className="block sm:col-span-2">
                  <span className={micro}>Booking key</span>
                  <select
                    value={inOptions ? v.key : "__custom"}
                    onChange={(e) => {
                      if (e.target.value !== "__custom") updateFleet(i, { key: e.target.value });
                    }}
                    className="mt-1.5 w-full appearance-none rounded-lg border border-paper-2 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold"
                  >
                    {options.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                    <option value="__custom">Custom…</option>
                  </select>
                  {!inOptions && (
                    <input
                      value={v.key}
                      onChange={(e) => updateFleet(i, { key: e.target.value })}
                      placeholder="Type a custom booking option"
                      aria-label="Custom booking key"
                      className="mt-2 w-full rounded-lg border border-paper-2 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-fog focus:border-gold"
                    />
                  )}
                  <span className="mt-1 block text-[11px] leading-snug text-steel">
                    Matches the vehicle to a choice in the booking form.
                  </span>
                </label>
              </div>

              <div className="mt-4 border-t border-paper-2 pt-4">
                <ImagePicker
                  label="Photo"
                  path={v.img}
                  pending={media.pending}
                  onFile={(f) => uploadImg(i, f)}
                  hint="Uploaded images are resized in the browser, then committed on publish."
                />
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <SectionTitle
          title="Booking-form"
          accent="choices"
          desc="The vehicle dropdown on the site’s booking form — each fleet card links back to one of these."
        />
        <ListEditor
          items={options}
          onChange={(next) => update({ vehicleOptions: next })}
          itemLabel="choice"
          placeholder="Family SUV (Innova Crysta)"
          addLabel="Add choice"
          reorder
        />
      </Card>
    </div>
  );
}
