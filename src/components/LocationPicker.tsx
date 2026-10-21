import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Loader2, MapPin, X } from "lucide-react";
import { GOOGLE_MAPS_KEY, type Coord } from "../data";
import GooglePickerBody from "./GooglePickerBody";
import LeafletPickerBody from "./LeafletPickerBody";

/* Location picker modal — engine-neutral shell.
   With GOOGLE_MAPS_KEY set (data.ts / VITE_GOOGLE_MAPS_KEY env var) the map
   runs on Google Maps (Places autocomplete, Google tiles, Geocoder). Without
   a key — or if Google rejects it — the OpenStreetMap body takes over and the
   picker keeps working exactly as before. Both bodies render the same search
   row + 320 px map and report the chosen pin up here for the confirm row. */
export default function LocationPicker({
  open,
  title,
  initial,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  title: string;
  initial?: Coord;
  onCancel: () => void;
  onConfirm: (c: Coord) => void;
}) {
  const [coord, setCoord] = useState<Coord | null>(null);
  const [busy, setBusy] = useState(false);
  /* flipped when Google is unconfigured-by-failure (bad key / offline) */
  const [googleOff, setGoogleOff] = useState(false);
  const reduce = useReducedMotion();

  /* every open starts from the stored pin (or empty) — no stale label left
     over from an edit the visitor then cancelled */
  useEffect(() => {
    if (open) {
      setCoord(initial ?? null);
      setBusy(false);
    }
  }, [open, initial]);

  const useGoogle = GOOGLE_MAPS_KEY !== "" && !googleOff;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm"
          onClick={onCancel}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? undefined : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-paper-2 bg-white shadow-[0_30px_70px_-30px_rgba(16,35,63,0.5)]"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-paper-2 px-5 py-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
                <MapPin size={18} className="text-gold-deep" />
                {title}
              </h3>
              <button
                onClick={onCancel}
                aria-label="Close map picker"
                className="grid h-9 w-9 place-items-center rounded-lg text-steel transition-colors hover:bg-paper hover:text-ink"
              >
                <X size={18} />
              </button>
            </div>

            {/* engine-owned search row + map */}
            {useGoogle ? (
              <GooglePickerBody
                initial={initial}
                onPick={setCoord}
                onBusy={setBusy}
                onError={() => setGoogleOff(true)}
              />
            ) : (
              <LeafletPickerBody initial={initial} onPick={setCoord} onBusy={setBusy} />
            )}

            {/* chosen location + confirm */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-paper-2 px-5 py-4">
              <p className="min-w-0 flex-1 text-[13px] leading-snug text-steel">
                {busy ? (
                  <span className="flex items-center gap-2 text-fog">
                    <Loader2 size={14} className="animate-spin" /> Finding address…
                  </span>
                ) : coord ? (
                  <span className="line-clamp-2">{coord.label}</span>
                ) : (
                  "Tap the map or search to set your exact point."
                )}
              </p>
              <button
                disabled={!coord || busy}
                onClick={() => coord && onConfirm(coord)}
                className="shrink-0 rounded-lg bg-navy px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-navy-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Set this location
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
