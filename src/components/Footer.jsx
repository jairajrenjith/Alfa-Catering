import { PhoneIcon, WhatsAppIcon, HeartIcon } from './Icons';
import logoImg from '../assets/logo.jpg';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div className="footer-brand">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <img src={logoImg} alt="Alfa Catering Logo" style={{
              width: 44, height: 44, borderRadius: '50%', objectFit: 'cover'
            }} />
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem', color: 'var(--white)' }}>
                Alfa Catering BKD
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--gold-light)', letterSpacing: '0.08em' }}>
                MANIYUR · MANTHARATTUR
              </div>
            </div>
          </div>
          <p className="malayalam">
            ആഘോഷങ്ങൾക്ക് സ്നേഹം വിളമ്പാൻ എന്നും അൽഫ കാറ്ററിംങ്ങ് കൂടെയുണ്ട്.
          </p>
        </div>

        <div className="footer-col">
          <h4>Quick Links</h4>
          <ul>
            {[
              ['#home', 'Home'],
              ['#about', 'About Us'],
              ['#services', 'Services'],
              ['#gallery', 'Gallery'],
              ['#slots', 'Slot Availability'],
              ['#contact', 'Contact'],
            ].map(([href, label]) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contact</h4>
          <ul>
            <li>
              <a href="tel:+919745575826"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <PhoneIcon size={14} color="var(--gold)" />
                97455 75826
              </a>
            </li>
            <li>
              <a href="https://wa.me/919745575826" target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <WhatsAppIcon size={14} color="#25D366" />
                WhatsApp
              </a>
            </li>
            <li className="malayalam" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>ബഷിർ വലിയാണ്ടി</li>
            <li className="malayalam" style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem' }}>മണിയൂർ · മന്തരത്തൂർ</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {year} Alfa Catering BKD. All rights reserved.</p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          Made with <HeartIcon size={13} color="#e74c3c" /> for every celebration
        </p>
      </div>
    </footer>
  );
}
