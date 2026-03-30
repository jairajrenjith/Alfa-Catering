import { useState, useEffect } from 'react';
import './App.css';
import { bookedSlots } from './data/slots';
import { getSharedSlots, saveSharedSlots } from './data/bookingService';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Gallery from './components/Gallery';
import Slots from './components/Slots';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';
import { SettingsIcon, WhatsAppIcon, CheckIcon } from './components/Icons';

// Remove slots whose date has already passed (before today)
function purgePastSlots(slots) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return slots.filter(s => {
    if (!s.date) return true; // keep if no date info
    const slotDate = new Date(s.date);
    slotDate.setHours(0, 0, 0, 0);
    return slotDate >= today;
  });
}

export default function App() {
  const [slots, setSlots] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const load = async () => {
      const raw = await getSharedSlots(bookedSlots);
      const purged = purgePastSlots(raw);
      // If any past slots were removed, save the cleaned list back
      if (purged.length !== raw.length) {
        await saveSharedSlots(purged);
      }
      setSlots(purged);
    };

    load();
    // Poll every 15s — picks up admin changes on other devices
    const interval = setInterval(load, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = () => {
    setShowLogin(false);
    setShowAdmin(true);
  };

  const handleSlotsChange = async (updated) => {
    setSlots(updated);
    await saveSharedSlots(updated);
    setToast('Changes saved successfully!');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Gallery />
      <Slots slots={slots} />
      <Contact />
      <Footer />

      {/* WhatsApp Float */}
      <a
        href="https://wa.me/919745575826"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
        title="Chat on WhatsApp"
        aria-label="WhatsApp"
      >
        <WhatsAppIcon size={26} color="#fff" />
      </a>

      {/* Admin Access Button */}
      <button
        className="admin-access-btn"
        onClick={() => setShowLogin(true)}
        title="Admin Panel"
        aria-label="Admin Panel"
      >
        <SettingsIcon size={22} color="#fff" />
      </button>

      {showLogin && (
        <LoginModal
          onSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
        />
      )}

      {showAdmin && (
        <AdminPanel
          slots={slots}
          onSlotsChange={handleSlotsChange}
          onClose={() => setShowAdmin(false)}
        />
      )}

      {toast && (
        <div className="success-toast"
          style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <CheckIcon size={16} color="#fff" />
          {toast}
        </div>
      )}
    </>
  );
}
