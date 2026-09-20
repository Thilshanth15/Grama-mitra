import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, Activity, Bug, MapPin, FileText,
  ShieldCheck, TestTube, Target, BarChart2, MessageSquare,
  Bell, LogOut, ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/safety', icon: Activity, label: 'Disease Surveillance' },
  { to: '/admin/pest', icon: Bug, label: 'Pest Surveillance' },
  { to: '/admin/hotspots', icon: MapPin, label: 'Hotspot Map' },
  { to: '/admin/queries', icon: FileText, label: 'Farmer Reports' },
  { to: '/admin/handoffs', icon: ShieldCheck, label: 'Expert Validation' },
  { to: '/admin/calls', icon: TestTube, label: 'Lab Referrals' },
  { to: '/admin/knowledge', icon: Target, label: 'Preventive Planning' },
  { to: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
  { to: '/admin/communication', icon: MessageSquare, label: 'Communication' },
  { to: '/admin/settings', icon: Bell, label: 'Notifications' },
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

      <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`} style={{
        background: '#040d07',
        borderRight: '1px solid rgba(16, 185, 129, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        <div>
          {/* Logo Header */}
          <div className="sidebar-logo" style={{
            padding: '1.25rem 1.25rem 1rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
              }}>
                <img 
                  src="/grama-mitra-emblem-white.png" 
                  alt="Grama Mitra" 
                  style={{ width: '22px', height: '22px', objectFit: 'contain' }} 
                />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: '1rem', color: '#ffffff', letterSpacing: '0.04em', lineHeight: 1.1 }}>
                  UZHAVAN
                </div>
                <div style={{ fontSize: '0.65rem', color: '#34d399', fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '2px' }}>
                  OFFICER PANEL
                </div>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav style={{ padding: '0.75rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {navItems.map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === '/admin'}
                onClick={onClose}
                className={({ isActive }) => `sidebar-link-pill ${isActive ? 'active' : ''}`}
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.95rem',
                  borderRadius: '12px',
                  color: isActive ? '#34d399' : '#94a3b8',
                  background: isActive ? 'rgba(16, 185, 129, 0.16)' : 'transparent',
                  border: isActive ? '1px solid rgba(52, 211, 153, 0.35)' : '1px solid transparent',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.875rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 20px rgba(16, 185, 129, 0.25)' : 'none',
                })}
              >
                <item.icon size={18} style={{ flexShrink: 0 }} />
                <span style={{ flex: 1, whiteSpace: 'nowrap' }}>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* User Info & Logout Footer */}
        <div style={{
          padding: '1rem 1.1rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '0.9rem',
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
            flexShrink: 0,
          }}>
            {user?.displayName?.[0] || 'D'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: '#ffffff', fontSize: '0.85rem', fontWeight: 800, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user?.displayName || 'Dr. Priya Sharma'}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Agriculture Extension Officer
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '0.35rem',
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
            onMouseLeave={e => e.currentTarget.style.color = '#94a3b8'}
          >
            <LogOut size={15} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
