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
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#000000',
      color: '#ffffff',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* ── LEFT SIDEBAR ── */}
      <aside style={{
        width: '280px',
        minWidth: '280px',
        background: '#050505',
        borderRight: '1px solid rgba(0, 255, 157, 0.3)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '1.65rem 1.25rem',
        position: 'sticky',
        top: 0,
        height: '100vh',
        boxSizing: 'border-box',
        zIndex: 100,
        boxShadow: '10px 0 35px rgba(0,0,0,0.9)',
      }}>
        <div>
          {/* Brand Header */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', textDecoration: 'none', marginBottom: '2.25rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #00ff9d 0%, #00f0ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(0, 255, 157, 0.6)',
            }}>
              <Building2 size={24} color="#000000" />
            </div>
            <div>
              <div style={{
                fontWeight: 900, fontSize: '1.3rem', letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #ffffff 0%, #00ff9d 50%, #00f0ff 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              }}>
                Grama Mitra
              </div>
              <span style={{ fontSize: '0.74rem', fontWeight: 900, color: '#00f0ff', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Officer Panel
              </span>
            </div>
          </Link>

          {/* Sidebar Category Subheading Label */}
          <div style={{ fontSize: '0.74rem', fontWeight: 900, color: '#00f0ff', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.95rem', paddingLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#00ff9d', boxShadow: '0 0 10px #00ff9d' }}></span>
            Officer Scopes & Portals
          </div>

          {/* Subheadings Nav List */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
            {[
              { id: 'villages', label: 'Assigned Villages', icon: Building2, activeBg: 'linear-gradient(135deg, rgba(0, 240, 255, 0.25), rgba(0, 240, 255, 0.05))', activeBorder: '#00f0ff', activeColor: '#00f0ff', glow: 'rgba(0, 240, 255, 0.35)' },
              { id: 'handoffs', label: 'Handoff Escalations', icon: AlertTriangle, count: handoffs.filter(h => h.status !== 'Resolved').length || 8, activeBg: 'linear-gradient(135deg, rgba(255, 183, 0, 0.25), rgba(255, 183, 0, 0.05))', activeBorder: '#ffb700', activeColor: '#ffb700', glow: 'rgba(255, 183, 0, 0.35)' },
              { id: 'agri', label: 'Area Crop Alerts', icon: Activity, count: 4, activeBg: 'linear-gradient(135deg, rgba(255, 42, 95, 0.25), rgba(255, 42, 95, 0.05))', activeBorder: '#ff2a5f', activeColor: '#ff809f', glow: 'rgba(255, 42, 95, 0.35)' },
              { id: 'hotspot-map', label: 'Hotspot Mapping', icon: MapPin, activeBg: 'linear-gradient(135deg, rgba(176, 38, 255, 0.3), rgba(232, 121, 249, 0.1))', activeBorder: '#b026ff', activeColor: '#e879f9', glow: 'rgba(176, 38, 255, 0.5)' },
              { id: 'schemes', label: 'Scheme Approvals', icon: FileText, count: 34, activeBg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(59, 130, 246, 0.05))', activeBorder: '#3b82f6', activeColor: '#60a5fa', glow: 'rgba(59, 130, 246, 0.35)' },
              { id: 'analytics', label: 'Reports & Trends', icon: BarChart, activeBg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.05))', activeBorder: '#f59e0b', activeColor: '#fbbf24', glow: 'rgba(245, 158, 11, 0.35)' },
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
                    padding: '0.85rem 1rem',
                    borderRadius: '14px',
                    background: isActive ? tab.activeBg : '#111111',
                    border: isActive ? `1.5px solid ${tab.activeBorder}` : '1px solid rgba(255, 255, 255, 0.12)',
                    color: isActive ? tab.activeColor : '#e2e8f0',
                    fontWeight: isActive ? 900 : 700,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                    textAlign: 'left',
                    width: '100%',
                    boxShadow: isActive ? `0 0 25px ${tab.glow}` : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#1e1e1e';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.background = '#111111';
                      e.currentTarget.style.color = '#e2e8f0';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <IconComp size={20} color={isActive ? tab.activeColor : '#cbd5e1'} />
                    <span style={{ color: isActive ? tab.activeColor : '#ffffff', fontWeight: 800 }}>{tab.label}</span>
                  </div>
                  {tab.count > 0 && (
                    <span style={{
                      padding: '0.18rem 0.6rem',
                      borderRadius: '9999px',
                      background: isActive ? tab.activeColor : 'rgba(255, 255, 255, 0.2)',
                      color: isActive ? '#000000' : '#ffffff',
                      fontSize: '0.76rem',
                      fontWeight: 900,
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
        <div style={{ borderTop: '1px solid rgba(0, 240, 255, 0.3)', paddingTop: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.95rem', padding: '0.5rem 0.75rem', background: '#0e0e0e', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.18)' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00f0ff 0%, #b026ff 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '1.05rem',
              boxShadow: '0 0 15px rgba(0, 240, 255, 0.5)',
            }}>
              {(user?.displayName || 'D')[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.92rem', fontWeight: 900, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.displayName || 'District Officer'}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#00f0ff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: 800 }}>
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
              gap: '0.65rem',
              padding: '0.85rem 1rem',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(255, 42, 95, 0.35) 0%, rgba(153, 27, 27, 0.35) 100%)',
              border: '1.5px solid #ff2a5f',
              color: '#ffffff',
              fontSize: '0.92rem',
              fontWeight: 900,
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: '0 0 20px rgba(255, 42, 95, 0.35)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #ff2a5f 0%, #991b1b 100%)';
              e.currentTarget.style.borderColor = '#ffffff';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(255, 42, 95, 0.7)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 42, 95, 0.35) 0%, rgba(153, 27, 27, 0.35) 100%)';
              e.currentTarget.style.borderColor = '#ff2a5f';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 42, 95, 0.35)';
            }}
          >
            <LogOut size={18} color="#ffffff" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main style={{ flex: 1, minWidth: 0, overflowY: 'auto' }}>
        {/* Top Header Bar */}
        <header style={{
          background: '#080808',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '1rem 2.25rem',
          position: 'sticky',
          top: 0,
          zIndex: 90,
          backdropFilter: 'blur(20px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
                padding: '0.45rem 1.15rem', background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(176, 38, 255, 0.2))',
                border: '1.5px solid #00f0ff', borderRadius: '9999px',
                fontSize: '0.88rem', fontWeight: 900, color: '#00f0ff',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.35)',
              }}>
                <Building2 size={18} color="#00f0ff" />
                <span>District / Block Officer Dashboard</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 800 }}>
                ID: <span style={{ color: '#ffffff', fontWeight: 900, background: 'rgba(0, 240, 255, 0.25)', padding: '0.25rem 0.6rem', borderRadius: '8px', border: '1px solid #00f0ff' }}>{user?.officerId || 'THILSHANTH45'}</span> | <span style={{ color: '#00f0ff', fontWeight: 900 }}>{selectedDistrict} District ({selectedBlock} Block)</span>
              </div>
              <button
                onClick={loadDashboardData}
                className="btn btn-sm btn-ghost"
                style={{ color: '#00f0ff', border: '1px solid #00f0ff', borderRadius: '10px', background: 'rgba(0, 240, 255, 0.15)', padding: '0.45rem' }}
                title="Refresh Dashboard Data"
              >
                <RefreshCw size={17} />
              </button>
            </div>
          </div>
        </header>

        <div style={{ padding: '2rem 2.25rem', maxWidth: '1480px', margin: '0 auto' }}>
        {/* Toast Notification */}
        {actionMessage && (
          <div style={{
            padding: '1rem 1.4rem', background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.25) 0%, rgba(176, 38, 255, 0.25) 100%)',
            border: '1px solid #00f0ff', borderRadius: '16px', color: '#00f0ff', fontSize: '0.95rem', fontWeight: 900, marginBottom: '1.6rem',
            display: 'flex', alignItems: 'center', gap: '0.65rem', boxShadow: '0 0 25px rgba(0, 240, 255, 0.4)',
          }}>
            <CheckCircle size={22} /> {actionMessage}
          </div>
        )}

        {/* Global Filter Bar */}
        <div style={{
          background: '#0c0c0c',
          border: '1.5px solid #00f0ff',
          borderRadius: '22px',
          padding: '1.4rem 1.75rem',
          marginBottom: '1.85rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
          boxShadow: '0 10px 35px rgba(0, 0, 0, 0.9), 0 0 25px rgba(0, 240, 255, 0.25)',
          backdropFilter: 'blur(16px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.05rem', fontWeight: 900 }}>
            <Filter size={22} color="#00f0ff" />
            <span style={{
              background: 'linear-gradient(90deg, #00f0ff, #e879f9)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>
              Administrative Scope & Filters:
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.35rem', flexWrap: 'wrap' }}>
            <div>
              <span style={{ fontSize: '0.85rem', color: '#00f0ff', marginRight: '0.65rem', fontWeight: 900 }}>District:</span>
              <select
                value={selectedDistrict}
                onChange={e => setSelectedDistrict(e.target.value)}
                style={{
                  background: '#141414', border: '1.5px solid #00f0ff', color: '#ffffff',
                  padding: '0.55rem 0.95rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 900, outline: 'none',
                  boxShadow: '0 0 15px rgba(0, 240, 255, 0.25)',
                }}
              >
                {districts.map(d => <option key={d} value={d} style={{ background: '#141414', color: '#ffffff' }}>{d}</option>)}
              </select>
            </div>

            <div>
              <span style={{ fontSize: '0.85rem', color: '#e879f9', marginRight: '0.65rem', fontWeight: 900 }}>Block:</span>
              <select
                value={selectedBlock}
                onChange={e => setSelectedBlock(e.target.value)}
                style={{
                  background: '#141414', border: '1.5px solid #e879f9', color: '#ffffff',
                  padding: '0.55rem 0.95rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 900, outline: 'none',
                  boxShadow: '0 0 15px rgba(232, 121, 249, 0.25)',
                }}
              >
                {blocks.map(b => <option key={b} value={b} style={{ background: '#141414', color: '#ffffff' }}>{b}</option>)}
              </select>
            </div>

            <div>
              <span style={{ fontSize: '0.85rem', color: '#ffb700', marginRight: '0.65rem', fontWeight: 900 }}>Village:</span>
              <select
                value={selectedVillageFilter}
                onChange={e => setSelectedVillageFilter(e.target.value)}
                style={{
                  background: '#141414', border: '1.5px solid #ffb700', color: '#ffffff',
                  padding: '0.55rem 0.95rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 900, outline: 'none',
                  boxShadow: '0 0 15px rgba(255, 183, 0, 0.25)',
                }}
              >
                <option value="ALL" style={{ background: '#141414', color: '#ffffff' }}>All Villages ({selectedBlock})</option>
                {getVillages(selectedDistrict, selectedBlock).map(v => <option key={v} value={v} style={{ background: '#141414', color: '#ffffff' }}>{v}</option>)}
              </select>
            </div>

            <div>
              <span style={{ fontSize: '0.85rem', color: '#ff809f', marginRight: '0.65rem', fontWeight: 900 }}>Time Period:</span>
              <select
                value={dateRange}
                onChange={e => setDateRange(e.target.value)}
                style={{
                  background: '#141414', border: '1.5px solid #ff2a5f', color: '#ffffff',
                  padding: '0.55rem 0.95rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 900, outline: 'none',
                  boxShadow: '0 0 15px rgba(255, 42, 95, 0.25)',
                }}
              >
                <option value="7d" style={{ background: '#141414', color: '#ffffff' }}>Last 7 Days</option>
                <option value="30d" style={{ background: '#141414', color: '#ffffff' }}>Last 30 Days</option>
                <option value="90d" style={{ background: '#141414', color: '#ffffff' }}>Last 90 Days</option>
              </select>
            </div>
          </div>
        </div>

        {/* Key Performance Indicators Grid (Hidden when Hotspot Mapping is active) */}
        {activeTab !== 'hotspot-map' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.35rem', marginBottom: '2rem' }}>
            <div onClick={() => setActiveTab('villages')} style={{ background: activeTab === 'villages' ? 'linear-gradient(135deg, rgba(0, 240, 255, 0.25), #0f0f0f)' : '#0d0d0d', border: activeTab === 'villages' ? '1.5px solid #00f0ff' : '1px solid rgba(0, 240, 255, 0.4)', padding: '1.35rem', borderRadius: '18px', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 0 20px rgba(0, 240, 255, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 800 }}>Assigned Villages</span>
                <Building2 size={22} color="#00f0ff" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>
                {VILLAGES_MASTER.filter(v => v.block === selectedBlock).length || 5}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#00f0ff', marginTop: '0.35rem', fontWeight: 900 }}>Active monitoring in {selectedBlock}</div>
            </div>

            <div onClick={() => setActiveTab('handoffs')} style={{ background: activeTab === 'handoffs' ? 'linear-gradient(135deg, rgba(255, 183, 0, 0.25), #0f0f0f)' : '#0d0d0d', border: activeTab === 'handoffs' ? '1.5px solid #ffb700' : '1px solid rgba(255, 183, 0, 0.4)', padding: '1.35rem', borderRadius: '18px', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 0 20px rgba(255, 183, 0, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 800 }}>Pending Escalations</span>
                <AlertTriangle size={22} color="#ffb700" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>
                {handoffs.filter(h => h.status !== 'Resolved').length || 8}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#ffb700', marginTop: '0.35rem', fontWeight: 900 }}>Requires officer review</div>
            </div>

            <div onClick={() => setActiveTab('agri')} style={{ background: activeTab === 'agri' ? 'linear-gradient(135deg, rgba(255, 42, 95, 0.25), #0f0f0f)' : '#0d0d0d', border: activeTab === 'agri' ? '1.5px solid #ff2a5f' : '1px solid rgba(255, 42, 95, 0.4)', padding: '1.35rem', borderRadius: '18px', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 0 20px rgba(255, 42, 95, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 800 }}>Area Crop Alerts</span>
                <Activity size={22} color="#ff2a5f" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>
                {DEMO_AGRI_ISSUES.length} Active Alerts
              </div>
              <div style={{ fontSize: '0.8rem', color: '#ff809f', marginTop: '0.35rem', fontWeight: 900 }}>Paddy Blast & BPH Warnings</div>
            </div>

            <div onClick={() => setActiveTab('agri')} style={{ background: '#0d0d0d', border: '1.5px solid #ff2a5f', padding: '1.35rem', borderRadius: '18px', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 0 20px rgba(255, 42, 95, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 800 }}>Health Safety Red Flags</span>
                <ShieldAlert size={22} color="#ff2a5f" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>
                {alerts.length || 2} Alerts
              </div>
              <div style={{ fontSize: '0.8rem', color: '#ff809f', marginTop: '0.35rem', fontWeight: 900 }}>108 Protocol Triggered</div>
            </div>

            <div onClick={() => setActiveTab('schemes')} style={{ background: activeTab === 'schemes' ? 'linear-gradient(135deg, rgba(176, 38, 255, 0.25), #0f0f0f)' : '#0d0d0d', border: activeTab === 'schemes' ? '1.5px solid #b026ff' : '1px solid rgba(176, 38, 255, 0.4)', padding: '1.35rem', borderRadius: '18px', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 0 20px rgba(176, 38, 255, 0.3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                <span style={{ fontSize: '0.88rem', color: '#e2e8f0', fontWeight: 800 }}>Scheme Applications</span>
                <FileText size={22} color="#e879f9" />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ffffff' }}>
                {DEMO_SCHEME_REQUESTS.length + 30} Total
              </div>
              <div style={{ fontSize: '0.8rem', color: '#e879f9', marginTop: '0.35rem', fontWeight: 900 }}>PM-KISAN, PMFBY & KCC</div>
            </div>
          </div>
        )}

        {/* Tab Content 1: Assigned Villages Overview */}
        {activeTab === 'villages' && (
          <div style={{ background: '#0a0a0a', border: '1.5px solid #00f0ff', borderRadius: '22px', padding: '1.75rem', boxShadow: '0 10px 35px rgba(0,0,0,0.9), 0 0 25px rgba(0, 240, 255, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Building2 size={22} color="#00f0ff" />
                Assigned Villages in {selectedBlock} Block ({selectedDistrict} District)
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#00f0ff', fontWeight: 900, background: 'rgba(0, 240, 255, 0.15)', padding: '0.35rem 0.85rem', borderRadius: '9999px', border: '1px solid #00f0ff' }}>
                Showing {VILLAGES_MASTER.filter(v => v.block === selectedBlock).length} monitored villages
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(0, 240, 255, 0.4)', color: '#00f0ff', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 900 }}>Village Name</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 900 }}>Block / District</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 900 }}>Registered Farmers</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 900 }}>Active Queries</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 900 }}>Assigned Village Officer</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 900 }}>Status</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 900 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {VILLAGES_MASTER.filter(v => selectedVillageFilter === 'ALL' || v.name === selectedVillageFilter).map((v, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                      <td style={{ padding: '1.1rem 1rem', fontWeight: 900, color: '#00f0ff', fontSize: '0.98rem' }}>{v.name}</td>
                      <td style={{ padding: '1.1rem 1rem', color: '#e2e8f0', fontWeight: 600 }}>{v.block}, {v.district}</td>
                      <td style={{ padding: '1.1rem 1rem', fontWeight: 900, color: '#ffffff' }}>{v.totalFarmers} Farmers</td>
                      <td style={{ padding: '1.1rem 1rem', color: '#ffb700', fontWeight: 900 }}>{v.activeRequests} Requests</td>
                      <td style={{ padding: '1.1rem 1rem', color: '#ffffff', fontWeight: 800 }}>{v.officerName}</td>
                      <td style={{ padding: '1.1rem 1rem' }}>
                        <span style={{
                          padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 900,
                          background: v.status.includes('Alert') ? 'rgba(255, 42, 95, 0.3)' : 'rgba(0, 240, 255, 0.25)',
                          color: v.status.includes('Alert') ? '#ff809f' : '#00f0ff',
                          border: `1.5px solid ${v.status.includes('Alert') ? '#ff2a5f' : '#00f0ff'}`,
                          boxShadow: v.status.includes('Alert') ? '0 0 12px rgba(255, 42, 95, 0.4)' : '0 0 12px rgba(0, 240, 255, 0.4)',
                        }}>
                          {v.status}
                        </span>
                      </td>
                      <td style={{ padding: '1.1rem 1rem' }}>
                        <Link
                          to={`/officer/village/dashboard?village=${v.name}&block=${v.block}&district=${v.district}`}
                          className="btn btn-sm"
                          style={{
                            fontSize: '0.82rem', padding: '0.45rem 0.95rem', borderRadius: '10px',
                            background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)', color: '#000000',
                            fontWeight: 900, textDecoration: 'none', border: '1px solid #00f0ff',
                            boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)',
                          }}
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
          <div style={{ background: '#0a0a0a', border: '1px solid #ffb700', borderRadius: '22px', padding: '1.75rem', boxShadow: '0 10px 35px rgba(0,0,0,0.8), 0 0 25px rgba(255, 183, 0, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <AlertTriangle size={22} color="#ffb700" />
                Pending Escalated Handoff Requests ({selectedBlock} Block)
              </h2>
              <span style={{ fontSize: '0.85rem', color: '#ffb700', fontWeight: 800 }}>
                Human support escalations from low-confidence AI or high sensitivity queries
              </span>
            </div>

            {handoffs.length === 0 ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: '#cbd5e1' }}>
                <CheckCircle size={40} color="#00ff9d" style={{ margin: '0 auto 0.75rem', filter: 'drop-shadow(0 0 10px #00ff9d)' }} />
                <p style={{ fontSize: '1rem', fontWeight: 800 }}>No pending handoff escalations in this block.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                {handoffs.map((h, i) => (
                  <div key={i} style={{
                    padding: '1.35rem', background: '#121212', border: `1px solid ${h.priority === 'Emergency' ? '#ff2a5f' : '#ffb700'}`,
                    borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1.15rem',
                    boxShadow: `0 0 20px ${h.priority === 'Emergency' ? 'rgba(255, 42, 95, 0.25)' : 'rgba(255, 183, 0, 0.25)'}`,
                  }}>
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
                        <span style={{
                          padding: '0.25rem 0.65rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 900,
                          background: h.priority === 'Emergency' ? '#ff2a5f' : h.priority === 'High' ? '#ffb700' : '#00f0ff',
                          color: '#000000',
                        }}>
                          {h.priority || 'Normal'} Priority
                        </span>
                        <span style={{ fontSize: '0.82rem', color: '#00f0ff', fontWeight: 800 }}>Category: {h.category || 'AGRICULTURE'}</span>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>• {h.created_at || 'Just now'}</span>
                      </div>

                      <div style={{ fontSize: '1.05rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.45rem' }}>
                        "{h.query || h.message || 'Farmer requested human support'}"
                      </div>
                      <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>
                        <strong style={{ color: '#ffb700' }}>Reason:</strong> {h.reason || 'AI low confidence — requires official verification'}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      {h.status !== 'Resolved' && (
                        <button
                          onClick={() => handleResolveHandoff(h.id)}
                          style={{
                            padding: '0.6rem 1.15rem', borderRadius: '12px', background: 'linear-gradient(135deg, #00ff9d 0%, #059669 100%)', color: '#000000',
                            fontWeight: 900, fontSize: '0.88rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.45rem',
                            boxShadow: '0 0 15px rgba(0, 255, 157, 0.4)',
                          }}
                        >
                          <Check size={16} /> Resolve Request
                        </button>
                      )}
                      <a
                        href="tel:18004250000"
                        style={{
                          padding: '0.6rem 1.15rem', borderRadius: '12px', background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)', color: '#000000',
                          fontWeight: 900, fontSize: '0.88rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.45rem',
                          boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)',
                        }}
                      >
                        <PhoneCall size={16} /> Call Farmer
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
          <div style={{ background: '#0a0a0a', border: '1.5px solid #ff2a5f', borderRadius: '22px', padding: '1.75rem', boxShadow: '0 10px 35px rgba(0,0,0,0.9), 0 0 25px rgba(255, 42, 95, 0.25)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Activity size={22} color="#ff2a5f" />
              Area-Wise Agricultural & Pest Outbreak Monitoring ({selectedBlock} Block)
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.35rem' }}>
              {DEMO_AGRI_ISSUES.map((iss, i) => (
                <div key={i} style={{ background: '#121212', border: '1.5px solid rgba(255, 42, 95, 0.4)', borderRadius: '16px', padding: '1.35rem', boxShadow: '0 4px 20px rgba(0,0,0,0.7)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.6rem' }}>
                    <h3 style={{ fontSize: '1.08rem', fontWeight: 900, color: '#ff809f' }}>{iss.title}</h3>
                    <span style={{
                      padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.78rem', fontWeight: 900,
                      background: iss.severity === 'Emergency' ? '#ff2a5f' : iss.severity === 'High' ? '#ffb700' : '#00f0ff', color: '#000000',
                    }}>
                      {iss.severity}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.88rem', color: '#e2e8f0', marginBottom: '0.85rem', fontWeight: 700 }}>
                    <strong style={{ color: '#00f0ff' }}>Village:</strong> {iss.village} | <strong style={{ color: '#00f0ff' }}>Affected Area:</strong> {iss.affectedArea}
                  </div>

                  <div style={{ fontSize: '0.88rem', background: '#050505', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.15)', color: '#ffffff', marginBottom: '0.85rem', fontWeight: 600, lineHeight: 1.5 }}>
                    <strong style={{ color: '#ffb700' }}>Advisory & Treatment:</strong> {iss.treatment}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 800 }}>
                    <span>Reported: {iss.date}</span>
                    <span style={{ color: '#00f0ff', fontWeight: 900 }}>Status: {iss.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 4: Scheme Approvals */}
        {activeTab === 'schemes' && (
          <div style={{ background: '#0a0a0a', border: '1.5px solid #3b82f6', borderRadius: '22px', padding: '1.75rem', boxShadow: '0 10px 35px rgba(0,0,0,0.9), 0 0 25px rgba(59, 130, 246, 0.25)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#ffffff', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <FileText size={22} color="#60a5fa" />
              Government Scheme Applications & Verification Status
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(59, 130, 246, 0.4)', color: '#60a5fa', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 900 }}>Farmer Name</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 900 }}>Village</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 900 }}>Scheme & Service</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 900 }}>Document Status</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 900 }}>Verification State</th>
                    <th style={{ padding: '0.85rem 1rem', fontWeight: 900 }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_SCHEME_REQUESTS.map((sr, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                      <td style={{ padding: '1.1rem 1rem', fontWeight: 900, color: '#ffffff', fontSize: '0.98rem' }}>{sr.farmerName}</td>
                      <td style={{ padding: '1.1rem 1rem', color: '#e2e8f0', fontWeight: 600 }}>{sr.village}</td>
                      <td style={{ padding: '1.1rem 1rem', color: '#60a5fa', fontWeight: 900 }}>{sr.scheme}</td>
                      <td style={{ padding: '1.1rem 1rem', color: '#ffffff', fontWeight: 800 }}>{sr.docStatus}</td>
                      <td style={{ padding: '1.1rem 1rem' }}>
                        <span style={{ padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.78rem', fontWeight: 900, background: 'rgba(59, 130, 246, 0.25)', color: '#60a5fa', border: '1.5px solid #3b82f6', boxShadow: '0 0 12px rgba(59, 130, 246, 0.4)' }}>
                          {sr.status}
                        </span>
                      </td>
                      <td style={{ padding: '1.1rem 1rem' }}>
                        <button className="btn btn-sm" style={{ fontSize: '0.82rem', padding: '0.45rem 0.95rem', borderRadius: '10px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', color: '#ffffff', fontWeight: 900, border: '1px solid #3b82f6', boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)', cursor: 'pointer' }}>
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
            <div style={{ background: '#0a0a0a', border: '1.5px solid #f59e0b', borderRadius: '22px', padding: '1.75rem', boxShadow: '0 10px 35px rgba(0,0,0,0.9), 0 0 25px rgba(245, 158, 11, 0.25)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <BarChart size={22} color="#fbbf24" />
                Monthly Query & Handoff Trends
              </h3>
              <div style={{ width: '100%', height: 270 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                    <XAxis dataKey="month" stroke="#e2e8f0" />
                    <YAxis stroke="#e2e8f0" />
                    <Tooltip contentStyle={{ background: '#121212', border: '1px solid #fbbf24', color: '#fff', borderRadius: '12px' }} />
                    <Legend />
                    <Bar dataKey="queries" fill="#00f0ff" name="Total Farmer Queries" />
                    <Bar dataKey="resolved" fill="#e879f9" name="Resolved Queries" />
                    <Bar dataKey="handoffs" fill="#ffb700" name="Escalated Handoffs" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={{ background: '#0a0a0a', border: '1.5px solid #f59e0b', borderRadius: '22px', padding: '1.75rem', boxShadow: '0 10px 35px rgba(0,0,0,0.9), 0 0 25px rgba(245, 158, 11, 0.25)' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <PieChart size={22} color="#fbbf24" />
                Category Distribution across Block
              </h3>
              <div style={{ width: '100%', height: 270 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryDistribution} cx="50%" cy="50%" outerRadius={85} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ background: '#121212', border: '1px solid #fbbf24', color: '#fff', borderRadius: '12px' }} />
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
