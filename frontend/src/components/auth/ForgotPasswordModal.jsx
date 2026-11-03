import React, { useState } from 'react';
import { X, Mail, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setStatus({ type: 'error', message: 'Please enter your registered email address.' });
      return;
    }
    setLoading(true);
    setStatus({ type: '', message: '' });

    const res = await resetPassword(email);
    setLoading(false);

    if (res.success) {
      setStatus({ type: 'success', message: res.message });
    } else {
      setStatus({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="civic-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="civic-modal-dialog" onClick={(e) => e.stopPropagation()}>
        <button className="civic-modal-close" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>

        <div style={{ marginBottom: 20 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: '#E0F2FE',
            color: '#0284C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16
          }}>
            <Mail size={24} />
          </div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0A1628', marginBottom: 6 }}>
            Reset Password
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Enter your CivicTrack registered email address and we'll send you instructions to securely reset your password.
          </p>
        </div>

        {status.message && (
          <div className={`civic-alert civic-alert-${status.type}`}>
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{status.message}</span>
          </div>
        )}

        {status.type !== 'success' ? (
          <form onSubmit={handleSubmit}>
            <div className="civic-input-group">
              <label className="civic-input-label" htmlFor="reset-email">Email Address</label>
              <div className="civic-input-box">
                <span className="civic-input-icon">
                  <Mail size={18} />
                </span>
                <input
                  id="reset-email"
                  type="email"
                  className="civic-input"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="civic-btn-submit"
              disabled={loading}
              style={{ marginTop: 12 }}
            >
              {loading ? (
                <>
                  <span className="civic-spinner" />
                  <span>Sending Instructions…</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        ) : (
          <button
            type="button"
            className="civic-btn-submit"
            onClick={onClose}
            style={{ marginTop: 12 }}
          >
            Back to Sign In
          </button>
        )}
      </div>
    </div>
  );
}
