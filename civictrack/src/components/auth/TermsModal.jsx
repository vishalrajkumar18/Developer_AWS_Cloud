import React from 'react';
import { X, ShieldCheck, Check } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="civic-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="civic-modal-dialog" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
        <button className="civic-modal-close" onClick={onClose} aria-label="Close dialog">
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: '#E0F2FE',
            color: '#0284C7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0A1628', margin: 0 }}>
              Terms of Service & Citizen Charter
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#64748B' }}>CivicTrack Citizen Portal • Version 2.4</span>
          </div>
        </div>

        <div style={{
          fontSize: '0.88rem',
          color: '#475569',
          lineHeight: 1.65,
          maxHeight: 340,
          overflowY: 'auto',
          paddingRight: 8,
          marginBottom: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 14
        }}>
          <div>
            <strong style={{ color: '#0A1628', display: 'block', marginBottom: 4 }}>1. Civic Grievance Reporting</strong>
            <p>
              CivicTrack is an official smart public grievance registration portal. By creating an account, you agree to submit genuine, verifiable civic issues (e.g. road damage, streetlight failure, water leakage, sanitation) within municipal jurisdiction.
            </p>
          </div>

          <div>
            <strong style={{ color: '#0A1628', display: 'block', marginBottom: 4 }}>2. Authenticity & Verification</strong>
            <p>
              Submissions must be accurate to the best of your knowledge. Providing false, misleading, or malicious reports may result in account restriction under municipal digital compliance codes.
            </p>
          </div>

          <div>
            <strong style={{ color: '#0A1628', display: 'block', marginBottom: 4 }}>3. Privacy & Data Protection</strong>
            <p>
              Your personal information (name, contact number, and email address) is encrypted using 256-bit SSL protocols. Contact data is shared solely with assigned municipal engineers for field resolution inquiries.
            </p>
          </div>

          <div>
            <strong style={{ color: '#0A1628', display: 'block', marginBottom: 4 }}>4. Resolution Timelines & Citizen Rights</strong>
            <p>
              Departments are mandated to acknowledge grievances within 24 hours and provide stage-wise updates on the citizen dashboard until final resolution.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="civic-btn-submit"
          onClick={onClose}
        >
          <Check size={18} />
          <span>I Understand & Agree</span>
        </button>
      </div>
    </div>
  );
}
