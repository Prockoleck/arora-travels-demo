import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Crosshair, Loader2, MapPin, Search, X } from "lucide-react";
import type * as LType from "leaflet";
import { type Coord } from "../data";

/* Leaflet (~80 kB) is loaded on demand the first time the picker opens, so
   the main bundle stays light for visitors who never tap the map button. */
let leafletPromise: Promise<typeof LType> | null = null;
const loadLeaflet = () =>
  (leafletPromise ??= import("leaflet").then(async (mod) => {
    await import("leaflet/dist/leaflet.css");
    return mod;
  }));

/* Amritsar — default map centre */
const AMRITSAR: [number, number] = [31.634, 74.8723];

/* Inline pin so we don't depend on Leaflet's CDN image assets (which
   break under Vite bundling). Takes the loaded module (see loadLeaflet). */
const pinIcon = (L: typeof LType, active: boolean) =>
  L.divIcon({
    className: "",
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    html: `<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 41C15 41 28 26.5 28 15A13 13 0 1 0 2 15c0 11.5 13 26 13 26Z"
            fill="${active ? "#c9962e" : "#10233f"}" stroke="#ffffff" stroke-width="2"/>
      <circle cx="15" cy="15" r="5" fill="#ffffff"/>
    </svg>`,
  });

/* Free, keyless geocoding — Nominatim (OpenStreetMap). Attribution is
   required by their usage policy and is shown in the modal footer. */
const NOMINATIM = "https://nominatim.openstreetmap.org";

type NominatimResult = {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
};

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const url = `${NOMINATIM}/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&accept-language=en`;
    const res = await fetch(url);
    if (!res.ok) return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    const data = (await res.json()) as { display_name?: string };
    return data.display_name || `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  } catch {
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  }
}

async function searchPlaces(q: string): Promise<NominatimResult[]> {
  const url = `${NOMINATIM}/search?format=jsonv2&limit=6&q=${encodeURIComponent(
    q,
  )}&accept-language=en`;
  const res = await fetch(url);
  if (!res.ok) return [];
  return (await res.json()) as NominatimResult[];
}

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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapObj = useRef<LType.Map | null>(null);
  const marker = useRef<LType.Marker | null>(null);
  const [coord, setCoord] = useState<Coord | null>(initial ?? null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const reduce = useReducedMotion();

  /* Place / move the pin and reverse-geocode its label. */
  const place = useCallback(async (lat: number, lng: number) => {
    setBusy(true);
    const label = await reverseGeocode(lat, lng);
    setCoord({ lat, lng, label });
    setBusy(false);
  }, []);

  /* Initialise the map once, when the modal opens (Leaflet loads lazily). */
  useEffect(() => {
    if (!open || mapObj.current) return;
    let disposed = false;
    let map: LType.Map | null = null;

    void (async () => {
      const L = await loadLeaflet();
      /* modal closed (or component unmounted) while the chunk loaded */
      if (disposed || !mapRef.current) return;
      const start: [number, number] = initial
        ? [initial.lat, initial.lng]
        : AMRITSAR;
      map = L.map(mapRef.current, {
        center: start,
        zoom: initial ? 16 : 13,
        zoomControl: true,
        attributionControl: true,
      });
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      marker.current = L.marker(start, {
        icon: pinIcon(L, true),
        draggable: true,
      }).addTo(map);
      marker.current.on("dragend", () => {
        const p = marker.current!.getLatLng();
        void place(p.lat, p.lng);
      });
      map.on("click", (e: LType.LeafletMouseEvent) => {
        marker.current!.setLatLng(e.latlng);
        void place(e.latlng.lat, e.latlng.lng);
      });
      mapObj.current = map;

      if (initial) void place(initial.lat, initial.lng);
      else void place(AMRITSAR[0], AMRITSAR[1]);
    })();

    return () => {
      disposed = true;
      map?.remove();
      mapObj.current = null;
      marker.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  /* Search-as-you-type against Nominatim (debounced). */
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const id = setTimeout(async () => {
      setSearching(true);
      try {
        setResults(await searchPlaces(query));
      } finally {
        setSearching(false);
      }
    }, 450);
    return () => clearTimeout(id);
  }, [query]);

  const flyTo = (lat: number, lng: number) => {
    mapObj.current?.flyTo([lat, lng], 16, { duration: reduce ? 0 : 0.8 });
    marker.current?.setLatLng([lat, lng]);
    void place(lat, lng);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setSearching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSearching(false);
        flyTo(pos.coords.latitude, pos.coords.longitude);
      },
      () => setSearching(false),
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

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

            {/* search row */}
            <div className="border-b border-paper-2 px-5 py-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search
                    size={15}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fog"
                  />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search a place, e.g. Golden Temple…"
                    className="w-full rounded-lg border border-paper-2 bg-white py-2.5 pl-9 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-fog focus:border-gold"
                  />
                </div>
                <button
                  onClick={useMyLocation}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg border border-paper-2 px-3 py-2.5 text-xs font-bold text-steel transition-all hover:border-gold hover:text-gold-deep"
                  title="Use my current location"
                >
                  <Crosshair size={14} />
                  <span className="hidden sm:inline">Locate me</span>
                </button>
              </div>

              {/* search results */}
              {results.length > 0 && (
                <ul className="mt-2 max-h-40 space-y-1 overflow-y-auto">
                  {results.map((r) => (
                    <li key={r.place_id}>
                      <button
                        onClick={() => {
                          flyTo(parseFloat(r.lat), parseFloat(r.lon));
                          setResults([]);
                          setQuery("");
                        }}
                        className="w-full rounded-md px-2 py-1.5 text-left text-[13px] leading-snug text-steel transition-colors hover:bg-paper hover:text-ink"
                      >
                        {r.display_name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* map */}
            <div ref={mapRef} className="h-[320px] w-full bg-paper" />

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
