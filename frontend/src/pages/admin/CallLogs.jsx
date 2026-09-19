import React, { useEffect, useState } from 'react';
import { Phone, RefreshCw } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { getCallLogs } from '../../services/firebase.js';

export default function CallLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCallLogs().then(l => { setLogs(l); setLoading(false); });
  }, []);

  return (
    <AdminLayout title="Call Logs">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div className="badge badge-green" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
          ⚡ IVR Voice & Telephony Helpline Registry
        </div>
        <button className="btn btn-sm btn-ghost" onClick={() => { setLoading(true); getCallLogs().then(l => { setLogs(l); setLoading(false); }); }}>
          <RefreshCw size={14} /> Refresh
        </button>
        <span className="text-sm" style={{ color: 'var(--gray-500)', marginLeft: 'auto' }}>{logs.length} call records</span>
      </div>

      <div style={{ marginBottom: '1rem', padding: '0.875rem 1rem', background: 'var(--blue-50)', border: '1px solid var(--blue-100)', borderRadius: 'var(--radius-xl)', fontSize: '0.8125rem', color: 'var(--blue-700)' }}>
        <strong>Telephony Engine Status:</strong> Real-time registry of incoming IVR calls, Speech-to-Text transcriptions, and Grama Mitra automated voice responses.
      </div>

      <div className="table-wrapper">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }} /></div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Call ID</th>
                <th>Channel</th>
                <th>Date/Time</th>
                <th>Duration</th>
                <th>Category</th>
                <th>Status</th>
                <th>Handoff</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={i}>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--gray-500)', fontFamily: 'monospace' }}>{log.id}</td>
                  <td>
                    <span className={`badge ${log.channel === 'Website' ? 'badge-green' : log.channel === 'WhatsApp' ? 'badge-green' : 'badge-amber'}`}>
                      {log.channel}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.8125rem', color: 'var(--gray-600)', whiteSpace: 'nowrap' }}>
                    {new Date(log.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td style={{ fontSize: '0.875rem', color: 'var(--gray-700)' }}>{log.duration}</td>
                  <td>
                    <span className={`badge ${log.category === 'AGRICULTURE' ? 'badge-green' : log.category === 'HEALTH' ? 'badge-red' : 'badge-blue'}`}>
                      {log.category}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${log.status === 'Completed' ? 'badge-green' : 'badge-red'}`}>
                      {log.status}
                    </span>
                  </td>
                  <td>
                    {log.handoff ? <span className="badge badge-amber">Yes</span> : <span style={{ color: 'var(--gray-400)', fontSize: '0.875rem' }}>—</span>}
                  </td>
                  <td>
                    {log.simulated && <div className="sim-badge">Simulated</div>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
