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
  email: "aroraishu@icloud.com",
  /* Every address here receives a copy of each website booking.
     Editable in the admin console (Business → Booking notifications). */
  notifyEmails: ["aroraishu@icloud.com", "aroratravels46@rediffmail.com"],
  whatsapp: "https://wa.me/919914404090",
  address:
    "Shop No. 46, Gol Bagh, Taxi Stand Market, Narain Nagar, Goal Bagh, Amritsar, Punjab 143001, India",
  addressShort: "Shop No. 46, Gol Bagh Taxi Stand Market, Amritsar, Punjab 143001",
  /* Exact Google Business Profile (ARORA TRAVELS, 4.9★, Gol Bagh).
     Place ID verified 31 Oct 2026 — opens the listing, not a search. */
  mapsUrl:
    "https://www.google.com/maps/place/?q=place_id:ChIJqbwPpPJlGTkR_cwfs9ocdSI",
  mapCoords: { lat: 31.6315786, lng: 74.8686835 },
};

export type Business = typeof BUSINESS;

export const IMAGES = {
  /* client's own photo of a branded Arora Travels car (About section) */
  heritage: "/about.jpg",
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
};

/** Passenger-count bounds (matches the fleet's smallest & largest seats). */
export const PASSENGERS_MIN = 1;
export const PASSENGERS_MAX = 30;

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
});

/* ── Ticker tape (defaults — editable in the admin console) ── */
export const TICKER_ITEMS = [
  "Golden Temple darshan",
  "Wagah Border retreat",
  "Jallianwala Bagh",
  "Partition Museum",
  "Durgiana Temple",
  "Gobindgarh Fort",
  "ATQ airport transfers",
  "Amritsar city tours",
  "Outstation cabs",
  "Corporate fleet",
  "Wedding cars",
];

/* ── Sightseeing places — the “beyond the Golden Temple” gallery ── */
export type Sight = {
  title: string;
  kicker: string;
  text: string;
  img: string;
  imgAlt: string;
};

export const SIGHTS: Sight[] = [
  {
    title: "Golden Temple",
    kicker: "Harmandir Sahib",
    text: "The city's golden heart. Go at first light for the quietest darshan, or after dark when the sarovar turns to glass.",
    img: "/dest/golden-temple.jpg",
    imgAlt: "The Golden Temple glowing at dusk, reflected in the sarovar",
  },
  {
    title: "Jallianwala Bagh",
    kicker: "Remembrance",
    text: "A walled memorial garden a short walk from the Golden Temple — restrained, moving, and deeply part of Amritsar.",
    img: "/dest/jallianwala-bagh.jpg",
    imgAlt: "The Jallianwala Bagh memorial wall and bronze statue in Amritsar",
  },
  {
    title: "Partition Museum",
    kicker: "Town Hall · Hall Bazaar",
    text: "Letters, photographs and first-hand voices from 1947, gathered in the old red-brick Town Hall.",
    img: "/dest/partition-museum.jpg",
    imgAlt: "The red-brick Town Hall that houses the Partition Museum in Amritsar",
  },
  {
    title: "Durgiana Temple",
    kicker: "The lake temple",
    text: "Golden domes rising from a sarovar of its own — the calm, unhurried counterpart to the Golden Temple crowds.",
    img: "/dest/durgiana-temple.jpg",
    imgAlt: "Golden domes of Durgiana Temple seen from the marble bridge over its sarovar",
  },
  {
    title: "Gobindgarh Fort",
    kicker: "Living history",
    text: "An 18th-century fort turned cultural campus: museums, a food street and evening performances under the ramparts.",
    img: "/dest/gobindgarh-fort.jpg",
    imgAlt: "The gate of Gobindgarh Fort with its Punjab Tourism sign in Amritsar",
  },
  {
    title: "Ram Bagh",
    kicker: "Maharaja Ranjit Singh's garden",
    text: "The Maharaja's summer palace, shaded gardens and the old Deorhi gateway — a slow, green hour away from the bazaar.",
    img: "/dest/rambagh.jpg",
    imgAlt: "The historic Deorhi gateway at Ram Bagh, Amritsar",
  },
];

/* ── Services ────────────────────────────────────────────── */
export type Service = {
  n: string;
  title: string;
  desc: string;
  includes: string[];
};

/* Icons are positional (not serializable) — matched by index in the UI. */
export const SERVICE_ICONS: LucideIcon[] = [Car, Briefcase, MapIcon, Plane];

export const SERVICES: Service[] = [
  {
    n: "01",
    title: "Executive Car Hire",
    desc: "Chauffeur-driven sedans and SUVs for board meetings, weddings, and city travel — spotless cars, punctual drivers, zero fuss.",
    includes: ["Uniformed chauffeur", "Sanitised cabin", "Hourly & daily packs"],
  },
  {
    n: "02",
    title: "Corporate Transportation",
    desc: "One call, one monthly invoice, zero headaches. Fixed corporate tariffs, GST billing and priority cars for your teams and guests.",
    includes: ["Monthly billing", "GST invoices", "Dedicated manager"],
  },
  {
    n: "03",
    title: "Outstation Taxi Services",
    desc: "One-way or round trips to Delhi, Chandigarh, Katra, McLeodganj and beyond — drivers who know every highway and every hill route.",
    includes: ["One-way & round trips", "Experienced hill drivers", "Multi-day packages"],
  },
  {
    n: "04",
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
  title: string;
  desc: string;
};

/* Icons are positional — matched by index in the UI. */
export const REASON_ICONS: LucideIcon[] = [IndianRupee, Receipt, ShieldCheck, Clock];

export const REASONS: Reason[] = [
  {
    title: "Economical Rates",
    desc: "Honest per-kilometre pricing agreed before the wheel turns. No surge nonsense, no meter drama, no surprise line items.",
  },
  {
    title: "Reasonable Corporate Tariffs",
    desc: "Fixed monthly packages, GST-compliant invoicing and priority vehicles for businesses that move people every single week.",
  },
  {
    title: "Professional Chauffeurs",
    desc: "Uniformed, verified drivers who speak Punjabi, Hindi and English — and know every shortcut from Gol Bagh to the GT Road.",
  },
  {
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
/* Rotation is positional (not serializable) — matched by index. */
export const TESTIMONIAL_ROTATIONS = ["-rotate-2", "rotate-1", "-rotate-1"];

export const TESTIMONIALS = [
  {
    quote:
      "Booked an airport pickup for 3:40 in the morning. The driver was waiting with my name board before I even cleared baggage. That's 27 years of practice.",
    name: "Simran Kaur",
    role: "NRI guest · Toronto, Canada",
  },
  {
    quote:
      "Arora Travels has handled all our guest movement in Amritsar for six years. One call, one invoice, zero headaches. The corporate tariff is genuinely fair.",
    name: "Rajesh Malhotra",
    role: "AGM Operations · Ludhiana",
  },
  {
    quote:
      "Took the family to Vaishno Devi in their Innova. Spotless car, sure-footed driving on the hills, and a fare exactly as quoted. Our hotel now recommends them too.",
    name: "Col. A. S. Gill (Retd.)",
    role: "Family traveller · Amritsar",
  },
];

export const NAV_LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Sightseeing", href: "#sights" },
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
