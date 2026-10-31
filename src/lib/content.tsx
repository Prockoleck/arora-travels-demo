import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  BUSINESS,
  FLEET,
  IMAGES,
  REASONS,
  ROUTES,
  SERVICES,
  SIGHTS,
  STATS,
  TESTIMONIALS,
  TICKER_ITEMS,
  TIMELINE,
  VEHICLE_OPTIONS,
  type RouteFare,
  type Sight,
  type Vehicle,
} from "../data";

/* ────────────────────────────────────────────────────────────────
   Site content — the single editable model behind the public site.

   Defaults live in src/data.ts. A published snapshot lives at
   /content/site.json (committed to the repo by the admin console's
   publish API). The provider merges the snapshot over the defaults,
   so a missing/partial file can never break the site.

   Draft mode: /?draft=1 applies the admin's local draft on top —
   used by the console's "Preview on site" button.
   ──────────────────────────────────────────────────────────────── */

export type HeroSlide = { src: string; alt: string; caption: string };

export type HeroContent = {
  line1: string;
  line2: string;
  accent: string;
  badge: string;
  subA: string;
  subBold: string;
  subEnd: string;
  cta: string;
  /* framed photo slideshow beside the headline */
  slides: HeroSlide[];
  slideSeconds: number;
};

export type WelcomeContent = { heading: string; text: string };

export type TickerContent = { items: string[]; seconds: number };

export type BandContent = {
  eyebrow: string;
  pre: string;
  accent: string;
  text: string;
  cta: string;
  img: string;
  imgAlt: string;
  caption: string;
};

export type AboutContent = { img: string; imgAlt: string; caption: string };
export type WhyContent = { img: string; imgAlt: string; caption: string };

export type SiteContent = {
  business: typeof BUSINESS;
  hero: HeroContent;
  welcome: WelcomeContent;
  ticker: TickerContent;
  band: BandContent;
  about: AboutContent;
  why: WhyContent;
  logo: { src: string };
  stats: { value: number; suffix: string; label: string }[];
  sights: Sight[];
  services: { n: string; title: string; desc: string; includes: string[] }[];
  fleet: Vehicle[];
  vehicleOptions: string[];
  routes: RouteFare[];
  reasons: { title: string; desc: string }[];
  timeline: { year: string; title: string; text: string }[];
  testimonials: { quote: string; name: string; role: string }[];
  photoCredit: string;
};

export const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;

export function defaultContent(): SiteContent {
  return {
    business: { ...BUSINESS, phones: BUSINESS.phones.map((p) => ({ ...p })) },
    hero: {
      line1: "Premium car rental",
      line2: "& taxi services in",
      accent: "Amritsar",
      badge: "SINCE ’97",
      subA: "Not just a car — a",
      subBold: "complete, tailor-made transportation solution",
      subEnd:
        "for executives, families and guests. Economical rates, reasonable corporate tariffs, professional chauffeurs. Any hour, any road.",
      cta: "Book your ride now",
      slides: [
        {
          src: "/dest/golden-temple.jpg",
          alt: "The Golden Temple (Harmandir Sahib) glowing at dusk, reflected in the sarovar",
          caption: "Harmandir Sahib · Amritsar at dusk",
        },
        {
          src: "/dest/wagah.jpg",
          alt: "The India gate at the Attari-Wagah border with the tricolour flying over a packed stadium",
          caption: "Attari–Wagah Border · retreat ceremony",
        },
        {
          src: "/dest/jallianwala-bagh.jpg",
          alt: "The Jallianwala Bagh memorial wall and bronze statue in Amritsar",
          caption: "Jallianwala Bagh · a quiet memorial",
        },
        {
          src: "/dest/durgiana-temple.jpg",
          alt: "Golden domes of Durgiana Temple seen from the marble bridge over its sarovar",
          caption: "Durgiana Temple · the lake temple",
        },
      ],
      slideSeconds: 7,
    },
    welcome: {
      heading: "Welcome to Arora Travels",
      text:
        "For nearly three decades, families, executives and pilgrims have stepped into our Gol Bagh stand and driven away with the same thing: a clean car, a courteous chauffeur and a fare agreed before the wheels turn. That is still the whole idea.",
    },
    ticker: { items: [...TICKER_ITEMS], seconds: 30 },
    band: {
      eyebrow: "Explore Amritsar",
      pre: "From the Golden Temple to the",
      accent: "Wagah Border",
      text:
        "Airport drops, city darshan and evening trips to the border retreat ceremony — our chauffeurs have run every one of these roads, at every hour of the night. Tell us where; we’ll take you there.",
      cta: "Book your ride",
      img: "/dest/wagah.jpg",
      imgAlt:
        "The India gate at the Attari-Wagah border with the tricolour flying over a packed stadium",
      caption: "Attari–Wagah Border · retreat ceremony",
    },
    about: {
      img: IMAGES.heritage,
      imgAlt: "An Arora Travels car in company livery",
      caption: "Gol Bagh Taxi Stand · where it all began — Amritsar, 1997",
    },
    why: {
      img: IMAGES.chauffeur,
      imgAlt: "An Arora Travels chauffeur in uniform beside a sedan",
      caption: "Our chauffeurs · verified & uniformed",
    },
    logo: { src: "/logo.jpg" },
    stats: STATS.map((s) => ({ ...s })),
    sights: SIGHTS.map((s) => ({ ...s })),
    services: SERVICES.map((s) => ({
      n: s.n,
      title: s.title,
      desc: s.desc,
      includes: [...s.includes],
    })),
    fleet: FLEET.map((v) => ({ ...v })),
    vehicleOptions: [...VEHICLE_OPTIONS],
    routes: ROUTES.map((r) => ({ ...r })),
    reasons: REASONS.map((r) => ({ title: r.title, desc: r.desc })),
    timeline: TIMELINE.map((t) => ({ ...t })),
    testimonials: TESTIMONIALS.map((t) => ({ quote: t.quote, name: t.name, role: t.role })),
    photoCredit:
      "Wikimedia Commons — Golden Temple & Jallianwala Bagh © Bernard Gagnon (CC BY-SA) · Durgiana Temple © Jaiprakashsingh (CC BY-SA) · Partition Museum © shankar s. (CC BY 2.0) · Gobindgarh Fort © Gobindgarh Fort (CC BY-SA 4.0) · Ram Bagh © Harvinder Chandigarh (CC BY-SA 4.0) · Wagah Border © Tamjeed Ahmed (CC BY-SA)",
  };
}

/** Merge a published/partial snapshot over the defaults, defensively. */
export function mergeContent(saved: unknown): SiteContent {
  const d = defaultContent();
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return d;
  const s = saved as Record<string, unknown>;
  const out = { ...d } as unknown as Record<string, unknown>;

  for (const key of Object.keys(d) as (keyof SiteContent)[]) {
    const v = s[key];
    if (v === undefined || v === null) continue;
    const def = d[key] as unknown;
    if (key === "business" && typeof v === "object" && !Array.isArray(v)) {
      out.business = { ...(def as object), ...(v as object) };
    } else if (Array.isArray(def)) {
      if (Array.isArray(v)) out[key] = v;
    } else if (typeof def === "object" && typeof v === "object" && !Array.isArray(v)) {
      out[key] = { ...(def as object), ...(v as object) };
    } else if (typeof v === typeof def) {
      out[key] = v;
    }
  }

  const biz = out.business as unknown as SiteContent["business"];
  if (!Array.isArray(biz.phones) || biz.phones.length === 0) {
    biz.phones = d.business.phones;
  }

  /* Migrate a pre-slideshow snapshot: the saved hero image becomes slide 1 */
  const savedHero = (
    s.hero && typeof s.hero === "object" && !Array.isArray(s.hero) ? s.hero : {}
  ) as Record<string, unknown>;
  const hero = out.hero as unknown as HeroContent;
  if (!Array.isArray(savedHero.slides)) {
    const img = typeof savedHero.img === "string" ? savedHero.img.trim() : "";
    if (img) {
      hero.slides = [
        {
          src: img,
          alt: typeof savedHero.imgAlt === "string" ? savedHero.imgAlt : "",
          caption: typeof savedHero.caption === "string" ? savedHero.caption : "",
        },
      ];
    }
  }
  hero.slides = (Array.isArray(hero.slides) ? hero.slides : []).filter(
    (slide) => slide && typeof slide.src === "string" && slide.src.trim() !== "",
  );
  if (hero.slides.length === 0) hero.slides = d.hero.slides;
  if (!Number.isFinite(hero.slideSeconds) || hero.slideSeconds < 2) {
    hero.slideSeconds = d.hero.slideSeconds;
  }

  /* Migrate the old destination board into the customizable ticker tape */
  const ticker = out.ticker as unknown as TickerContent;
  const savedTicker = (
    s.ticker && typeof s.ticker === "object" && !Array.isArray(s.ticker) ? s.ticker : {}
  ) as Record<string, unknown>;
  if (!Array.isArray(savedTicker.items) && Array.isArray(s.destinations)) {
    const migrated = s.destinations.filter(
      (item): item is string => typeof item === "string" && item.trim() !== "",
    );
    if (migrated.length) ticker.items = migrated;
  }
  if (!Array.isArray(ticker.items) || ticker.items.length === 0) {
    ticker.items = d.ticker.items;
  }
  if (!Number.isFinite(ticker.seconds) || ticker.seconds < 5) {
    ticker.seconds = d.ticker.seconds;
  }

  return out as unknown as SiteContent;
}

/* ── Draft persistence (admin's unpublished working copy) ───── */
export const DRAFT_KEY = "arora_site_draft";

export function loadDraft(): SiteContent | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return mergeContent(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function saveDraft(c: SiteContent): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(c));
  } catch {
    /* quota — draft stays in memory */
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

/** Cheap structural equality for dirty-state checks. */
export function contentEquals(a: SiteContent, b: SiteContent): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

/* ── Provider ───────────────────────────────────────────────── */
type ContentCtx = { content: SiteContent; loaded: boolean };
const Ctx = createContext<ContentCtx>({ content: defaultContent(), loaded: false });

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(() => defaultContent());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const wantDraft = new URLSearchParams(window.location.search).has("draft");

    fetch(`/content/site.json?t=${Date.now()}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json().catch(() => null) : null))
      .then((json) => {
        if (cancelled) return;
        let next = json ? mergeContent(json) : defaultContent();
        if (wantDraft) {
          const draft = loadDraft();
          if (draft) next = mergeContent(draft);
        }
        setContent(next);
        setLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <Ctx.Provider value={{ content, loaded }}>{children}</Ctx.Provider>;
}

export function useContent(): SiteContent {
  return useContext(Ctx).content;
}

export function useContentLoaded(): boolean {
  return useContext(Ctx).loaded;
}

/* ── Small shared helpers ───────────────────────────────────── */
/** "+91 99144 04090" / "099144 04090" → "tel:+919914404090" */
export function telHref(display: string): string {
  const digits = (display || "").replace(/\D/g, "");
  if (!digits) return "tel:";
  return `tel:+${digits}`;
}
