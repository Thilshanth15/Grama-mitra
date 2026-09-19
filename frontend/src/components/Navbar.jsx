import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Building2, Home } from 'lucide-react';
import LanguageSelector from './LanguageSelector.jsx';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/assistant', label: 'Voice Assistant' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <div className="logo-mark">
            <img 
              src="/grama-mitra-emblem-white.png" 
              alt="Grama Mitra" 
              style={{ width: '26px', height: '26px', objectFit: 'contain' }} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: '1.125rem', color: '#ffffff', lineHeight: 1.15, whiteSpace: 'nowrap', letterSpacing: '-0.01em' }}>
              Grama Mitra
            </div>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
              Rural AI Platform
            </div>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="navbar-links">
          {navLinks.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {/* Actions */}
        <div className="navbar-actions">
          {/* Multi-Language Selector Dropdown in Navbar */}
          <LanguageSelector />

          {/* 1. District / Block Officer Button */}
          <Link
            to="/officer/district-block/login"
            className="btn btn-sm btn-ghost"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              height: '38px',
              padding: '0 0.85rem',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.82rem',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              background: 'rgba(255, 255, 255, 0.06)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
            }}
          >
            <Building2 size={14} color="#38bdf8" />
            <span>District / Block Officer</span>
          </Link>

          {/* 2. Village Officer Button */}
          <Link
            to="/officer/village/login"
            className="btn btn-sm btn-ghost"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              height: '38px',
              padding: '0 0.85rem',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.82rem',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              background: 'rgba(255, 255, 255, 0.06)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
              e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
            }}
          >
            <Home size={14} color="#34d399" />
            <span>Village Officer</span>
          </Link>

          {/* Try Assistant Button */}
          <Link
            to="/assistant"
            className="btn btn-sm btn-primary"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '38px',
              padding: '0 1.1rem',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.82rem',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.35)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            Try Assistant
          </Link>

          <button
            className="mobile-menu-btn"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'absolute',
          top: 'var(--nav-height)',
          left: 0,
          right: 0,
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          zIndex: 200,
          animation: 'slideUp 0.2s ease',
        }}>
          {navLinks.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
              onClick={() => setOpen(false)}
              style={{ display: 'block', padding: '0.625rem 1rem' }}
            >
              {l.label}
            </NavLink>
          ))}
          <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link
              to="/officer/district-block/login"
              className="btn btn-sm btn-ghost"
              onClick={() => setOpen(false)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <Building2 size={14} color="#38bdf8" /> District / Block Officer
            </Link>
            <Link
              to="/officer/village/login"
              className="btn btn-sm btn-ghost"
              onClick={() => setOpen(false)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <Home size={14} color="#34d399" /> Village Officer
            </Link>
            <Link to="/assistant" className="btn btn-sm btn-primary" onClick={() => setOpen(false)} style={{ textAlign: 'center' }}>
              Try Assistant
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
