import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, Lock, Mail, Shield, CheckCircle, AlertCircle, ChevronRight, HelpCircle } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { getDistricts, getBlocks } from '../../data/locationData.js';

export default function DistrictBlockLogin() {
  const navigate = useNavigate();
  const { loginDistrictOfficer, loading: authLoading } = useAuth();

  const districts = getDistricts();
  const [district, setDistrict] = useState(districts[0] || 'Thanjavur');
  const [blocks, setBlocks] = useState(getBlocks(districts[0] || 'Thanjavur'));
  const [block, setBlock] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  useEffect(() => {
    const availableBlocks = getBlocks(district);
    setBlocks(availableBlocks);
    setBlock(availableBlocks[0] || '');
  }, [district]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!district || !block) {
      setError('Please select both your assigned District and Block.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your Official Email address or Officer ID.');
      return;
    }
    if (!password || password.length < 4) {
      setError('Please enter a valid password (minimum 4 characters).');
      return;
    }

    setIsSubmitting(true);
    try {
      const officerUser = await loginDistrictOfficer({
        district,
        block,
        officerId: email.includes('@') ? email.split('@')[0].toUpperCase() : email.toUpperCase(),
        email: email.includes('@') ? email : `${email.toLowerCase()}@gramaMitra.in`,
        password,
        officerName: `District Officer (${district} / ${block})`,
      });

      if (officerUser) {
        navigate('/officer/district-block/dashboard');
      }
    } catch (err) {
      setError('Authentication failed. Please check your officer credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotSent(true);
    setTimeout(() => {
      setShowForgotModal(false);
      setForgotSent(false);
      setForgotEmail('');
    }, 2500);
  };

  return (
    <PublicLayout>
      <div style={{
        minHeight: 'calc(100vh - var(--nav-height, 76px))',
        background: 'radial-gradient(circle at 50% 0%, #0d2818 0%, #07130c 50%, #020604 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1rem',
        color: '#ffffff',
      }}>
        <div style={{
          width: '100%',
          maxWidth: '520px',
          background: 'rgba(12, 20, 15, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(52, 211, 153, 0.25)',
          borderRadius: '24px',
          padding: '2.5rem 2rem',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.1)',
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(56, 189, 248, 0.2))',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <Building2 size={28} color="#34d399" />
            </div>

            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', color: '#34d399', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              District & Block Administration
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem', lineHeight: 1.2 }}>
              District / Block Officer Login
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Access regional agriculture oversight, pending handoff escalations, and block-level analytics.
            </p>
          </div>

          {/* Error Notification */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.85rem 1rem',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              color: '#fca5a5',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* District & Block Selection Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  District <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                >
                  {districts.map(d => (
                    <option key={d} value={d} style={{ background: '#0f172a', color: '#fff' }}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                  Assigned Block <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={block}
                  onChange={(e) => setBlock(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                >
                  {blocks.map(b => (
                    <option key={b} value={b} style={{ background: '#0f172a', color: '#fff' }}>{b}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Official Email / Officer ID */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.4rem' }}>
                Official Email or Officer ID <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="e.g. dbo.thanjavur@gramaMitra.in or DBO-904"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#cbd5e1' }}>
                  Password <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '0.78rem', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Forgot Password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 0.85rem 0.75rem 2.4rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Remember Me */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
              <input
                type="checkbox"
                id="remember-dbo"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ accentColor: '#10b981', width: 16, height: 16, cursor: 'pointer' }}
              />
              <label htmlFor="remember-dbo" style={{ fontSize: '0.82rem', color: '#94a3b8', cursor: 'pointer' }}>
                Remember this session on this official device
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || authLoading}
              style={{
                width: '100%',
                padding: '0.9rem',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.95rem',
                border: '1px solid rgba(52, 211, 153, 0.4)',
                boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                marginTop: '0.5rem',
              }}
            >
              {isSubmitting ? 'Authenticating Officer...' : 'Login to District / Block Dashboard'}
              <ChevronRight size={18} />
            </button>
          </form>

          {/* Footer Navigation */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.82rem',
          }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ArrowLeft size={14} /> Back to Home
            </Link>
            <Link to="/officer/village/login" style={{ color: '#38bdf8', textDecoration: 'none', fontWeight: 600 }}>
              Village Officer Login →
            </Link>
          </div>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem',
        }}>
          <div style={{
            width: '100%', maxWidth: '420px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px', padding: '2rem', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.8)',
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Reset Officer Password</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
              Enter your registered official email. Password reset instructions will be sent via government SSO directory.
            </p>
            {forgotSent ? (
              <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', borderRadius: '10px', color: '#34d399', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={18} />
                <span>Reset link sent to your official email!</span>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword}>
                <input
                  type="email"
                  placeholder="officer.email@gramaMitra.in"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                  style={{
                    width: '100%', padding: '0.75rem', background: '#1e293b', border: '1px solid #334155',
                    borderRadius: '8px', color: '#fff', marginBottom: '1rem', outline: 'none', boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowForgotModal(false)} className="btn btn-sm btn-ghost" style={{ color: '#cbd5e1' }}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-sm btn-primary">
                    Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
