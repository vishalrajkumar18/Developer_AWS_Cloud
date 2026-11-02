import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, PlusCircle, Search, LogOut,
  Menu, X, Bell, ChevronDown, User, Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const citizenLinks = [
  { to: '/citizen-dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/register-complaint', icon: PlusCircle,       label: 'Register Complaint' },
  { to: '/my-complaints',      icon: FileText,         label: 'My Complaints' },
  { to: '/track',              icon: Search,           label: 'Track Complaint' },
];

const adminLinks = [
  { to: '/admin-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/track',           icon: Search,          label: 'Track Complaint' },
];

const deptLinks = [
  { to: '/department-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/track',                icon: Search,          label: 'Track Complaint' },
];

export default function DashboardLayout({ children, title }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'department' ? deptLinks : citizenLinks;

  const RoleIcon = user?.role === 'admin' ? Shield : User;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-mobile-open' : ''}`} style={sidebarOpen ? { display: 'flex' } : {}}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div className="logo-text">
            <h2>CivicTrack</h2>
            <p>Grievance Portal</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="sidebar-section-label">Navigation</span>
          {links.map(({ to, icon: Icon, label }) => (
            <Link
              key={to}
              to={to}
              className={`sidebar-link${location.pathname === to ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="sidebar-avatar" style={{ overflow: 'hidden', padding: 0 }}>
            {user?.photoURL ? (
              <img src={user.photoURL} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            ) : (
              user?.name?.[0]?.toUpperCase() || 'U'
            )}
          </div>
          <div className="sidebar-user-info" style={{ flex: 1, minWidth: 0 }}>
            <h4 style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name}</h4>
            <p style={{ textTransform: 'capitalize' }}>{user?.role}</p>
          </div>
          <button onClick={handleLogout} title="Logout" style={{ color: 'rgba(255,255,255,.6)', transition: 'color .2s' }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.6)'}
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="main-content">
        <header className="top-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none', color: 'var(--gray-600)' }}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h1>{title}</h1>
          </div>
          <div className="top-bar-actions">
            <button style={{ position: 'relative', padding: '8px', color: 'var(--gray-500)', borderRadius: '8px', background: 'var(--gray-100)' }}>
              <Bell size={18} />
              <span style={{ position: 'absolute', top: 6, right: 6, width: 7, height: 7, background: 'var(--sky-500)', borderRadius: '50%' }} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: 'var(--gray-100)', borderRadius: 10 }}>
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg, var(--sky-500), var(--navy-500))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem', overflow: 'hidden' }}>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user?.name?.[0]?.toUpperCase()
                )}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--gray-700)' }}>{user?.name?.split(' ')[0]}</span>
              <ChevronDown size={14} style={{ color: 'var(--gray-500)' }} />
            </div>
          </div>
        </header>

        <main className="content-area">
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
          .sidebar {
            position: fixed !important;
            left: 0; top: 0; bottom: 0;
            z-index: 200;
            width: 260px !important;
          }
          .sidebar-mobile-open { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
