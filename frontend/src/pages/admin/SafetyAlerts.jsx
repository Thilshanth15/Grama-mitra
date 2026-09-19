import React, { useEffect, useState } from 'react';
import { Shield, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { getSafetyAlerts } from '../../services/firebase.js';

export default function SafetyAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  const load = () => {
    setLoading(true);
    getSafetyAlerts().then(a => { setAlerts(a); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const displayed = filter === 'ALL' ? alerts : alerts.filter(a => a.priority === filter || a.riskType === filter);

  const priorityColors = { Emergency: 'badge-red', High: 'badge-amber', Normal: 'badge-blue' };
  const riskColors = { EMERGENCY: 'rgba(239, 68, 68, 0.12)', HEALTH_QUERY: 'rgba(245, 158, 11, 0.12)' };

  return (
    <AdminLayout title="Health Safety Alerts">
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'Emergency', 'High', 'Normal'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-ghost'}`}>
              {f}
              {f !== 'ALL' && (
                <span style={{ marginLeft: 4 }}>
                  ({alerts.filter(a => a.priority === f).length})
                </span>
              )}
            </button>
          ))}
        </div>
        <button className="btn btn-sm btn-ghost" onClick={load} style={{ marginLeft: 'auto' }}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {[
          { label: 'Total Alerts', val: alerts.length, color: 'var(--gray-600)', bg: 'var(--gray-50)' },
          { label: 'Emergency', val: alerts.filter(a => a.priority === 'Emergency').length, color: 'var(--red-600)', bg: 'var(--red-50)' },
          { label: 'Active', val: alerts.filter(a => a.status === 'Active').length, color: 'var(--amber-600)', bg: 'var(--amber-50)' },
          { label: 'Resolved', val: alerts.filter(a => a.status === 'Resolved').length, color: 'var(--green-600)', bg: 'var(--green-50)' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '0.875rem 1.25rem', background: s.bg, border: `1px solid ${s.bg === 'var(--gray-50)' ? 'var(--color-border)' : 'transparent'}`, borderRadius: 'var(--radius-xl)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.val}</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 'var(--radius-xl)' }} />)}
        </div>
      ) : displayed.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Shield size={28} /></div>
          <div className="font-semibold" style={{ color: 'var(--gray-600)' }}>No safety alerts</div>
          <div className="text-sm">Ask an emergency health question in the assistant to generate a demo alert.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {displayed.map((alert, i) => (
            <div key={i} className="card" style={{
              background: riskColors[alert.riskType] || 'var(--color-surface)',
              borderLeft: `4px solid ${alert.priority === 'Emergency' ? 'var(--red-500)' : alert.priority === 'High' ? 'var(--amber-500)' : 'var(--blue-400)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    {alert.priority === 'Emergency' && <AlertTriangle size={16} color="var(--red-600)" />}
                    <span className={`badge ${priorityColors[alert.priority] || 'badge-gray'}`}>{alert.priority}</span>
                    <span className="badge badge-gray">{alert.riskType?.replace('_', ' ')}</span>
                    <span className="badge" style={{ background: alert.status === 'Active' ? 'var(--red-100)' : 'var(--green-100)', color: alert.status === 'Active' ? 'var(--red-700)' : 'var(--green-700)' }}>
                      {alert.status}
                    </span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-tamil)', fontSize: '0.9375rem', color: 'var(--gray-900)', marginBottom: '0.375rem' }}>
                    {alert.query}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', display: 'flex', gap: '0.75rem' }}>
                    <span>ID: {alert.id}</span>
                    <span>Channel: {alert.channel || 'Website'}</span>
                    <span>{alert.createdAt ? new Date(alert.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</span>
                  </div>
                </div>
                {alert.status === 'Active' && (
                  <button
                    className="btn btn-sm"
                    style={{ background: 'var(--green-600)', color: '#fff', borderColor: 'var(--green-600)', flexShrink: 0 }}
                    onClick={() => {
                      setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, status: 'Resolved' } : a));
                    }}
                  >
                    <CheckCircle size={13} /> Resolve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--blue-50)', border: '1px solid var(--blue-200)', borderRadius: 'var(--radius-xl)', fontSize: '0.8125rem', color: 'var(--blue-700)' }}>
        <strong>Safety Protocol:</strong> Emergency alerts are automatically created when users submit queries with emergency keywords (chest pain, breathing difficulty, unconsciousness, etc.). 
        These users receive 108 escalation guidance and their interactions are logged here for human review.
      </div>
    </AdminLayout>
  );
}
