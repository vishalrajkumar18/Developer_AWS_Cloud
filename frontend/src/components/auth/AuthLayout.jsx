import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle2, Lock, Award, Users, Clock, CheckCircle } from 'lucide-react';
import '../../styles/auth.css';

export default function AuthLayout({ children, onSelectDemoUser }) {
  return (
    <div className="civic-auth-wrapper">
      <div className="civic-auth-bg-grid" />

      {/* ============================================================
          Left Panel: CivicTrack Branding, Hero, Illustration & Stats
          ============================================================ */}
      <aside className="civic-auth-left" aria-label="CivicTrack Portal Information">
        {/* Brand Header */}
        <div className="civic-brand-header">
          <Link to="/" className="civic-brand-logo-group" aria-label="Go to CivicTrack Homepage">
            <div className="civic-brand-icon">
              <Shield size={30} strokeWidth={2.4} />
            </div>
            <div className="civic-brand-text">
              <h1>CivicTrack</h1>
              <span>Smart Public Grievance Portal</span>
            </div>
          </Link>

          <div className="civic-gov-badge">
            <span className="civic-gov-badge-dot" />
            <span>Govt. Public Portal</span>
          </div>
        </div>

        {/* Hero Content */}
        <div className="civic-left-hero">
          <div className="civic-hero-tag">
            <Award size={16} />
            <span>Transparent • Accountable • Rapid</span>
          </div>

          <h2 className="civic-hero-heading">
            Your Voice,<br />
            <span className="highlight">Our Responsibility</span>
          </h2>

          <p className="civic-hero-desc">
            Empowering citizens to report municipal grievances, track field inspections in real-time, 
            and collaborate with local departments to build cleaner, safer, and smarter communities.
          </p>

          {/* Civic Community Showcase Card with SVG City & floating resolution tags */}
          <div className="civic-visual-card">
            <div className="civic-svg-container">
              <svg width="100%" height="150" viewBox="0 0 500 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Background City Silhouette */}
                <path d="M40 130V90H80V130H120V70H160V130H200V80H230V130H270V60H310V130H360V75H400V130H460" stroke="rgba(255,255,255,0.15)" strokeWidth="2" strokeDasharray="4 4"/>
                <rect x="50" y="98" width="8" height="8" rx="2" fill="#38BDF8" fillOpacity="0.4"/>
                <rect x="65" y="98" width="8" height="8" rx="2" fill="#38BDF8" fillOpacity="0.4"/>
                <rect x="130" y="80" width="10" height="10" rx="2" fill="#38BDF8" fillOpacity="0.6"/>
                <rect x="145" y="80" width="10" height="10" rx="2" fill="#38BDF8" fillOpacity="0.6"/>
                <rect x="280" y="70" width="10" height="10" rx="2" fill="#38BDF8" fillOpacity="0.5"/>
                <rect x="295" y="70" width="10" height="10" rx="2" fill="#38BDF8" fillOpacity="0.5"/>
                <rect x="370" y="85" width="8" height="8" rx="2" fill="#38BDF8" fillOpacity="0.4"/>

                {/* Ground Highway / Road */}
                <path d="M0 135L500 135" stroke="rgba(56, 189, 248, 0.4)" strokeWidth="3"/>
                <path d="M20 148L480 148" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="2" strokeDasharray="16 16"/>

                {/* Streetlight Nodes */}
                <path d="M100 135V105C100 100 108 100 112 100" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="112" cy="100" r="4" fill="#FBBF24" />
                <path d="M106 102L96 135" stroke="url(#lightGradient)" strokeWidth="12" opacity="0.3"/>

                <path d="M340 135V105C340 100 348 100 352 100" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="352" cy="100" r="4" fill="#FBBF24" />
                <path d="M346 102L336 135" stroke="url(#lightGradient)" strokeWidth="12" opacity="0.3"/>

                {/* Civic Inspection Pin */}
                <g transform="translate(230, 40)">
                  <circle cx="20" cy="20" r="18" fill="#0EA5E9" fillOpacity="0.25"/>
                  <circle cx="20" cy="20" r="12" fill="#0284C7"/>
                  <path d="M16 20L19 23L25 17" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 32V45" stroke="#38BDF8" strokeWidth="2" strokeDasharray="3 3"/>
                  <circle cx="20" cy="46" r="3" fill="#38BDF8"/>
                </g>

                {/* Gradients */}
                <defs>
                  <linearGradient id="lightGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8"/>
                    <stop offset="100%" stopColor="#FBBF24" stopOpacity="0"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Floating Live Badges */}
            <div className="civic-floating-pills">
              <span className="civic-float-pill">
                <span className="civic-pill-dot green" />
                <span>Pothole Repaired in 48h</span>
              </span>
              <span className="civic-float-pill">
                <span className="civic-pill-dot sky" />
                <span>Smart Streetlights Online</span>
              </span>
              <span className="civic-float-pill">
                <span className="civic-pill-dot amber" />
                <span>Water Supply Restored</span>
              </span>
            </div>
          </div>

          {/* Verified Statistics Grid */}
          <div className="civic-stats-grid">
            <div className="civic-stat-box">
              <div className="civic-stat-value">18,450+</div>
              <div className="civic-stat-label">Complaints Resolved</div>
              <div className="civic-stat-sub">
                <CheckCircle size={12} /> 94.6% resolution rate
              </div>
            </div>

            <div className="civic-stat-box">
              <div className="civic-stat-value">95,000+</div>
              <div className="civic-stat-label">Citizens Served</div>
              <div className="civic-stat-sub">
                <Users size={12} /> Across all wards
              </div>
            </div>

            <div className="civic-stat-box">
              <div className="civic-stat-value">72h</div>
              <div className="civic-stat-label">Avg. Resolution</div>
              <div className="civic-stat-sub">
                <Clock size={12} /> SLA guaranteed
              </div>
            </div>
          </div>

          {/* Quick Demo Credentials selector if provided */}
          {onSelectDemoUser && (
            <div className="civic-demo-accounts">
              <div className="civic-demo-accounts-title">
                <span>Quick Evaluation Logins</span>
                <span style={{ fontSize: '0.72rem', color: '#94A3B8', fontWeight: 500 }}>Click to auto-fill</span>
              </div>
              <div className="civic-demo-chips">
                <button
                  type="button"
                  className="civic-demo-chip"
                  onClick={() => onSelectDemoUser('citizen@example.com', 'citizen123')}
                >
                  👤 Citizen Account
                </button>
                <button
                  type="button"
                  className="civic-demo-chip"
                  onClick={() => onSelectDemoUser('admin@civictrack.gov.in', 'admin123')}
                >
                  🛡️ Admin Account
                </button>
                <button
                  type="button"
                  className="civic-demo-chip"
                  onClick={() => onSelectDemoUser('pwd@civictrack.gov.in', 'dept123')}
                >
                  🏢 PWD Dept.
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Security Certification */}
        <div className="civic-left-footer">
          <div className="civic-security-badges">
            <span className="civic-sec-badge">
              <Lock size={14} color="#38BDF8" /> 256-Bit SSL Secure
            </span>
            <span className="civic-sec-badge">
              <CheckCircle2 size={14} color="#34D399" /> Citizen Charter
            </span>
          </div>
          <div>© {new Date().getFullYear()} CivicTrack • Government of Citizen Services</div>
        </div>
      </aside>

      {/* ============================================================
          Right Panel: Authentication Form Container
          ============================================================ */}
      <main className="civic-auth-right">
        <div className="civic-form-card">
          <div className="civic-form-card-top-bar" />

          {/* Mobile Brand Header */}
          <div className="civic-mobile-brand">
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0EA5E9, #1D4ED8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                <Shield size={22} />
              </div>
              <div>
                <strong style={{ fontSize: '1.25rem', color: '#0A1628', display: 'block', lineHeight: 1.2 }}>CivicTrack</strong>
                <span style={{ fontSize: '0.72rem', color: '#0EA5E9', fontWeight: 600, textTransform: 'uppercase' }}>Grievance Portal</span>
              </div>
            </Link>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
