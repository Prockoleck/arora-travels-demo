import { useEffect, useRef, type KeyboardEvent } from "react";
import L from "leaflet";
import { ArrowUpRight, MapPin } from "lucide-react";
import { useContent } from "../lib/content";

/* Show-only stand map.

   Why not a Google Maps iframe? A keyless Google embed shows every nearby
   taxi agency and hotel as a label — exactly what the client asked us to
   avoid. Esri's “World Light Gray Base” is keyless and has no business
   labels at this zoom, so the only pin on this map is Arora Travels.
   Clicking the map (or the pin) opens the exact Google Business Profile
   in a new tab. */
export default function StandMap() {
  const { business } = useContent();
  const holder = useRef<HTMLDivElement>(null);
  const { lat, lng } = business.mapCoords;

  const openProfile = () => {
    window.open(business.mapsUrl, "_blank", "noopener,noreferrer");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProfile();
    }
  };

  useEffect(() => {
    const el = holder.current;
    if (!el) return;

    const map = L.map(el, {
      center: [lat, lng],
      zoom: 16,
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      keyboard: false,
      attributionControl: true,
    });

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a> — Esri, HERE, Garmin, &copy; OpenStreetMap contributors',
        maxZoom: 16,
        minZoom: 13,
      },
    ).addTo(map);

    const icon = L.divIcon({
      className: "arora-map-icon",
      html: '<span class="arora-map-dot"></span>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    const marker = L.marker([lat, lng], {
      icon,
      title: "Arora Travels",
      alt: "Arora Travels — Shop No. 46, Gol Bagh Taxi Stand Market, Amritsar",
      bubblingMouseEvents: false,
    }).addTo(map);

    marker.bindTooltip("ARORA TRAVELS", {
      permanent: true,
      direction: "top",
      offset: [0, -13],
      opacity: 1,
      className: "arora-map-tip",
    });

    marker.on("click", openProfile);
    map.on("click", openProfile);

    const resize = new ResizeObserver(() => map.invalidateSize());
    resize.observe(el);

    return () => {
      resize.disconnect();
      map.off();
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng, business.mapsUrl]);

  return (
    <div className="mt-14 overflow-hidden rounded-2xl border border-paper-2 bg-paper">
      <div className="relative">
        <div
          ref={holder}
          tabIndex={0}
          role="link"
          aria-label="Arora Travels on Google Maps — opens the exact business profile in a new tab"
          onKeyDown={onKeyDown}
          className="arora-map relative z-0 h-[320px] w-full cursor-pointer outline-none focus-visible:ring-4 focus-visible:ring-gold/40 sm:h-[360px]"
        />

        {/* area chip — keeps the no-label map oriented */}
        <div className="pointer-events-none absolute left-4 top-4 z-10 flex items-center gap-2 rounded-lg border border-white/70 bg-white/95 px-3 py-2 shadow-sm backdrop-blur">
          <MapPin size={13} className="text-gold-deep" />
          <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-navy">
            Gol Bagh · Amritsar
          </span>
        </div>

        <a
          href={business.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="absolute right-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-lg bg-navy px-3.5 py-2 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-white shadow-sm transition-colors hover:bg-navy-800"
        >
          Google Maps
          <ArrowUpRight size={12} strokeWidth={2.5} />
        </a>

        <span className="pointer-events-none absolute bottom-4 left-4 z-10 hidden rounded-md bg-white/90 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-steel shadow-sm backdrop-blur sm:block">
          Tap the map to open the profile
        </span>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-paper-2 bg-white px-5 py-3.5">
        <p className="text-xs text-steel">
          <span className="font-bold text-ink">Arora Travels</span> · Shop No. 46, Gol Bagh Taxi
          Stand Market
        </p>
        <a
          href={business.mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-1.5 text-xs font-bold text-gold-deep"
        >
          Open in Google Maps
          <ArrowUpRight
            size={13}
            strokeWidth={2.5}
            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </div>
  );
}
