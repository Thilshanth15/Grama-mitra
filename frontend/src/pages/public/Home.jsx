import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic, ArrowRight, CheckCircle, Leaf, Building2, Heart, Phone, MessageCircle,
  Globe, Shield, Users, Zap, ChevronRight, Star, Award, TrendingUp, Layers, Sparkles
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';

const SERVICES = [
  {
    icon: Leaf,
    theme: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      glow: 'rgba(16, 185, 129, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
      border: 'rgba(16, 185, 129, 0.35)',
      pillBg: 'rgba(16, 185, 129, 0.12)',
      pillText: '#6ee7b7',
      cardBg: 'rgba(6, 30, 20, 0.75)',
    },
    title: 'Agriculture Guidance',
    tagline: 'TNAU Verified Farming Science',
    desc: 'Crop advice, pest identification, fertilizer guidance, and farming best practices from TNAU-verified sources.',
    examples: ['Crop disease identification', 'Fertilizer recommendations', 'Irrigation timing & guidance'],
    btnText: 'Ask Agriculture Question',
    catId: 'agriculture',
  },
  {
    icon: Building2,
    theme: {
      primary: '#3b82f6',
      secondary: '#2563eb',
      accent: '#60a5fa',
      glow: 'rgba(59, 130, 246, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%)',
      border: 'rgba(59, 130, 246, 0.35)',
      pillBg: 'rgba(59, 130, 246, 0.12)',
      pillText: '#93c5fd',
      cardBg: 'rgba(10, 25, 47, 0.75)',
    },
    title: 'Government Schemes',
    tagline: 'Eligibility & Application Checklists',
    desc: 'Eligibility, required documents, and step-by-step application guidance for PM-KISAN, PMFBY, KCC, and ration cards.',
    examples: ['PM-KISAN ₹6k e-KYC guidance', 'PMFBY crop insurance claim', 'Kisan Credit Card (KCC) apply'],
    btnText: 'Ask Government Question',
    catId: 'government',
  },
  {
    icon: Heart,
    theme: {
      primary: '#f43f5e',
      secondary: '#e11d48',
      accent: '#fb7185',
      glow: 'rgba(244, 63, 94, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(225, 29, 72, 0.05) 100%)',
      border: 'rgba(244, 63, 94, 0.35)',
      pillBg: 'rgba(244, 63, 94, 0.12)',
      pillText: '#fca5a5',
      cardBg: 'rgba(38, 12, 20, 0.75)',
    },
    title: 'Basic Health Guidance',
    tagline: 'Preventive Healthcare & 108 Emergency',
    desc: 'General health information, child vaccination schedules, and automatic immediate escalation for medical emergencies.',
    examples: ['Fever & common illness advice', 'Child vaccination schedule', 'Automated 108 Emergency routing'],
    btnText: 'Ask Basic Health Question',
    catId: 'health',
  },
];

const CHANNELS = [
  {
    icon: Globe,
    theme: { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.3)', bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.3)' },
    name: 'Website AI Voice Assistant',
    desc: 'Tamil voice & text interface with crop image diagnosis and instant verified responses directly in browser.',
    status: 'Live Web App',
    link: '/assistant',
    btnText: 'Launch Web Assistant',
  },
  {
    icon: MessageCircle,
    theme: { primary: '#25D366', glow: 'rgba(37, 211, 102, 0.3)', bg: 'rgba(37, 211, 102, 0.12)', border: 'rgba(37, 211, 102, 0.3)' },
    name: 'WhatsApp Bot Channel',
    desc: 'Ask questions via WhatsApp text and Tamil voice notes. Instant automated AI responses for rural farmers.',
    status: 'Active Bot',
    link: '/contact',
    btnText: 'Launch WhatsApp Bot',
  },
  {
    icon: Phone,
    theme: { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.3)', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)' },
    name: 'Toll-Free Phone IVR Line',
    desc: 'Keypad feature phone accessibility. Dial 1800-GRAMA-AI, speak in Tamil, and receive AI audio answers.',
    status: 'Voice Helpline',
    link: '/contact',
    btnText: 'Access Toll-Free IVR',
  },
];

const PIPELINE_STEPS = [
  { n: 1, label: 'User Asks', sub: 'Tamil Voice / Text / Image', color: '#10b981', border: '#34d399' },
  { n: 2, label: 'Language & NLU', sub: 'Tamil Dialect Detection', color: '#06b6d4', border: '#22d3ee' },
  { n: 3, label: 'Intent Classifier', sub: 'Agri / Govt / Health / Gen', color: '#3b82f6', border: '#60a5fa' },
  { n: 4, label: 'Safety Guardrail', sub: '108 Emergency Detection', color: '#f43f5e', border: '#fb7185' },
  { n: 5, label: 'Knowledge RAG', sub: 'TNAU & Scheme DB Search', color: '#f59e0b', border: '#fbbf24' },
  { n: 6, label: 'Gemini LLM', sub: 'Grounded Context Synthesis', color: '#8b5cf6', border: '#c084fc' },
  { n: 7, label: 'Multimodal Out', sub: 'Tamil Audio + Text Render', color: '#ec4899', border: '#f472b6' },
  { n: 8, label: 'Officer Route', sub: 'VAO Ticket Handoff', color: '#64748b', border: '#94a3b8' },
];

const TRUST_ITEMS = [
  { icon: Shield, title: 'Verified Information', desc: 'Every response is grounded in verified knowledge from TNAU manuals and government portals.', theme: '#10b981' },
  { icon: Award, title: 'Safety-First Design', desc: 'Health queries are handled carefully with automatic 108 emergency escalation.', theme: '#f43f5e' },
  { icon: Users, title: 'Human Escalation', desc: 'Uncertain or complex local policy queries route directly to Village Administrative Officers.', theme: '#3b82f6' },
  { icon: Zap, title: 'Zero Hallucinations', desc: 'Strict confidence thresholds ensure no fabricated data or false certainty.', theme: '#f59e0b' },
];

export default function Home() {
  const { t } = useLanguage();

  const scrollToCTA = (e) => {
    if (e) e.preventDefault();
    const target = document.getElementById('ask-grama-mitra-cta');
    if (!target) return;

    const navOffset = 76;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navOffset;

    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const duration = 1200; // 1.2s smooth slow scroll
    let start = null;

    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1);
      const percent = Math.min(progress / duration, 1);

      window.scrollTo(0, startPosition + distance * easeInOutCubic(percent));

      if (progress < duration) {
        window.requestAnimationFrame(step);
      }
    };

    window.requestAnimationFrame(step);
  };

  return (
    <PublicLayout>
      {/* ── FULL-SCREEN CINEMATIC VIDEO HERO ── */}
      <section style={{
        position: 'relative',
        height: 'calc(100vh - var(--nav-height, 76px))',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0 0 2.5rem',
        overflow: 'hidden',
        background: '#000000',
        color: '#ffffff',
      }}>
        {/* Full-Bleed Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%) scale(1.28)',
            zIndex: 0,
            filter: 'brightness(1.06) contrast(1.04)',
          }}
          src="/video/app dashboard.mp4"
        />

        {/* Floating Glass Action Bar at Viewport Bottom */}
        <div className="container" style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
          <div style={{ maxWidth: 880, margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.85rem',
              flexWrap: 'nowrap',
              padding: '0.75rem 1rem',
              background: 'rgba(6, 11, 20, 0.8)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              borderRadius: '24px',
              boxShadow: '0 25px 65px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(124, 58, 237, 0.35)',
              maxWidth: '100%',
            }}>
              {/* Primary Voice AI CTA */}
              <Link
                to="/assistant"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #6d28d9 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  padding: '0.85rem 1.6rem 0.85rem 1.1rem',
                  borderRadius: '16px',
                  boxShadow: '0 12px 35px -4px rgba(124, 58, 237, 0.7), 0 0 25px rgba(168, 85, 247, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  letterSpacing: '0.01em',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #8b5cf6 0%, #c084fc 50%, #7c3aed 100%)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #6d28d9 100%)';
                }}
              >
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  flexShrink: 0,
                }}>
                  <Mic size={18} color="#ffffff" />
                </span>
                <span>{t('talkToGrama')}</span>
                <ArrowRight size={18} color="#ffffff" style={{ flexShrink: 0 }} />
              </Link>

              {/* Secondary Discovery CTA */}
              <button
                type="button"
                onClick={scrollToCTA}
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 58, 138, 0.45) 100%)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  padding: '0.85rem 1.6rem 0.85rem 1.1rem',
                  borderRadius: '16px',
                  border: '1px solid rgba(56, 189, 248, 0.5)',
                  backdropFilter: 'blur(16px)',
                  letterSpacing: '0.01em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  boxShadow: '0 10px 30px -5px rgba(14, 165, 233, 0.4)',
                  transition: 'all 0.25s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                  e.currentTarget.style.borderColor = '#38bdf8';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                }}
                aria-label="Explore Services"
              >
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  background: 'rgba(56, 189, 248, 0.25)',
                  border: '1px solid rgba(56, 189, 248, 0.5)',
                  flexShrink: 0,
                }}>
                  <Layers size={18} color="#38bdf8" />
                </span>
                <span>{t('exploreServices')}</span>
                <ChevronRight size={18} color="#38bdf8" style={{ flexShrink: 0 }} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE RURAL CHALLENGE ── */}
      <section className="section" style={{ background: '#020617', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '5.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: '9999px', background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>
              The Problem We Solve
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              Rural Communities Face Real Barriers
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
              Most digital government and agricultural services assume English literacy, smartphones, and high-speed internet.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {[
              {
                emoji: '🗣️',
                label: 'Language Barrier',
                desc: 'Existing portals assume English literacy, leaving non-English speakers unable to access entitlements.',
                bg: 'linear-gradient(135deg, rgba(124, 58, 237, 0.16) 0%, rgba(168, 85, 247, 0.05) 100%)',
                border: 'rgba(167, 139, 250, 0.4)',
                glow: 'rgba(167, 139, 250, 0.3)',
                iconBg: 'rgba(124, 58, 237, 0.28)',
              },
              {
                emoji: '📱',
                label: 'Digital Literacy',
                desc: 'Complex multi-step web forms create friction for rural elders and first-time mobile users.',
                bg: 'linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(52, 211, 153, 0.05) 100%)',
                border: 'rgba(52, 211, 153, 0.4)',
                glow: 'rgba(52, 211, 153, 0.3)',
                iconBg: 'rgba(16, 185, 129, 0.28)',
              },
              {
                emoji: '📡',
                label: 'Low Bandwidth',
                desc: 'Heavy website pages fail in low-network rural regions; voice and light interfaces are critical.',
                bg: 'linear-gradient(135deg, rgba(14, 165, 233, 0.16) 0%, rgba(56, 189, 248, 0.05) 100%)',
                border: 'rgba(56, 189, 248, 0.4)',
                glow: 'rgba(56, 189, 248, 0.3)',
                iconBg: 'rgba(14, 165, 233, 0.28)',
              },
              {
                emoji: '📋',
                label: 'Scheme Complexity',
                desc: 'Overlapping central and state government welfare schemes cause confusion in applications.',
                bg: 'linear-gradient(135deg, rgba(245, 158, 11, 0.16) 0%, rgba(251, 191, 36, 0.05) 100%)',
                border: 'rgba(251, 191, 36, 0.4)',
                glow: 'rgba(251, 191, 36, 0.3)',
                iconBg: 'rgba(245, 158, 11, 0.28)',
              },
              {
                emoji: '📞',
                label: 'Feature Phone Exclusion',
                desc: 'Over 40% of rural citizens rely on basic keypad feature phones without web browsers.',
                bg: 'linear-gradient(135deg, rgba(219, 39, 119, 0.16) 0%, rgba(244, 114, 182, 0.05) 100%)',
                border: 'rgba(244, 114, 182, 0.4)',
                glow: 'rgba(244, 114, 182, 0.3)',
                iconBg: 'rgba(219, 39, 119, 0.28)',
              },
              {
                emoji: '🏥',
                label: 'Unverified Advice',
                desc: 'Unreliable social media forwards can cause crop failures; verified medical escalation is essential.',
                bg: 'linear-gradient(135deg, rgba(225, 29, 72, 0.16) 0%, rgba(251, 113, 133, 0.05) 100%)',
                border: 'rgba(251, 113, 133, 0.4)',
                glow: 'rgba(251, 113, 133, 0.3)',
                iconBg: 'rgba(225, 29, 72, 0.28)',
              },
            ].map((item, i) => (
              <div
                key={i}
                style={{
                  textAlign: 'center',
                  padding: '2.5rem 2rem',
                  background: item.bg,
                  border: `1px solid ${item.border}`,
                  borderRadius: '24px',
                  backdropFilter: 'blur(16px)',
                  boxShadow: `0 12px 30px -5px ${item.glow}`,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-6px) scale(1.02)';
                  e.currentTarget.style.boxShadow = `0 20px 45px -5px ${item.glow}`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = `0 12px 30px -5px ${item.glow}`;
                }}
              >
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  background: item.iconBg,
                  border: `1px solid ${item.border}`,
                  fontSize: '2.4rem',
                  marginBottom: '1.5rem',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                }}>
                  {item.emoji}
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.85rem', color: '#ffffff', lineHeight: 1.3 }}>
                  {item.label}
                </h3>
                <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.7, fontWeight: 400 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES (3 Vibrant Glass Cards) ── */}
      <section className="section" style={{ background: '#030712', padding: '5.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>
              Core Domains
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              Three Pillars. One Trusted AI Engine.
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto' }}>
              Verified, Tamil-first guidance across agriculture, government schemes, and basic health.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {SERVICES.map((s, i) => {
              const IconComp = s.icon;
              return (
                <div
                  key={i}
                  style={{
                    background: s.theme.cardBg,
                    border: `1px solid ${s.theme.border}`,
                    borderRadius: '24px',
                    padding: '2.5rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'hidden',
                    boxShadow: `0 12px 35px -5px ${s.theme.glow}`,
                    backdropFilter: 'blur(16px)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                >
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${s.theme.primary}, ${s.theme.accent})` }} />

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.5rem' }}>
                    <div style={{ width: 62, height: 62, borderRadius: '18px', background: s.theme.gradient, border: `1px solid ${s.theme.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: `0 6px 20px ${s.theme.glow}` }}>
                      <IconComp size={30} style={{ color: s.theme.primary }} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.25, marginBottom: '0.35rem' }}>{s.title}</h3>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: s.theme.pillText, background: s.theme.pillBg, padding: '0.2rem 0.65rem', borderRadius: '9999px', border: `1px solid ${s.theme.border}`, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {s.tagline}
                      </span>
                    </div>
                  </div>

                  <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: 1.75, marginBottom: '1.75rem' }}>
                    {s.desc}
                  </p>

                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2.25rem' }}>
                    {s.examples.map((ex, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.92rem', color: '#f1f5f9' }}>
                        <ChevronRight size={16} style={{ color: s.theme.primary, flexShrink: 0 }} />
                        <span>{ex}</span>
                      </li>
                    ))}
                  </ul>

                  <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <Link
                      to={`/assistant?cat=${s.catId}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.625rem',
                        width: '100%',
                        padding: '0.95rem 1.25rem',
                        borderRadius: '14px',
                        background: `linear-gradient(135deg, ${s.theme.primary}, ${s.theme.secondary})`,
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.95rem',
                        textDecoration: 'none',
                        boxShadow: `0 8px 20px ${s.theme.glow}`,
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span>{s.btnText}</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── AI ARCHITECTURE PIPELINE PREVIEW ── */}
      <section className="section" style={{ background: '#020617', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '5.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: '9999px', background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', color: '#c084fc', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>
              Safety Architecture
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              How Grama Mitra Answers Safely
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto' }}>
              Every query passes through an 8-stage verified, safety-checked AI pipeline.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {PIPELINE_STEPS.map((step, i) => (
              <div key={i} style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: `1px solid ${step.border}35`,
                borderRadius: '18px',
                padding: '1.75rem 1.35rem',
                display: 'flex',
                gap: '1.125rem',
                alignItems: 'flex-start',
                backdropFilter: 'blur(10px)',
                boxShadow: `0 4px 20px ${step.color}15`,
              }}>
                <div style={{
                  width: 42,
                  height: 42,
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${step.color}, ${step.border})`,
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.95rem',
                  flexShrink: 0,
                  boxShadow: `0 4px 14px ${step.color}50`,
                }}>
                  {step.n}
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem', fontSize: '1.05rem', lineHeight: 1.3 }}>{step.label}</div>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, fontWeight: 500 }}>{step.sub}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/how-it-works" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.625rem',
              padding: '0.95rem 2.25rem',
              borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.05)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.95rem',
              textDecoration: 'none',
              backdropFilter: 'blur(10px)',
            }}>
              Explore Full System Architecture <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MULTI-CHANNEL ACCESS ── */}
      <section className="section" style={{ background: '#030712', padding: '5.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: '9999px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', color: '#38bdf8', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>
              Multi-Channel Delivery
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              Reach Us However You Prefer
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.15rem', maxWidth: '700px', margin: '0 auto' }}>
              Same grounded AI intelligence — accessible through website, WhatsApp, or phone dial-in.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem', maxWidth: 1100, margin: '0 auto' }}>
            {CHANNELS.map((ch, i) => {
              const ChIcon = ch.icon;
              return (
                <div
                  key={i}
                  style={{
                    padding: '2.5rem 2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    background: 'rgba(15, 23, 42, 0.75)',
                    border: `1px solid ${ch.theme.border}`,
                    borderRadius: '24px',
                    boxShadow: `0 12px 35px -5px ${ch.theme.glow}`,
                    backdropFilter: 'blur(16px)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '1.5rem' }}>
                    <div style={{
                      background: ch.theme.bg,
                      width: 62,
                      height: 62,
                      borderRadius: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${ch.theme.border}`,
                      boxShadow: `0 6px 18px ${ch.theme.glow}`,
                    }}>
                      <ChIcon size={30} style={{ color: ch.theme.primary }} />
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      padding: '0.3rem 0.8rem',
                      borderRadius: '9999px',
                      background: ch.theme.bg,
                      color: ch.theme.primary,
                      border: `1px solid ${ch.theme.border}`,
                    }}>
                      {ch.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                    {ch.name}
                  </h3>
                  <p style={{ fontSize: '0.95rem', color: '#cbd5e1', lineHeight: 1.7, marginBottom: '2rem', flex: 1 }}>
                    {ch.desc}
                  </p>

                  <div style={{ width: '100%', marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                    <Link
                      to={ch.link}
                      style={{
                        width: '100%',
                        padding: '0.9rem 1.25rem',
                        fontWeight: 800,
                        fontSize: '0.925rem',
                        display: 'inline-flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '0.5rem',
                        borderRadius: '14px',
                        color: ch.theme.primary,
                        borderColor: ch.theme.border,
                        background: ch.theme.bg,
                        border: `1px solid ${ch.theme.border}`,
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <span>{ch.btnText}</span>
                      <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── RESPONSIBLE AI & TRUST ── */}
      <section className="section" style={{ background: '#020617', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '5.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: '9999px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>
              Trust & Responsibility
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
              Responsible AI by Design
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
            {TRUST_ITEMS.map((item, i) => {
              const TrustIcon = item.icon;
              return (
                <div key={i} style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: `1px solid ${item.theme}35`,
                  borderRadius: '20px',
                  textAlign: 'center',
                  padding: '2.5rem 2rem',
                  boxShadow: `0 8px 25px ${item.theme}15`,
                  backdropFilter: 'blur(10px)',
                }}>
                  <div style={{
                    width: 60,
                    height: 60,
                    borderRadius: '18px',
                    background: `${item.theme}18`,
                    border: `1px solid ${item.theme}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                  }}>
                    <TrustIcon size={28} style={{ color: item.theme }} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.75rem', color: '#ffffff', lineHeight: 1.3 }}>{item.title}</h3>
                  <p style={{ fontSize: '0.925rem', color: '#cbd5e1', lineHeight: 1.75 }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ── IMPACT STATS STRIP (Harmonized with Harvest Video Palette) ── */}
      <section id="impact-stats-section" style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #042f2e 0%, #064e3b 30%, #78350f 70%, #451a03 100%)',
        padding: '3.75rem 0',
        marginBottom: '4rem',
        borderTop: '1px solid rgba(245, 158, 11, 0.25)',
        borderBottom: '1px solid rgba(245, 158, 11, 0.25)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
      }}>
        {/* Subtle ambient light glow matching golden harvest & emerald crops */}
        <div style={{
          position: 'absolute',
          top: 0, left: '25%', width: '50%', height: '100%',
          background: 'radial-gradient(ellipse at center, rgba(245, 158, 11, 0.15) 0%, rgba(16, 185, 129, 0.1) 50%, rgba(0,0,0,0) 80%)',
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '2.5rem', textAlign: 'center' }}>
            {[
              { v: '50+', l: 'Verified FAQs Indexed', s: 'TNAU & State Portals', color: '#6ee7b7' },
              { v: '3', l: 'Core Domains', s: 'Agri, Schemes, Health', color: '#fde047' },
              { v: '3', l: 'Delivery Channels', s: 'Web Voice, WhatsApp, IVR', color: '#fbbf24' },
              { v: '108', l: 'Emergency Safety', s: 'Automatic Medical Routing', color: '#fca5a5' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 'clamp(2.4rem, 5vw, 3.5rem)', fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: '0.5rem', textShadow: `0 4px 20px ${s.color}40`, filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.5))' }}>{s.v}</div>
                <div style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.05rem', marginBottom: '0.25rem', letterSpacing: '-0.01em' }}>{s.l}</div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', fontWeight: 600 }}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOTTOM CTA WITH BRIGHT BACKGROUND TRACTOR VIDEO ── */}
      <section id="ask-grama-mitra-cta" className="section" style={{
        position: 'relative',
        background: '#000000',
        padding: '5.5rem 0',
        borderTop: '1px solid rgba(255,255,255,0.15)',
        overflow: 'hidden',
        minHeight: '520px',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* Bright Background Tractor Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'translate(-50%, -50%) scale(1.22)',
            zIndex: 0,
            filter: 'brightness(0.92) contrast(1.05) saturate(1.15)',
          }}
          src="/video/Tractor.mp4"
        />

        {/* Clear Glass Gradient Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(135deg, rgba(3, 7, 18, 0.3) 0%, rgba(3, 7, 18, 0.15) 50%, rgba(3, 7, 18, 0.45) 100%)',
          zIndex: 1,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          {/* Top Right Corner: Ultra-Premium Glass Title Card */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3.5rem' }}>
            <div style={{
              maxWidth: '580px',
              textAlign: 'right',
              background: 'linear-gradient(135deg, rgba(6, 11, 20, 0.45) 0%, rgba(15, 23, 42, 0.35) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '28px',
              padding: '2.25rem 2.75rem',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), inset 0 1.5px 2px rgba(255, 255, 255, 0.35)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Metallic Accent Highlight Line */}
              <div style={{
                position: 'absolute',
                top: 0,
                right: '15%',
                width: '130px',
                height: '3px',
                background: 'linear-gradient(90deg, #34d399, #fbbf24, #f59e0b)',
                borderRadius: '9999px',
              }} />

              {/* Mini Pill Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', padding: '0.35rem 0.9rem', borderRadius: '9999px', background: 'rgba(245, 158, 11, 0.2)', border: '1px solid rgba(245, 158, 11, 0.5)', color: '#fbbf24', fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem', boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)', backdropFilter: 'blur(10px)' }}>
                <Sparkles size={13} style={{ color: '#fbbf24' }} />
                AI Rural Assistant
              </div>

              <h2 style={{
                fontSize: 'clamp(2rem, 4.2vw, 3rem)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.2,
                letterSpacing: '-0.025em',
                margin: 0,
                textShadow: '0 4px 25px rgba(0,0,0,0.85)',
              }}>
                Ask Grama Mitra <br />
                <span style={{
                  background: 'linear-gradient(135deg, #34d399 0%, #fde047 50%, #f59e0b 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 4px 18px rgba(245, 158, 11, 0.5))',
                }}>
                  Your First Question
                </span>
              </h2>
            </div>
          </div>

          {/* Bottom Right Corner: Action Buttons in Compact Translucent Glass Container */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{
              display: 'inline-flex',
              gap: '0.75rem',
              flexWrap: 'nowrap',
              alignItems: 'center',
              background: 'linear-gradient(135deg, rgba(6, 11, 20, 0.45) 0%, rgba(15, 23, 42, 0.35) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              padding: '0.75rem 1.15rem',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5), inset 0 1.5px 2px rgba(255, 255, 255, 0.35)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Primary Voice AI CTA */}
              <Link to="/assistant" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.6rem 1.25rem 0.6rem 0.75rem',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.88) 0%, rgba(5, 150, 105, 0.88) 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                textDecoration: 'none',
                boxShadow: '0 8px 25px -4px rgba(16, 185, 129, 0.6), inset 0 1.5px 2px rgba(255, 255, 255, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.5)',
                transition: 'all 0.25s ease',
                backdropFilter: 'blur(12px)',
                letterSpacing: '0.01em',
              }} aria-label="Start Voice Assistant">
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '30px',
                  height: '30px',
                  borderRadius: '9px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}>
                  <Mic size={16} color="#ffffff" />
                </span>
                <span style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}>Start Voice Assistant</span>
                <ArrowRight size={16} color="#ffffff" />
              </Link>

              {/* Secondary Discovery CTA */}
              <Link to="/services" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1.25rem',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.35)',
                background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.5) 0%, rgba(30, 58, 138, 0.3) 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                textDecoration: 'none',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                boxShadow: '0 8px 20px rgba(0,0,0,0.4), inset 0 1.5px 2px rgba(255, 255, 255, 0.25)',
                transition: 'all 0.25s ease',
              }} aria-label="View All Services">
                <span>View All Services</span>
                <ChevronRight size={16} color="#fbbf24" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}



