import React, { useState, useEffect } from 'react';
import {
  X, Shield, CheckCircle2, Clock, Loader, AlertTriangle,
  Building2, UserCheck, Flag, MessageSquare, MapPin, Calendar, Mail, FileText
} from 'lucide-react';
import { StatusBadge, PriorityBadge, ComplaintTimeline } from '../ui/UIComponents';
import { departments } from '../../data/mockData';

export default function AdminComplaintModal({ isOpen, complaint, onClose, onSave }) {
  if (!isOpen || !complaint) return null;

  const [status, setStatus] = useState(complaint.status || 'pending');
  const [department, setDepartment] = useState(complaint.department || 'Roads & Infrastructure');
  const [assignedOfficer, setAssignedOfficer] = useState(complaint.assignedOfficer || '');
  const [priority, setPriority] = useState(complaint.priority || 'medium');
  const [note, setNote] = useState(complaint.adminRemarks || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (complaint) {
      setStatus(complaint.status || 'pending');
      setDepartment(complaint.department || 'Roads & Infrastructure');
      setAssignedOfficer(complaint.assignedOfficer || '');
      setPriority(complaint.priority || 'medium');
      setNote(complaint.adminRemarks || '');
    }
  }, [complaint]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 350));

    onSave(complaint.id, {
      status,
      department,
      assignedOfficer: assignedOfficer.trim() || null,
      priority,
      note: note.trim()
    });

    setIsSaving(false);
    onClose();
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending Review', icon: Clock, color: '#F59E0B', bg: '#FEF3C7' },
    { value: 'in-progress', label: 'In Progress', icon: Loader, color: '#3B82F6', bg: '#DBEAFE' },
    { value: 'resolved', label: 'Resolved', icon: CheckCircle2, color: '#10B981', bg: '#D1FAE5' },
    { value: 'rejected', label: 'Rejected', icon: AlertTriangle, color: '#EF4444', bg: '#FEE2E2' },
  ];

  return (
    <div className="civic-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="civic-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 680, padding: '28px 32px' }}
      >
        {/* Modal Top Bar */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #0EA5E9, #1D4ED8)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(14,165,233,0.35)',
              flexShrink: 0
            }}>
              <Shield size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--sky-600)', fontSize: '0.95rem' }}>
                  {complaint.id}
                </span>
                <StatusBadge status={complaint.status} />
                <PriorityBadge priority={complaint.priority} />
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--navy-900)', marginTop: 2, marginBottom: 0 }}>
                {complaint.title}
              </h3>
            </div>
          </div>

          <button className="civic-modal-close" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        {/* Complaint Info Snippet */}
        <div style={{
          background: 'var(--gray-50)',
          border: '1px solid var(--gray-200)',
          borderRadius: 12,
          padding: '14px 16px',
          marginBottom: 24,
          fontSize: '0.84rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gray-600)' }}>
            <Mail size={15} color="var(--sky-500)" />
            <span>Citizen: <strong style={{ color: 'var(--navy-900)' }}>{complaint.submittedBy}</strong></span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gray-600)' }}>
            <Calendar size={15} color="var(--sky-500)" />
            <span>Date: <strong style={{ color: 'var(--navy-900)' }}>{complaint.submittedDate}</strong></span>
          </div>
          {complaint.location && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--gray-600)', gridColumn: '1 / -1' }}>
              <MapPin size={15} color="var(--sky-500)" />
              <span>Location: <strong style={{ color: 'var(--navy-900)' }}>{complaint.location}</strong></span>
            </div>
          )}
          {complaint.description && (
            <div style={{ gridColumn: '1 / -1', marginTop: 4, color: 'var(--gray-700)', lineHeight: 1.5 }}>
              <span style={{ fontWeight: 600, color: 'var(--gray-500)', display: 'block', marginBottom: 2 }}>Description:</span>
              {complaint.description}
            </div>
          )}
        </div>

        {/* Status Update Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: 'var(--navy-900)', marginBottom: 10 }}>
              Update Grievance Status
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
              {statusOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = status === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '12px 8px',
                      borderRadius: 12,
                      border: isSelected ? `2px solid ${opt.color}` : '1.5px solid var(--gray-200)',
                      background: isSelected ? opt.bg : 'var(--white)',
                      color: isSelected ? opt.color : 'var(--gray-600)',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? `0 4px 12px ${opt.color}25` : 'none',
                    }}
                  >
                    <Icon size={18} color={isSelected ? opt.color : 'var(--gray-400)'} />
                    <span style={{ fontSize: '0.78rem' }}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 18 }}>
            {/* Department Assignment */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Building2 size={15} color="var(--sky-500)" />
                <span>Assigned Department</span>
              </label>
              <select
                className="form-control"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                style={{ width: '100%', height: 44, borderRadius: 10 }}
              >
                {departments.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
                <option value="General Services">General Services</option>
              </select>
            </div>

            {/* Priority Level */}
            <div className="form-group" style={{ margin: 0 }}>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Flag size={15} color="var(--sky-500)" />
                <span>Priority Level</span>
              </label>
              <select
                className="form-control"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                style={{ width: '100%', height: 44, borderRadius: 10 }}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Assigned Officer */}
          <div className="form-group" style={{ marginBottom: 18 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <UserCheck size={15} color="var(--sky-500)" />
              <span>Assigned Field Officer (Optional)</span>
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Officer Rajesh Kumar, PWD Inspector"
              value={assignedOfficer}
              onChange={(e) => setAssignedOfficer(e.target.value)}
              style={{ width: '100%', height: 44, borderRadius: 10 }}
            />
          </div>

          {/* Admin Resolution Note */}
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <MessageSquare size={15} color="var(--sky-500)" />
              <span>Administrative Action Remarks / Citizen Note</span>
            </label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Explain the actions taken or reason for status update (visible on citizen tracking timeline)..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{ width: '100%', borderRadius: 10, padding: 12 }}
            />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              style={{ padding: '10px 20px', borderRadius: 10 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSaving}
              style={{ padding: '10px 24px', borderRadius: 10 }}
            >
              {isSaving ? (
                <>
                  <span className="civic-spinner" />
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Save Status Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
