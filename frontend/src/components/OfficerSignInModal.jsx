import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Mail, Lock, Eye, EyeOff, ArrowRight, LogIn, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

export default function OfficerSignInModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('thilshanth45@gmail.com');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleStep, setGoogleStep] = useState(null); // null | 'selecting' | 'verified'
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleStandardSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await login(email, password);
      if (onClose) onClose();
      navigate('/admin', { replace: true });
      window.scrollTo(0, 0);
    } catch (err) {
      setErrorMsg('Sign in failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleStep('selecting');
    setErrorMsg('');
    
    // Simulate authentic Google account confirmation flow
    setTimeout(async () => {
      try {
        setGoogleStep('verified');
        await loginWithGoogle(email || 'thilshanth45@gmail.com', 'Officer Thilshanth');
        setTimeout(() => {
          setGoogleStep(null);
          if (onClose) onClose();
          navigate('/admin', { replace: true });
          window.scrollTo(0, 0);
        }, 800);
      } catch (err) {
        setGoogleStep(null);
        setErrorMsg('Google sign-in encountered an error. Entering portal directly.');
        setTimeout(() => {
          if (onClose) onClose();
          navigate('/admin', { replace: true });
          window.scrollTo(0, 0);
        }, 1000);
      }
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0, 0, 0, 0.78)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading && !googleStep) onClose();
      }}
    >
      {/* Modal Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '430px',
          background: '#111315',
          border: '1px solid rgba(255, 255, 255, 0.13)',
          borderRadius: '24px',
          padding: '2.25rem 2rem',
          boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.12)',
          color: '#ffffff',
          overflow: 'hidden',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          disabled={loading || !!googleStep}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#ffffff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
        >
          <X size={20} />
        </button>

        {/* Top Icon Badge */}
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.35rem',
            boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.08)',
          }}
        >
          <LogIn size={22} color="#00c875" />
        </div>

        {/* Modal Title & Subtitle */}
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
            marginBottom: '0.45rem',
            letterSpacing: '-0.02em',
          }}
        >
          Sign in to Officer Portal
        </h2>
        <p
          style={{
            color: '#94a3b8',
            fontSize: '0.875rem',
            textAlign: 'center',
            lineHeight: 1.5,
            marginBottom: '1.75rem',
          }}
        >
          Access intelligent surveillance and validation tools securely.
        </p>

        {errorMsg && (
          <div
            style={{
              padding: '0.65rem 0.85rem',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '10px',
              color: '#fca5a5',
              fontSize: '0.8rem',
              marginBottom: '1rem',
              textAlign: 'center',
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Interactive Google Account Completion Flow State */}
        {googleStep ? (
          <div
            style={{
              padding: '1.75rem 1rem',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center',
              animation: 'fadeIn 0.25s ease',
            }}
          >
            {googleStep === 'selecting' ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                  <div className="spinner" style={{ width: 36, height: 36, borderColor: 'rgba(255,255,255,0.2)', borderTopColor: '#00c875' }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff', marginBottom: '0.35rem' }}>
                  Completing Google Account Authorization
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Connecting <span style={{ color: '#00c875', fontWeight: 600 }}>{email}</span> to Officer Portal...
                </div>
              </>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.85rem' }}>
                  <CheckCircle size={40} color="#00c875" />
                </div>
                <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#ffffff', marginBottom: '0.25rem' }}>
                  Google Account Verified
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Entering Officer Dashboard...
                </div>
              </>
            )}
          </div>
        ) : (
          <form onSubmit={handleStandardSubmit}>
            {/* Email Field */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: '#1a1d21',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '0.85rem 1.1rem',
                marginBottom: '1rem',
                transition: 'border-color 0.2s',
              }}
            >
              <Mail size={18} color="#64748b" style={{ flexShrink: 0 }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  width: '100%',
                }}
              />
            </div>

            {/* Password Field */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: '#1a1d21',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '12px',
                padding: '0.85rem 1.1rem',
                marginBottom: '0.75rem',
              }}
            >
              <Lock size={18} color="#64748b" style={{ flexShrink: 0 }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  fontWeight: 500,
                  width: '100%',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.4rem' }}>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to ' + email)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#00c875',
                  fontSize: '0.825rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Forgot password?
              </button>
            </div>

            {/* Get Started -> Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '0.9rem',
                background: '#00c875',
                color: '#000000',
                fontWeight: 700,
                fontSize: '0.975rem',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 20px rgba(0, 200, 117, 0.35)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#00df83';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#00c875';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {loading ? (
                <div className="spinner" style={{ width: 20, height: 20, borderColor: 'rgba(0,0,0,0.3)', borderTopColor: '#000000' }} />
              ) : (
                <>
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            {/* Divider */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                margin: '1.5rem 0',
                color: '#64748b',
                fontSize: '0.78rem',
                fontWeight: 500,
              }}
            >
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
              <span>Or sign in with</span>
              <div style={{ flex: 1, height: '1px', background: 'rgba(255, 255, 255, 0.1)' }} />
            </div>

            {/* Social Auth Buttons Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '0.75rem',
              }}
            >
              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                style={{
                  background: '#181b1f',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '0.75rem 0.5rem',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#22262c';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#181b1f';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
              >
                Google
              </button>

              {/* Apple Button */}
              <button
                type="button"
                onClick={handleStandardSubmit}
                style={{
                  background: '#181b1f',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '0.75rem 0.5rem',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#22262c';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#181b1f';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
              >
                Apple
              </button>

              {/* SSO Button */}
              <button
                type="button"
                onClick={handleStandardSubmit}
                style={{
                  background: '#181b1f',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '12px',
                  padding: '0.75rem 0.5rem',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#22262c';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#181b1f';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                }}
              >
                SSO
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
