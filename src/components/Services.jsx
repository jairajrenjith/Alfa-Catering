import {
  ForkKnifeIcon, CelebrationIcon, MosqueIcon,
  BowlIcon, MicIcon, BoxIcon
} from './Icons';

const services = [
  {
    Icon: ForkKnifeIcon,
    title: 'Wedding Catering',
    titleMl: 'വിവാഹ വിരുന്ന്',
    desc: 'Grand sadya spreads, traditional Kerala feasts, and customized wedding menus for your most special day.'
  },
  {
    Icon: CelebrationIcon,
    title: 'Event Catering',
    titleMl: 'ഇവന്റ് കാറ്ററിംങ്ങ്',
    desc: 'Birthday parties, anniversaries, Mehfil, corporate events — we cater to all celebrations with precision.'
  },
  {
    Icon: MosqueIcon,
    title: 'Religious Functions',
    titleMl: 'മതപരമായ ചടങ്ങുകൾ',
    desc: 'Valiyambadam, Uroos, Milad, and all community functions served with authenticity and warmth.'
  },
  {
    Icon: BowlIcon,
    title: 'Traditional Sadya',
    titleMl: 'കേരള സദ്യ',
    desc: 'Authentic Kerala sadya with 20+ traditional dishes served fresh on banana leaf — the real experience.'
  },
  {
    Icon: MicIcon,
    title: 'Mehfil & Cultural',
    titleMl: 'മെഹഫിൽ',
    desc: 'Catering for Mehfil programs, cultural events, and grand gatherings with premium hospitality.'
  },
  {
    Icon: BoxIcon,
    title: 'Parcel & Delivery',
    titleMl: 'പാഴ്സൽ സർവ്വീസ്',
    desc: 'Bulk food orders and parcel delivery available for small and large gatherings alike.'
  },
];

export default function Services() {
  return (
    <section className="section" id="services" style={{ background: 'var(--cream)' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-label">What We Offer</span>
          <h2 className="section-title">Our Services</h2>
          <div className="divider" style={{ margin: '1rem auto 0' }} />
        </div>

        <div className="services-grid">
          {services.map(({ Icon, title, titleMl, desc }) => (
            <div className="service-card" key={title}>
              <div className="service-icon">
                <Icon size={36} color="var(--green)" />
              </div>
              <h3>{title}</h3>
              <p className="malayalam" style={{ fontSize: '0.88rem', marginBottom: '0.4rem', color: 'var(--gold-dark)' }}>
                {titleMl}
              </p>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
