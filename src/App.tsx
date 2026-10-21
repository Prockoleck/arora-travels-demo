import { useCallback, useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Ticker from "./components/Ticker";
import About from "./components/About";
import Services from "./components/Services";
import Fleet from "./components/Fleet";
import WhyUs from "./components/WhyUs";
import Testimonials from "./components/Testimonials";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import FloatingWhatsApp from "./components/FloatingWhatsApp";
import Admin from "./components/Admin";
import { emptyBooking, type Booking } from "./data";

export default function App() {
  /* shared booking state — route chips, fleet cards & the booking form all feed it */
  const [booking, setBooking] = useState<Booking>(emptyBooking());

  /* lightweight hash route — #/admin swaps the whole site for the console
     (plain section anchors like #home keep working untouched) */
  const [isAdmin, setIsAdmin] = useState(() => window.location.hash === "#/admin");
  useEffect(() => {
    const onHash = () => setIsAdmin(window.location.hash === "#/admin");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const patch = useCallback((p: Partial<Booking>) => {
    setBooking((b) => ({ ...b, ...p }));
  }, []);

  const goBook = useCallback(() => {
    const el = document.getElementById("home");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }, []);

  if (isAdmin) return <Admin />;

  return (
    <div className="relative">
      <Navbar />

      <main>
        {/* booking section is the landing — the site opens on the form */}
        <Contact booking={booking} patch={patch} />
        <Ticker />
        <About />
        <Services goBook={goBook} />
        <Fleet patch={patch} goBook={goBook} />
        <WhyUs />
        <Testimonials />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}
