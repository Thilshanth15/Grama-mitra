import React, { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Menu, Bell, Search, ExternalLink } from 'lucide-react';
import AdminSidebar from '../components/AdminSidebar.jsx';
import { useAuth } from '../hooks/useAuth.js';

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#050c07' }}>
        <div className="spinner" style={{ width: 36, height: 36, borderColor: '#10b981', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="admin-layout" style={{
      background: 'linear-gradient(135deg, #040d07 0%, #07150c 50%, #030805 100%)',
      minHeight: '100vh',
      color: '#ffffff',
      position: 'relative',
    }}>
      {/* Subtle ambient green glow overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(circle at 70% 30%, rgba(16, 185, 129, 0.07) 0%, rgba(0, 0, 0, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="admin-main" style={{ position: 'relative', zIndex: 1 }}>
        {/* Top bar for mobile menu & quick actions */}
        <header className="admin-topbar" style={{
          background: 'rgba(4, 13, 7, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <div className="admin-topbar-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setSidebarOpen(true)}
                style={{ padding: '0.375rem', borderRadius: '8px', cursor: 'pointer', border: 'none', background: 'rgba(255,255,255,0.06)', color: '#ffffff' }}
                className="mobile-menu-toggle"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                  {title || 'Officer Dashboard'}
                </h1>
                <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 2 }}>
                  Grama Mitra — Regional Officer Surveillance
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '10px',
                color: '#94a3b8',
                fontSize: '0.85rem',
              }}>
                <Search size={15} />
                <span>Search surveillance data…</span>
              </div>
              <button style={{
                position: 'relative', padding: '0.5rem',
                borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                background: 'rgba(255, 255, 255, 0.06)', cursor: 'pointer', color: '#ffffff',
              }}>
                <Bell size={18} />
                <span style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 8, height: 8, borderRadius: '50%',
                  background: '#ef4444', border: '2px solid #040d07',
                }} />
              </button>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.4rem 0.85rem',
                background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '10px',
                fontSize: '0.8125rem', color: '#34d399', fontWeight: 700,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                Live Surveillance Active
              </div>

              <Link
                to="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.85rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '10px',
                  fontSize: '0.8125rem',
                  color: '#ffffff',
                  fontWeight: 700,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }}
                title="Return to Public Site"
                aria-label="Exit to Website"
              >
                <ExternalLink size={13} />
                <span>Exit to Website</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content" style={{ padding: '1.75rem 2rem' }}>
          <div className="admin-container">
            {children}
          </div>
        </main>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .mobile-menu-toggle { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
