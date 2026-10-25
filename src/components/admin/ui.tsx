import {
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type InputHTMLAttributes,
  type ReactNode,
} from "react";
import { ArrowDown, ArrowUp, Image as ImageIcon, Plus, Upload, X } from "lucide-react";
import type { SiteContent } from "../../lib/content";
import type { PendingImage } from "../../lib/image";

/* ────────────────────────────────────────────────────────────────
   Dispatch Console — shared primitives.
   Visual language mirrors the public site: paper page, white cards,
   navy headings with a gold-deep accent word, mono micro-labels.
   ──────────────────────────────────────────────────────────────── */

export type TabId =
  | "dashboard"
  | "fleet"
  | "fares"
  | "media"
  | "content"
  | "business"
  | "bookings"
  | "settings";

export type DraftProps = {
  draft: SiteContent;
  /** Accepts a patch object, or an updater reading the latest draft (safe across async work). */
  update: (patch: Partial<SiteContent> | ((prev: SiteContent) => Partial<SiteContent>)) => void;
};

export const micro =
  "font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-fog";

export const inputCls =
  "mt-1.5 w-full rounded-lg border border-paper-2 bg-white px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-fog focus:border-gold";

export const areaCls = `${inputCls} resize-y leading-relaxed`;

const kindCls: Record<string, string> = {
  primary:
    "bg-navy text-white hover:bg-navy-800 rounded-lg px-4 py-2.5 text-[12.5px] font-bold",
  gold: "bg-gold text-white hover:bg-gold-deep rounded-lg px-5 py-2.5 text-[13px] font-bold",
  ghost:
    "border border-paper-2 bg-white text-steel hover:border-gold hover:text-gold-deep rounded-lg px-4 py-2.5 text-[12.5px] font-semibold",
  danger:
    "border border-red-300 text-red-500 hover:bg-red-50 rounded-lg px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em]",
};

export type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  kind?: keyof typeof kindCls;
};

export function Btn({ kind = "ghost", className = "", type = "button", ...rest }: BtnProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${kindCls[kind]} ${className}`}
      {...rest}
    />
  );
}

export function IconBtn({
  label,
  className = "",
  type = "button",
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-paper-2 bg-white text-steel transition-colors hover:border-gold hover:text-gold-deep disabled:pointer-events-none disabled:opacity-40 ${className}`}
      {...rest}
    />
  );
}

/** ↑/↓ pair used for reordering list rows. */
export function MoveBtns({
  onUp,
  onDown,
  atTop,
  atBottom,
  className = "",
}: {
  onUp: () => void;
  onDown: () => void;
  atTop: boolean;
  atBottom: boolean;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <IconBtn label="Move up" onClick={onUp} disabled={atTop}>
        <ArrowUp size={13} />
      </IconBtn>
      <IconBtn label="Move down" onClick={onDown} disabled={atBottom}>
        <ArrowDown size={13} />
      </IconBtn>
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-paper-2 bg-white p-4 sm:p-5 ${className}`}>
      {children}
    </div>
  );
}

export function SectionTitle({
  title,
  accent,
  desc,
  right,
}: {
  title: string;
  accent?: string;
  desc?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="font-display text-lg text-navy sm:text-xl">
          {title} {accent && <span className="text-gold-deep">{accent}</span>}
        </h2>
        {desc && <p className="mt-1 max-w-2xl text-[12.5px] leading-relaxed text-steel">{desc}</p>}
      </div>
      {right && <div className="flex shrink-0 items-center gap-2">{right}</div>}
    </div>
  );
}

export function Note({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border-l-2 border-gold bg-white px-4 py-3 text-[12.5px] leading-relaxed text-steel">
      {children}
    </p>
  );
}

export function Spinner({ size = 14 }: { size?: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
      style={{ width: size, height: size }}
    />
  );
}

/* ── Fields ─────────────────────────────────────────────────── */

type FieldBase = {
  label: string;
  labelCls?: string;
  hint?: ReactNode;
  className?: string;
};

export function TextField({
  label,
  labelCls = "",
  hint,
  className = "",
  value,
  onChange,
  placeholder,
  id,
  inputMode,
  type = "text",
  disabled,
}: FieldBase & {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  id?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>["inputMode"];
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={`${micro} ${labelCls}`}>{label}</span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        id={id}
        inputMode={inputMode}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
      {hint && <span className="mt-1 block text-[11px] leading-snug text-steel">{hint}</span>}
    </label>
  );
}

export function TextAreaField({
  label,
  labelCls = "",
  hint,
  className = "",
  value,
  onChange,
  rows = 3,
  ...rest
}: FieldBase & {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  id?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={`${micro} ${labelCls}`}>{label}</span>
      <textarea
        rows={rows}
        value={value}
        placeholder={rest.placeholder}
        id={rest.id}
        onChange={(e) => onChange(e.target.value)}
        className={areaCls}
      />
      {hint && <span className="mt-1 block text-[11px] leading-snug text-steel">{hint}</span>}
    </label>
  );
}

export function SelectField({
  label,
  labelCls = "",
  hint,
  className = "",
  value,
  onChange,
  options,
  ...rest
}: FieldBase & {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={`${micro} ${labelCls}`}>{label}</span>
      <select
        value={value}
        disabled={rest.disabled}
        onChange={(e) => onChange(e.target.value)}
        className={`${inputCls} appearance-none pr-8`}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && <span className="mt-1 block text-[11px] leading-snug text-steel">{hint}</span>}
    </label>
  );
}

/* ── String list editor (destinations, phones, options…) ────── */

export function ListEditor({
  items,
  onChange,
  itemLabel = "Item",
  placeholder,
  addLabel = "Add item",
  reorder = false,
}: {
  items: string[];
  onChange: (next: string[]) => void;
  itemLabel?: string;
  placeholder?: string;
  addLabel?: string;
  reorder?: boolean;
}) {
  const set = (i: number, v: string) =>
    onChange(items.map((x, idx) => (idx === i ? v : x)));
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    const tmp = next[i];
    next[i] = next[j];
    next[j] = tmp;
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {items.length === 0 && (
        <p className="rounded-lg border border-dashed border-paper-2 px-4 py-3 text-[12px] text-fog">
          Nothing here yet — add the first one below.
        </p>
      )}
      {items.map((it, i) => (
        <div key={i} className="flex items-start gap-2">
          <input
            value={it}
            placeholder={placeholder}
            aria-label={`${itemLabel} ${i + 1}`}
            onChange={(e) => set(i, e.target.value)}
            className={inputCls}
          />
          {reorder && (
            <MoveBtns
              className="mt-1.5"
              atTop={i === 0}
              atBottom={i === items.length - 1}
              onUp={() => move(i, -1)}
              onDown={() => move(i, 1)}
            />
          )}
          <IconBtn
            label={`Remove ${itemLabel}`}
            onClick={() => remove(i)}
            className="mt-1.5 text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
          >
            <X size={14} />
          </IconBtn>
        </div>
      ))}
      <Btn kind="ghost" onClick={() => onChange([...items, ""])}>
        <Plus size={13} /> {addLabel}
      </Btn>
    </div>
  );
}

/* ── Image slots ────────────────────────────────────────────── */

/** Stored path → thumbnail source (pending uploads use their object URL). */
export function resolvePreview(path: string, pending: PendingImage[]): string {
  if (!path) return "";
  const name = path.split("/").pop() || "";
  const hit = pending.find((p) => p.name === name);
  return hit ? hit.previewUrl : path;
}

export function ImagePicker({
  label,
  path,
  pending,
  onFile,
  hint,
  contain = false,
  previewClass = "h-28 w-44",
}: {
  label: string;
  path: string;
  pending: PendingImage[];
  onFile: (file: File) => Promise<void>;
  hint?: ReactNode;
  contain?: boolean;
  previewClass?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const src = resolvePreview(path, pending);

  const pick = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!file) return;
    setBusy(true);
    setErr("");
    try {
      await onFile(file);
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-start gap-4">
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-paper-2 bg-paper ${previewClass}`}
      >
        {src ? (
          <img
            src={src}
            alt=""
            className={`h-full w-full ${contain ? "object-contain" : "object-cover"}`}
          />
        ) : (
          <ImageIcon size={20} className="text-fog" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <span className={micro}>{label}</span>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <Btn kind="ghost" onClick={() => inputRef.current?.click()} disabled={busy}>
            <Upload size={13} /> {busy ? "Preparing…" : "Upload"}
          </Btn>
          <span className="min-w-0 break-all font-mono text-[10.5px] text-steel">
            {path || "no image set"}
          </span>
        </div>
        {hint && <p className="mt-1.5 text-[11px] leading-snug text-steel">{hint}</p>}
        {err && (
          <p role="alert" className="mt-1 text-[11px] text-red-500">
            {err}
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={pick}
        />
      </div>
    </div>
  );
}

/* ── Shell-level media API (shared by Fleet + Media editors) ── */

export type MediaApi = {
  pending: PendingImage[];
  /** prepareImage + queue for publish; `apply` writes the new path into the draft. */
  upload: (file: File, opts: { maxWidth?: number; apply: (path: string) => void }) => Promise<void>;
  remove: (name: string) => void;
};
