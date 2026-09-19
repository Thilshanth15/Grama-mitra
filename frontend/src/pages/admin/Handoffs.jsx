import React, { useEffect, useState } from 'react';
import { Clock, CheckCircle, AlertTriangle, Users, RefreshCw } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { getHandoffs, updateHandoffStatus } from '../../services/firebase.js';

const PRIORITY_COLORS = { Emergency: 'badge-red', High: 'badge-amber', Normal: 'badge-blue' };
const STATUS_TABS = ['Pending', 'Assigned', 'In Progress', 'Resolved'];

export default function Handoffs() {
  const [handoffs, setHandoffs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Pending');

  useEffect(() => { load(); }, []);

  const load = () => {
    setLoading(true);
    getHandoffs().then(h => { setHandoffs(h); setLoading(false); });
  };

  const handleStatusChange = async (id, newStatus) => {
    await updateHandoffStatus(id, newStatus);
    setHandoffs(prev => prev.map(h => h.id === id ? { ...h, status: newStatus } : h));
  };

  const displayed = handoffs.filter(h => h.status === activeTab);

  const countFor = (tab) => handoffs.filter(h => h.status === tab).length;

  return (
    <AdminLayout title="Handoff Requests">
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '1.25rem', background: 'var(--color-surface)', padding: '0.375rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', width: 'fit-content' }}>
        {STATUS_TABS.map(tab => {
          const cnt = countFor(tab);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.5rem 1rem', borderRadius: 'var(--radius-lg)',
                background: activeTab === tab ? 'var(--green-600)' : 'transparent',
                color: activeTab === tab ? '#fff' : 'var(--gray-500)',
                fontWeight: activeTab === tab ? 600 : 400,
                fontSize: '0.875rem', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.375rem',
              }}
            >
              {tab}
              {cnt > 0 && (
                <span style={{
                  background: activeTab === tab ? 'rgba(255,255,255,0.25)' : 'var(--gray-200)',
                  color: activeTab === tab ? '#fff' : 'var(--gray-600)',
                  borderRadius: 'var(--radius-full)', fontSize: '0.7rem', padding: '0 0.375rem', fontWeight: 700, lineHeight: '1.4rem',
                }}>
                  {cnt}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginBottom: '0.75rem' }}>
        <button className="btn btn-sm btn-ghost" onClick={load}>
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 90, borderRadius: 'var(--radius-xl)' }} />)}
        </div>
      ) : displayed.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><CheckCircle size={28} /></div>
          <div className="font-semibold" style={{ color: 'var(--gray-600)' }}>No {activeTab.toLowerCase()} handoffs</div>
          <div className="text-sm">Use the voice assistant to generate escalations.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {displayed.map((h, i) => (
            <div key={i} className="card" style={{
              borderLeft: `4px solid ${h.priority === 'Emergency' ? 'var(--red-500)' : h.priority === 'High' ? 'var(--amber-500)' : 'var(--blue-400)'}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${PRIORITY_COLORS[h.priority] || 'badge-gray'}`}>
                      {h.priority === 'Emergency' && '🚨 '}{h.priority}
                    </span>
                    <span className="badge badge-gray">{h.category?.replace('_', ' ')}</span>
                    <span className="badge badge-gray">{h.channel || 'Website'}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-tamil)', fontSize: '0.9375rem', color: 'var(--gray-900)', marginBottom: '0.375rem' }}>
                    {h.query}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                    Reason: {h.reason}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--gray-400)', marginTop: '0.375rem', display: 'flex', gap: '0.75rem' }}>
                    <span>ID: {h.id}</span>
                    <span>{h.createdAt ? new Date(h.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end', flexShrink: 0 }}>
                  {activeTab === 'Pending' && (
                    <>
                      <button className="btn btn-sm btn-primary" onClick={() => handleStatusChange(h.id, 'Assigned')}>
                        <Users size={13} /> Assign
                      </button>
                      <button className="btn btn-sm btn-ghost" onClick={() => handleStatusChange(h.id, 'Resolved')} style={{ fontSize: '0.8rem' }}>
                        Mark Resolved
                      </button>
                    </>
                  )}
                  {activeTab === 'Assigned' && (
                    <button className="btn btn-sm btn-secondary" onClick={() => handleStatusChange(h.id, 'In Progress')}>
                      Start Work
                    </button>
                  )}
                  {activeTab === 'In Progress' && (
                    <button className="btn btn-sm" style={{ background: 'var(--green-600)', color: '#fff', borderColor: 'var(--green-600)' }} onClick={() => handleStatusChange(h.id, 'Resolved')}>
                      <CheckCircle size={13} /> Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
