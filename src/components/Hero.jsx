import { PhoneIcon, StarIcon } from './Icons';

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-pattern" />
      <div className="hero-ornament hero-ornament-1" />
      <div className="hero-ornament hero-ornament-2" />

      <div className="hero-content">
        <span className="hero-badge">
          <StarIcon size={10} color="var(--gold)" />
          Professional Catering Service
          <StarIcon size={10} color="var(--gold)" />
        </span>

        <h1 className="hero-title">
          <span className="italic gold">Alfa</span>{' '}
          <span>Catering</span>
          <br />
          <span style={{ fontSize: '60%', fontWeight: 400 }}>BKD</span>
        </h1>

        <p className="hero-subtitle">
          മണിയൂർ · മന്തരത്തൂർ · കേരള
        </p>

        {/* Malayalam Caption — verbatim */}
        <div className="hero-caption malayalam">
          <span className="caption-text">
            ആഘോഷങ്ങൾ എന്തുമാവട്ടെ സ്വാദുള്ള ഭക്ഷണം വിളമ്പണം, വയറു പോലെ മനസ്സും നിറയണം,
            അങ്ങനെയുള്ള രുചികൂട്ടുകൾ ആണ് ഓരോ ആഘോഷങ്ങളും മനോഹരമാക്കുന്നത്,
            നിങ്ങളുടെ ആഘോഷങ്ങൾക്ക് സ്നേഹം വിളമ്പാൻ എന്നും അൽഫ കാറ്ററിംങ്ങ് കൂടെയുണ്ട്,
            നിങ്ങളുടെ സന്തോഷ നിമിഷങ്ങളിൽ നന്മയുടെ രുചി പകരാൻ ഇന്ന് തന്നെ ബുക്ക്‌ ചെയ്യൂ.
          </span>
          <div className="caption-divider" />
          <a href="tel:+919745575826" className="phone">
            <PhoneIcon size={16} color="var(--gold)" />
            97455 75826
          </a>
          <span className="coordinator">
            കോഡിനേറ്റർ: ബഷിർ വലിയാണ്ടി · മണിയൂർ · മന്തരത്തൂർ
          </span>
        </div>

        <div className="hero-actions">
          <a href="#contact" className="btn-primary">Book Your Event</a>
          <a href="#slots" className="btn-outline">View Availability</a>
        </div>
      </div>
    </section>
  );
}
