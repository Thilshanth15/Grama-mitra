import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Mic, ArrowRight, CheckCircle, Leaf, Building2, Heart, Phone, MessageCircle,
  Globe, Shield, Users, Zap, ChevronRight, Star, Award, TrendingUp, Layers
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';

import { useLanguage } from '../../context/LanguageContext.jsx';

const SAMPLE_QUESTIONS = [
  { q: 'நெல் இலை மஞ்சளாகிறது — என்ன செய்வது?', cat: 'Agriculture' },
  { q: 'PM-KISAN திட்டத்தில் எப்படி சேரலாம்?', cat: 'Government' },
  { q: 'எனக்கு காய்ச்சல் இருக்கிறது — என்ன செய்யலாம்?', cat: 'Health' },
];

const SERVICES = [
  {
    icon: Leaf,
    color: 'var(--green-600)',
    bg: 'var(--green-50)',
    title: 'Agriculture Guidance',
    desc: 'Crop advice, pest identification, fertilizer guidance, and farming best practices from TNAU-verified sources.',
    examples: ['Crop disease identification', 'Fertilizer recommendations', 'Irrigation guidance'],
  },
  {
    icon: Building2,
    color: 'var(--blue-600)',
    bg: 'var(--blue-50)',
    title: 'Government Schemes',
    desc: 'Eligibility, documents, and step-by-step application guidance for PM-KISAN, PMFBY, KCC, and more.',
    examples: ['PM-KISAN registration', 'Crop insurance (PMFBY)', 'Kisan Credit Card'],
  },
  {
    icon: Heart,
    color: '#e11d48',
    bg: 'rgba(225, 29, 72, 0.15)',
    title: 'Basic Health Guidance',
    desc: 'General health information, vaccination schedules, and immediate escalation for emergencies. Not a replacement for medical care.',
    examples: ['Fever & common illness', 'Child vaccination info', 'Emergency escalation'],
  },
];

const CHANNELS = [
  {
    icon: Globe,
    color: 'var(--blue-400)',
    bg: 'var(--blue-50)',
    name: 'Website Assistant',
    desc: 'Tamil voice & text interface with crop image diagnosis and instant verified responses.',
    status: 'Live Channel',
    link: '/assistant',
    btnText: 'Launch Assistant',
  },
  {
    icon: MessageCircle,
    color: '#25D366',
    bg: 'rgba(37, 211, 102, 0.15)',
    name: 'WhatsApp Bot',
    desc: 'Ask questions via WhatsApp chat and voice notes. Instant responses in simple Tamil.',
    status: 'Active Channel',
    link: '/contact',
    btnText: 'Launch WhatsApp Assistant',
  },
  {
    icon: Phone,
    color: 'var(--amber-400)',
    bg: 'var(--amber-50)',
    name: 'Phone / IVR Helpline',
    desc: 'Toll-free voice recognition line designed for farmers with basic feature phones.',
    status: 'Voice Helpline',
    link: '/contact',
    btnText: 'Access IVR Helpline',
  },
];

const PIPELINE_STEPS = [
  { n: 1, label: 'User asks', sub: 'Voice or Text', color: 'var(--green-600)' },
  { n: 2, label: 'Language detection', sub: 'Tamil / English', color: 'var(--blue-600)' },
  { n: 3, label: 'Intent classification', sub: 'Agri / Govt / Health', color: 'var(--blue-500)' },
  { n: 4, label: 'Safety layer', sub: 'Emergency detection', color: '#e11d48' },
  { n: 5, label: 'Knowledge search', sub: 'Verified sources', color: 'var(--amber-600)' },
  { n: 6, label: 'AI generation', sub: 'Grounded by Gemini', color: 'var(--green-600)' },
  { n: 7, label: 'Tamil response', sub: 'Text + Audio', color: 'var(--green-700)' },
  { n: 8, label: 'Human handoff', sub: 'If needed', color: 'var(--gray-600)' },
];

const TRUST_ITEMS = [
  { icon: Shield, title: 'Verified Information', desc: 'Every response is grounded in verified knowledge from trusted government and agricultural sources.' },
  { icon: Award, title: 'Safety-First Design', desc: 'Health queries are handled carefully. Emergencies are escalated immediately. No harmful advice.' },
  { icon: Users, title: 'Human Escalation', desc: 'When AI confidence is low or queries are sensitive, real humans step in through the handoff system.' },
  { icon: Zap, title: 'Honest AI', desc: 'If we don\'t know the answer, we say so — and connect you with help. No hallucinations.' },
];

export default function Home() {
  const { t } = useLanguage();
  const scrollToCTA = (e) => {
    if (e) e.preventDefault();
    const target = document.getElementById('ask-grama-mitra-cta');
    if (!target) return;

    const navOffset = 60;
    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navOffset;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  };

  return (
    <PublicLayout>
      {/* ── FULL-SCREEN CINEMATIC VIDEO HERO (Fills Entire Screen Viewport) ── */}
      <section style={{
        position: 'relative',
        height: 'calc(100vh - var(--nav-height, 76px))',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0 0 2rem',
        overflow: 'hidden',
        background: '#000000',
        color: '#ffffff',
      }}>
        {/* Full-Bleed Video that fills 100% of the viewport with vivid clarity */}
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
            transform: 'translate(-50%, -50%) scale(1.18)',
            zIndex: 0,
            filter: 'brightness(1.06) contrast(1.04)',
          }}
          src="/video/Cinematic_4k_quality_video._The_20260919174842.mp4"
        />

        {/* Action Buttons Positioned at Bottom of Video */}
        <div className="container" style={{ position: 'relative', zIndex: 3, textAlign: 'center' }}>
          <div style={{ maxWidth: 860, margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1.15rem',
              flexWrap: 'wrap',
              padding: '0.65rem',
              background: 'rgba(6, 11, 20, 0.65)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.22)',
              borderRadius: '9999px',
              boxShadow: '0 25px 60px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(16, 185, 129, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.25)',
            }}>
              {/* Primary Voice AI CTA — Electric Cyan & Emerald Glass */}
              <Link
                to="/assistant"
                style={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 50%, #0d9488 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  padding: '0.9rem 2rem 0.9rem 1.25rem',
                  borderRadius: '9999px',
                  boxShadow: '0 10px 32px -4px rgba(6, 182, 212, 0.65), 0 0 22px rgba(16, 185, 129, 0.45), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.5)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  letterSpacing: '0.02em',
                  textDecoration: 'none',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.03)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #22d3ee 0%, #34d399 50%, #14b8a6 100%)';
                  e.currentTarget.style.boxShadow = '0 16px 45px -4px rgba(6, 182, 212, 0.85), 0 0 30px rgba(52, 211, 153, 0.6), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.9)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, #06b6d4 0%, #10b981 50%, #0d9488 100%)';
                  e.currentTarget.style.boxShadow = '0 10px 32px -4px rgba(6, 182, 212, 0.65), 0 0 22px rgba(16, 185, 129, 0.45), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.7)';
                }}
              >
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.18))',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid rgba(255, 255, 255, 0.6)',
                  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.35)',
                }}>
                  <Mic size={19} color="#ffffff" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))' }} />
                </span>
                <span style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>{t('talkToGrama')}</span>
                <ArrowRight size={19} color="#ffffff" />
              </Link>

              {/* Secondary Discovery CTA — Ultra-Premium Sapphire & Cyan Glass */}
              <button
                type="button"
                onClick={scrollToCTA}
                style={{
                  background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(30, 58, 138, 0.4) 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  padding: '0.9rem 2rem 0.9rem 1.25rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(56, 189, 248, 0.45)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  letterSpacing: '0.02em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  textDecoration: 'none',
                  boxShadow: '0 10px 30px -5px rgba(14, 165, 233, 0.35), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.25)',
                  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(14, 165, 233, 0.35) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.75)';
                  e.currentTarget.style.boxShadow = '0 16px 40px -4px rgba(56, 189, 248, 0.55), 0 0 20px rgba(56, 189, 248, 0.4), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(15, 23, 42, 0.88) 0%, rgba(30, 58, 138, 0.4) 100%)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.45)';
                  e.currentTarget.style.boxShadow = '0 10px 30px -5px rgba(14, 165, 233, 0.35), inset 0 1.5px 2px 0 rgba(255, 255, 255, 0.25)';
                }}
                aria-label="Explore Services - Scroll to Ask Grama Mitra"
              >
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.35), rgba(14, 165, 233, 0.15))',
                  border: '1px solid rgba(56, 189, 248, 0.5)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}>
                  <Layers size={19} color="#38bdf8" />
                </span>
                <span style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>{t('exploreServices')}</span>
                <ChevronRight size={19} color="#38bdf8" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="section" style={{ background: '#050507', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <span className="section-label">The Challenge</span>
            </div>
            <h2 className="section-title">Rural communities face real barriers</h2>
            <p className="section-subtitle">
              Most digital services assume English literacy, smartphones, and stable connectivity — 
              leaving rural users behind.
            </p>
          </div>
          <div className="challenge-grid">
            {[
              { emoji: '🗣️', label: 'Language Barrier', desc: 'Existing portals assume English, leaving non-English speakers unable to access entitlements.' },
              { emoji: '📱', label: 'Digital Literacy', desc: 'Multi-step web forms create friction for rural elders and first-time smartphone users.' },
              { emoji: '📡', label: 'Connectivity & Speed', desc: 'Heavy pages fail in low-bandwidth rural regions; voice and light interfaces are needed.' },
              { emoji: '📋', label: 'Scheme Complexity', desc: 'Overlapping central and state government welfare schemes cause confusion in applications.' },
              { emoji: '📞', label: 'Feature Phones', desc: 'Over 40% of rural users rely on feature phones without modern web browsers or apps.' },
              { emoji: '🏥', label: 'Health Access', desc: 'Unreliable WhatsApp forward advice can be dangerous; verified medical escalation is critical.' },
            ].map((item, i) => (
              <div key={i} className="card card-hover" style={{ textAlign: 'center', padding: '2.5rem 1.85rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1.25rem' }}>{item.emoji}</div>
                <div className="font-semibold" style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--gray-900)', lineHeight: 1.4 }}>{item.label}</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--gray-400)', lineHeight: 1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CORE SERVICES ── */}
      <section className="section" style={{ background: '#000000' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <span className="section-label">Core Services</span>
            </div>
            <h2 className="section-title">Three areas. One trusted platform.</h2>
            <p className="section-subtitle">
              Verified, Tamil-first guidance across agriculture, government schemes, and basic health.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.25rem' }}>
            {SERVICES.map((s, i) => (
              <div key={i} className="card card-hover" style={{ position: 'relative', overflow: 'hidden', padding: '2.75rem 2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                  background: s.color, borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                }} />
                <div style={{ width: 60, height: 60, borderRadius: 'var(--radius-xl)', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <s.icon size={28} color={s.color} />
                </div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.875rem', color: 'var(--gray-900)', lineHeight: 1.35 }}>{s.title}</h3>
                <p style={{ color: 'var(--gray-400)', fontSize: '0.925rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>{s.desc}</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '2rem' }}>
                  {s.examples.map((ex, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', fontSize: '0.9rem', color: 'var(--gray-300)', lineHeight: 1.5 }}>
                      <ChevronRight size={15} color={s.color} style={{ flexShrink: 0 }} />
                      {ex}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
                  <Link
                    to={`/assistant?cat=${s.title.toLowerCase().includes('agri') ? 'agriculture' : s.title.toLowerCase().includes('govt') ? 'government' : 'health'}`}
                    className="btn btn-outline"
                    style={{ color: s.color, borderColor: s.color, width: '100%', padding: '0.85rem 1.25rem', fontWeight: 700, fontSize: '0.925rem', display: 'inline-flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                    aria-label={`Ask question about ${s.title}`}
                  >
                    Ask {s.title.split(' ')[0]} Question <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW AI PIPELINE WORKS ── */}
      <section className="section" style={{ background: '#050507', color: 'var(--color-text)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <span className="section-label">
                AI Architecture
              </span>
            </div>
            <h2 className="section-title">
              How Grama Mitra answers safely
            </h2>
            <p className="section-subtitle">
              Every query passes through a verified, safety-checked, human-reviewed AI pipeline.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
            {PIPELINE_STEPS.map((step, i) => (
              <div key={i} className="card-hover" style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.75rem 1.35rem',
                display: 'flex',
                gap: '1.125rem',
                alignItems: 'flex-start',
                transition: 'all 0.2s',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: step.color, color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '0.875rem', flexShrink: 0,
                  boxShadow: `0 4px 14px ${step.color}40`,
                }}>
                  {step.n}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#fff', marginBottom: '0.45rem', fontSize: '1.05rem', lineHeight: 1.35 }}>{step.label}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--gray-400)', lineHeight: 1.6 }}>{step.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/how-it-works" className="btn btn-outline" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.25)', padding: '0.9rem 2.25rem', fontWeight: 600 }}>
              Explore Full 9-Step Pipeline Details <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CHANNELS ── */}
      <section className="section" style={{ background: '#000000' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <span className="section-label">Multi-Channel Access</span>
            </div>
            <h2 className="section-title">Reach us however you prefer</h2>
            <p className="section-subtitle">
              Same AI intelligence — accessible through website, WhatsApp, or phone.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.25rem', maxWidth: 1060, margin: '0 auto' }}>
            {CHANNELS.map((ch, i) => (
              <div
                key={i}
                className="card card-hover"
                style={{
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'left',
                  alignItems: 'flex-start',
                  position: 'relative',
                  background: '#0c0c12',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 'var(--radius-xl)',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
                }}
              >
                {/* Top Row: Icon on left, Status Badge on right */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: '1.5rem' }}>
                  <div style={{
                    background: ch.bg,
                    width: 60,
                    height: 60,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${ch.color}33`,
                  }}>
                    <ch.icon size={28} color={ch.color} />
                  </div>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    background: ch.status.includes('Live') || ch.status.includes('Active') ? 'rgba(16, 185, 129, 0.18)' : 'rgba(59, 130, 246, 0.18)',
                    color: ch.status.includes('Live') || ch.status.includes('Active') ? '#34d399' : '#60a5fa',
                    border: `1px solid ${ch.status.includes('Live') || ch.status.includes('Active') ? 'rgba(52, 211, 153, 0.35)' : 'rgba(96, 165, 250, 0.35)'}`,
                  }}>
                    {ch.status}
                  </span>
                </div>

                {/* Title & Description Aligned */}
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem', lineHeight: 1.3 }}>
                  {ch.name}
                </h3>
                <p style={{ fontSize: '0.925rem', color: 'var(--gray-400)', lineHeight: 1.7, marginBottom: '2rem', flex: 1 }}>
                  {ch.desc}
                </p>

                {/* Full-Width Action Button */}
                <div style={{ width: '100%', marginTop: 'auto', paddingTop: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                  <Link
                    to={ch.link}
                    className="btn btn-outline"
                    style={{
                      width: '100%',
                      padding: '0.85rem 1.25rem',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      display: 'inline-flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      gap: '0.5rem',
                      borderRadius: '12px',
                      color: ch.color,
                      borderColor: `${ch.color}55`,
                      background: 'rgba(255, 255, 255, 0.04)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = `${ch.color}15`;
                      e.currentTarget.style.borderColor = ch.color;
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                      e.currentTarget.style.borderColor = `${ch.color}55`;
                    }}
                    aria-label={`${ch.btnText} for ${ch.name}`}
                  >
                    <span>{ch.btnText}</span>
                    <ArrowRight size={15} color={ch.color} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ── */}
      <section className="section" style={{ background: '#050507', borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <span className="section-label">Why Trust Us</span>
            </div>
            <h2 className="section-title">Responsible AI by design</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.75rem' }}>
            {TRUST_ITEMS.map((item, i) => (
              <div key={i} className="card card-hover" style={{ textAlign: 'center', padding: '2.25rem 1.75rem' }}>
                <div style={{
                  width: 58, height: 58, borderRadius: 'var(--radius-xl)',
                  background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', margin: '0 auto 1.5rem',
                }}>
                  <item.icon size={26} color="var(--green-400)" />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--gray-900)', lineHeight: 1.4 }}>{item.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-400)', lineHeight: 1.75 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--green-600), var(--green-700))' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {[
              { v: '50+', l: 'Verified FAQs', s: 'Agriculture, Govt, Health' },
              { v: '3', l: 'Service Areas', s: 'Agri, Schemes, Health' },
              { v: '3', l: 'Channels', s: 'Web, WhatsApp, Phone' },
              { v: '108', l: 'Emergency Escalation', s: 'Automatic safety routing' },
            ].map((s, i) => (
              <div key={i}>
                <div style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#fff', lineHeight: 1, marginBottom: '0.5rem' }}>{s.v}</div>
                <div style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: '0.25rem' }}>{s.l}</div>
                <div style={{ fontSize: '0.8125rem', color: 'rgba(255,255,255,0.55)' }}>{s.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="ask-grama-mitra-cta" className="section" style={{ background: '#000000', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '7.5rem 0' }}>
        <div className="container-sm">
          <div style={{ marginBottom: '1.75rem' }}>
            <span className="section-label">Start Now</span>
          </div>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
            Ask Grama Mitra your first question
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto 3.5rem', lineHeight: 1.8, fontSize: '1.125rem', maxWidth: 640 }}>
            Voice or text, Tamil or English — get trusted, verified guidance within seconds.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/assistant" className="btn btn-primary btn-lg" style={{ padding: '1.125rem 2.5rem', fontWeight: 700, fontSize: '1.0625rem' }} aria-label="Start Voice Assistant">
              <Mic size={22} />
              Start Voice Assistant
            </Link>
            <Link to="/services" className="btn btn-outline btn-lg" style={{ padding: '1.125rem 2.25rem', fontWeight: 700, fontSize: '1.0625rem' }} aria-label="View All Services">
              View All Services
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
