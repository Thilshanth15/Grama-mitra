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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'var(--gray-50)' }}>
        <div className="spinner" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="admin-layout">
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div className="admin-topbar-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setSidebarOpen(true)}
                style={{ display: 'none', padding: '0.375rem', borderRadius: 'var(--radius-md)', cursor: 'pointer', border: 'none', background: 'none', color: 'var(--gray-600)' }}
                className="mobile-menu-toggle"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--gray-900)', lineHeight: 1 }}>
                  {title || 'Admin Dashboard'}
                </h1>
                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', marginTop: 2 }}>
                  Grama Mitra — Administration
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.375rem 0.875rem',
                background: 'var(--gray-100)',
                borderRadius: 'var(--radius-lg)',
                color: 'var(--gray-500)',
                fontSize: '0.875rem',
              }}>
                <Search size={15} />
                <span>Search…</span>
              </div>
              <button style={{
                position: 'relative', padding: '0.5rem',
                borderRadius: 'var(--radius-lg)', border: 'none',
                background: 'var(--gray-100)', cursor: 'pointer', color: 'var(--gray-600)',
              }}>
                <Bell size={18} />
                <span style={{
                  position: 'absolute', top: 6, right: 6,
                  width: 8, height: 8, borderRadius: '50%',
                  background: 'var(--red-500)', border: '2px solid #fff',
                }} />
              </button>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.375rem 0.75rem',
                background: 'var(--green-50)', border: '1px solid var(--green-200)',
                borderRadius: 'var(--radius-lg)',
                fontSize: '0.8125rem', color: 'var(--green-700)', fontWeight: 600,
              }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green-500)', display: 'inline-block' }} />
                System Active
              </div>

              <Link
                to="/"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.375rem 0.85rem',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '0.8125rem',
                  color: '#ffffff',
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(16, 185, 129, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                }}
                title="Return to Public Dashboard"
                aria-label="Exit to Normal Dashboard"
              >
                <ExternalLink size={13} />
                <span>Exit to Website</span>
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="admin-content">
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
