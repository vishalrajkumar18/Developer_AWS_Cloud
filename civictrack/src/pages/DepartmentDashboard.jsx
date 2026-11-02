import React, { useState } from 'react';
import { CheckCircle2, Clock, Loader, Upload, AlertCircle, X } from 'lucide-react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { StatCard, StatusBadge, ComplaintTimeline } from '../components/ui/UIComponents';
import { useAuth } from '../context/AuthContext';

export default function DepartmentDashboard() {
  const { user, complaints, updateComplaintStatus } = useAuth();
  const deptComplaints = complaints.filter(c => c.department === user?.department);

  const total      = deptComplaints.length;
  const pending    = deptComplaints.filter(c => c.status === 'pending').length;
  const inProgress = deptComplaints.filter(c => c.status === 'in-progress').length;
  const resolved   = deptComplaints.filter(c => c.status === 'resolved').length;

  const [selected, setSelected] = useState(null);
  const [updateNote, setUpdateNote] = useState('');
  const [evidence, setEvidence] = useState(null);
  const [msg, setMsg] = useState('');

  const handleUpdate = (id, status) => {
    updateComplaintStatus(id, status, updateNote);
    setSelected(null); setUpdateNote(''); setEvidence(null);
    setMsg(`Complaint ${id} updated to "${status}" successfully!`);
    setTimeout(() => setMsg(''), 3500);
  };

  const selectedComplaint = complaints.find(c => c.id === selected);

  return (
    <DashboardLayout title={`${user?.department || 'Department'} Dashboard`}>
      {/* Welcome */}
      <div style={{ background: 'linear-gradient(135deg,#0A1628,#1A3160,#0284C7)', borderRadius: 20, padding: '24px 32px', color: 'white', marginBottom: 28 }}>
        <h2 style={{ fontWeight: 800, fontSize: '1.4rem', marginBottom: 4 }}>Welcome, {user?.name}</h2>
        <p style={{ color: 'rgba(255,255,255,.75)', fontSize: '0.9rem' }}>{user?.department} — Manage assigned complaints and update resolution status.</p>
      </div>

      {msg && <div className="alert alert-success"><CheckCircle2 size={16} />{msg}</div>}

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 28 }}>
        <StatCard icon={AlertCircle}  iconBg="#FEF9C3" iconColor="#CA8A04" label="Total Assigned"  value={total} />
        <StatCard icon={Clock}        iconBg="#FEE2E2" iconColor="#EF4444" label="Pending"          value={pending} />
        <StatCard icon={Loader}       iconBg="#EEF2FF" iconColor="#6366F1" label="In Progress"      value={inProgress} />
        <StatCard icon={CheckCircle2} iconBg="#D1FAE5" iconColor="#10B981" label="Resolved"         value={resolved} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 24 }}>
        {/* Complaints Table */}
        <div className="card">
          <div className="card-header">
            <h3 className="section-title">Assigned Complaints</h3>
            <p className="section-sub">Click a complaint to update its status</p>
          </div>
          <div className="table-wrapper">
            {deptComplaints.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--gray-500)' }}>
                <CheckCircle2 size={40} style={{ margin: '0 auto 12px', opacity: .3 }} />
                <p>No complaints assigned to your department yet.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {deptComplaints.map(c => (
                    <tr key={c.id} style={{ cursor: 'pointer', background: selected === c.id ? 'var(--sky-50)' : '' }}
                      onClick={() => setSelected(selected === c.id ? null : c.id)}>
                      <td><span style={{ fontWeight: 700, color: 'var(--sky-600)', fontSize: '0.8rem', fontFamily: 'monospace' }}>{c.id}</span></td>
                      <td style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{c.title}</td>
                      <td><span style={{ background: 'var(--gray-100)', padding: '3px 8px', borderRadius: 999, fontSize: '0.75rem' }}>{c.category}</span></td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>{c.submittedDate}</td>
                      <td><StatusBadge status={c.status} /></td>
                      <td onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', gap: 6 }}>
                          {c.status === 'pending' && (
                            <button className="btn btn-outline btn-sm" style={{ fontSize: '0.72rem', padding: '4px 10px' }}
                              onClick={() => handleUpdate(c.id, 'in-progress')}>
                              <Loader size={12} /> Start
                            </button>
                          )}
                          {c.status === 'in-progress' && (
                            <button className="btn btn-primary btn-sm" style={{ fontSize: '0.72rem', padding: '4px 10px', background: 'var(--success)', boxShadow: 'none' }}
                              onClick={() => { setSelected(c.id); }}>
                              <CheckCircle2 size={12} /> Resolve
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Update Panel */}
        {selected && selectedComplaint && (
          <div className="card">
            <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="section-title">Update Status</h3>
                <p className="section-sub" style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--sky-600)' }}>{selectedComplaint.id}</p>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: 'var(--gray-400)' }}><X size={20} /></button>
            </div>
            <div className="card-body">
              <h4 style={{ fontWeight: 700, color: 'var(--navy-900)', marginBottom: 16, fontSize: '0.95rem' }}>{selectedComplaint.title}</h4>

              <ComplaintTimeline timeline={selectedComplaint.timeline} />

              <div className="divider" />

              <div className="form-group">
                <label className="form-label">Resolution Note</label>
                <textarea className="form-control" rows={3} placeholder="Describe the work done or resolution steps taken…"
                  value={updateNote} onChange={e => setUpdateNote(e.target.value)} />
              </div>

              <div className="form-group">
                <label className="form-label">Resolution Evidence (Optional)</label>
                {evidence ? (
                  <div style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', border: '2px solid var(--sky-200)' }}>
                    <img src={evidence} alt="Evidence" style={{ width: '100%', maxHeight: 180, objectFit: 'cover' }} />
                    <button type="button" onClick={() => setEvidence(null)}
                      style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,.6)', color: 'white', borderRadius: '50%', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="upload-area" style={{ padding: 24 }} onClick={() => document.getElementById('evi-upload').click()}>
                    <Upload size={28} style={{ margin: '0 auto 8px', color: 'var(--gray-400)' }} />
                    <p style={{ fontSize: '0.82rem', color: 'var(--gray-500)' }}>Click to upload evidence photo</p>
                    <input id="evi-upload" type="file" accept="image/*" style={{ display: 'none' }}
                      onChange={e => {
                        const f = e.target.files[0];
                        if (f) { const r = new FileReader(); r.onload = ev => setEvidence(ev.target.result); r.readAsDataURL(f); }
                      }} />
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                {selectedComplaint.status === 'pending' && (
                  <button className="btn btn-outline w-full" style={{ justifyContent: 'center' }} onClick={() => handleUpdate(selectedComplaint.id, 'in-progress')}>
                    <Loader size={16} /> Mark In-Progress
                  </button>
                )}
                {selectedComplaint.status !== 'resolved' && (
                  <button className="btn btn-primary w-full" style={{ justifyContent: 'center', background: 'var(--success)', boxShadow: 'none' }}
                    onClick={() => handleUpdate(selectedComplaint.id, 'resolved')}>
                    <CheckCircle2 size={16} /> Mark as Resolved
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
