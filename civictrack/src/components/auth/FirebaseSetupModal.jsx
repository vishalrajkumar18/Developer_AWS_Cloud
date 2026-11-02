import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, ShieldAlert, Sparkles, Terminal } from 'lucide-react';

export default function FirebaseSetupModal({ isOpen, onClose, onSimulateDemoGoogle }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const envSample = `# CivicTrack Firebase Authentication (.env)
VITE_FIREBASE_API_KEY=AIzaSyYourActualApiKeyHere
VITE_FIREBASE_AUTH_DOMAIN=your-civictrack-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-civictrack-app
VITE_FIREBASE_STORAGE_BUCKET=your-civictrack-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890`;

  const handleCopy = () => {
    navigator.clipboard.writeText(envSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="civic-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="civic-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 580 }}>
        <button className="civic-modal-close" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: '#FEF3C7',
            color: '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <ShieldAlert size={26} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0A1628', margin: 0 }}>
              Firebase Google OAuth Setup
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Quick Configuration Guide</span>
          </div>
        </div>

        <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: 1.55, marginBottom: 18 }}>
          Google OAuth requires valid Firebase API keys in your root <code>.env</code> file. To connect your live Firebase project:
        </p>

        <div style={{
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: 12,
          padding: '16px',
          marginBottom: 18,
          fontSize: '0.84rem',
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#0EA5E9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>1</span>
            <div>Visit <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" style={{ color: '#0284C7', fontWeight: 600 }}>Firebase Console <ExternalLink size={12} style={{ display: 'inline' }} /></a> and create a project.</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#0EA5E9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>2</span>
            <div>Go to <strong>Authentication &gt; Sign-in method</strong> and enable <strong>Google</strong>.</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#0EA5E9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>3</span>
            <div>Go to <strong>Project Settings &gt; General &gt; Your apps</strong> and add a Web App.</div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#0EA5E9', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>4</span>
            <div>Copy the configuration into a <code>.env</code> file in your project root.</div>
          </div>
        </div>

        {/* Code block */}
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#0F172A',
            color: '#94A3B8',
            padding: '8px 14px',
            borderRadius: '10px 10px 0 0',
            fontSize: '0.75rem',
            fontFamily: 'monospace'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Terminal size={14} /> .env
            </span>
            <button
              onClick={handleCopy}
              style={{
                color: copied ? '#34D399' : '#CBD5E1',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.75rem'
              }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Template'}
            </button>
          </div>
          <pre style={{
            background: '#0A1628',
            color: '#38BDF8',
            padding: '14px',
            borderRadius: '0 0 10px 10px',
            fontSize: '0.78rem',
            fontFamily: 'monospace',
            overflowX: 'auto',
            margin: 0,
            lineHeight: 1.5
          }}>
            {envSample}
          </pre>
        </div>

        {/* Demo Google Sandbox option */}
        {onSimulateDemoGoogle && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.08), rgba(29, 78, 216, 0.08))',
            border: '1px solid rgba(14, 165, 233, 0.25)',
            borderRadius: 12,
            padding: '14px 16px',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12
          }}>
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0A1628', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Sparkles size={16} color="#0EA5E9" />
                Want to test the Google Citizen Flow right now?
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: 2 }}>
                Instantly try the Google Profile Card & Dashboard Redirection with a simulated Google citizen account.
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSimulateDemoGoogle();
              }}
              style={{
                background: '#0284C7',
                color: 'white',
                border: 'none',
                borderRadius: 8,
                padding: '8px 14px',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              Test Google Demo
            </button>
          </div>
        )}

        <button
          type="button"
          className="civic-btn-submit"
          onClick={onClose}
        >
          Got It, I'll Configure .env
        </button>
      </div>
    </div>
  );
}
