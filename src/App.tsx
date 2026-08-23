import { useCallback, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Ticker from "./components/Ticker";
import About from "./components/About";
import Services from "./components/Services";
import Fleet from "./components/Fleet";
import WhyUs from "./components/WhyUs";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import { emptyBooking, type Booking } from "./data";

/* film-grain overlay for a printed, tactile feel */
const NOISE_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export default function App() {
  /* shared booking state — hero widget, route chips, fleet cards & contact form all feed it */
  const [booking, setBooking] = useState<Booking>(emptyBooking());

  const patch = useCallback((p: Partial<Booking>) => {
    setBooking((b) => ({ ...b, ...p }));
  }, []);

  const goBook = useCallback(() => {
    const el = document.getElementById("contact");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }, []);

  return (
    <div className="relative">
      {/* ambient film grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80] opacity-[0.045] mix-blend-overlay"
        style={{ backgroundImage: NOISE_URI }}
      />

      <Navbar />

      <main>
        <Hero booking={booking} patch={patch} goBook={goBook} />
        <Ticker />
        <About />
        <Services goBook={goBook} />
        <Fleet patch={patch} goBook={goBook} />
        <WhyUs />
        <Testimonials />
        <Contact booking={booking} patch={patch} />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
