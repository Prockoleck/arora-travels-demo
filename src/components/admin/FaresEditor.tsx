import { Plus, Trash2 } from "lucide-react";
import type { RouteFare } from "../../data";
import {
  Btn,
  Card,
  IconBtn,
  MoveBtns,
  SectionTitle,
  TextField,
  type DraftProps,
} from "./ui";

/* ── Fares — popular route cards (tap → pre-fills booking form) ─ */

const headerCls = "font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-fog";

export default function FaresEditor({ draft, update }: DraftProps) {
  const routes = draft.routes;

  const setRoute = (i: number, patch: Partial<RouteFare>) =>
    update({ routes: routes.map((r, idx) => (idx === i ? { ...r, ...patch } : r)) });

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= routes.length) return;
    const next = [...routes];
    const tmp = next[i];
    next[i] = next[j];
    next[j] = tmp;
    update({ routes: next });
  };

  const remove = (i: number) => {
    if (!confirm(`Remove the ${routes[i].from} → ${routes[i].to} fare card?`)) return;
    update({ routes: routes.filter((_, idx) => idx !== i) });
  };

  const add = () =>
    update({ routes: [...routes, { from: "Amritsar", to: "", fare: "₹" }] });

  return (
    <div className="space-y-5">
      <SectionTitle
        title="Popular"
        accent="fares"
        desc="Each row becomes a tappable fare card that pre-fills the booking form."
        right={
          <Btn kind="primary" onClick={add}>
            <Plus size={14} /> Add route
          </Btn>
        }
      />

      <div className="rounded-xl border border-paper-2 bg-white">
        <div className="hidden grid-cols-[1fr_1fr_0.6fr_auto] gap-4 border-b border-paper-2 px-5 py-3 lg:grid">
          <span className={headerCls}>From</span>
          <span className={headerCls}>To</span>
          <span className={headerCls}>Fare</span>
          <span className="sr-only">Reorder</span>
        </div>

        {routes.length === 0 && (
          <p className="px-5 py-6 text-[13px] text-steel">
            No fare cards yet — add the first route above.
          </p>
        )}

        {routes.map((r, i) => (
          <div
            key={i}
            className="grid grid-cols-1 items-start gap-4 border-b border-paper-2 px-5 py-4 last:border-b-0 lg:grid-cols-[1fr_1fr_0.6fr_auto]"
          >
            <TextField
              label="From"
              labelCls="lg:sr-only"
              value={r.from}
              onChange={(s) => setRoute(i, { from: s })}
              placeholder="ATQ Airport"
            />
            <TextField
              label="To"
              labelCls="lg:sr-only"
              value={r.to}
              onChange={(s) => setRoute(i, { to: s })}
              placeholder="Golden Temple / City Hotel"
            />
            <TextField
              label="Fare"
              labelCls="lg:sr-only"
              value={r.fare}
              onChange={(s) => setRoute(i, { fare: s })}
              placeholder="₹499"
            />
            <div className="flex items-start gap-2 pt-0.5">
              <MoveBtns
                atTop={i === 0}
                atBottom={i === routes.length - 1}
                onUp={() => move(i, -1)}
                onDown={() => move(i, 1)}
              />
              <IconBtn
                label={`Delete ${r.from} to ${r.to}`}
                onClick={() => remove(i)}
                className="mt-0.5 text-red-500 hover:border-red-300 hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 size={14} />
              </IconBtn>
            </div>
          </div>
        ))}
      </div>

      <p className="text-[12px] leading-relaxed text-steel">
        Fares are indicative one-way rates — the site always notes that final pricing is
        confirmed on call.
      </p>
    </div>
  );
}
