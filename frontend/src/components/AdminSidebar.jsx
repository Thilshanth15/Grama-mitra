import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  Leaf, LayoutDashboard, BookOpen,
  Shield, Phone, BarChart2, Settings, LogOut, ChevronRight, MapPin
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

const sections = [
  { label: 'Overview', items: [
    { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/hotspots', icon: MapPin, label: 'Risk Hotspots' },
    { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  ]},
  { label: 'Management', items: [
    { to: '/admin/knowledge', icon: BookOpen, label: 'Knowledge Base' },
  ]},
  { label: 'Safety', items: [
    { to: '/admin/safety', icon: Shield, label: 'Safety Alerts' },
    { to: '/admin/calls', icon: Phone, label: 'Call Logs' },
  ]},
  { label: 'System', items: [
    { to: '/admin/settings', icon: Settings, label: 'Settings' },
  ]},
];

export default function AdminSidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.error('Logout error:', e);
    }
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="drawer-overlay"
          style={{ zIndex: 99 }}
          onClick={onClose}
        />
      )}

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }} title="Back to Home Dashboard">
            <div className="logo-mark">
              <img 
                src="/grama-mitra-emblem-white.png" 
                alt="Grama Mitra" 
                style={{ width: '22px', height: '22px', objectFit: 'contain' }} 
              />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: '#fff' }}>Grama Mitra</div>
              <div style={{ fontSize: '0.6875rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>Officer Dashboard</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {sections.map(sec => (
            <div key={sec.label}>
              <div className="sidebar-section-label">{sec.label}</div>
              {sec.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin'}
                  className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                  onClick={onClose}
                >
                  <item.icon size={17} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  <ChevronRight size={14} style={{ opacity: 0.3 }} />
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User info + logout */}
        <div style={{
          padding: '1rem 1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--green-600), var(--blue-600))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: '0.875rem', flexShrink: 0,
          }}>
            {user?.displayName?.[0] || user?.email?.[0]?.toUpperCase() || 'O'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#ffffff', fontSize: '0.8125rem', fontWeight: 600, truncate: true }}>
              {user?.displayName || 'Officer'}
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.725rem' }}>
              {user?.email || 'officer@gramaMitra.in'}
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Exit to Home Dashboard"
            aria-label="Exit to Home Dashboard"
            style={{
              color: '#f87171',
              cursor: 'pointer',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.45rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease-in-out',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
              e.currentTarget.style.color = '#f87171';
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
