import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Clock, Loader, CheckCircle2, PlusCircle, ArrowRight } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StatCard, StatusBadge } from '../components/ui/UIComponents';
import { useAuth } from '../context/AuthContext';

export default function CitizenDashboard() {
  const { user, getMyComplaints } = useAuth();
  const complaints = getMyComplaints();

  const total     = complaints.length;
  const pending   = complaints.filter(c => c.status === 'pending').length;
  const inProgress = complaints.filter(c => c.status === 'in-progress').length;
  const resolved  = complaints.filter(c => c.status === 'resolved').length;
  const recent    = complaints.slice(0, 5);

  return (
    <DashboardLayout title="Citizen Dashboard">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--navy-900), var(--navy-700), var(--sky-600))',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
        color: 'white',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 20,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,.05)' }} />
        <div>
          <p style={{ color: 'rgba(255,255,255,.7)', marginBottom: 4 }}>Welcome back,</p>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>{user?.name} 👋</h2>
          <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '0.9rem' }}>
            You have <strong style={{ color: '#38BDF8' }}>{pending}</strong> pending and{' '}
            <strong style={{ color: '#34D399' }}>{inProgress}</strong> in-progress complaints.
          </p>
        </div>
        <Link to="/register-complaint" className="btn btn-ghost" style={{ flexShrink: 0 }}>
          <PlusCircle size={18} /> New Complaint <ArrowRight size={16} />
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <StatCard icon={FileText}    iconBg="#EFF6FF" iconColor="#3B82F6" label="Total Complaints" value={total} />
        <StatCard icon={Clock}       iconBg="#FEF9C3" iconColor="#CA8A04" label="Pending" value={pending} />
        <StatCard icon={Loader}      iconBg="#EEF2FF" iconColor="#6366F1" label="In Progress" value={inProgress} />
        <StatCard icon={CheckCircle2} iconBg="#F0FDF4" iconColor="#16A34A" label="Resolved" value={resolved} />
      </div>

      {/* Recent Complaints Table */}
      <div className="card">
        <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 className="section-title">Recent Complaints</h3>
            <p className="section-sub">Your latest submitted complaints</p>
          </div>
          <Link to="/my-complaints" className="btn btn-outline btn-sm">View All</Link>
        </div>
        <div className="table-wrapper">
          {recent.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--gray-500)' }}>
              <FileText size={42} style={{ margin: '0 auto 12px', opacity: .4 }} />
              <p>No complaints filed yet.</p>
              <Link to="/register-complaint" className="btn btn-primary btn-sm" style={{ marginTop: 16, display: 'inline-flex' }}>
                <PlusCircle size={16} /> Register First Complaint
              </Link>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map(c => (
                  <tr key={c.id}>
                    <td><span style={{ fontWeight: 600, color: 'var(--sky-600)', fontSize: '0.82rem' }}>{c.id}</span></td>
                    <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</td>
                    <td><span style={{ background: 'var(--gray-100)', padding: '3px 10px', borderRadius: 999, fontSize: '0.78rem' }}>{c.category}</span></td>
                    <td style={{ color: 'var(--gray-500)', fontSize: '0.82rem' }}>{c.submittedDate}</td>
                    <td><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid-3" style={{ marginTop: 24 }}>
        {[
          { to: '/register-complaint', icon: PlusCircle, label: 'New Complaint', desc: 'Report a public issue', color: 'var(--sky-500)', bg: 'var(--sky-50)' },
          { to: '/my-complaints', icon: FileText, label: 'My Complaints', desc: 'View all your complaints', color: '#6366F1', bg: '#EEF2FF' },
          { to: '/track', icon: ArrowRight, label: 'Track Complaint', desc: 'Check resolution status', color: '#16A34A', bg: '#F0FDF4' },
        ].map(a => (
          <Link key={a.to} to={a.to} style={{ display: 'block', textDecoration: 'none' }}>
            <div style={{ background: a.bg, borderRadius: 'var(--radius-lg)', padding: '24px 20px', display: 'flex', alignItems: 'center', gap: 14, transition: 'all .25s', border: `1px solid ${a.bg}` }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-sm)', flexShrink: 0 }}>
                <a.icon size={20} color={a.color} />
              </div>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '0.95rem' }}>{a.label}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)', marginTop: 2 }}>{a.desc}</div>
              </div>
              <ArrowRight size={16} style={{ marginLeft: 'auto', color: 'var(--gray-400)', flexShrink: 0 }} />
            </div>
          </Link>
        ))}
      </div>
    </DashboardLayout>
  );
}
