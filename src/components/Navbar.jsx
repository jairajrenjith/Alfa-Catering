import { useState } from 'react';
import { XIcon } from './Icons';
import logoImg from '../assets/logo.jpg';

const MenuIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="3" y1="6"  x2="21" y2="6"  />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: 'Home',     href: '#home'     },
    { label: 'About',    href: '#about'    },
    { label: 'Services', href: '#services' },
    { label: 'Gallery',  href: '#gallery'  },
    { label: 'Slots',    href: '#slots'    },
    { label: 'Contact',  href: '#contact'  },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">

        {/* Brand */}
        <a href="#home" className="navbar-brand">
          <img src={logoImg} alt="Alfa Catering Logo" className="navbar-logo-img" />
          <div className="navbar-name">
            അൽഫ കാറ്ററിംങ്ങ്
            <small>BKD · Maniyur · Mantharattur</small>
          </div>
        </a>

        {/* Desktop links */}
        <ul className="navbar-links">
          {links.map(l => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
          <li>
            <a href="#contact" className="navbar-cta">Book Now</a>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen
            ? <XIcon size={22} color="#fff" />
            : <MenuIcon />
          }
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="navbar-mobile-menu">
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="navbar-mobile-link"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            className="navbar-mobile-cta"
            onClick={() => setMenuOpen(false)}
          >
            Book Now
          </a>
        </div>
      )}
    </nav>
  );
}
