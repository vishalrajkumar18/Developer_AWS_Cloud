import React from 'react';

export function StatusBadge({ status }) {
  const map = {
    pending:     { cls: 'badge-pending',  label: 'Pending' },
    'in-progress':{ cls: 'badge-progress', label: 'In Progress' },
    resolved:    { cls: 'badge-resolved', label: 'Resolved' },
    rejected:    { cls: 'badge-rejected', label: 'Rejected' },
  };
  const { cls, label } = map[status] || { cls: 'badge-pending', label: status };
  return <span className={`badge ${cls}`}>{label}</span>;
}

export function PriorityBadge({ priority }) {
  const styles = {
    urgent: { bg: '#FEE2E2', color: '#991B1B' },
    high:   { bg: '#FEF3C7', color: '#92400E' },
    medium: { bg: '#DBEAFE', color: '#1D4ED8' },
    low:    { bg: '#F3F4F6', color: '#374151' },
  };
  const s = styles[priority] || styles.medium;
  return (
    <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>
      {priority}
    </span>
  );
}

export function StatCard({ icon: Icon, iconBg, iconColor, label, value, trend }) {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: iconBg }}>
        <Icon size={26} color={iconColor} />
      </div>
      <div className="stat-info">
        <h3>{typeof value === 'number' ? value.toLocaleString() : value}</h3>
        <p>{label}</p>
        {trend && <span style={{ fontSize: '0.75rem', color: trend > 0 ? '#10B981' : '#EF4444', fontWeight: 600 }}>
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}% this month
        </span>}
      </div>
    </div>
  );
}

export function ComplaintTimeline({ timeline }) {
  return (
    <div className="timeline">
      {timeline.map((item, i) => (
        <div key={i} className="timeline-item">
          <div className={`timeline-dot ${item.done ? (i === timeline.filter(t=>t.done).length - 1 && !timeline[i+1]?.done ? 'active' : 'done') : 'pending'}`} />
          <div className="timeline-content">
            <h4>{item.stage}</h4>
            {item.date && <p style={{ color: 'var(--sky-500)', fontWeight: 500 }}>{item.date}</p>}
            {item.note && <p>{item.note}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--gray-500)' }}>
      <div style={{ marginBottom: 16, opacity: 0.4 }}><Icon size={56} /></div>
      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--gray-700)', marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: '0.875rem', marginBottom: 24 }}>{description}</p>
      {action}
    </div>
  );
}
