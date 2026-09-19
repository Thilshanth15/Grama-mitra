import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Home, Users, AlertTriangle, CheckCircle, Clock, ShieldAlert,
  Search, Filter, RefreshCw, LogOut, ArrowRight, Activity, FileText,
  ChevronRight, MapPin, Award, PhoneCall, Check, X, Shield, Eye, Leaf
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
    <div style={{ minHeight: '100vh', background: '#051317', color: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Header Bar */}
      <header style={{
        background: '#0a1e24',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '0.85rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Logo & Village Tag */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', textDecoration: 'none' }}>
              <div style={{ width: 34, height: 34, borderRadius: '10px', background: 'linear-gradient(135deg, #0284c7, #0369a1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Home size={20} color="#fff" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.15rem', color: '#fff' }}>Grama Mitra</span>
            </Link>
            <span style={{ height: 20, width: 1, background: 'rgba(255,255,255,0.2)' }} />
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.25rem 0.75rem', background: 'rgba(56, 189, 248, 0.15)',
              border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '9999px',
              fontSize: '0.78rem', fontWeight: 700, color: '#38bdf8',
            }}>
              <Home size={13} />
              <span>Village Officer Dashboard</span>
            </div>
          </div>

          {/* Officer Details & Location Scope */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                {user?.displayName || `Village Officer (${assignedVillage})`}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
                Village: <span style={{ color: '#fff', textDecoration: 'underline' }}>{assignedVillage}</span> | Block: {assignedBlock} | District: {assignedDistrict}
              </div>
            </div>

            <button
              onClick={loadData}
              className="btn btn-sm btn-ghost"
              style={{ color: '#94a3b8', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px' }}
              title="Refresh Dashboard"
            >
              <RefreshCw size={15} />
            </button>

            <button
              onClick={handleLogout}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.45rem 0.85rem', borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#fca5a5', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
              }}
            >
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </header>

      <div style={{ padding: '1.75rem 2rem', maxWidth: '1440px', margin: '0 auto' }}>
        {/* Village Scope Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0a2540 0%, #061e24 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.2rem' }}>
              <MapPin size={16} /> Assigned Local Jurisdiction
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Village: {assignedVillage}
            </h1>
            <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>
              All requests, farmer records, and crop health alerts below are strictly scoped for {assignedVillage} Village ({assignedBlock} Block, {assignedDistrict} District).
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', fontWeight: 700 }}>
              Active Officer On Duty
            </span>
            <Link to="/officer/district-block/dashboard" style={{ fontSize: '0.8rem', color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>
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

        {/* Village Key Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div style={{ background: '#0c2229', border: '1px solid rgba(56, 189, 248, 0.25)', padding: '1.25rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Registered Farmers</span>
              <Users size={20} color="#38bdf8" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
              {villageFarmers.length > 0 ? 420 : 380}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '0.25rem' }}>In {assignedVillage} Village</div>
          </div>

          <div style={{ background: '#0c2229', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '1.25rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Pending Village Requests</span>
              <Clock size={20} color="#fbbf24" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
              14 Active
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '0.25rem' }}>Awaiting officer advisory</div>
          </div>

          <div style={{ background: '#0c2229', border: '1px solid rgba(239, 68, 68, 0.25)', padding: '1.25rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Crop & Pest Warnings</span>
              <Leaf size={20} color="#fca5a5" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
              {villageAgriIssues.length || 2} Issues
            </div>
            <div style={{ fontSize: '0.75rem', color: '#fca5a5', marginTop: '0.25rem' }}>Yellowing paddy leaf spot</div>
          </div>

          <div style={{ background: '#0c2229', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '1.25rem', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>PM-KISAN / KCC Status</span>
              <FileText size={20} color="#34d399" />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>
              92% Approved
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '0.25rem' }}>eKYC & Patta verified</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.12)', marginBottom: '1.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {[
            { id: 'farmers', label: 'Village Farmers Directory', icon: Users },
            { id: 'requests', label: 'Pending Assistance Requests', icon: Clock, count: 14 },
            { id: 'crop-issues', label: 'Crop Health & Pest Outbreaks', icon: Leaf },
            { id: 'schemes', label: 'Village Scheme Applications', icon: FileText },
            { id: 'activity', label: 'Recent Activity Feed', icon: Activity },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.65rem 1.2rem', borderRadius: '10px',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #0284c7, #0369a1)' : 'rgba(255,255,255,0.05)',
                color: activeTab === tab.id ? '#ffffff' : '#94a3b8',
                fontWeight: 700, fontSize: '0.85rem', border: 'none', cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'all 0.2s ease',
              }}
            >
              <tab.icon size={16} />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span style={{ padding: '0.1rem 0.45rem', borderRadius: '9999px', background: '#f59e0b', color: '#fff', fontSize: '0.7rem' }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
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
    </div>
  );
}
