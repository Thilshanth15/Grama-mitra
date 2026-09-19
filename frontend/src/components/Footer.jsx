import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Phone, Mail, MapPin, Shield, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div className="logo-mark">
                <img 
                  src="/grama-mitra-emblem-white.png" 
                  alt="Grama Mitra" 
                  style={{ width: '22px', height: '22px', objectFit: 'contain' }} 
                />
              </div>
              <h3 style={{ margin: 0 }}>Grama Mitra</h3>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, maxWidth: '280px' }}>
              AI-powered Tamil-first rural assistance platform bringing trusted agriculture, 
              government scheme, and health guidance to rural communities.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <div style={{
                background: 'var(--green-900)',
                border: '1px solid var(--green-800)',
                borderRadius: '0.5rem',
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                color: 'var(--green-400)',
                fontWeight: 600,
              }}>
                Tamil-First AI
              </div>
              <div style={{
                background: 'rgb(37 99 235 / 0.1)',
                border: '1px solid rgb(37 99 235 / 0.2)',
                borderRadius: '0.5rem',
                padding: '0.375rem 0.75rem',
                fontSize: '0.75rem',
                color: 'var(--blue-400)',
                fontWeight: 600,
              }}>
                Multi-Channel
              </div>
            </div>
          </div>

          {/* Platform */}
          <div className="footer-col">
            <h4>Platform</h4>
            <ul>
              <li><Link to="/assistant">Voice Assistant</Link></li>
              <li><Link to="/services">Services</Link></li>
              <li><Link to="/how-it-works">How It Works</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              <li><Link to="/services#agriculture">Agriculture Guidance</Link></li>
              <li><Link to="/services#government">Government Schemes</Link></li>
              <li><Link to="/services#health">Health Guidance</Link></li>
              <li><Link to="/assistant">Tamil Voice Assistant</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={14} style={{ flexShrink: 0, color: 'var(--gray-500)' }} />
                <span>hello@gramaMitra.in</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={14} style={{ flexShrink: 0, color: 'var(--gray-500)' }} />
                <span>IVR Voice Helpline: 1800-425-GRAMA</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={14} style={{ flexShrink: 0, color: 'var(--gray-500)' }} />
                <span>Tamil Nadu, India</span>
              </li>
            </ul>
            <div style={{ marginTop: '1rem' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                padding: '0.3rem 0.625rem',
                background: 'rgb(239 68 68 / 0.1)',
                borderRadius: '0.375rem',
                fontSize: '0.75rem',
                color: 'rgb(248 113 113)',
              }}>
                <Shield size={12} />
                Emergency: 108 (Ambulance)
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>© 2024 Grama Mitra.</span>
            <span style={{ color: 'var(--gray-600)' }}>Built with</span>
            <Heart size={12} style={{ color: 'var(--green-400)' }} />
            <span style={{ color: 'var(--gray-600)' }}>for rural India.</span>
          </div>
          <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8125rem' }}>
            <Link to="/about" style={{ color: 'var(--gray-500)' }}>Privacy</Link>
            <Link to="/about" style={{ color: 'var(--gray-500)' }}>Terms</Link>
            <Link to="/about" style={{ color: 'var(--gray-500)' }}>Safety</Link>
            <Link to="/about" style={{ color: 'var(--gray-500)' }}>Accessibility</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
