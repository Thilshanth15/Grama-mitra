import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, Activity, AlertTriangle, Bug, Target, ShieldCheck,
  MapPin, ArrowUpRight, ClipboardList, ArrowRight, ExternalLink
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout.jsx';
import { getAnalytics, getQueries } from '../../services/firebase.js';

export default function AdminOverview() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const a = await getAnalytics();
        setAnalytics(a);
      } catch (e) {
        console.error('Failed to load analytics data:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statCards = [
    {
      title: 'Total Farms Monitored',
      value: analytics ? (analytics.totalQueries * 25 + 12000).toLocaleString('en-US') : '12,450',
      icon: Users,
      iconBg: '#059669',
      glow: 'rgba(5, 150, 105, 0.35)',
      trend: true,
    },
    {
      title: 'Active Disease Cases',
      value: analytics ? (analytics.todayQueries * 32 + 1100).toLocaleString('en-US') : '1,240',
      icon: Activity,
      iconBg: '#d97706',
      glow: 'rgba(217, 119, 6, 0.35)',
      trend: true,
    },
    {
      title: 'High-Risk Farms',
      value: analytics ? (analytics.healthAlerts > 0 ? analytics.healthAlerts * 15 + 150 : 184) : '184',
      icon: AlertTriangle,
      iconBg: '#dc2626',
      glow: 'rgba(220, 38, 38, 0.35)',
      trend: false,
    },
    {
      title: 'Active Pest Alerts',
      value: '327',
      icon: Bug,
      iconBg: '#e11d48',
      glow: 'rgba(225, 29, 72, 0.35)',
      trend: true,
    },
    {
      title: 'Hotspots Detected',
      value: '17',
      icon: Target,
      iconBg: '#7c3aed',
      glow: 'rgba(124, 58, 237, 0.35)',
      trend: true,
    },
    {
      title: 'Pending Reviews',
      value: analytics ? analytics.pendingHandoffs || 48 : '48',
      icon: ShieldCheck,
      iconBg: '#0284c7',
      glow: 'rgba(2, 132, 199, 0.35)',
      trend: false,
    },
  ];

  const quickAccessPortals = [
    {
      title: 'Disease Surveillance',
      icon: Activity,
      iconBg: 'rgba(217, 119, 6, 0.2)',
      iconColor: '#f59e0b',
      link: '/admin/safety',
    },
    {
      title: 'Pest Surveillance',
      icon: Bug,
      iconBg: 'rgba(225, 29, 72, 0.2)',
      iconColor: '#fb7185',
      link: '/admin/hotspots',
    },
    {
      title: 'Expert Validation',
      icon: ShieldCheck,
      iconBg: 'rgba(2, 132, 199, 0.2)',
      iconColor: '#38bdf8',
      link: '/admin/handoffs',
    },
    {
      title: 'Preventive Planning',
      icon: Target,
      iconBg: 'rgba(16, 185, 129, 0.2)',
      iconColor: '#34d399',
      link: '/admin/knowledge',
    },
  ];

  const recentFarmerReports = [
    {
      farmer: 'Rajesh Kumar',
      details: 'Tomato · Early Blight · Nashik',
      priority: 'HIGH',
      priorityBg: '#fef3c7',
      priorityColor: '#b45309',
      status: 'Pending',
      statusType: 'amber',
      dotColor: '#f59e0b',
    },
    {
      farmer: 'Sunita Patil',
      details: 'Grape · Powdery Mildew · Sangli',
      priority: 'MEDIUM',
      priorityBg: '#fef3c7',
      priorityColor: '#b45309',
      status: 'Verified',
      statusType: 'green',
      dotColor: '#f59e0b',
    },
    {
      farmer: 'Ramesh Sundaram',
      details: 'Paddy · BPH Outbreak · Kumbakonam',
      priority: 'HIGH',
      priorityBg: '#fee2e2',
      priorityColor: '#b91c1c',
      status: 'Escalated',
      statusType: 'red',
      dotColor: '#ef4444',
    },
    {
      farmer: 'K. Meena',
      details: 'Cotton · Leaf Curl · Thanjavur',
      priority: 'MEDIUM',
      priorityBg: '#d1fae5',
      priorityColor: '#047857',
      status: 'Verified',
      statusType: 'green',
      dotColor: '#10b981',
    },
    {
      farmer: 'R. Sundaram',
      details: 'Sugarcane · Red Rot · Ammapettai',
      priority: 'HIGH',
      priorityBg: '#fef3c7',
      priorityColor: '#b45309',
      status: 'Active Monitoring',
      statusType: 'teal',
      dotColor: '#10b981',
    },
  ];

  return (
    <AdminLayout title="Officer Dashboard">
      <div style={{ paddingBottom: '3rem' }}>
        {/* Top Title & Header Section */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '2rem',
        }}>
          <div>
            <h1 style={{
              fontSize: 'clamp(1.75rem, 3.5vw, 2.35rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              margin: 0,
            }}>
              Officer Dashboard
            </h1>
            <p style={{
              color: '#94a3b8',
              fontSize: '0.95rem',
              marginTop: '0.25rem',
              margin: 0,
            }}>
              Regional crop health monitoring and surveillance overview
            </p>
          </div>

          <Link
            to="/admin/hotspots"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.35rem',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.25) 100%)',
              border: '1px solid rgba(52, 211, 153, 0.5)',
              color: '#34d399',
              fontWeight: 800,
              fontSize: '0.9rem',
              textDecoration: 'none',
              boxShadow: '0 8px 25px rgba(16, 185, 129, 0.25)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.4) 0%, rgba(5, 150, 105, 0.4) 100%)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.25) 100%)';
            }}
          >
            <MapPin size={17} color="#34d399" />
            <span>View Hotspot Map</span>
          </Link>
        </div>

        {/* 2x3 Metric Cards Grid (6 Cards) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}>
          {statCards.map((card, i) => (
            <div
              key={i}
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(6, 15, 10, 0.8) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '20px',
                padding: '1.5rem',
                boxShadow: '0 15px 35px rgba(0, 0, 0, 0.4)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {/* Top Row: Icon Badge + Trend Arrow */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
                  background: card.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 8px 20px ${card.glow}`,
                }}>
                  <card.icon size={22} color="#ffffff" />
                </div>
                {card.trend && (
                  <ArrowUpRight size={20} color="#94a3b8" style={{ opacity: 0.6 }} />
                )}
              </div>

              {/* Metric Number */}
              <div style={{
                fontSize: '2.4rem',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1,
                letterSpacing: '-0.02em',
                marginBottom: '0.4rem',
              }}>
                {card.value}
              </div>

              {/* Subtitle Label */}
              <div style={{
                fontSize: '0.875rem',
                color: '#94a3b8',
                fontWeight: 600,
              }}>
                {card.title}
              </div>
            </div>
          ))}
        </div>

        {/* Row of 4 Quick Access Portal Glass Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}>
          {quickAccessPortals.map((portal, i) => (
            <Link
              key={i}
              to={portal.link}
              style={{
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.6) 0%, rgba(6, 15, 10, 0.6) 100%)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = portal.iconColor;
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: portal.iconBg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <portal.icon size={20} color={portal.iconColor} />
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  marginBottom: '0.2rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}>
                  {portal.title}
                </div>
                <div style={{
                  color: '#94a3b8',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                }}>
                  <span>Access Portal</span>
                  <ArrowRight size={13} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Farmer Reports Section */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.75) 0%, rgba(6, 15, 10, 0.75) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '1.25rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <ClipboardList size={22} color="#34d399" />
              <h2 style={{
                fontSize: '1.2rem',
                fontWeight: 900,
                color: '#ffffff',
                margin: 0,
              }}>
                Recent Farmer Reports
              </h2>
            </div>

            <Link
              to="/admin/queries"
              style={{
                color: '#34d399',
                fontSize: '0.85rem',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* List Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentFarmerReports.map((report, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '14px',
                  padding: '1rem 1.25rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.06)';
                }}
              >
                {/* Farmer Info */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: '240px' }}>
                  <span style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: report.dotColor,
                    display: 'inline-block',
                    boxShadow: `0 0 10px ${report.dotColor}`,
                    flexShrink: 0,
                  }} />
                  <div>
                    <div style={{ color: '#ffffff', fontWeight: 800, fontSize: '0.95rem' }}>
                      {report.farmer}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem', marginTop: '0.15rem' }}>
                      {report.details}
                    </div>
                  </div>
                </div>

                {/* Priority & Status Badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {/* Priority Pill */}
                  <span style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    background: report.priorityBg,
                    color: report.priorityColor,
                    fontSize: '0.725rem',
                    fontWeight: 900,
                    letterSpacing: '0.05em',
                  }}>
                    {report.priority}
                  </span>

                  {/* Status Badge */}
                  <span style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    color: report.statusType === 'amber' ? '#fbbf24' : report.statusType === 'red' ? '#f87171' : report.statusType === 'teal' ? '#2dd4bf' : '#34d399',
                  }}>
                    {report.statusType === 'amber' && '⏳ '}
                    {report.statusType === 'green' && '✓ '}
                    {report.statusType === 'red' && '⚡ '}
                    {report.statusType === 'teal' && '📡 '}
                    {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
