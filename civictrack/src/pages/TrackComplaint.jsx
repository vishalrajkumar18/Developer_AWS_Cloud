import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Search, MapPin, Building2, Calendar, User, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StatusBadge, ComplaintTimeline } from '../components/ui/UIComponents';
import { useAuth } from '../context/AuthContext';

function PublicWrapper({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--gray-50)' }}>
      <nav style={{ background: 'var(--navy-900)', color: 'white', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'white' }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(135deg,#0EA5E9,#1D4ED8)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          </div>
          <span style={{ fontWeight: 700 }}>CivicTrack</span>
        </a>
        <span style={{ color: 'rgba(255,255,255,.4)', marginLeft: 4 }}>/ Track Complaint</span>
      </nav>
      <div style={{ padding: '40px 24px', maxWidth: 860, margin: '0 auto' }}>{children}</div>
    </div>
  );
}

function TrackContent() {
  const location = useLocation();
  const { complaints } = useAuth();
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    if (id) { setSearchId(id); doSearch(id); }
  }, []);

  const doSearch = (id = searchId) => {
    setNotFound(false); setResult(null);
    const found = complaints?.find(c => c.id.toLowerCase() === id.trim().toLowerCase());
    if (found) setResult(found);
    else setNotFound(true);
  };

  const handleSearch = (e) => { e.preventDefault(); doSearch(); };

  return (
    <>
      {/* Search */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-body">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--navy-900)', marginBottom: 6 }}>Track Your Complaint</h2>
          <p style={{ color: 'var(--gray-500)', marginBottom: 24 }}>Enter your complaint ID to view real-time status and updates</p>
          <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
              <Search size={18} style={{ color: 'var(--gray-400)', flexShrink: 0 }} />
              <input id="track-id-input" type="text" placeholder="Enter Complaint ID (e.g., CIV-2024-001)"
                value={searchId} onChange={e => setSearchId(e.target.value)} />
            </div>
            <button id="track-search-btn" type="submit" className="btn btn-primary">Search</button>
          </form>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>Try:</span>
            {['CIV-2024-001','CIV-2024-002','CIV-2024-003'].map(id => (
              <button key={id} type="button" onClick={() => { setSearchId(id); doSearch(id); }}
                style={{ fontSize: '0.78rem', color: 'var(--sky-600)', background: 'var(--sky-50)', padding: '2px 10px', borderRadius: 999, cursor: 'pointer', border: '1px solid var(--sky-100)' }}>
                {id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {notFound && (
        <div className="alert alert-error"><AlertCircle size={16} />No complaint found with ID "{searchId}". Please check the ID and try again.</div>
      )}

      {result && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="track-grid">
          {/* Left – Details */}
          <div className="card">
            <div className="card-header">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--sky-600)', letterSpacing: 1 }}>COMPLAINT ID</span>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--navy-900)' }}>{result.id}</h3>
                </div>
                <StatusBadge status={result.status} />
              </div>
            </div>
            <div className="card-body">
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: 16 }}>{result.title}</h4>

              {[
                { icon: Building2, label: 'Category',     value: result.category },
                { icon: Calendar,  label: 'Submitted',    value: result.submittedDate },
                { icon: Building2, label: 'Department',   value: result.department },
                { icon: User,      label: 'Assigned To',  value: result.assignedOfficer || 'Not yet assigned' },
                { icon: MapPin,    label: 'Location',     value: result.location },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, background: 'var(--sky-50)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={16} color="var(--sky-600)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: .5 }}>{label}</div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--gray-800)' }}>{value}</div>
                  </div>
                </div>
              ))}

              {result.description && (
                <div style={{ marginTop: 8, background: 'var(--gray-50)', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', letterSpacing: .5, marginBottom: 6 }}>Description</div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)', lineHeight: 1.6 }}>{result.description}</p>
                </div>
              )}

              {result.image && (
                <div style={{ marginTop: 16 }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gray-500)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: .5 }}>Photo Evidence</div>
                  <img src={result.image} alt="Complaint" style={{ borderRadius: 10, width: '100%', objectFit: 'cover', maxHeight: 200 }} />
                </div>
              )}
            </div>
          </div>

          {/* Right – Timeline */}
          <div className="card">
            <div className="card-header">
              <h3 className="section-title">Resolution Timeline</h3>
              <p className="section-sub">Track every stage of your complaint</p>
            </div>
            <div className="card-body">
              <ComplaintTimeline timeline={result.timeline} />
            </div>
          </div>
        </div>
      )}

      <style>{`.track-grid { @media (max-width:768px) { grid-template-columns: 1fr; } }`}</style>
    </>
  );
}

export default function TrackComplaint() {
  const { user } = useAuth();
  if (user) {
    return <DashboardLayout title="Track Complaint"><TrackContent /></DashboardLayout>;
  }
  return <PublicWrapper><TrackContent /></PublicWrapper>;
}
