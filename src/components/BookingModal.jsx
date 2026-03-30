import { useState } from 'react';
import { XIcon, CheckIcon, PhoneIcon, SendIcon } from './Icons';
import { addBooking } from '../data/bookingService';

export default function BookingModal({ selectedDate, selectedShift, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', notes: '' });
  const [step, setStep] = useState('form');
  const [loading, setLoading] = useState(false);
  const up = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const shiftLabel = selectedShift === 'morning' ? 'Morning (10 AM)' : 'Afternoon (3 PM)';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await addBooking({
      ...form,
      date: selectedDate,
      shift: selectedShift,
      shiftLabel,
    });
    setLoading(false);
    setStep('success');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box booking-modal-box" onClick={e => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          <XIcon size={16} color="var(--text-mid)" />
        </button>

        {step === 'form' ? (
          <>
            <div className="booking-modal-header">
              <h2>Request Booking</h2>
              <p style={{ color: 'var(--text-light)', fontSize: '0.88rem', marginTop: '0.2rem' }}>
                {selectedDate} &nbsp;·&nbsp;
                <span style={{ color: selectedShift === 'morning' ? '#E67E22' : '#8E44AD', fontWeight: 700 }}>
                  {selectedShift === 'morning' ? 'Morning Shift' : 'Afternoon Shift'}
                </span>
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                Fill in your details. Admin will confirm and contact you via WhatsApp.
              </p>
            </div>

            <form className="contact-form" onSubmit={handleSubmit} style={{ gap: '0.75rem', marginTop: '1rem' }}>
              <div className="form-row">
                <div className="form-group">
                  <label>Your Name *</label>
                  <input type="text" placeholder="Full name" required
                    value={form.name} onChange={e => up('name', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="tel" placeholder="+91 XXXXX XXXXX" required
                    value={form.phone} onChange={e => up('phone', e.target.value)} />
                </div>
              </div>

              <div className="form-group">
                <label>Additional Notes <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(optional)</span></label>
                <textarea placeholder="Any special requirements or message for the admin..."
                  style={{ minHeight: 80 }}
                  value={form.notes} onChange={e => up('notes', e.target.value)} />
              </div>

              <button type="submit" className="submit-btn"
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', opacity: loading ? 0.7 : 1 }}>
                {loading
                  ? 'Submitting...'
                  : <><SendIcon size={15} color="#fff" /> Submit Booking Request</>
                }
              </button>
            </form>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{
              width: 60, height: 60,
              background: 'var(--available-light)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1rem'
            }}>
              <CheckIcon size={28} color="var(--available)" />
            </div>
            <h2 style={{ color: 'var(--green)', marginBottom: '0.5rem' }}>Request Sent!</h2>
            <p className="malayalam" style={{ color: 'var(--text-mid)', fontSize: '0.95rem', lineHeight: 1.8 }}>
              നിങ്ങളുടെ ബുക്കിംഗ് അഭ്യർഥന ലഭിച്ചു.<br />
              ബഷിർ വലിയാണ്ടി ഉടൻ ബന്ധപ്പെടും.
            </p>
            <p style={{ color: 'var(--text-light)', fontSize: '0.82rem', margin: '0.75rem 0 1.5rem' }}>
              Admin will confirm and contact you at <strong>{form.phone}</strong>
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <a href="https://wa.me/919745575826" target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  background: '#25D366', color: '#fff',
                  padding: '0.7rem 1.4rem', borderRadius: '30px',
                  fontWeight: 700, fontSize: '0.88rem'
                }}>
                <PhoneIcon size={14} color="#fff" /> WhatsApp Admin
              </a>
              <button onClick={onClose}
                style={{
                  background: 'var(--cream-dark)', color: 'var(--text-mid)',
                  padding: '0.7rem 1.4rem', borderRadius: '30px',
                  fontWeight: 700, fontSize: '0.88rem'
                }}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
