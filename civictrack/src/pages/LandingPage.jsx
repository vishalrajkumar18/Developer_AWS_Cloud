import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, Mail, ChevronRight, CheckCircle2, Clock, Users,
  Star, ArrowRight, Shield, Zap, BarChart3, Facebook, Twitter, Linkedin,
  AlertCircle, Lightbulb, Droplets, GitBranch, Trash2, TrafficCone, Menu, X
} from 'lucide-react';

const navLinks = [
  { href: '#how-it-works', label: 'How It Works' },
  { href: '#categories', label: 'Categories' },
  { href: '#stats', label: 'Statistics' },
];

const categoryItems = [
  { icon: AlertCircle, label: 'Road Damage', desc: 'Potholes, road cracks & surface damage', color: '#EF4444', bg: '#FEE2E2' },
  { icon: Lightbulb,   label: 'Streetlight',  desc: 'Non-functional street and signal lights', color: '#F59E0B', bg: '#FEF3C7' },
  { icon: Droplets,    label: 'Water Leakage',desc: 'Pipe leaks & water supply issues', color: '#3B82F6', bg: '#DBEAFE' },
  { icon: GitBranch,   label: 'Drainage',     desc: 'Blocked drains & flooding issues', color: '#8B5CF6', bg: '#EDE9FE' },
  { icon: Trash2,      label: 'Garbage',      desc: 'Missed collection & illegal dumping', color: '#10B981', bg: '#D1FAE5' },
  { icon: TrafficCone, label: 'Traffic Signal',desc: 'Malfunctioning signals & road signs', color: '#F97316', bg: '#FFEDD5' },
];

const steps = [
  { step: '01', title: 'Register & Login', desc: 'Create your account with basic details to access the portal securely.', icon: Users },
  { step: '02', title: 'Submit Complaint', desc: 'Fill the complaint form with location, category and photo evidence.', icon: AlertCircle },
  { step: '03', title: 'Track Progress', desc: 'Get real-time updates and track the resolution of your complaint.', icon: BarChart3 },
  { step: '04', title: 'Issue Resolved', desc: 'Receive confirmation once the department resolves your complaint.', icon: CheckCircle2 },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* ── Navbar ── */}
      <nav style={{
        background: 'rgba(10,22,40,0.97)',
        backdropFilter: 'blur(12px)',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        borderBottom: '1px solid rgba(255,255,255,.08)'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'white' }}>
            <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #0EA5E9, #1D4ED8)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={20} color="white" />
            </div>
            <div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800 }}>CivicTrack</span>
              <div style={{ fontSize: '0.65rem', color: '#38BDF8', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>Gov. Portal</div>
            </div>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }} className="desktop-nav">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} style={{ color: 'rgba(255,255,255,.8)', fontSize: '0.875rem', fontWeight: 500, transition: 'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#38BDF8'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.8)'}>{l.label}</a>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10 }} className="desktop-nav">
            <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Register Free</Link>
          </div>

          <button style={{ color: 'white', display: 'none' }} className="mobile-nav-btn" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileMenu && (
          <div style={{ background: '#0F2044', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {navLinks.map(l => (
              <a key={l.href} href={l.href} style={{ color: 'rgba(255,255,255,.8)', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,.1)' }} onClick={() => setMobileMenu(false)}>{l.label}</a>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <Link to="/login" className="btn btn-ghost btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center' }}>Register</Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero ── */}
      <section style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #1A3160 50%, #0284C7 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        paddingTop: 80,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Animated blobs */}
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: 'rgba(14,165,233,.12)', filter: 'blur(60px)', top: -100, right: -100, animation: 'float 6s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: 'rgba(29,78,216,.2)', filter: 'blur(40px)', bottom: 100, left: -50, animation: 'float 8s ease-in-out infinite reverse' }} />

        <div className="container" style={{ color: 'white', position: 'relative' }}>
          <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(14,165,233,.2)', border: '1px solid rgba(14,165,233,.4)', borderRadius: 999, padding: '6px 16px', marginBottom: 28, fontSize: '0.82rem', fontWeight: 600, color: '#38BDF8' }}>
              <Zap size={14} /> Smart Grievance Management System
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
              Your Voice,<br />
              <span style={{ background: 'linear-gradient(90deg, #38BDF8, #0EA5E9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Our Responsibility</span>
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,.75)', lineHeight: 1.7, marginBottom: 36 }}>
              Report public issues directly to the right authorities. Track real-time resolution progress. Make your city better, one complaint at a time.
            </p>
            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register-complaint" className="btn btn-primary btn-lg">
                Register Complaint <ArrowRight size={18} />
              </Link>
              <Link to="/track" className="btn btn-ghost btn-lg">
                <Search16 /> Track Complaint
              </Link>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'flex', gap: 32, marginTop: 56, justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { val: '34,562', label: 'Complaints Filed' },
                { val: '86%', label: 'Resolved' },
                { val: '4.2 Days', label: 'Avg Resolution' },
                { val: '12,847', label: 'Citizens' },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#38BDF8' }}>{s.val}</div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,.6)', marginTop: 3, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .mobile-nav-btn { display: flex !important; }
          }
        `}</style>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <div className="text-center mb-8">
            <div style={{ display: 'inline-block', background: 'var(--sky-50)', color: 'var(--sky-600)', padding: '6px 16px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Process</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: 12 }}>How CivicTrack Works</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '1.05rem', maxWidth: 480, margin: '0 auto' }}>Simple, transparent, and efficient grievance management in 4 easy steps</p>
          </div>
          <div className="grid-4" style={{ marginTop: 48 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '32px 20px', borderRadius: 16, background: 'var(--gray-50)', border: '1px solid var(--gray-100)', transition: 'all .3s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--gray-50)'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, var(--sky-500), var(--navy-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'white' }}>
                  <s.icon size={26} />
                </div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--sky-500)', letterSpacing: 2, marginBottom: 8 }}>STEP {s.step}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--gray-500)', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section id="categories" style={{ padding: '80px 0', background: 'var(--gray-50)' }}>
        <div className="container">
          <div className="text-center mb-8">
            <div style={{ display: 'inline-block', background: 'var(--sky-50)', color: 'var(--sky-600)', padding: '6px 16px', borderRadius: 999, fontSize: '0.8rem', fontWeight: 700, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Categories</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: 12 }}>What Issues Can You Report?</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: '1.05rem' }}>Six major categories covering all public infrastructure issues</p>
          </div>
          <div className="grid-3" style={{ marginTop: 40 }}>
            {categoryItems.map((c, i) => (
              <Link to="/register-complaint" key={i} style={{ display: 'block', textDecoration: 'none' }}>
                <div style={{ background: 'white', borderRadius: 16, padding: '28px 24px', boxShadow: 'var(--shadow-sm)', border: `1px solid ${c.bg}`, transition: 'all .3s', display: 'flex', alignItems: 'flex-start', gap: 16 }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = c.color; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = c.bg; }}>
                  <div style={{ width: 52, height: 52, borderRadius: 12, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <c.icon size={26} color={c.color} />
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, color: 'var(--navy-900)', marginBottom: 4 }}>{c.label}</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--gray-500)' }}>{c.desc}</p>
                  </div>
                  <ChevronRight size={16} style={{ marginLeft: 'auto', color: 'var(--gray-400)', flexShrink: 0, marginTop: 4 }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Banner ── */}
      <section id="stats" style={{ background: 'linear-gradient(135deg, var(--navy-900), var(--navy-700))', padding: '64px 0', color: 'white' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 800, marginBottom: 48 }}>
            <span style={{ color: '#38BDF8' }}>CivicTrack</span> in Numbers
          </h2>
          <div className="grid-4" style={{ gap: 0 }}>
            {[
              { val: '34,562', label: 'Total Complaints', sub: 'Filed since launch', icon: '📋' },
              { val: '12,847', label: 'Registered Citizens', sub: 'Active users', icon: '👥' },
              { val: '94%', label: 'Satisfaction Rate', sub: 'Citizen feedback', icon: '⭐' },
              { val: '4.2 Days', label: 'Avg Resolution', sub: 'Industry leading', icon: '⚡' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '24px', borderRight: i < 3 ? '1px solid rgba(255,255,255,.1)' : 'none' }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#38BDF8', lineHeight: 1 }}>{s.val}</div>
                <div style={{ fontWeight: 700, marginTop: 8, marginBottom: 4 }}>{s.label}</div>
                <div style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,.55)' }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '80px 0', background: 'white' }}>
        <div className="container text-center">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: 16 }}>Ready to Make a Difference?</h2>
          <p style={{ color: 'var(--gray-500)', fontSize: '1.05rem', marginBottom: 36 }}>Join thousands of citizens already using CivicTrack</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary btn-lg">Get Started Free <ArrowRight size={18} /></Link>
            <Link to="/track" className="btn btn-outline btn-lg">Track Complaint</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: 'var(--navy-900)', color: 'rgba(255,255,255,.75)', padding: '56px 0 24px' }}>
        <div className="container">
          <div className="grid-3" style={{ marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, color: 'white' }}>
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #0EA5E9, #1D4ED8)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={20} color="white" />
                </div>
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>CivicTrack</span>
              </div>
              <p style={{ fontSize: '0.875rem', lineHeight: 1.7 }}>Smart Public Grievance Registration Portal. Bridging citizens and government for faster, transparent issue resolution.</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                  <a key={i} href="#" style={{ width: 34, height: 34, background: 'rgba(255,255,255,.1)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.7)', transition: 'all .2s' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#0EA5E9'; e.currentTarget.style.color = 'white'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.1)'; e.currentTarget.style.color = 'rgba(255,255,255,.7)'; }}>
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}>Quick Links</h4>
              {[
                { to: '/register', label: 'Register Complaint' },
                { to: '/track', label: 'Track Complaint' },
                { to: '/login', label: 'Citizen Login' },
                { to: '#how-it-works', label: 'How It Works' },
              ].map(l => (
                <Link key={l.label} to={l.to} style={{ display: 'block', marginBottom: 8, fontSize: '0.875rem', transition: 'color .2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#38BDF8'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.75)'}>{l.label}</Link>
              ))}
            </div>

            <div>
              <h4 style={{ color: 'white', fontWeight: 700, marginBottom: 16 }}>Contact Us</h4>
              {[
                { icon: MapPin, text: 'Municipal Corporation Office, City Centre, Bangalore – 560001' },
                { icon: Phone, text: '1800-123-4567 (Toll Free)' },
                { icon: Mail, text: 'help@civictrack.gov.in' },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: '0.875rem', alignItems: 'flex-start' }}>
                  <Icon size={16} style={{ flexShrink: 0, marginTop: 2, color: '#38BDF8' }} />
                  {text}
                </div>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.1)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, fontSize: '0.82rem' }}>
            <span>© 2024 CivicTrack. Government of India Initiative.</span>
            <div style={{ display: 'flex', gap: 20 }}>
              <a href="#" style={{ color: 'inherit' }}>Privacy Policy</a>
              <a href="#" style={{ color: 'inherit' }}>Terms of Use</a>
              <a href="#" style={{ color: 'inherit' }}>RTI</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Search16() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  );
}
