import {
  Briefcase,
  Car,
  Clock,
  IndianRupee,
  Luggage,
  Map as MapIcon,
  Plane,
  Receipt,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

/* ── Business facts ──────────────────────────────────────── */
export const BUSINESS = {
  name: "Arora Travels",
  est: 1997,
  phoneDisplay: "+91 99144 04090",
  phoneTel: "tel:+919914404090",
  phones: [
    { display: "+91 99144 04090", tel: "tel:+919914404090" },
    { display: "+91 99150 70856", tel: "tel:+919915070856" },
    { display: "+91 98143 70856", tel: "tel:+919814370856" },
  ],
  email: "aroratravels46@rediffmail.com",
  whatsapp: "https://wa.me/919914404090",
  address:
    "Shop No. 46, Gol Bagh, Taxi Stand Market, Narain Nagar, Goal Bagh, Amritsar, Punjab 143001, India",
  addressShort: "Shop No. 46, Gol Bagh Taxi Stand Market, Amritsar, Punjab 143001",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=Arora+Travels,+Gol+Bagh,+Amritsar,+Punjab+143001",
};

export const HERO_IMG =
  "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1920&q=80";

export const IMAGES = {
  heritage:
    "https://image.qwenlm.ai/generated-images/6a46dbb6-cee2-43fe-a9b4-ca6d3671ad15/_result.png",
  chauffeur:
    "https://image.qwenlm.ai/generated-images/c0446841-ea5f-45d4-9258-ae90a9088f23/_result.png",
};

/* ── Booking form model (shared between hero CTA & booking form) ── */
export type Booking = {
  name: string;
  phone: string;
  pickup: string;
  drop: string;
  datetime: string;
  vehicle: string;
  passengers: number;
  /** Optional precise coordinates chosen on the map (WGS84), if used. */
  pickupCoords?: Coord;
  dropCoords?: Coord;
};

/** A chosen point on the map. `label` is the human-readable address. */
export type Coord = {
  lat: number;
  lng: number;
  label: string;
};

/** Passenger-count bounds (matches the fleet's smallest & largest seats). */
export const PASSENGERS_MIN = 1;
export const PASSENGERS_MAX = 30;

/** Build a tappable Google Maps link from a coordinate (dispatcher handoff). */
export const gmapsLink = (c: Coord) =>
  `https://www.google.com/maps?q=${c.lat},${c.lng}`;

/** Google Maps key for the *interactive* location picker.
 *  Paste the key between the quotes below, or set the `VITE_GOOGLE_MAPS_KEY`
 *  env var (Vercel → Project → Settings → Environment Variables) and rebuild.
 *  While empty, the picker runs on the keyless OpenStreetMap engine — and if a
 *  provided key is rejected by Google (billing off, wrong domain), the picker
 *  falls back to OpenStreetMap automatically instead of breaking. */
export const GOOGLE_MAPS_KEY = (
  (import.meta as unknown as { env?: Record<string, string | undefined> }).env
    ?.VITE_GOOGLE_MAPS_KEY ?? ""
).trim();

export const VEHICLE_OPTIONS = [
  "Any vehicle — you decide for me",
  "Compact Sedan (Dzire / Amaze)",
  "Family SUV (Innova Crysta)",
  "Premium SUV (Toyota Fortuner)",
  "Tempo Traveller (12-seater)",
  "Mini Bus (25–30 seats)",
];

export const defaultDatetime = () => {
  const d = new Date(Date.now() + 2 * 3600 * 1000);
  d.setMinutes(0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
};

export const emptyBooking = (): Booking => ({
  name: "",
  phone: "",
  pickup: "",
  drop: "",
  datetime: defaultDatetime(),
  vehicle: VEHICLE_OPTIONS[0],
  passengers: 2,
  pickupCoords: undefined,
  dropCoords: undefined,
});

/* ── Destination board (marquee) ─────────────────────────── */
export const DESTINATIONS = [
  "ATQ Airport Transfers",
  "Golden Temple",
  "Wagah Border",
  "Delhi",
  "Chandigarh",
  "Katra · Vaishno Devi",
  "McLeodganj",
  "Jammu",
  "Corporate Fleet",
  "Wedding Cars",
  "Jallianwala Bagh",
  "Amritsar City Tour",
];

/* ── Services ────────────────────────────────────────────── */
export type Service = {
  n: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  includes: string[];
};

export const SERVICES: Service[] = [
  {
    n: "01",
    icon: Car,
    title: "Executive Car Hire",
    desc: "Chauffeur-driven sedans and SUVs for board meetings, weddings, and city travel — spotless cars, punctual drivers, zero fuss.",
    includes: ["Uniformed chauffeur", "Sanitised cabin", "Hourly & daily packs"],
  },
  {
    n: "02",
    icon: Briefcase,
    title: "Corporate Transportation",
    desc: "One call, one monthly invoice, zero headaches. Fixed corporate tariffs, GST billing and priority cars for your teams and guests.",
    includes: ["Monthly billing", "GST invoices", "Dedicated manager"],
  },
  {
    n: "03",
    icon: MapIcon,
    title: "Outstation Taxi Services",
    desc: "One-way or round trips to Delhi, Chandigarh, Katra, McLeodganj and beyond — drivers who know every highway and every hill route.",
    includes: ["One-way & round trips", "Experienced hill drivers", "Multi-day packages"],
  },
  {
    n: "04",
    icon: Plane,
    title: "24/7 Airport Pickup & Drop",
    desc: "Sri Guru Ram Dass Jee International (ATQ), any hour. We track your flight, hold a name placard, and wait — the first 30 minutes free.",
    includes: ["Flight tracking", "Meet & greet placard", "30-min free waiting"],
  },
];

/* ── Fleet & tariffs ─────────────────────────────────────── */
export type Vehicle = {
  key: string;
  name: string;
  models: string;
  img: string;
  seats: number | string;
  bags: number | string;
  /* null = quoted per trip — no public tariff for this class yet */
  perKm: number | null;
  perDay: string | null;
  tag?: string;
};

export const FLEET: Vehicle[] = [
  {
    key: VEHICLE_OPTIONS[1],
    name: "Suzuki Dzire",
    models: "Maruti Suzuki Dzire · compact sedan",
    img: "/fleet/dzire.jpg",
    seats: 4,
    bags: 2,
    perKm: 12,
    perDay: "₹1,500",
    tag: "MOST BOOKED",
  },
  {
    key: VEHICLE_OPTIONS[1],
    name: "Honda Amaze",
    models: "Honda Amaze · compact sedan",
    img: "/fleet/amaze.jpg",
    seats: 4,
    bags: 2,
    perKm: 12,
    perDay: "₹1,500",
  },
  {
    key: VEHICLE_OPTIONS[2],
    name: "Innova Crysta",
    models: "Toyota Innova Crysta · family SUV",
    img: "/fleet/innova.jpg",
    seats: 7,
    bags: 4,
    perKm: 16,
    perDay: "₹2,200",
  },
  {
    key: VEHICLE_OPTIONS[3],
    name: "Toyota Fortuner",
    models: "Toyota Fortuner · premium SUV",
    img: "/fleet/fortuner.jpg",
    seats: 7,
    bags: 4,
    perKm: 20,
    perDay: "₹2,800",
    tag: "EXECUTIVE",
  },
  {
    key: VEHICLE_OPTIONS[4],
    name: "Tempo Traveller",
    models: "Force Traveller · 12 seater",
    img: "/fleet/traveller.jpg",
    seats: 12,
    bags: 10,
    perKm: 22,
    perDay: "₹3,000",
    tag: "GROUPS",
  },
  {
    key: VEHICLE_OPTIONS[5],
    name: "Mini Bus",
    models: "Air-conditioned group coach",
    img: "/fleet/minibus.jpg",
    seats: "25–30",
    bags: "20+",
    perKm: null,
    perDay: null,
    tag: "LARGE GROUPS",
  },
];

/* ── Popular routes (tap → pre-fills the booking form) ───── */
export type RouteFare = { from: string; to: string; fare: string };

export const ROUTES: RouteFare[] = [
  { from: "ATQ Airport", to: "Golden Temple / City Hotel", fare: "₹499" },
  { from: "Amritsar", to: "Wagah Border (round trip)", fare: "₹1,199" },
  { from: "Amritsar", to: "Delhi (one way)", fare: "₹4,499" },
  { from: "Amritsar", to: "Chandigarh (one way)", fare: "₹2,999" },
  { from: "Amritsar", to: "Katra — Vaishno Devi", fare: "₹3,799" },
  { from: "Amritsar", to: "McLeodganj / Dharamshala", fare: "₹3,499" },
  { from: "Amritsar", to: "Ludhiana (one way)", fare: "₹1,999" },
  { from: "Amritsar", to: "Golden Temple City Tour", fare: "₹899" },
];

/* ── Why choose us ───────────────────────────────────────── */
export type Reason = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

export const REASONS: Reason[] = [
  {
    icon: IndianRupee,
    title: "Economical Rates",
    desc: "Honest per-kilometre pricing agreed before the wheel turns. No surge nonsense, no meter drama, no surprise line items.",
  },
  {
    icon: Receipt,
    title: "Reasonable Corporate Tariffs",
    desc: "Fixed monthly packages, GST-compliant invoicing and priority vehicles for businesses that move people every single week.",
  },
  {
    icon: ShieldCheck,
    title: "Professional Chauffeurs",
    desc: "Uniformed, verified drivers who speak Punjabi, Hindi and English — and know every shortcut from Gol Bagh to the GT Road.",
  },
  {
    icon: Clock,
    title: "24/7 Availability",
    desc: "A 3:40 AM flight? A wedding baraat at midnight? One call and a driver is already warming the engine at the stand.",
  },
];

/* ── Heritage timeline ───────────────────────────────────── */
export const TIMELINE = [
  {
    year: "1997",
    title: "One taxi, one stand",
    text: "The first Arora taxi takes its place at the Gol Bagh taxi stand. One car, one promise: reach on time.",
  },
  {
    year: "2003",
    title: "The airport runs begin",
    text: "Word spreads. Regular pickups from Raja Sansi airfield turn into Amritsar's most trusted airport service.",
  },
  {
    year: "2011",
    title: "Corporate contracts",
    text: "Local businesses hand us their guest movement — monthly billing and fixed tariffs are born.",
  },
  {
    year: "2019",
    title: "A modern fleet",
    text: "Every vehicle GPS-tracked, every chauffeur trained and uniformed. The standards go up; the rates stay honest.",
  },
  {
    year: "Today",
    title: "40+ vehicles, one promise",
    text: "Sedans, SUVs and travellers on call 24×7 — still family-run, still answering the phone at 3 AM.",
  },
];

/* ── Testimonials ────────────────────────────────────────── */
export const TESTIMONIALS = [
  {
    quote:
      "Booked an airport pickup for 3:40 in the morning. The driver was waiting with my name board before I even cleared baggage. That's 27 years of practice.",
    name: "Simran Kaur",
    role: "NRI guest · Toronto, Canada",
    rotate: "-rotate-2",
  },
  {
    quote:
      "Arora Travels has handled all our guest movement in Amritsar for six years. One call, one invoice, zero headaches. The corporate tariff is genuinely fair.",
    name: "Rajesh Malhotra",
    role: "AGM Operations · Ludhiana",
    rotate: "rotate-1",
  },
  {
    quote:
      "Took the family to Vaishno Devi in their Innova. Spotless car, sure-footed driving on the hills, and a fare exactly as quoted. Our hotel now recommends them too.",
    name: "Col. A. S. Gill (Retd.)",
    role: "Family traveller · Amritsar",
    rotate: "-rotate-1",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Fleet & Fares", href: "#fleet" },
  { label: "Contact", href: "#contact" },
];

export const STATS = [
  { value: 28, suffix: "+", label: "Years on the road" },
  { value: 100000, suffix: "+", label: "Rides completed" },
  { value: 40, suffix: "+", label: "Vehicles in fleet" },
  { value: 50, suffix: "+", label: "Corporate clients" },
];

export { Users, Luggage };
