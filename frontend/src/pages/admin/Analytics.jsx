import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { getAnalytics } from '../../services/firebase.js';

const COLORS = ['#16a34a', '#2563eb', '#e11d48', '#6b7280', '#dc2626'];
const CHANNEL_COLORS = { Website: '#16a34a', WhatsApp: '#25D366', IVR: '#f59e0b' };

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics().then(a => { setAnalytics(a); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <AdminLayout title="Analytics">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 280, borderRadius: 'var(--radius-xl)' }} />)}
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Analytics">
      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Queries', val: analytics.totalQueries, color: 'var(--green-600)' },
          { label: "Today's Queries", val: analytics.todayQueries, color: 'var(--blue-600)' },
          { label: 'Pending Handoffs', val: analytics.pendingHandoffs, color: 'var(--amber-600)' },
          { label: 'Health Alerts', val: analytics.healthAlerts, color: '#e11d48' },
          { label: 'Handoff Rate', val: `${analytics.handoffRate}%`, color: 'var(--gray-600)' },
        ].map((s, i) => (
          <div key={i} style={{ padding: '1.25rem 1.5rem', background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.val}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--gray-500)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1rem' }}>
        {/* Query trend */}
        <div className="chart-container">
          <div className="font-semibold" style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Query Trend (Last 7 Days)</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics.queryTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--gray-500)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--gray-500)' }} allowDecimals={false} />
              <Tooltip formatter={(v) => [v, 'Queries']} />
              <Bar dataKey="queries" fill="var(--green-500)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category distribution */}
        <div className="chart-container">
          <div className="font-semibold" style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Category Breakdown</div>
          {analytics.categoryDistribution.every(c => c.value === 0) ? (
            <div className="empty-state" style={{ height: 200 }}>
              <div className="text-sm">No query data yet. Use the voice assistant!</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={analytics.categoryDistribution.filter(c => c.value > 0)}
                  cx="50%" cy="50%"
                  outerRadius={85}
                  dataKey="value"
                  label={({ name, value }) => `${name.replace('_', ' ')}: ${value}`}
                  labelLine={false}
                >
                  {analytics.categoryDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Channel distribution */}
        <div className="chart-container">
          <div className="font-semibold" style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Channel Distribution</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={analytics.channelDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
              <XAxis type="number" tick={{ fontSize: 12, fill: 'var(--gray-500)' }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'var(--gray-600)' }} width={70} />
              <Tooltip />
              <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                {analytics.channelDistribution.map((entry, i) => (
                  <Cell key={i} fill={CHANNEL_COLORS[entry.name] || '#6b7280'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Cumulative queries */}
        <div className="chart-container">
          <div className="font-semibold" style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Cumulative Queries (7 Days)</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={analytics.queryTrend.map((d, i, arr) => ({
              ...d,
              cumulative: arr.slice(0, i + 1).reduce((sum, x) => sum + x.queries, 0),
            }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--gray-500)' }} />
              <YAxis tick={{ fontSize: 12, fill: 'var(--gray-500)' }} allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="cumulative" stroke="var(--blue-500)" strokeWidth={2} dot={{ fill: 'var(--blue-500)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </AdminLayout>
  );
}
