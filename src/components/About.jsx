import img1 from '../assets/gallery/IMG-20260226-WA0088.jpg.jpeg';
import img2 from '../assets/gallery/IMG-20260226-WA0085.jpg.jpeg';

export default function About() {
  return (
    <section className="section" id="about" style={{ background: 'var(--white)' }}>
      <div className="container">
        <div className="about-grid">
          <div className="about-image-stack">
            <img src={img1} alt="Alfa Catering food spread" className="about-img-main" />
            <img src={img2} alt="Catering setup" className="about-img-accent" />
            <div className="about-badge">
              <span className="num">10+</span>
              <span className="lbl">Years of<br/>Excellence</span>
            </div>
          </div>

          <div className="about-text">
            <span className="section-label">About Us</span>
            <h2 className="section-title">
              Kerala's Trusted<br />Catering Legacy
            </h2>
            <div className="divider" />

            <p className="malayalam" style={{ fontSize: '1.05rem', lineHeight: '2', color: 'var(--text-mid)' }}>
              ആഘോഷങ്ങളെ അവിസ്മരണീയമാക്കുന്ന സ്വാദിന്റെ കലയാണ് അൽഫ കാറ്ററിംങ്ങ്.
              ഞങ്ങൾ ഓരോ വിഭവവും പ്രേമത്തോടും ശ്രദ്ധയോടും കൂടി തയ്യാറാക്കുന്നു.
            </p>

            <p style={{ marginTop: '1rem', color: 'var(--text-mid)' }}>
              Based in Maniyur, Mantharattur, Alfa Catering BKD has been delivering
              authentic Kerala flavors to weddings, festivals, corporate events, and
              family celebrations across Kozhikode, Kannur, and beyond.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem',
              marginTop: '2rem'
            }}>
              {[
                { num: '500+', label: 'Events Served' },
                { num: '50+', label: 'Menu Varieties' },
                { num: '10+', label: 'Years Experience' },
                { num: '100%', label: 'Client Satisfaction' },
              ].map(stat => (
                <div key={stat.label} style={{
                  background: 'var(--cream)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-sm)',
                  textAlign: 'center',
                  border: '1px solid var(--cream-dark)'
                }}>
                  <div style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1.8rem',
                    fontWeight: 700,
                    color: 'var(--green)'
                  }}>{stat.num}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
