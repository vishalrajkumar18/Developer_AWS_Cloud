import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, FileText, PlusCircle } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StatusBadge, PriorityBadge, EmptyState } from '../components/ui/UIComponents';
import { useAuth } from '../context/AuthContext';
import { categories } from '../data/mockData';

const STATUS_OPTIONS = ['all', 'pending', 'in-progress', 'resolved'];

export default function MyComplaints() {
  const { getMyComplaints } = useAuth();
  const allComplaints = getMyComplaints();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filtered = useMemo(() => {
    return allComplaints.filter(c => {
      const matchSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.id.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchCat = categoryFilter === 'all' || c.category === categoryFilter;
      return matchSearch && matchStatus && matchCat;
    });
  }, [allComplaints, search, statusFilter, categoryFilter]);

  return (
    <DashboardLayout title="My Complaints">
      {/* Summary Row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        {STATUS_OPTIONS.slice(1).map(s => {
          const count = allComplaints.filter(c => c.status === s).length;
          const colors = { pending: ['#FEF3C7','#92400E'], 'in-progress': ['#DBEAFE','#1D4ED8'], resolved: ['#D1FAE5','#065F46'] };
          return (
            <div key={s} style={{ background: colors[s][0], color: colors[s][1], padding: '10px 18px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', border: statusFilter === s ? `2px solid ${colors[s][1]}` : '2px solid transparent', transition: 'all .2s' }}
              onClick={() => setStatusFilter(statusFilter === s ? 'all' : s)}>
              {count} {s.replace('-',' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h3 className="section-title">All Complaints ({filtered.length})</h3>
              <p className="section-sub">Manage and track all your submitted complaints</p>
            </div>
            <Link to="/register-complaint" className="btn btn-primary btn-sm"><PlusCircle size={16} /> New</Link>
          </div>

          {/* Filters */}
          <div className="filter-row" style={{ marginTop: 16, marginBottom: 0 }}>
            <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
              <Search size={16} style={{ color: 'var(--gray-400)' }} />
              <input placeholder="Search by ID or title…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              {STATUS_OPTIONS.slice(1).map(s => <option key={s} value={s}>{s.replace('-',' ').replace(/\b\w/g, l => l.toUpperCase())}</option>)}
            </select>
            <select className="filter-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            {(statusFilter !== 'all' || categoryFilter !== 'all' || search) && (
              <button className="btn btn-outline btn-sm" onClick={() => { setSearch(''); setStatusFilter('all'); setCategoryFilter('all'); }}>Clear</button>
            )}
          </div>
        </div>

        <div className="table-wrapper">
          {filtered.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No complaints found"
              description="No complaints match your current filters."
              action={<Link to="/register-complaint" className="btn btn-primary btn-sm" style={{ display: 'inline-flex' }}><PlusCircle size={16} />Register Complaint</Link>}
            />
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Complaint ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Date</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td><span style={{ fontWeight: 700, color: 'var(--sky-600)', fontSize: '0.82rem', fontFamily: 'monospace' }}>{c.id}</span></td>
                    <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{c.title}</td>
                    <td><span style={{ background: 'var(--gray-100)', padding: '3px 10px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 600 }}>{c.category}</span></td>
                    <td><PriorityBadge priority={c.priority || 'medium'} /></td>
                    <td style={{ color: 'var(--gray-500)', fontSize: '0.82rem' }}>{c.submittedDate}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--gray-600)' }}>{c.department}</td>
                    <td><StatusBadge status={c.status} /></td>
                    <td>
                      <Link to={`/track?id=${c.id}`} className="btn btn-outline btn-sm" style={{ padding: '5px 12px', fontSize: '0.78rem' }}>Track</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
