import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Building2, Home } from 'lucide-react';
import LanguageSelector from './LanguageSelector.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();

  const navLinks = [
    { to: '/', label: t('home') },
    { to: '/services', label: t('services') },
    { to: '/how-it-works', label: t('howItWorks') },
    { to: '/assistant', label: t('assistant') },
    { to: '/about', label: t('about') },
    { to: '/contact', label: t('contact') },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          <div className="logo-mark" style={{
            position: 'relative',
            width: '42px',
            height: '42px',
            background: 'linear-gradient(135deg, #10b981 0%, #0284c7 100%)',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 0 22px rgba(16, 185, 129, 0.55), 0 0 40px rgba(56, 189, 248, 0.35), inset 0 1.5px 2px rgba(255, 255, 255, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.08) rotate(4deg)';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.8), 0 0 50px rgba(56, 189, 248, 0.5), inset 0 1.5px 2px rgba(255, 255, 255, 0.8)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
            e.currentTarget.style.boxShadow = '0 0 22px rgba(16, 185, 129, 0.55), 0 0 40px rgba(56, 189, 248, 0.35), inset 0 1.5px 2px rgba(255, 255, 255, 0.6)';
          }}
          >
            <img 
              src="/grama-mitra-emblem-white.png" 
              alt="Grama Mitra" 
              style={{ width: '26px', height: '26px', objectFit: 'contain', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} 
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: '1.125rem', color: '#ffffff', lineHeight: 1.15, whiteSpace: 'nowrap', letterSpacing: '-0.01em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
              Grama Mitra
            </div>
            <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
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
              gap: '0.5rem',
              height: '40px',
              padding: '0 0.9rem 0 0.5rem',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.82rem',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 15px rgba(14, 165, 233, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
              textDecoration: 'none',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(14, 165, 233, 0.28) 0%, rgba(15, 23, 42, 0.8) 100%)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.65)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(14, 165, 233, 0.4), 0 0 15px rgba(56, 189, 248, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%)';
              e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.25)';
            }}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.35) 0%, rgba(2, 132, 199, 0.25) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.5)',
              boxShadow: '0 2px 8px rgba(14, 165, 233, 0.35)',
            }}>
              <Building2 size={14} color="#38bdf8" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
            </span>
            <span>{t('districtOfficer')}</span>
          </Link>

          {/* 2. Village Officer Button */}
          <Link
            to="/officer/village/login"
            className="btn btn-sm btn-ghost"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              height: '40px',
              padding: '0 0.9rem 0 0.5rem',
              borderRadius: '9999px',
              whiteSpace: 'nowrap',
              color: '#ffffff',
              fontWeight: 600,
              fontSize: '0.82rem',
              border: '1px solid rgba(52, 211, 153, 0.35)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
              textDecoration: 'none',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.28) 0%, rgba(15, 23, 42, 0.8) 100%)';
              e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.65)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4), 0 0 15px rgba(52, 211, 153, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(15, 23, 42, 0.6) 100%)';
              e.currentTarget.style.borderColor = 'rgba(52, 211, 153, 0.35)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.25)';
            }}
          >
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.35) 0%, rgba(5, 150, 105, 0.25) 100%)',
              border: '1px solid rgba(52, 211, 153, 0.5)',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.35)',
            }}>
              <Home size={14} color="#34d399" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }} />
            </span>
            <span>{t('villageOfficer')}</span>
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
              <Building2 size={14} color="#38bdf8" /> {t('districtOfficer')}
            </Link>
            <Link
              to="/officer/village/login"
              className="btn btn-sm btn-ghost"
              onClick={() => setOpen(false)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', border: '1px solid rgba(255,255,255,0.15)' }}
            >
              <Home size={14} color="#34d399" /> {t('villageOfficer')}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
