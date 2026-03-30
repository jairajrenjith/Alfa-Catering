import { useState } from 'react';
import { PhoneIcon, WhatsAppIcon, MapPinIcon, ClockIcon, UserIcon, SendIcon, CheckIcon } from './Icons';

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
  </svg>
);

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', event: '', date: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = `*Alfa Catering Booking Enquiry*%0A%0AName: ${form.name}%0APhone: ${form.phone}%0AEvent: ${form.event}%0ADate: ${form.date}%0AMessage: ${form.message}`;
    window.open(`https://wa.me/919745575826?text=${msg}`, '_blank');
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const contactItems = [
    { Icon: PhoneIcon,  label: 'Phone / WhatsApp', value: '97455 75826',                  ml: false },
    { Icon: UserIcon,   label: 'Coordinator',       value: 'ബഷിർ വലിയാണ്ടി',             ml: true  },
    { Icon: MapPinIcon, label: 'Location',          value: 'മണിയൂർ · മന്തരത്തൂർ, Kerala', ml: true  },
    { Icon: ClockIcon,  label: 'Available',         value: '24/7 for enquiries',            ml: false },
  ];

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-label">Get In Touch</span>
          <h2 className="section-title">Book Your Event</h2>
          <div className="divider" style={{ margin: '1rem auto 0' }} />
        </div>

        <div className="contact-grid">
          {/* Info Card */}
          <div className="contact-info-card">
            <h3>Alfa Catering BKD</h3>
            <p className="subtitle malayalam">നിങ്ങളുടെ ആഘോഷം ഞങ്ങളുടെ ഉത്തരവാദിത്തം</p>

            {contactItems.map(({ Icon, label, value, ml }) => (
              <div className="contact-item" key={label}>
                <div className="contact-icon">
                  <Icon size={18} color="var(--gold-light)" />
                </div>
                <div className="contact-item-text">
                  <div className="label">{label}</div>
                  <div className={`value${ml ? ' malayalam' : ''}`}>{value}</div>
                </div>
              </div>
            ))}

            {/* Social buttons row */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.2rem' }}>
              {/* WhatsApp */}
              <a
                href="https://wa.me/919745575826"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: '#25D366',
                  color: '#fff',
                  padding: '0.75rem 1rem',
                  borderRadius: '30px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  transition: 'opacity 0.2s',
                }}
              >
                <WhatsAppIcon size={17} color="#fff" />
                WhatsApp
              </a>

              {/* Instagram */}
              <a
                href="https://www.instagram.com/bashseer_v__?igsh=MTV0OHUxajZjZmF5MQ%3D%3D&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                  color: '#fff',
                  padding: '0.75rem 1rem',
                  borderRadius: '30px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  transition: 'opacity 0.2s',
                }}
              >
                <InstagramIcon />
                Instagram
              </a>
            </div>
          </div>

          {/* Form */}
          <form className="contact-form" onSubmit={handleSubmit}>
            <h3 style={{ color: 'var(--green)', marginBottom: '0.25rem' }}>Send Enquiry</h3>
            <p className="malayalam" style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              ഒരു മെസ്സേജ് അയക്കൂ, ഞങ്ങൾ ബന്ധപ്പെടാം
            </p>

            <div className="form-row">
              <div className="form-group">
                <label>Your Name *</label>
                <input type="text" placeholder="Full name" required
                  value={form.name} onChange={e => update('name', e.target.value)} />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" placeholder="+91 XXXXX XXXXX" required
                  value={form.phone} onChange={e => update('phone', e.target.value)} />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Event Type</label>
                <select value={form.event} onChange={e => update('event', e.target.value)}>
                  <option value="">Select event type</option>
                  <option>Wedding / Nikah</option>
                  <option>Birthday Party</option>
                  <option>Mehfil</option>
                  <option>Sadya</option>
                  <option>Religious Function</option>
                  <option>Corporate Event</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Event Date</label>
                <input type="date" value={form.date} onChange={e => update('date', e.target.value)} />
              </div>
            </div>

            <div className="form-group">
              <label>Message / Requirements</label>
              <textarea
                placeholder="Tell us about your event, expected number of guests, special requirements..."
                value={form.message} onChange={e => update('message', e.target.value)}
              />
            </div>

            <button type="submit" className="submit-btn"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
              <SendIcon size={16} color="#fff" />
              Send via WhatsApp
            </button>

            {sent && (
              <div style={{
                background: 'var(--available-light)',
                color: 'var(--available)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontWeight: 600,
                fontSize: '0.9rem'
              }}>
                <CheckIcon size={16} color="var(--available)" />
                Redirecting to WhatsApp...
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
