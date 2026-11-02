import React, { useState, useMemo } from 'react';
import {
  Users, FileText, Clock, CheckCircle2, TrendingUp, BarChart3,
  AlertCircle, Loader, Search, Edit3, Filter, Building2, Check, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer
} from 'recharts';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StatCard, StatusBadge, PriorityBadge } from '../components/ui/UIComponents';
import { useAuth } from '../context/AuthContext';
import { stats, monthlyData, categoryData, departments } from '../data/mockData';
import AdminComplaintModal from '../components/admin/AdminComplaintModal';

export default function AdminDashboard() {
  const { complaints, updateComplaintStatus } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Modal State
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [toastMsg, setToastMsg] = useState('');

  // Live Counts
  const total      = complaints.length;
  const pending    = complaints.filter(c => c.status === 'pending').length;
  const inProgress = complaints.filter(c => c.status === 'in-progress').length;
  const resolved   = complaints.filter(c => c.status === 'resolved').length;
  const rejected   = complaints.filter(c => c.status === 'rejected').length;

  // Filter complaints
  const filtered = complaints.filter(c => {
    const matchSearch = !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.submittedBy?.toLowerCase().includes(search.toLowerCase()) ||
      c.location?.toLowerCase().includes(search.toLowerCase());
    
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchDept = departmentFilter === 'all' || c.department === departmentFilter;
    const matchPriority = priorityFilter === 'all' || c.priority === priorityFilter;

    return matchSearch && matchStatus && matchDept && matchPriority;
  });

  // Dynamic Department Stats calculated from live complaints
  const dynamicDeptStats = useMemo(() => {
    const map = {};
    departments.forEach(dept => {
      map[dept] = { dept, assigned: 0, resolved: 0, pending: 0, inProgress: 0 };
    });

    complaints.forEach(c => {
      const d = c.department || 'Roads & Infrastructure';
      if (!map[d]) {
        map[d] = { dept: d, assigned: 0, resolved: 0, pending: 0, inProgress: 0 };
      }
      map[d].assigned += 1;
      if (c.status === 'resolved') map[d].resolved += 1;
      else if (c.status === 'pending') map[d].pending += 1;
      else if (c.status === 'in-progress') map[d].inProgress += 1;
    });

    return Object.values(map);
  }, [complaints]);

  // Handler for saving changes from modal
  const handleSaveModal = (id, updates) => {
    updateComplaintStatus(id, updates);
    showToast(`Complaint ${id} updated to "${updates.status.toUpperCase()}" successfully!`);
  };

  // Handler for quick status change directly from table dropdown
  const handleQuickStatusChange = (id, newStatus) => {
    updateComplaintStatus(id, newStatus, `Status updated to ${newStatus} by System Administrator`);
    showToast(`Complaint ${id} quick-updated to "${newStatus.toUpperCase()}"!`);
  };

  const showToast = (message) => {
    setToastMsg(message);
    setTimeout(() => setToastMsg(''), 4000);
  };

  return (
    <DashboardLayout title="Admin Control Center">
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: 24,
          right: 24,
          zIndex: 1050,
          background: 'linear-gradient(135deg, #0A1628, #1E3A8A)',
          color: 'white',
          padding: '14px 20px',
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontSize: '0.9rem',
          fontWeight: 600,
          border: '1px solid rgba(14, 165, 233, 0.4)',
          animation: 'slideDown 0.3s ease-out',
        }}>
          <CheckCircle2 size={20} color="#34D399" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0A1628 0%, #1A3160 55%, #0284C7 100%)',
        borderRadius: 20,
        padding: '28px 32px',
        color: 'white',
        marginBottom: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16
      }}>
        <div>
          <span style={{
            background: 'rgba(56, 189, 248, 0.18)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            padding: '4px 12px',
            borderRadius: 999,
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: '#BAE6FD',
            display: 'inline-block',
            marginBottom: 8
          }}>
            Super Administrator Portal
          </span>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 6 }}>
            CivicTrack Central Grievance Management
          </h2>
          <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '0.92rem', maxWidth: 640 }}>
            Oversee system grievances, change complaint resolution stages, reassign departments, and dispatch field work orders in real-time.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => showToast('Refreshed complaint records from municipal server')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 18px',
              borderRadius: 10,
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: 'white',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <RefreshCw size={15} /> Refresh Data
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <StatCard icon={FileText}     iconBg="#EFF6FF" iconColor="#3B82F6" label="Total Grievances"   value={total}                trend={8}  />
        <StatCard icon={AlertCircle}  iconBg="#FEF3C7" iconColor="#F59E0B" label="Pending Review"    value={pending}              trend={-3} />
        <StatCard icon={Loader}       iconBg="#EEF2FF" iconColor="#6366F1" label="Under Progress"    value={inProgress}           trend={12} />
        <StatCard icon={CheckCircle2} iconBg="#D1FAE5" iconColor="#10B981" label="Resolved Issues"   value={resolved}             trend={15} />
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        {/* Monthly Bar Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Monthly Complaint Trends</h3>
            <p className="section-sub">Submitted vs Resolved last 6 months</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748B' }} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,.1)' }} />
                <Legend />
                <Bar dataKey="submitted" fill="#0EA5E9" radius={[4, 4, 0, 0]} name="Submitted" />
                <Bar dataKey="resolved"  fill="#10B981" radius={[4, 4, 0, 0]} name="Resolved"  />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Complaints by Category</h3>
            <p className="section-sub">Distribution across issue types</p>
          </div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,.1)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {categoryData.map(d => (
                <div key={d.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: d.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--gray-700)' }}>{d.name}</span>
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-800)' }}>{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Department Performance */}
      <div className="card" style={{ marginBottom: 28 }}>
        <div className="card-header">
          <h3 className="section-title">Department Live Workload & Resolution</h3>
          <p className="section-sub">Real-time status based on active complaint assignments</p>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Assigned</th>
                <th>Resolved</th>
                <th>In Progress</th>
                <th>Pending</th>
                <th>Resolution Rate</th>
              </tr>
            </thead>
            <tbody>
              {dynamicDeptStats.map(d => {
                const totalAssigned = d.assigned || 1;
                const rate = Math.round((d.resolved / totalAssigned) * 100);
                return (
                  <tr key={d.dept}>
                    <td style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{d.dept}</td>
                    <td><span style={{ fontWeight: 700 }}>{d.assigned}</span></td>
                    <td><span style={{ color: 'var(--success)', fontWeight: 700 }}>{d.resolved}</span></td>
                    <td><span style={{ color: '#2563EB', fontWeight: 600 }}>{d.inProgress}</span></td>
                    <td><span style={{ color: d.pending > 0 ? 'var(--warning)' : 'var(--gray-400)', fontWeight: 600 }}>{d.pending}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 8, background: 'var(--gray-100)', borderRadius: 999, overflow: 'hidden' }}>
                          <div style={{ width: `${rate}%`, height: '100%', background: rate >= 70 ? 'var(--success)' : '#F59E0B', borderRadius: 999 }} />
                        </div>
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--gray-700)', minWidth: 36 }}>{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ============================================================
          ALL COMPLAINTS MANAGEMENT & STATUS CHANGE INTERFACE
          ============================================================ */}
      <div className="card">
        <div className="card-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 14 }}>
            <div>
              <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>Complaints Management</span>
                <span style={{ background: '#E0F2FE', color: '#0284C7', padding: '2px 8px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700 }}>
                  {filtered.length} of {total}
                </span>
              </h3>
              <p className="section-sub">Select or manage complaints to update their status, department, and resolution notes</p>
            </div>

            {/* Filters Row */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search */}
              <div className="search-bar" style={{ minWidth: 200 }}>
                <Search size={16} style={{ color: 'var(--gray-400)' }} />
                <input
                  placeholder="Search ID, title, citizen..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              {/* Status Filter */}
              <select
                className="filter-select"
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 10 }}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>

              {/* Department Filter */}
              <select
                className="filter-select"
                value={departmentFilter}
                onChange={e => setDepartmentFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 10 }}
              >
                <option value="all">All Departments</option>
                {departments.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>

              {/* Priority Filter */}
              <select
                className="filter-select"
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: 10 }}
              >
                <option value="all">All Priorities</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Complaints Table with Quick Status Change and Action Button */}
        <div className="table-wrapper">
          {filtered.length === 0 ? (
            <div style={{ padding: 48, textAlign: 'center', color: 'var(--gray-500)' }}>
              <AlertCircle size={44} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--navy-900)' }}>No matching complaints found</p>
              <p style={{ fontSize: '0.85rem' }}>Try clearing the search query or adjusting your filters.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Title & Location</th>
                  <th>Category</th>
                  <th>Citizen</th>
                  <th>Department</th>
                  <th>Priority</th>
                  <th>Quick Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => {
                  return (
                    <tr key={c.id} style={{ transition: 'background 0.2s' }}>
                      {/* ID */}
                      <td>
                        <span style={{ fontWeight: 800, color: 'var(--sky-600)', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                          {c.id}
                        </span>
                      </td>

                      {/* Title & Location */}
                      <td style={{ maxWidth: 220 }}>
                        <div style={{ fontWeight: 600, color: 'var(--navy-900)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.title}
                        </div>
                        {c.location && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            📍 {c.location}
                          </div>
                        )}
                      </td>

                      {/* Category */}
                      <td>
                        <span style={{ background: 'var(--gray-100)', padding: '3px 8px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 500 }}>
                          {c.category}
                        </span>
                      </td>

                      {/* Citizen Email & Date */}
                      <td>
                        <div style={{ fontSize: '0.82rem', color: 'var(--gray-700)', fontWeight: 500 }}>
                          {c.submittedBy}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                          {c.submittedDate}
                        </div>
                      </td>

                      {/* Department */}
                      <td>
                        <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--navy-800)' }}>
                          {c.department}
                        </span>
                      </td>

                      {/* Priority */}
                      <td>
                        <PriorityBadge priority={c.priority} />
                      </td>

                      {/* Quick Status Dropdown (Change status right in table) */}
                      <td>
                        <select
                          value={c.status}
                          onChange={(e) => handleQuickStatusChange(c.id, e.target.value)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: 8,
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            border: '1.5px solid var(--gray-200)',
                            background:
                              c.status === 'resolved'    ? '#D1FAE5' :
                              c.status === 'in-progress' ? '#DBEAFE' :
                              c.status === 'rejected'    ? '#FEE2E2' : '#FEF3C7',
                            color:
                              c.status === 'resolved'    ? '#065F46' :
                              c.status === 'in-progress' ? '#1E40AF' :
                              c.status === 'rejected'    ? '#991B1B' : '#92400E',
                            cursor: 'pointer',
                            outline: 'none',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <option value="pending">⏳ Pending</option>
                          <option value="in-progress">⚙️ In Progress</option>
                          <option value="resolved">✅ Resolved</option>
                          <option value="rejected">❌ Rejected</option>
                        </select>
                      </td>

                      {/* Full Manage Modal Trigger */}
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelectedComplaint(c)}
                          className="btn btn-outline"
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.78rem',
                            borderRadius: 8,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5
                          }}
                        >
                          <Edit3 size={13} />
                          <span>Manage</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Admin Complaint Update Modal */}
      <AdminComplaintModal
        isOpen={Boolean(selectedComplaint)}
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        onSave={handleSaveModal}
      />
    </DashboardLayout>
  );
}
