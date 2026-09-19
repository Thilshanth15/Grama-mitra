import React, { useEffect, useState } from 'react';
import { Search, Filter, Eye, X, ChevronDown } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { getQueries } from '../../services/firebase.js';

const CATEGORY_COLORS = {
  AGRICULTURE: 'badge-green',
  GOVERNMENT_SCHEME: 'badge-blue',
  HEALTH: 'badge-red',
  GENERAL: 'badge-gray',
  EMERGENCY: 'badge-red',
  UNKNOWN: 'badge-gray',
};

const STATUS_COLORS = {
  Resolved: 'badge-green',
  Pending: 'badge-amber',
  Escalated: 'badge-red',
};

export default function UserQueries() {
  const [queries, setQueries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getQueries(100).then(q => {
      setQueries(q);
      setFiltered(q);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    let result = queries;
    if (search) result = result.filter(q => q.message?.toLowerCase().includes(search.toLowerCase()) || q.category?.includes(search.toUpperCase()));
    if (catFilter !== 'ALL') result = result.filter(q => q.category === catFilter);
    if (statusFilter !== 'ALL') result = result.filter(q => q.status === statusFilter);
    setFiltered(result);
  }, [search, catFilter, statusFilter, queries]);

  return (
    <AdminLayout title="User Queries">
      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)',
          padding: '0.5rem 0.875rem', flex: 1, minWidth: 200,
        }}>
          <Search size={15} color="var(--gray-400)" />
          <input
            placeholder="Search queries…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ border: 'none', outline: 'none', width: '100%', fontSize: '0.875rem', color: 'var(--color-text)', background: 'transparent' }}
          />
        </div>

        <select
          className="form-input form-select"
          style={{ width: 160 }}
          value={catFilter}
          onChange={e => setCatFilter(e.target.value)}
        >
          <option value="ALL">All Categories</option>
          <option value="AGRICULTURE">Agriculture</option>
          <option value="GOVERNMENT_SCHEME">Government</option>
          <option value="HEALTH">Health</option>
          <option value="EMERGENCY">Emergency</option>
          <option value="GENERAL">General</option>
        </select>

        <select
          className="form-input form-select"
          style={{ width: 140 }}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="Resolved">Resolved</option>
          <option value="Pending">Pending</option>
          <option value="Escalated">Escalated</option>
        </select>

        <div style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', whiteSpace: 'nowrap' }}>
          {filtered.length} queries
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <div className="spinner" style={{ margin: '0 auto' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon"><Search size={28} /></div>
            <p className="font-semibold" style={{ color: 'var(--gray-600)' }}>No queries found</p>
            <p className="text-sm">Submit queries via the Voice Assistant to see real-time updates.</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Query</th>
                <th>Category</th>
                <th>Channel</th>
                <th>Confidence</th>
                <th>Status</th>
                <th>Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q, i) => (
                <tr key={i}>
                  <td style={{ maxWidth: 300 }}>
                    <div style={{ fontFamily: 'var(--font-tamil)', fontSize: '0.875rem', color: 'var(--gray-800)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {q.message}
                    </div>
                    {q.safetyFlag && (
                      <span className="badge badge-red" style={{ fontSize: '0.65rem', marginTop: 3 }}>⚠ Safety Flag</span>
                    )}
                  </td>
                  <td><span className={`badge ${CATEGORY_COLORS[q.category] || 'badge-gray'}`}>{q.category?.replace('_', ' ')}</span></td>
                  <td><span style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{q.channel || 'Website'}</span></td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className="progress-fill" style={{
                          width: `${Math.round((q.confidence || 0) * 100)}%`,
                          background: q.confidence >= 0.8 ? 'var(--green-500)' : q.confidence >= 0.6 ? 'var(--amber-500)' : 'var(--red-500)',
                        }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                        {Math.round((q.confidence || 0) * 100)}%
                      </span>
                    </div>
                  </td>
                  <td><span className={`badge ${STATUS_COLORS[q.status] || 'badge-gray'}`}>{q.status}</span></td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                    {q.createdAt ? new Date(q.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-ghost"
                      style={{ padding: '0.375rem 0.625rem' }}
                      onClick={() => setSelected(q)}
                      title="View details"
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Drawer */}
      {selected && (
        <>
          <div className="drawer-overlay" onClick={() => setSelected(null)} />
          <div className="drawer">
            <div className="drawer-header">
              <div>
                <div className="font-bold" style={{ color: 'var(--gray-900)' }}>Query Detail</div>
                <div className="text-xs" style={{ color: 'var(--gray-500)' }}>{selected.id}</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ color: 'var(--gray-400)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>
            <div className="drawer-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {[
                  ['Question', selected.message],
                  ['Category / Intent', `${selected.category} — ${selected.intent || selected.category}`],
                  ['Channel', selected.channel || 'Website'],
                  ['Confidence', `${Math.round((selected.confidence || 0) * 100)}%`],
                  ['Status', selected.status],
                  ['Safety Flag', selected.safetyFlag ? '⚠️ Yes — Emergency detected' : 'None'],
                  ['Timestamp', selected.createdAt ? new Date(selected.createdAt).toLocaleString('en-IN') : '—'],
                ].map(([label, val], i) => (
                  <div key={i}>
                    <div className="text-xs font-semibold" style={{ color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>{label}</div>
                    <div style={{ fontSize: '0.9375rem', color: 'var(--gray-800)', fontFamily: label === 'Question' ? 'var(--font-tamil)' : 'inherit', lineHeight: 1.5 }}>{val}</div>
                  </div>
                ))}

                {selected.response && (
                  <div>
                    <div className="text-xs font-semibold" style={{ color: 'var(--gray-400)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.375rem' }}>AI Response</div>
                    <div style={{
                      background: 'var(--gray-50)', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)', padding: '0.875rem',
                      fontSize: '0.875rem', color: 'var(--gray-700)',
                      fontFamily: 'var(--font-tamil)', lineHeight: 1.7,
                      maxHeight: 200, overflowY: 'auto', whiteSpace: 'pre-wrap',
                    }}>
                      {selected.response}
                    </div>
                  </div>
                )}

                {selected.handoffId && (
                  <div className="highlight-box amber">
                    <div className="font-semibold text-sm">Handoff Created</div>
                    <div className="text-sm" style={{ marginTop: '0.25rem' }}>ID: {selected.handoffId}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
