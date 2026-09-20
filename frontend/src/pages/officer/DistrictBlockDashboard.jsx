import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Building2, Users, AlertTriangle, CheckCircle, Clock, ShieldAlert,
  Search, Filter, RefreshCw, LogOut, ArrowRight, Activity, FileText,
  ChevronRight, MapPin, Award, PhoneCall, Check, X, Shield, Eye
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from 'recharts';
import { useAuth } from '../../hooks/useAuth.js';
import {
  getDistricts, getBlocks, getVillages, VILLAGES_MASTER, DEMO_FARMERS, DEMO_AGRI_ISSUES, DEMO_SCHEME_REQUESTS
} from '../../data/locationData.js';
import { getHandoffs, getQueries, getSafetyAlerts } from '../../services/firebase.js';
import OfficerSatelliteMap from '../../components/OfficerSatelliteMap.jsx';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function DistrictBlockDashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAuthorized = user && (user.role === 'district_block_officer' || !user.role);

  // Filters
  const districts = getDistricts();
  const [selectedDistrict, setSelectedDistrict] = useState(user?.district || districts[0] || 'Thanjavur');
  const [blocks, setBlocks] = useState(getBlocks(user?.district || districts[0] || 'Thanjavur'));
  const [selectedBlock, setSelectedBlock] = useState(user?.block || 'Kumbakonam');
  const [selectedVillageFilter, setSelectedVillageFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('villages');

  // Live Firebase/Local Data
  const [handoffs, setHandoffs] = useState([]);
  const [queries, setQueries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const availableBlocks = getBlocks(selectedDistrict);
    setBlocks(availableBlocks);
    if (!availableBlocks.includes(selectedBlock)) {
      setSelectedBlock(availableBlocks[0] || '');
    }
  }, [selectedDistrict]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [hList, qList, aList] = await Promise.all([
        getHandoffs(),
        getQueries(100),
        getSafetyAlerts(),
      ]);
      setHandoffs(hList || []);
      setQueries(qList || []);
      setAlerts(aList || []);
    } catch (e) {
      console.error('Dashboard data error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/officer/district-block/login');
  };

  const handleResolveHandoff = (id) => {
    setHandoffs(prev => prev.map(h => h.id === id ? { ...h, status: 'Resolved' } : h));
    setActionMessage(`Handoff #${id} resolved successfully.`);
    setTimeout(() => setActionMessage(''), 3000);
  };

  // Analytics Chart Data
  const monthlyData = [
    { month: 'May', queries: 210, handoffs: 18, resolved: 192 },
    { month: 'Jun', queries: 285, handoffs: 24, resolved: 261 },
    { month: 'Jul', queries: 340, handoffs: 31, resolved: 309 },
    { month: 'Aug', queries: 410, handoffs: 28, resolved: 382 },
    { month: 'Sep', queries: 480, handoffs: 35, resolved: 445 },
  ];

  const categoryDistribution = [
    { name: 'Agriculture', value: 45 },
    { name: 'Gov Schemes', value: 30 },
    { name: 'Health', value: 15 },
    { name: 'General', value: 10 },
  ];

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: '100vh', background: '#0b1120', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '480px', width: '100%', background: '#1e293b', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '20px', padding: '2.5rem', textAlign: 'center' }}>
          <ShieldAlert size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Restricted</h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            You must be logged in as a <strong>District / Block Officer</strong> to view regional administration dashboards.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/officer/district-block/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Login as District / Block Officer
            </Link>
            <Link to="/" style={{ color: '#94a3b8', fontSize: '0.85rem', textDecoration: 'none' }}>
              Return to Public Site
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#090d16', color: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      {/* ── LEFT SIDEBAR (Red Rectangle Box Area) ── */}
      <aside style={{
        width: '270px',
        minWidth: '270px',
        background: 'linear-gradient(180deg, #0f172a 0%, #090d16 100%)',
        borderRight: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.5rem 1.15rem',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxSizing: 'border-box',
        zIndex: 100,
      }}>
        <div>
          {/* Brand Header */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '2rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
            }}>
              <Building2 size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                Grama Mitra
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Officer Panel
              </span>
            </div>
          </Link>

          {/* Sidebar Category Subheading Label */}
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem', paddingLeft: '0.5rem' }}>
            Officer Scopes & Portals
          </div>

          {/* Subheadings Nav List */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {[
              { id: 'villages', label: 'Assigned Villages', icon: Building2 },
              { id: 'handoffs', label: 'Handoff Escalations', icon: AlertTriangle, count: handoffs.filter(h => h.status !== 'Resolved').length || 8 },
              { id: 'agri', label: 'Area Crop Alerts', icon: Activity, count: 4 },
              { id: 'hotspot-map', label: 'Hotspot Mapping', icon: MapPin },
              { id: 'schemes', label: 'Scheme Approvals', icon: FileText, count: 34 },
              { id: 'analytics', label: 'Reports & Trends', icon: BarChart },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.8rem 0.95rem',
                    borderRadius: '12px',
                    background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                    border: isActive ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid transparent',
                    color: isActive ? '#34d399' : '#94a3b8',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    width: '100%',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#94a3b8';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <IconComp size={18} color={isActive ? '#34d399' : '#64748b'} />
                    <span>{tab.label}</span>
                  </div>
                  {tab.count > 0 && (
                    <span style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                      background: isActive ? '#10b981' : 'rgba(255, 255, 255, 0.12)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                    }}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom of Sidebar: User Profile & Logout Section */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '1.15rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem', padding: '0.25rem 0.4rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
            }}>
              {(user?.displayName || 'D')[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.displayName || 'District Officer'}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#38bdf8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: 600 }}>
                {selectedDistrict} ({selectedBlock})
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.55rem',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              fontSize: '0.88rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
              e.currentTarget.style.borderColor = '#ef4444';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
            }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
        {/* Top Header Bar */}
        <header style={{
          background: '#0f172a',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          padding: '0.85rem 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 90,
          backdropFilter: 'blur(12px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.3rem 0.85rem', background: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '9999px',
                fontSize: '0.8rem', fontWeight: 700, color: '#34d399',
              }}>
                <Building2 size={14} />
                <span>District / Block Officer Dashboard</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>
                ID: <span style={{ color: '#ffffff' }}>{user?.officerId || 'THILSHANTH45'}</span> | {selectedDistrict} District ({selectedBlock} Block)
              </div>
              <button
                onClick={loadDashboardData}
                className="btn btn-sm btn-ghost"
                style={{ color: '#94a3b8', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px' }}
                title="Refresh Dashboard Data"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>
        </header>

        <div style={{ padding: '1.75rem 2rem', maxWidth: '1440px', margin: '0 auto' }}>
        {/* Toast Notification */}
        {actionMessage && (
          <div style={{
            padding: '0.85rem 1.25rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981',
            borderRadius: '12px', color: '#34d399', fontSize: '0.88rem', fontWeight: 600, marginBottom: '1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <CheckCircle size={18} /> {actionMessage}
          </div>
        )}

        {/* Global Filter Bar */}
        <div style={{
          background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px',
          padding: '1.25rem 1.5rem', marginBottom: '1.75rem', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: 700, color: '#34d399' }}>
            <Filter size={18} /> Administrative Scope & Filters:
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginRight: '0.5rem' }}>District:</span>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
              >
                {districts.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginRight: '0.5rem' }}>Block:</span>
              <select
                value={selectedBlock}
                onChange={e => setSelectedBlock(e.target.value)}
                style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
              >
                {blocks.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginRight: '0.5rem' }}>Village:</span>
              <select
                value={selectedVillageFilter}
                onChange={e => setSelectedVillageFilter(e.target.value)}
                style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
              >
                <option value="ALL">All Villages ({selectedBlock})</option>
                {getVillages(selectedDistrict, selectedBlock).map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </div>

            <div>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginRight: '0.5rem' }}>Time Period:</span>
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '0.4rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem', outline: 'none' }}
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators Grid (Hidden when Hotspot Mapping is active) */}
        {activeTab !== 'hotspot-map' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
            <div onClick={() => setActiveTab('villages')} style={{ background: activeTab === 'villages' ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), #1e293b)' : 'linear-gradient(135deg, #0f172a, #1e293b)', border: activeTab === 'villages' ? '1px solid #10b981' : '1px solid rgba(16, 185, 129, 0.3)', padding: '1.25rem', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Assigned Villages</span>
                <Building2 size={20} color="#34d399" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                {VILLAGES_MASTER.filter(v => v.block === selectedBlock).length || 5}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.25rem' }}>Active monitoring in {selectedBlock}</div>
            </div>

            <div onClick={() => setActiveTab('handoffs')} style={{ background: activeTab === 'handoffs' ? 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), #1e293b)' : 'linear-gradient(135deg, #0f172a, #1e293b)', border: activeTab === 'handoffs' ? '1px solid #f59e0b' : '1px solid rgba(245, 158, 11, 0.3)', padding: '1.25rem', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Pending Escalations</span>
                <AlertTriangle size={20} color="#fbbf24" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                {handoffs.filter(h => h.status !== 'Resolved').length || 8}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.25rem' }}>Requires officer review</div>
            </div>

            <div onClick={() => setActiveTab('agri')} style={{ background: activeTab === 'agri' ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), #1e293b)' : 'linear-gradient(135deg, #0f172a, #1e293b)', border: activeTab === 'agri' ? '1px solid #38bdf8' : '1px solid rgba(56, 189, 248, 0.3)', padding: '1.25rem', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Agri & Pest Outbreaks</span>
                <Activity size={20} color="#38bdf8" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                {DEMO_AGRI_ISSUES.length} Active Alerts
              </div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.25rem' }}>Paddy Blast & BPH Warnings</div>
            </div>

            <div onClick={() => setActiveTab('agri')} style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '1.25rem', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Health Safety Red Flags</span>
                <ShieldAlert size={20} color="#ef4444" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                {alerts.length || 2} Alerts
              </div>
              <div style={{ fontSize: '0.75rem', color: '#fca5a5', marginTop: '0.25rem' }}>108 Protocol Triggered</div>
            </div>

            <div onClick={() => setActiveTab('schemes')} style={{ background: activeTab === 'schemes' ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), #1e293b)' : 'linear-gradient(135deg, #0f172a, #1e293b)', border: activeTab === 'schemes' ? '1px solid #a78bfa' : '1px solid rgba(139, 92, 246, 0.3)', padding: '1.25rem', borderRadius: '16px', cursor: 'pointer', transition: 'all 0.2s ease' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Scheme Applications</span>
                <FileText size={20} color="#a78bfa" />
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
                {DEMO_SCHEME_REQUESTS.length + 30} Total
              </div>
              <div style={{ fontSize: '0.75rem', color: '#a78bfa', marginTop: '0.25rem' }}>PM-KISAN, PMFBY & KCC</div>
            </div>
          </div>
        )}



        {/* Tab Content 1: Assigned Villages Overview */}
        {activeTab === 'villages' && (
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                Assigned Villages in {selectedBlock} Block ({selectedDistrict} District)
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Showing {VILLAGES_MASTER.filter(v => v.block === selectedBlock).length} monitored villages
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Village Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Block / District</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Registered Farmers</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Active Queries</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Assigned Village Officer</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {VILLAGES_MASTER.filter(v => selectedVillageFilter === 'ALL' || v.name === selectedVillageFilter).map((v, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#38bdf8' }}>{v.name}</td>
                      <td style={{ padding: '1rem', color: '#94a3b8' }}>{v.block}, {v.district}</td>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>{v.totalFarmers} Farmers</td>
                      <td style={{ padding: '1rem', color: '#fbbf24', fontWeight: 700 }}>{v.activeRequests} Requests</td>
                      <td style={{ padding: '1rem', color: '#cbd5e1' }}>{v.officerName}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{
                          padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 700,
                          background: v.status.includes('Alert') ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: v.status.includes('Alert') ? '#fca5a5' : '#34d399',
                          border: `1px solid ${v.status.includes('Alert') ? 'rgba(239,68,68,0.4)' : 'rgba(16,185,129,0.4)'}`,
                        }}>
                          {v.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <Link
                          to={`/officer/village/dashboard?village=${v.name}&block=${v.block}&district=${v.district}`}
                          className="btn btn-sm btn-outline"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
                        >
                          View Village Data →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 2: Pending Handoff Requests */}
        {activeTab === 'handoffs' && (
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                Pending Escalated Handoff Requests ({selectedBlock} Block)
              </h2>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                Human support escalations from low-confidence AI or high sensitivity queries
              </span>
            </div>

            {handoffs.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                <CheckCircle size={36} color="#34d399" style={{ margin: '0 auto 0.5rem' }} />
                <p>No pending handoff escalations in this block.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {handoffs.map((h, i) => (
                  <div key={i} style={{
                    padding: '1.25rem', background: '#1e293b', border: `1px solid ${h.priority === 'Emergency' ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
                  }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                        <span style={{
                          padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800,
                          background: h.priority === 'Emergency' ? '#ef4444' : h.priority === 'High' ? '#f59e0b' : '#3b82f6',
                          color: '#fff',
                        }}>
                          {h.priority || 'Normal'} Priority
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Category: {h.category || 'AGRICULTURE'}</span>
                        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>• {h.created_at || 'Just now'}</span>
                      </div>

                      <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
                        "{h.query || h.message || 'Farmer requested human support'}"
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                        <strong>Reason:</strong> {h.reason || 'AI low confidence — requires official verification'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {h.status !== 'Resolved' && (
                        <button
                          onClick={() => handleResolveHandoff(h.id)}
                          style={{
                            padding: '0.5rem 0.85rem', borderRadius: '8px', background: '#10b981', color: '#fff',
                            fontWeight: 700, fontSize: '0.8rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem',
                          }}
                        >
                          <Check size={14} /> Resolve Request
                        </button>
                      )}
                      <a
                        href="tel:18004250000"
                        style={{
                          padding: '0.5rem 0.85rem', borderRadius: '8px', background: '#0284c7', color: '#fff',
                          fontWeight: 700, fontSize: '0.8rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem',
                        }}
                      >
                        <PhoneCall size={14} /> Call Farmer
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content 3: Area Crop Alerts */}
        {activeTab === 'agri' && (
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
              Area-Wise Agricultural & Pest Outbreak Monitoring ({selectedBlock} Block)
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
              {DEMO_AGRI_ISSUES.map((iss, i) => (
                <div key={i} style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>{iss.title}</h3>
                    <span style={{
                      padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800,
                      background: iss.severity === 'Emergency' ? '#ef4444' : iss.severity === 'High' ? '#f59e0b' : '#3b82f6', color: '#fff',
                    }}>
                      {iss.severity}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
                    <strong>Village:</strong> {iss.village} | <strong>Affected Area:</strong> {iss.affectedArea}
                  </div>

                  <div style={{ fontSize: '0.85rem', background: '#0f172a', padding: '0.75rem', borderRadius: '8px', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                    <strong>Advisory & Treatment:</strong> {iss.treatment}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: '#64748b' }}>
                    <span>Reported: {iss.date}</span>
                    <span style={{ color: '#34d399', fontWeight: 600 }}>Status: {iss.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 4: Scheme Approvals */}
        {activeTab === 'schemes' && (
          <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
              Government Scheme Applications & Verification Status
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Farmer Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Village</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Scheme & Service</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Document Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Verification State</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_SCHEME_REQUESTS.map((sr, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#fff' }}>{sr.farmerName}</td>
                      <td style={{ padding: '1rem', color: '#94a3b8' }}>{sr.village}</td>
                      <td style={{ padding: '1rem', color: '#38bdf8', fontWeight: 600 }}>{sr.scheme}</td>
                      <td style={{ padding: '1rem', color: '#cbd5e1' }}>{sr.docStatus}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>
                          {sr.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <button className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                          Review Documents
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 5: Reports & Analytics */}
        {activeTab === 'analytics' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Monthly Query & Handoff Trends</h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="month" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#fff' }} />
                    <Legend />
                    <Bar dataKey="queries" fill="#3b82f6" name="Total Farmer Queries" />
                    <Bar dataKey="resolved" fill="#10b981" name="Resolved Queries" />
                    <Bar dataKey="handoffs" fill="#f59e0b" name="Escalated Handoffs" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Category Distribution across Block</h3>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryDistribution} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content: Universal AI Voice Satellite Hotspot Mapping */}
        {activeTab === 'hotspot-map' && (
          <OfficerSatelliteMap officerDistrict={selectedDistrict} officerBlock={selectedBlock} />
        )}
      </div>
      </main>
    </div>
  );
}
