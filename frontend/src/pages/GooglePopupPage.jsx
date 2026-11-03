import React, { useState } from 'react';
import { User, Plus, Check, ChevronRight } from 'lucide-react';

export default function GooglePopupPage() {
  const [loadingUser, setLoadingUser] = useState(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');

  const accounts = [
    {
      name: 'Visahl Rajkumar',
      email: 'visahl.rajkumar@gmail.com',
      avatarBg: '#1E40AF',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      uid: 'google-uid-visahl-882194',
    },
    {
      name: 'Rahul Verma (Citizen)',
      email: 'rahul.verma.citizen@gmail.com',
      avatarBg: '#059669',
      photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      uid: 'google-uid-rahul-391048',
    },
  ];

  const handleSelectAccount = (account) => {
    setLoadingUser(account.email);

    setTimeout(() => {
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'CIVICTRACK_GOOGLE_AUTH_SUCCESS',
            user: {
              displayName: account.name,
              email: account.email,
              photoURL: account.photoURL || null,
              uid: account.uid,
            },
          },
          window.location.origin
        );
      }
      setTimeout(() => {
        window.close();
      }, 350);
    }, 450);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customEmail || !customName) return;
    handleSelectAccount({
      name: customName,
      email: customEmail,
      photoURL: null,
      uid: 'google-uid-custom-' + Date.now(),
    });
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FFFFFF',
      fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '36px 32px 24px',
      color: '#202124',
      boxSizing: 'border-box',
    }}>
      <div>
        {/* Google Header Logo */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <svg width="40" height="40" viewBox="0 0 24 24" style={{ display: 'inline-block' }}>
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          <h1 style={{ fontSize: '1.45rem', fontWeight: 500, marginTop: 12, marginBottom: 6, color: '#202124' }}>
            Choose an account
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#5F6368', margin: 0 }}>
            to continue to <strong style={{ color: '#1A73E8' }}>CivicTrack Portal</strong>
          </p>
        </div>

        {/* Account List */}
        <div style={{ borderTop: '1px solid #E8EAED', borderBottom: '1px solid #E8EAED', marginTop: 16 }}>
          {accounts.map((acc) => (
            <div
              key={acc.email}
              onClick={() => !loadingUser && handleSelectAccount(acc)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 12px',
                borderBottom: '1px solid #F1F3F4',
                cursor: loadingUser ? 'wait' : 'pointer',
                transition: 'background 0.2s',
                backgroundColor: loadingUser === acc.email ? '#E8F0FE' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (!loadingUser) e.currentTarget.style.backgroundColor = '#F8F9FA';
              }}
              onMouseLeave={(e) => {
                if (loadingUser !== acc.email) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {acc.photoURL ? (
                <img
                  src={acc.photoURL}
                  alt={acc.name}
                  style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: acc.avatarBg,
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: '1rem',
                }}>
                  {acc.name[0]}
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#202124' }}>{acc.name}</div>
                <div style={{ fontSize: '0.82rem', color: '#5F6368', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {acc.email}
                </div>
              </div>

              {loadingUser === acc.email ? (
                <div style={{
                  width: 18,
                  height: 18,
                  border: '2px solid #1A73E8',
                  borderTopColor: 'transparent',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
              ) : (
                <ChevronRight size={18} color="#9AA0A6" />
              )}
            </div>
          ))}

          {/* Use another account option */}
          {!showCustomInput ? (
            <div
              onClick={() => setShowCustomInput(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 12px',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8F9FA')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <div style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                border: '1px solid #DADCE0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#5F6368',
              }}>
                <Plus size={20} />
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 500, color: '#3C4043' }}>
                Use another Google account
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} style={{ padding: '16px 12px', background: '#F8FAFC' }}>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, marginBottom: 8, color: '#1A73E8' }}>
                Enter Google Account Details:
              </div>
              <input
                type="text"
                placeholder="Your Full Name"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 6,
                  border: '1px solid #CBD5E1',
                  marginBottom: 8,
                  fontSize: '0.88rem',
                  boxSizing: 'border-box',
                }}
              />
              <input
                type="email"
                placeholder="your.email@gmail.com"
                value={customEmail}
                onChange={(e) => setCustomEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: 6,
                  border: '1px solid #CBD5E1',
                  marginBottom: 10,
                  fontSize: '0.88rem',
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: '#1A73E8',
                    color: 'white',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 12px',
                    fontSize: '0.85rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Continue
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  style={{
                    background: '#E8EAED',
                    color: '#3C4043',
                    border: 'none',
                    borderRadius: 6,
                    padding: '8px 12px',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer Disclaimer */}
      <div style={{ marginTop: 20 }}>
        <p style={{ fontSize: '0.78rem', color: '#5F6368', lineHeight: 1.45, margin: 0, textAlign: 'center' }}>
          To continue, Google will share your name, email address, and profile picture with CivicTrack.
          Before using CivicTrack, review its <a href="#" style={{ color: '#1A73E8', textDecoration: 'none' }}>Privacy Policy</a> and <a href="#" style={{ color: '#1A73E8', textDecoration: 'none' }}>Terms of Service</a>.
        </p>

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 18,
          paddingTop: 12,
          borderTop: '1px solid #E8EAED',
          fontSize: '0.75rem',
          color: '#70757A',
        }}>
          <span>English (United States)</span>
          <div style={{ display: 'flex', gap: 14 }}>
            <span>Help</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
