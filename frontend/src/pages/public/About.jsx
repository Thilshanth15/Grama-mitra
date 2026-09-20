import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, Shield, Users, Zap, Heart, Award, ArrowRight, 
  CheckCircle, XCircle, Sparkles, Globe, Cpu, Phone, BookOpen, Lock, Activity
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';

const TEAM_VALUES = [
  { 
    icon: Shield, 
    title: 'Safety First', 
    desc: 'Emergency health and crop crisis situations are never left to AI guesswork. High-risk inputs trigger immediate 108 helpline & officer escalation.',
    theme: { primary: '#f43f5e', accent: '#fb7185', bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.3)', glow: 'rgba(244, 63, 94, 0.25)' }
  },
  { 
    icon: CheckCircle, 
    title: 'Verified Information', 
    desc: 'Every factual response is grounded in TNAU agricultural manuals, state government scheme guidelines, or verified public health standards.',
    theme: { primary: '#10b981', accent: '#34d399', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.3)', glow: 'rgba(16, 185, 129, 0.25)' }
  },
  { 
    icon: Heart, 
    title: 'Rural-Centered', 
    desc: 'Empowering smallholder farmers, women, and elderly citizens with zero digital barrier interfaces, feature phone access, and Tamil speech synthesis.',
    theme: { primary: '#f59e0b', accent: '#fbbf24', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.3)', glow: 'rgba(245, 158, 11, 0.25)' }
  },
  { 
    icon: Zap, 
    title: 'Tamil-Native Voice', 
    desc: 'Tamil is the core foundation — not a translated after-thought. Natural voice recognition designed specifically for regional dialects and accents.',
    theme: { primary: '#8b5cf6', accent: '#c084fc', bg: 'rgba(139, 92, 246, 0.12)', border: 'rgba(139, 92, 246, 0.3)', glow: 'rgba(139, 92, 246, 0.25)' }
  },
  { 
    icon: Users, 
    title: 'Human-in-the-Loop', 
    desc: 'AI resolves repetitive queries instantly while escalating low-confidence local policy questions directly to Village Administrative Officers (VAO).',
    theme: { primary: '#3b82f6', accent: '#60a5fa', bg: 'rgba(59, 130, 246, 0.12)', border: 'rgba(59, 130, 246, 0.3)', glow: 'rgba(59, 130, 246, 0.25)' }
  },
  { 
    icon: Award, 
    title: 'Honest AI Guardrails', 
    desc: 'Transparent operational boundary. No hallucinations, no fake source links, and clear honest admission of system boundaries when data is missing.',
    theme: { primary: '#06b6d4', accent: '#22d3ee', bg: 'rgba(6, 182, 212, 0.12)', border: 'rgba(6, 182, 212, 0.3)', glow: 'rgba(6, 182, 212, 0.25)' }
  },
];

const TECH_STACK = [
  { name: 'React + Vite', role: 'Fast Responsive UI', icon: Globe, color: '#61dafb' },
  { name: 'FastAPI (Python)', role: 'High-Speed Async RAG Backend', icon: Cpu, color: '#059669' },
  { name: 'Google Gemini Pro', role: 'Multilingual NLU & Context Reasoning', icon: Sparkles, color: '#a855f7' },
  { name: 'PyTorch / SentenceTransformers', role: 'Custom Tamil Vector Embeddings', icon: BookOpen, color: '#ee4c2c' },
  { name: 'Toll-Free Phone IVR', role: 'Feature Phone Keypad Telephony', icon: Phone, color: '#f59e0b' },
  { name: 'Firebase Firestore', role: 'Encrypted Ticket & Session Store', icon: Lock, color: '#ffca28' },
];

const IMPACT_METRICS = [
  { label: 'Core Domains Supported', val: 'Agriculture, Schemes, Health', color: '#10b981' },
  { label: 'Supported Dialects', val: 'Native Tamil Speech & Text', color: '#8b5cf6' },
  { label: 'Safety Pipeline', val: '9-Step Verification RAG', color: '#3b82f6' },
  { label: 'Accessibility', val: '24/7 Phone IVR + Web Voice', color: '#f59e0b' },
];

const SDG_ALIGNMENTS = [
  { num: 'SDG 1', title: 'No Poverty', desc: 'Ensuring smallholder farmers receive full entitlement scheme benefits & market subsidies.' },
  { num: 'SDG 3', title: 'Good Health & Well-being', desc: 'Preventive rural sanitation advice with instant 108 emergency health escalation.' },
  { num: 'SDG 8', title: 'Decent Work & Growth', desc: 'Improving agricultural crop yield and farming resilience through TNAU guidance.' },
  { num: 'SDG 10', title: 'Reduced Inequalities', desc: 'Bridging the digital divide for illiterate and feature-phone rural citizens.' },
];

export default function About() {
  return (
    <PublicLayout>
      <style>{`
        @keyframes pulseOrb {
          0%, 100% { opacity: 0.35; transform: scale(1); }
          50% { opacity: 0.65; transform: scale(1.06); }
        }
        .about-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 0;
          animation: pulseOrb 9s ease-in-out infinite alternate;
        }
        .value-card {
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .value-card:hover {
          transform: translateY(-5px);
        }
      `}</style>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        background: '#030712',
        padding: '6.5rem 0 4rem',
        overflow: 'hidden',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div className="about-orb" style={{ top: '-10%', left: '20%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, rgba(0,0,0,0) 70%)' }} />
        <div className="about-orb" style={{ top: '25%', right: '15%', width: '480px', height: '480px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(0,0,0,0) 70%)' }} />
        <div className="about-orb" style={{ bottom: '-15%', left: '35%', width: '420px', height: '420px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.18) 0%, rgba(0,0,0,0) 70%)' }} />

        <div className="container-sm" style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 1.25rem', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(10px)', marginBottom: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
            <Sparkles size={16} style={{ color: '#34d399' }} />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'linear-gradient(90deg, #34d399, #c084fc, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Our Mission & Vision
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: 900,
            color: '#ffffff',
            letterSpacing: '-0.03em',
            lineHeight: 1.15,
            marginBottom: '1.5rem',
          }}>
            Bridging Rural India's Digital Divide <br />
            <span style={{
              background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 20px rgba(16, 185, 129, 0.3))',
            }}>
              Through Multilingual AI.
            </span>
          </h1>

          <p style={{ fontSize: 'clamp(1.05rem, 2vw, 1.2rem)', color: '#94a3b8', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: '780px', marginInline: 'auto' }}>
            Grama Mitra was engineered to solve a critical inequality: millions of rural families struggle to access reliable information about farming, government entitlements, and healthcare because existing digital tools assume English literacy, high-end smartphones, and stable internet.
          </p>

          {/* Glowing Tamil Quote Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(139, 92, 246, 0.08) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '20px',
            padding: '1.75rem 2rem',
            marginBottom: '3rem',
            boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
            backdropFilter: 'blur(10px)',
          }}>
            <p style={{ fontSize: 'clamp(1.15rem, 2.5vw, 1.4rem)', color: '#6ee7b7', lineHeight: 1.7, fontFamily: 'var(--font-tamil)', fontWeight: 700 }}>
              "நாங்கள் நம்புகிறோம் — ஒவ்வொரு விவசாயிக்கும், ஒவ்வொரு குடும்பத்திற்கும், 
              நம்பகமான தகவல் கிடைக்க வேண்டும். தங்கள் மொழியில். தங்கள் குரலில்."
            </p>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, display: 'inline-block', marginTop: '0.75rem' }}>
              — We believe every rural citizen deserves trusted answers in their own language & voice.
            </span>
          </div>

          <Link to="/assistant" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1.1rem 2.75rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: '#ffffff',
            fontWeight: 800,
            fontSize: '1.05rem',
            textDecoration: 'none',
            boxShadow: '0 8px 25px rgba(16, 185, 129, 0.35)',
            transition: 'all 0.25s ease',
          }}>
            Experience Grama Mitra AI <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Impact Stats Strip */}
      <section style={{ background: '#020617', padding: '2.5rem 0', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
            {IMPACT_METRICS.map((m, i) => (
              <div key={i} style={{
                background: 'rgba(15, 23, 42, 0.7)',
                border: `1px solid ${m.color}33`,
                borderRadius: '16px',
                padding: '1.35rem 1.5rem',
                textAlign: 'center',
                boxShadow: `0 4px 20px ${m.color}15`,
              }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: m.color, marginBottom: '0.25rem' }}>{m.val}</div>
                <div style={{ fontSize: '0.825rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem vs Solution High-Contrast Cards */}
      <section className="section" style={{ background: '#030712', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', padding: '5.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '0.35rem 1rem', borderRadius: '9999px', border: '1px solid rgba(56, 189, 248, 0.3)' }}>
              Targeted System Engineering
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#ffffff', marginTop: '1rem', letterSpacing: '-0.02em' }}>
              Transforming Rural Challenges into Solutions
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
            {/* Left: The Problem (Crimson Glass) */}
            <div style={{
              background: 'rgba(38, 12, 20, 0.7)',
              border: '1px solid rgba(244, 63, 94, 0.3)',
              borderRadius: '24px',
              padding: '2.25rem',
              boxShadow: '0 12px 35px rgba(244, 63, 94, 0.15)',
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <XCircle size={24} style={{ color: '#f43f5e' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>The Rural Problem</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {[
                  'Complex government portals require high English literacy & desktop navigation',
                  'Health information is buried in obscure medical jargon and unavailable in local Tamil dialects',
                  'Farmers rely on unverified social media posts for pest control, leading to crop losses',
                  'Feature phone users (no internet) remain excluded from modern AI services',
                  'Emergency health symptoms go unrecognized due to lack of immediate escalation',
                ].map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', color: '#fca5a5', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(244, 63, 94, 0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <span style={{ color: '#f43f5e', fontSize: '0.85rem', fontWeight: 900 }}>✕</span>
                    </div>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Our Solution (Emerald Glass) */}
            <div style={{
              background: 'rgba(6, 30, 20, 0.7)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '24px',
              padding: '2.25rem',
              boxShadow: '0 12px 35px rgba(16, 185, 129, 0.15)',
              backdropFilter: 'blur(12px)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CheckCircle size={24} style={{ color: '#10b981' }} />
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>Our AI Solution</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                {[
                  'Tamil-first voice & text interface — ask naturally in spoken Tamil with zero typing',
                  'Ground-truth RAG pipeline indexing TNAU manuals, WHO guidance & official portals',
                  'Instant pest diagnosis & organic treatment recommendations verified by agronomists',
                  'Toll-Free IVR telephony channel enabling feature phone users to dial-in 24/7',
                  'Automated 108 emergency detection & seamless VAO human officer ticket escalation',
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', color: '#6ee7b7', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    <CheckCircle size={20} style={{ color: '#10b981', flexShrink: 0, marginTop: 2 }} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section (6 Color-Coded Cards) */}
      <section className="section" style={{ background: '#020617', padding: '5.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#c084fc', background: 'rgba(192, 132, 252, 0.1)', padding: '0.35rem 1rem', borderRadius: '9999px', border: '1px solid rgba(192, 132, 252, 0.3)' }}>
              Guiding Principles
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#ffffff', marginTop: '1rem' }}>
              What Drives Grama Mitra
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            {TEAM_VALUES.map((v, i) => {
              const IconComponent = v.icon;
              return (
                <div
                  key={i}
                  className="value-card"
                  style={{
                    background: v.theme.bg,
                    border: `1px solid ${v.theme.border}`,
                    borderRadius: '20px',
                    padding: '2rem',
                    boxShadow: `0 8px 25px -5px ${v.theme.glow}`,
                  }}
                >
                  <div style={{
                    width: 54,
                    height: 54,
                    borderRadius: '14px',
                    background: `linear-gradient(135deg, ${v.theme.primary}, ${v.theme.accent})`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    boxShadow: `0 6px 18px ${v.theme.glow}`,
                  }}>
                    <IconComponent size={26} style={{ color: '#ffffff' }} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.6rem' }}>
                    {v.title}
                  </h3>
                  <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Technology Architecture Section */}
      <section className="section" style={{ background: '#030712', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '5.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#60a5fa', background: 'rgba(96, 165, 250, 0.1)', padding: '0.35rem 1rem', borderRadius: '9999px', border: '1px solid rgba(96, 165, 250, 0.3)' }}>
              Full-Stack Engineering
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#ffffff', marginTop: '1rem' }}>
              Built with Production-Grade Infrastructure
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
            {TECH_STACK.map((t, i) => {
              const TechIcon = t.icon;
              return (
                <div key={i} style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  border: `1px solid ${t.color}33`,
                  borderRadius: '18px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.25s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = t.color;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = `${t.color}33`;
                  e.currentTarget.style.transform = 'none';
                }}
                >
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    background: `${t.color}18`,
                    border: `1px solid ${t.color}40`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem',
                  }}>
                    <TechIcon size={24} style={{ color: t.color }} />
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.35rem' }}>{t.name}</div>
                  <div style={{ fontSize: '0.825rem', color: t.color, fontWeight: 700 }}>{t.role}</div>
                </div>
              );
            })}
          </div>

          {/* UN SDG Alignment Card for Judges */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(6, 30, 20, 0.8) 0%, rgba(10, 25, 47, 0.8) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Globe size={24} style={{ color: '#34d399' }} />
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                United Nations SDG Impact Alignment
              </h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem' }}>
              {SDG_ALIGNMENTS.map((sdg, idx) => (
                <div key={idx} style={{ background: 'rgba(2, 6, 23, 0.6)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 900, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.25rem' }}>
                    {sdg.num}: {sdg.title}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6 }}>
                    {sdg.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="section" style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #064e3b 0%, #0284c7 50%, #4c1d95 100%)',
        textAlign: 'center',
        padding: '5rem 0',
      }}>
        <div className="container-sm">
          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#ffffff', marginBottom: '1.25rem' }}>
            Empower Your Community Today
          </h2>
          <p style={{ color: '#e2e8f0', fontSize: '1.15rem', marginBottom: '2.5rem', lineHeight: 1.7 }}>
            Try Grama Mitra's voice & text AI engine in Tamil or English.
          </p>
          <Link to="/assistant" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.625rem',
            padding: '1.1rem 2.5rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #38bdf8 0%, #2563eb 50%, #10b981 100%)',
            color: '#ffffff',
            fontWeight: 900,
            fontSize: '1.05rem',
            textDecoration: 'none',
            boxShadow: '0 10px 30px rgba(56, 189, 248, 0.4)',
          }}>
            Open Voice Assistant <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}

