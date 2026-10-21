import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Crosshair, Search } from "lucide-react";
import { GOOGLE_MAPS_KEY, type Coord } from "../data";

/* ── Google Maps engine ───────────────────────────────────────────────
   Active only when a key is configured (see GOOGLE_MAPS_KEY in data.ts).
   The JS API + Places library are pulled in once, on first open. If the
   script can't load, or Google rejects the key (gm_authFailure), the
   component reports onError and the picker falls back to the keyless
   OpenStreetMap engine instead of showing a broken map.               */

let gPromise: Promise<void> | null = null;
const loadGoogle = (): Promise<void> =>
  (gPromise ??= new Promise((resolve, reject) => {
    const w = window as unknown as { google?: { maps?: unknown } };
    if (w.google?.maps) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
      GOOGLE_MAPS_KEY,
    )}&libraries=places&v=weekly`;
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => {
      gPromise = null; /* allow a retry on the next open */
      reject(new Error("Google Maps script failed to load"));
    };
    document.head.appendChild(s);
  }));

/* Google calls this global when it refuses the key (billing disabled, wrong
   domain, quota). Registered before the API loads so we never miss it. */
let onAuthFail: (() => void) | null = null;
(window as unknown as { gm_authFailure?: () => void }).gm_authFailure = () =>
  onAuthFail?.();

/* Default view — Amritsar */
const AMRITSAR = { lat: 31.634, lng: 74.8723 };

/* Same gold pin as the OpenStreetMap engine, as a data URI for Marker. */
const PIN_URL = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg width="30" height="42" viewBox="0 0 30 42" xmlns="http://www.w3.org/2000/svg"><path d="M15 41C15 41 28 26.5 28 15A13 13 0 1 0 2 15c0 11.5 13 26 13 26Z" fill="#c9962e" stroke="#ffffff" stroke-width="2"/><circle cx="15" cy="15" r="5" fill="#ffffff"/></svg>`,
)}`;

const coordFallback = (lat: number, lng: number) =>
  `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

export default function GooglePickerBody({
  initial,
  onPick,
  onBusy,
  onError,
}: {
  initial?: Coord;
  onPick: (c: Coord) => void;
  onBusy: (b: boolean) => void;
  onError: () => void;
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mapObj = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  /* the effect-owned "geocode + report" path, reused by Locate me */
  const reportRef = useRef<
    ((lat: number, lng: number, given?: string) => Promise<void>) | null
  >(null);
  const [ready, setReady] = useState(false);
  const [query, setQuery] = useState("");
  const reduce = useReducedMotion();

  useEffect(() => {
    let disposed = false;
    let ac: google.maps.places.Autocomplete | null = null;

    const fail = (why: unknown) => {
      console.warn("[picker] Google Maps unavailable — using OpenStreetMap", why);
      if (!disposed) onError();
    };

    void (async () => {
      try {
        await loadGoogle();
        const div = divRef.current;
        const input = inputRef.current;
        if (disposed || !div || !input) return;

        onAuthFail = () => fail("key rejected by Google");

        const start: google.maps.LatLngLiteral = initial
          ? { lat: initial.lat, lng: initial.lng }
          : AMRITSAR;
        const map = new google.maps.Map(div, {
          center: start,
          zoom: initial ? 16 : 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          backgroundColor: "#f6f8fa",
        });
        const geo = new google.maps.Geocoder();
        const mk = new google.maps.Marker({
          map,
          position: start,
          draggable: true,
          icon: {
            url: PIN_URL,
            scaledSize: new google.maps.Size(30, 42),
            anchor: new google.maps.Point(15, 42),
          },
        });

        /* Move the pin / resolve its address and report up to the modal. */
        const report = async (lat: number, lng: number, given?: string) => {
          onBusy(true);
          let label = given ?? "";
          if (!label) {
            try {
              const r = await geo.geocode({ location: { lat, lng }, region: "IN" });
              label = r.results[0]?.formatted_address ?? "";
            } catch {
              label = "";
            }
          }
          if (!disposed) onPick({ lat, lng, label: label || coordFallback(lat, lng) });
          onBusy(false);
        };
        reportRef.current = report;

        mk.addListener("dragend", () => {
          const p = mk.getPosition();
          if (p) void report(p.lat(), p.lng());
        });
        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          mk.setPosition(e.latLng);
          void report(e.latLng.lat(), e.latLng.lng());
        });

        /* Google's own suggestion dropdown replaces the Nominatim list. */
        const autocomplete = new google.maps.places.Autocomplete(input, {
          fields: ["geometry", "formatted_address", "name"],
          componentRestrictions: { country: "in" },
        });
        ac = autocomplete;
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          const loc = place.geometry?.location;
          if (!loc) return;
          if (reduce) map.setCenter(loc);
          else map.panTo(loc);
          map.setZoom(16);
          mk.setPosition(loc);
          void report(
            loc.lat(),
            loc.lng(),
            place.formatted_address || place.name || undefined,
          );
        });

        mapObj.current = map;
        markerRef.current = mk;
        setReady(true);

        void report(start.lat, start.lng, initial?.label);
      } catch (err) {
        fail(err);
      }
    })();

    return () => {
      disposed = true;
      onAuthFail = null;
      reportRef.current = null;
      ac?.unbindAll?.();
      markerRef.current?.setMap(null);
      mapObj.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useMyLocation = () => {
    const map = mapObj.current;
    const report = reportRef.current;
    if (!navigator.geolocation || !map || !report) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const c = new (window as unknown as { google: typeof google }).google.maps.LatLng(
          lat,
          lng,
        );
        if (reduce) map.setCenter(c);
        else map.panTo(c);
        map.setZoom(16);
        markerRef.current?.setPosition(c);
        void report(lat, lng);
      },
      () => {},
      { enableHighAccuracy: true, timeout: 8000 },
    );
  };

  return (
    <>
      {/* search row — Google Places autocomplete is attached to this input */}
      <div className="border-b border-paper-2 px-5 py-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-fog"
            />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a place, e.g. Golden Temple…"
              aria-label="Search a place"
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
      </div>

      {/* map */}
      <div className="relative h-[320px] w-full bg-paper">
        <div ref={divRef} className="absolute inset-0" />
        {!ready && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-paper text-center font-mono text-[10px] tracking-[0.22em] text-fog">
            LOADING GOOGLE MAPS…
          </div>
        )}
      </div>
    </>
  );
}
