import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';

export default function AuthSuccessModal({ isOpen, user, redirectTo = '/citizen-dashboard' }) {
  const navigate = useNavigate();
  const [secondsLeft, setSecondsLeft] = useState(2);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(redirectTo);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, navigate, redirectTo]);

  if (!isOpen || !user) return null;

  return (
    <div className="civic-modal-backdrop" role="dialog" aria-modal="true">
      <div className="civic-modal-dialog" style={{ maxWidth: 460, textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: '#DCFCE7',
          color: '#16A34A',
          marginBottom: 16
        }}>
          <CheckCircle2 size={32} />
        </div>

        <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0A1628', marginBottom: 4 }}>
          Authentication Successful!
        </h3>
        <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: 20 }}>
          Welcome to CivicTrack Smart Public Grievance Portal
        </p>

        {/* Profile Card display */}
        <div className="civic-profile-card">
          <div className="civic-profile-avatar-wrap">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.name}
                className="civic-profile-avatar-img"
              />
            ) : (
              <div className="civic-profile-avatar-fallback">
                {user.name?.[0]?.toUpperCase() || 'C'}
              </div>
            )}
            <div className="civic-google-badge-overlay" title="Verified Google Account">
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
            </div>
          </div>

          <div className="civic-profile-name">{user.name}</div>
          <div className="civic-profile-email">{user.email}</div>

          <div className="civic-role-badge">
            <ShieldCheck size={14} />
            <span>Verified Citizen Account</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Redirecting to Citizen Dashboard in <strong>{secondsLeft}s</strong>…
          </p>

          <div className="civic-redirect-progress-bar">
            <div className="civic-redirect-progress-fill" />
          </div>

          <button
            type="button"
            className="civic-btn-submit"
            onClick={() => navigate(redirectTo)}
            style={{ marginTop: 20 }}
          >
            <span>Proceed to Dashboard Now</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
