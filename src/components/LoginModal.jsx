import { useState } from 'react';
import { LockIcon, AlertIcon, CheckIcon } from './Icons';
import { ADMIN_PASSWORD } from '../data/slots';

export default function LoginModal({ onSuccess, onClose }) {
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (pass === ADMIN_PASSWORD) {
      onSuccess();
    } else {
      setError('Incorrect password. Please try again.');
      setPass('');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{
          width: 48, height: 48,
          background: 'var(--green)',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 0 1rem'
        }}>
          <LockIcon size={20} color="var(--gold)" />
        </div>

        <h2>Admin Login</h2>
        <p>Enter the admin password to manage bookings and website content.</p>

        {error && (
          <div className="modal-error"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertIcon size={15} color="var(--red)" />
            {error}
          </div>
        )}

        <form className="contact-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter admin password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: '0.85rem',
                background: 'var(--cream-dark)',
                color: 'var(--text-mid)',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}
            >
              Cancel
            </button>
            <button type="submit" className="submit-btn"
              style={{ flex: 2, marginTop: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <LockIcon size={15} color="#fff" />
              Login
            </button>
          </div>
        </form>

        <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', textAlign: 'center', marginTop: '1rem' }}>
          Only authorized personnel can access the admin panel.
        </p>
      </div>
    </div>
  );
}
