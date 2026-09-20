import React, { useEffect, useState } from 'react';
import {
  MessageSquare, Users, Shield, TrendingUp, BarChart2,
  Phone, Leaf, Building2, Heart, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { getAnalytics, getQueries, getHandoffs, getSafetyAlerts } from '../../services/firebase.js';

const COLORS = {
  AGRICULTURE: '#16a34a',
  GOVERNMENT_SCHEME: '#2563eb',
  HEALTH: '#e11d48',
  GENERAL: '#6b7280',
  EMERGENCY: '#dc2626',
};

const CHANNEL_COLORS = { Website: '#16a34a', WhatsApp: '#25D366', IVR: '#f59e0b' };

export default function AdminOverview() {
  const [analytics, setAnalytics] = useState(null);
  const [recentQueries, setRecentQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [a, q] = await Promise.all([getAnalytics(), getQueries(5)]);
      setAnalytics(a);
      setRecentQueries(q);
      setLoading(false);
    }
    load();
  }, []);

  const stats = analytics ? [
    { icon: MessageSquare, color: 'var(--green-600)', bg: 'var(--green-50)', label: 'Total Queries', value: analytics.totalQueries, change: `+${analytics.todayQueries} today`, up: true },
    { icon: Activity, color: 'var(--blue-600)', bg: 'var(--blue-50)', label: "Today's Queries", value: analytics.todayQueries, change: 'Live', up: true },
    { icon: Users, color: 'var(--amber-600)', bg: 'var(--amber-50)', label: 'Pending Handoffs', value: analytics.pendingHandoffs, change: analytics.pendingHandoffs > 0 ? 'Needs attention' : 'All clear', up: false },
    { icon: Shield, color: '#e11d48', bg: '#fff1f2', label: 'Health Alerts', value: analytics.healthAlerts, change: analytics.healthAlerts > 0 ? 'Review required' : 'No active alerts', up: false },
  ] : [];

  return (
    <AdminLayout title="Dashboard Overview">
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 110, borderRadius: 'var(--radius-xl)' }} />
          ))}
        </div>
      ) : (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {stats.map((s, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon" style={{ background: s.bg }}>
                  <s.icon size={22} color={s.color} />
                </div>
                <div>
                  <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                  <div className={`stat-change ${s.up && s.value > 0 ? 'up' : 'down'}`}>{s.change}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="overview-grid-2-1">
            {/* Query Trend */}
            <div className="chart-container">
              <div className="font-semibold" style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>
                Query Trend (Last 7 Days)
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analytics.queryTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--gray-500)' }} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--gray-500)' }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="queries" fill="var(--green-500)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Distribution */}
            <div className="chart-container">
              <div className="font-semibold" style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>
                Category Distribution
              </div>
              {analytics.categoryDistribution.every(c => c.value === 0) ? (
                <div className="empty-state">
                  <div className="text-sm">No queries yet</div>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={analytics.categoryDistribution.filter(c => c.value > 0)} cx="50%" cy="50%" outerRadius={65} dataKey="value">
                        {analytics.categoryDistribution.map((entry, index) => (
                          <Cell key={index} fill={COLORS[entry.name] || '#9ca3af'} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', marginTop: '0.5rem' }}>
                    {analytics.categoryDistribution.filter(c => c.value > 0).map((cat, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem' }}>
                        <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[cat.name] || '#9ca3af' }} />
                        <span style={{ color: 'var(--gray-600)' }}>{cat.name.replace('_', ' ')}: {cat.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Channel + Recent */}
          <div className="overview-grid-1-2">
            {/* Channel distribution */}
            <div className="chart-container">
              <div className="font-semibold" style={{ marginBottom: '1rem', color: 'var(--gray-900)' }}>Channel Usage</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {analytics.channelDistribution.map((ch, i) => {
                  const total = analytics.totalQueries || 1;
                  const pct = Math.round((ch.value / total) * 100);
                  return (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span className="text-sm font-medium" style={{ color: 'var(--gray-700)' }}>{ch.name}</span>
                        <span className="text-sm" style={{ color: 'var(--gray-500)' }}>{ch.value} ({pct}%)</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: CHANNEL_COLORS[ch.name] || 'var(--green-500)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border)', fontSize: '0.8125rem', color: 'var(--gray-500)' }}>
                Handoff rate: <strong style={{ color: 'var(--amber-600)' }}>{analytics.handoffRate}%</strong>
              </div>
            </div>

            {/* Recent queries */}
            <div className="chart-container">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div className="font-semibold" style={{ color: 'var(--gray-900)' }}>Recent Queries</div>
                <a href="/admin/queries" className="text-sm" style={{ color: 'var(--green-600)', fontWeight: 600 }}>View all</a>
              </div>
              {recentQueries.length === 0 ? (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <div className="text-sm">No queries yet. Try the assistant!</div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {recentQueries.map((q, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.75rem', background: 'var(--gray-50)', borderRadius: 'var(--radius-lg)' }}>
                      <div className="status-dot" style={{ marginTop: 6, background: COLORS[q.category] || '#9ca3af' }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--gray-800)', fontFamily: 'var(--font-tamil)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {q.message}
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', alignItems: 'center' }}>
                          <span className={`badge ${q.category === 'EMERGENCY' ? 'badge-red' : q.category === 'HEALTH' ? 'badge-red' : q.category === 'AGRICULTURE' ? 'badge-green' : 'badge-blue'}`} style={{ fontSize: '0.65rem' }}>
                            {q.category}
                          </span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>{q.channel}</span>
                          <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                            {new Date(q.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <span className={`badge ${q.status === 'Resolved' ? 'badge-green' : q.status === 'Escalated' ? 'badge-red' : 'badge-amber'}`} style={{ fontSize: '0.65rem', flexShrink: 0 }}>
                        {q.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}
