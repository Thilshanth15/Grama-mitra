import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Home, Users, AlertTriangle, CheckCircle, Clock, ShieldAlert,
  Search, Filter, RefreshCw, LogOut, ArrowRight, Activity, FileText,
  ChevronRight, MapPin, Award, PhoneCall, Check, X, Shield, Eye, Leaf, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import {
  getDistricts, getBlocks, getVillages, VILLAGES_MASTER, DEMO_FARMERS, DEMO_AGRI_ISSUES, DEMO_SCHEME_REQUESTS
} from '../../data/locationData.js';
import { getHandoffs, getQueries } from '../../services/firebase.js';

export default function VillageOfficerDashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, logout } = useAuth();

  // URL override or user assigned village
  const paramVillage = searchParams.get('village');
  const paramBlock = searchParams.get('block');
  const paramDistrict = searchParams.get('district');

  const assignedDistrict = paramDistrict || user?.district || 'Thanjavur';
  const assignedBlock = paramBlock || user?.block || 'Kumbakonam';
  const assignedVillage = paramVillage || user?.village || 'Kovilur';

  const isAuthorized = user && (user.role === 'village_officer' || !user.role);

  // Filters & State
  const [activeTab, setActiveTab] = useState('farmers');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');

  // Scoped Data for Assigned Village
  const villageFarmers = DEMO_FARMERS.filter(f => f.village.toLowerCase() === assignedVillage.toLowerCase());
  const villageAgriIssues = DEMO_AGRI_ISSUES.filter(i => i.village.toLowerCase() === assignedVillage.toLowerCase());
  const villageSchemes = DEMO_SCHEME_REQUESTS.filter(s => s.village.toLowerCase() === assignedVillage.toLowerCase());

  const loadData = async () => {
    setLoading(true);
    try {
      const qList = await getQueries(100);
      setQueries(qList || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/officer/village/login');
  };

  const handleAction = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 3000);
  };

  if (!isAuthorized) {
    return (
      <div style={{ minHeight: '100vh', background: '#08191c', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div style={{ maxWidth: '480px', width: '100%', background: '#0f292f', border: '1px solid rgba(56,189,248,0.3)', borderRadius: '20px', padding: '2.5rem', textAlign: 'center' }}>
          <ShieldAlert size={48} color="#38bdf8" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Access Restricted</h2>
          <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            You must be logged in as a <strong>Village Officer</strong> to view village-level dashboards.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Link to="/officer/village/login" className="btn btn-primary" style={{ textDecoration: 'none' }}>
              Login as Village Officer
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
    <div style={{ display: 'flex', minHeight: '100vh', background: '#051317', color: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      {/* ── LEFT SIDEBAR (Red Rectangle Box Area) ── */}
      <aside style={{
        width: '270px',
        minWidth: '270px',
        background: 'linear-gradient(180deg, #0a1e24 0%, #051317 100%)',
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
              <Home size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 900, fontSize: '1.15rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
                Grama Mitra
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#38bdf8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                Village Panel
              </span>
            </div>
          </Link>

          {/* Sidebar Category Subheading Label */}
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.85rem', paddingLeft: '0.5rem' }}>
            Navigation & Subheadings
          </div>

          {/* Subheadings Nav List */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {[
              { id: 'farmers', label: 'Farmers Directory', icon: Users },
              { id: 'requests', label: 'Assistance Requests', icon: Clock, count: 14 },
              { id: 'crop-issues', label: 'Area Crop Alerts', icon: Leaf, count: villageAgriIssues.length || 2 },
              { id: 'schemes', label: 'Scheme Approvals', icon: FileText },
              { id: 'activity', label: 'Reports & Feed', icon: Activity },
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
              background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
            }}>
              {(user?.displayName || 'V')[0].toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                {user?.displayName || `Officer (${assignedVillage})`}
              </div>
              <div style={{ fontSize: '0.72rem', color: '#38bdf8', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: 600 }}>
                {assignedVillage} Village
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
          background: '#0a1e24',
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
                padding: '0.3rem 0.85rem', background: 'rgba(56, 189, 248, 0.15)',
                border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '9999px',
                fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8',
              }}>
                <Home size={14} />
                <span>Village Officer Dashboard</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '0.82rem', color: '#94a3b8', fontWeight: 600 }}>
                Village: <span style={{ color: '#34d399', fontWeight: 700 }}>{assignedVillage}</span> ({assignedBlock} Block, {assignedDistrict} District)
              </div>
              <button
                onClick={loadData}
                className="btn btn-sm btn-ghost"
                style={{ color: '#94a3b8', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px' }}
                title="Refresh Dashboard"
              >
                <RefreshCw size={15} />
              </button>
            </div>
          </div>
        </header>

        <div style={{ padding: '1.75rem 2rem', maxWidth: '1440px', margin: '0 auto' }}>
        {/* Page Title & Subheading Header Block (Matching Image 2) */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', margin: 0 }}>
              Officer Dashboard
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginTop: '0.35rem', margin: 0 }}>
              Regional crop health monitoring and surveillance overview for <span style={{ color: '#38bdf8', fontWeight: 600 }}>{assignedVillage} Village</span> ({assignedBlock} Block, {assignedDistrict} District)
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <Link to="/public/map" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.25rem',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              fontWeight: 700,
              fontSize: '0.88rem',
              textDecoration: 'none',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
              transition: 'all 0.2s ease',
            }}>
              <MapPin size={16} /> View Hotspot Map
            </Link>

            <Link to="/officer/district-block/dashboard" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.65rem 1.15rem',
              borderRadius: '12px',
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              color: '#38bdf8',
              fontWeight: 600,
              fontSize: '0.85rem',
              textDecoration: 'none',
            }}>
              Switch to District View →
            </Link>
          </div>
        </div>

        {/* Action Message Toast */}
        {actionMessage && (
          <div style={{
            padding: '0.85rem 1.25rem', background: 'rgba(16, 185, 129, 0.2)', border: '1px solid #10b981',
            borderRadius: '12px', color: '#34d399', fontSize: '0.88rem', fontWeight: 600, marginBottom: '1.25rem',
            display: 'flex', alignItems: 'center', gap: '0.5rem',
          }}>
            <CheckCircle size={18} /> {actionMessage}
          </div>
        )}

        {/* 6 Boxed Stat Cards Grid (Matching Image 2) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem',
        }}>
          {/* Card 1: Total Farms Monitored */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(12, 34, 41, 0.8) 0%, rgba(6, 18, 22, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.35rem 1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.2)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Users size={22} color="#34d399" />
              </div>
              <TrendingUp size={16} color="#64748b" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', margin: '0.85rem 0 0.2rem' }}>
              12,450
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
              Total Farms Monitored
            </div>
          </div>

          {/* Card 2: Active Disease Cases */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(12, 34, 41, 0.8) 0%, rgba(6, 18, 22, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.35rem 1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.2)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Activity size={22} color="#fbbf24" />
              </div>
              <TrendingUp size={16} color="#64748b" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', margin: '0.85rem 0 0.2rem' }}>
              1,240
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
              Active Disease Cases
            </div>
          </div>

          {/* Card 3: High-Risk Farms */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(12, 34, 41, 0.8) 0%, rgba(6, 18, 22, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.35rem 1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <AlertTriangle size={22} color="#f87171" />
              </div>
              <TrendingUp size={16} color="#64748b" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', margin: '0.85rem 0 0.2rem' }}>
              184
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
              High-Risk Farms
            </div>
          </div>

          {/* Card 4: Active Pest Alerts */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(12, 34, 41, 0.8) 0%, rgba(6, 18, 22, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.35rem 1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(244, 63, 94, 0.2)',
                border: '1px solid rgba(244, 63, 94, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Leaf size={22} color="#fb7185" />
              </div>
              <TrendingUp size={16} color="#64748b" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', margin: '0.85rem 0 0.2rem' }}>
              327
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
              Active Pest Alerts
            </div>
          </div>

          {/* Card 5: Hotspots Detected */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(12, 34, 41, 0.8) 0%, rgba(6, 18, 22, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.35rem 1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(124, 58, 237, 0.2)',
                border: '1px solid rgba(124, 58, 237, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <MapPin size={22} color="#a78bfa" />
              </div>
              <TrendingUp size={16} color="#64748b" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', margin: '0.85rem 0 0.2rem' }}>
              17
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
              Hotspots Detected
            </div>
          </div>

          {/* Card 6: Pending Reviews */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(12, 34, 41, 0.8) 0%, rgba(6, 18, 22, 0.9) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '1.35rem 1.5rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.2)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <CheckCircle size={22} color="#38bdf8" />
              </div>
              <TrendingUp size={16} color="#64748b" />
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', margin: '0.85rem 0 0.2rem' }}>
              48
            </div>
            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
              Pending Reviews
            </div>
          </div>
        </div>

        {/* 4 Boxed Portal Access Cards (Matching Image 2) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2.5rem',
        }}>
          {[
            { title: 'Disease Surveillance', icon: Activity, color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.25)', tab: 'crop-issues' },
            { title: 'Pest Surveillance', icon: Leaf, color: '#fb7185', bg: 'rgba(244, 63, 94, 0.25)', tab: 'crop-issues' },
            { title: 'Expert Validation', icon: Shield, color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.25)', tab: 'requests' },
            { title: 'Preventive Planning', icon: Award, color: '#34d399', bg: 'rgba(16, 185, 129, 0.25)', tab: 'schemes' },
          ].map((portal, idx) => {
            const IconComp = portal.icon;
            return (
              <div
                key={idx}
                onClick={() => setActiveTab(portal.tab)}
                style={{
                  background: 'rgba(10, 26, 32, 0.75)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  backdropFilter: 'blur(16px)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = portal.color;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: portal.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.85rem',
                }}>
                  <IconComp size={20} color={portal.color} />
                </div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                  {portal.title}
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.4rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Access Portal →
                </div>
              </div>
            );
          })}
        </div>



        {/* Tab Content 1: Village Farmers Directory */}
        {activeTab === 'farmers' && (
          <div style={{ background: '#0a1e24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff' }}>
                  Registered Farmers Directory ({assignedVillage} Village)
                </h2>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Manage individual farmer records, landholding, primary crop types, and direct contacts
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <input
                  type="text"
                  placeholder="Search farmer by name or phone..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  style={{
                    background: '#142d36', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: '8px', color: '#fff', padding: '0.45rem 0.85rem', fontSize: '0.85rem', outline: 'none',
                  }}
                />
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Farmer Name</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Phone Contact</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Landholding</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Primary Crops</th>
                    <th style={{ padding: '0.75rem 1rem' }}>PM-KISAN</th>
                    <th style={{ padding: '0.75rem 1rem' }}>KCC Card</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_FARMERS.filter(f => !searchQuery || f.name.toLowerCase().includes(searchQuery.toLowerCase()) || f.phone.includes(searchQuery)).map((f, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#38bdf8' }}>{f.name}</td>
                      <td style={{ padding: '1rem', color: '#cbd5e1' }}>{f.phone}</td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#fff' }}>{f.landSize}</td>
                      <td style={{ padding: '1rem', color: '#34d399' }}>{f.crop}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: 'rgba(16,185,129,0.2)', color: '#34d399' }}>
                          {f.pmKisan}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '0.15rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700, background: f.kcc === 'Issued' ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)', color: f.kcc === 'Issued' ? '#34d399' : '#fbbf24' }}>
                          {f.kcc}
                        </span>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <a
                          href={`tel:${f.phone.replace(/\s+/g, '')}`}
                          onClick={() => handleAction(`Initiated phone call to ${f.name} (${f.phone})`)}
                          className="btn btn-sm btn-outline"
                          style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', textDecoration: 'none' }}
                        >
                          <PhoneCall size={12} /> Contact
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 2: Pending Agriculture Requests */}
        {activeTab === 'requests' && (
          <div style={{ background: '#0a1e24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
              Pending Farmer Assistance Requests in {assignedVillage}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { id: 'vr-101', farmer: 'K. Ramasamy', category: 'AGRICULTURE', question: 'நெல் இலை மஞ்சளாகிறது — என்ன உரம் கொடுக்க வேண்டும்?', date: '2026-09-19', status: 'Pending Officer Advisory' },
                { id: 'vr-102', farmer: 'S. Dhanalakshmi', category: 'GOVERNMENT', question: 'PM-KISAN 17வது தவணை வரவில்லை — eKYC சரிபார்க்க வேண்டும்', date: '2026-09-18', status: 'Under Document Verification' },
                { id: 'vr-103', farmer: 'V. Murugan', category: 'AGRICULTURE', question: 'பயிரில் பூச்சி தாக்குதல் உள்ளது — பரிந்துரைக்கப்பட்ட பூச்சிக்கொல்லி என்ன?', date: '2026-09-17', status: 'Pending Field Visit' },
              ].map((req, i) => (
                <div key={i} style={{ background: '#142d36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8' }}>{req.farmer}</span>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>• {req.date}</span>
                    </div>
                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>
                      "{req.question}"
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 600 }}>
                      Status: {req.status}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleAction(`Advisory sent to ${req.farmer} for request #${req.id}`)}
                      style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', background: '#10b981', color: '#fff', fontSize: '0.8rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    >
                      Send Tamil Advisory
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 3: Crop Health & Pest Outbreaks */}
        {activeTab === 'crop-issues' && (
          <div style={{ background: '#0a1e24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
              Crop Disease & Pest Outbreaks in {assignedVillage}
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {DEMO_AGRI_ISSUES.map((iss, i) => (
                <div key={i} style={{ background: '#142d36', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.35rem' }}>{iss.title}</h3>
                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                    Affected Land: {iss.affectedArea} in {iss.village}
                  </div>
                  <div style={{ fontSize: '0.85rem', background: '#0a1e24', padding: '0.75rem', borderRadius: '8px', color: '#cbd5e1', marginBottom: '0.75rem' }}>
                    <strong>Recommended Treatment:</strong> {iss.treatment}
                  </div>
                  <button
                    onClick={() => handleAction(`Broadcasted advisory to all farmers in ${assignedVillage}`)}
                    style={{ width: '100%', padding: '0.5rem', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Broadcast Advisory to Village Farmers
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab Content 4: Village Schemes */}
        {activeTab === 'schemes' && (
          <div style={{ background: '#0a1e24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
              Government Scheme Verification in {assignedVillage}
            </h2>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#94a3b8', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 1rem' }}>Farmer</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Scheme Requested</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Document Verification</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                    <th style={{ padding: '0.75rem 1rem' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {DEMO_SCHEME_REQUESTS.map((sr, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#fff' }}>{sr.farmerName}</td>
                      <td style={{ padding: '1rem', color: '#38bdf8' }}>{sr.scheme}</td>
                      <td style={{ padding: '1rem', color: '#cbd5e1' }}>{sr.docStatus}</td>
                      <td style={{ padding: '1rem', color: '#34d399', fontWeight: 600 }}>{sr.status}</td>
                      <td style={{ padding: '1rem' }}>
                        <button
                          onClick={() => handleAction(`Approved document verification for ${sr.farmerName}`)}
                          className="btn btn-sm btn-outline" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                        >
                          Approve Record
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content 5: Activity Feed */}
        {activeTab === 'activity' && (
          <div style={{ background: '#0a1e24', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '16px', padding: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fff', marginBottom: '1.25rem' }}>
              Recent Activity & Assistance Log ({assignedVillage})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { time: '10 mins ago', text: 'Village Officer Sundaram sent paddy blast treatment advisory to K. Ramasamy' },
                { time: '1 hour ago', text: 'eKYC verification completed for S. Dhanalakshmi (PM-KISAN Scheme)' },
                { time: '3 hours ago', text: 'BPH pest warning broadcasted to all 420 registered farmers in Kovilur' },
                { time: 'Yesterday', text: 'Kisan Credit Card (KCC) document verified for M. Palanisamy' },
              ].map((act, i) => (
                <div key={i} style={{ padding: '0.85rem 1rem', background: '#142d36', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Activity size={16} color="#34d399" />
                  <div style={{ flex: 1, fontSize: '0.88rem', color: '#e2e8f0' }}>{act.text}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{act.time}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      </main>
    </div>
  );
}
