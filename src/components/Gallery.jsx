import img1 from '../assets/gallery/IMG-20260226-WA0088.jpg.jpeg';
import img2 from '../assets/gallery/IMG-20260226-WA0087.jpg.jpeg';
import img3 from '../assets/gallery/IMG-20260226-WA0085.jpg.jpeg';
import img4 from '../assets/gallery/IMG-20260226-WA0076.jpg.jpeg';
import img5 from '../assets/gallery/IMG-20260226-WA0091.jpg.jpeg';
import img6 from '../assets/gallery/IMG_20260227_235648.jpg.jpeg';

const images = [
  { src: img1, label: 'Grand Setup' },
  { src: img2, label: 'Food Presentation' },
  { src: img3, label: 'Event Catering' },
  { src: img4, label: 'Traditional Feast' },
  { src: img5, label: 'Wedding Catering' },
  { src: img6, label: 'Special Occasion' },
];

export default function Gallery() {
  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <span className="section-label">Our Work</span>
        <h2 className="section-title">Highlights &amp; Legacy</h2>
        <p className="malayalam" style={{ color: 'rgba(255,255,255,0.65)', marginTop: '0.5rem', fontSize: '0.95rem' }}>
          ഞങ്ങളുടെ ചില മനോഹരമായ നിമിഷങ്ങൾ
        </p>
        <div className="divider" />

        <div className="gallery-grid">
          {images.map((img, i) => (
            <div className="gallery-item" key={i}>
              <img src={img.src} alt={img.label} loading="lazy" />
              <div className="gallery-overlay">
                <span className="gallery-label">{img.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
