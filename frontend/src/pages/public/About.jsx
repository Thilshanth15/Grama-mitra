import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Shield, Users, Zap, Heart, Award, ArrowRight, CheckCircle } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';

const TEAM_VALUES = [
  { icon: Shield, title: 'Safety First', desc: 'Emergency situations are never handled by AI alone. We escalate immediately.' },
  { icon: CheckCircle, title: 'Verified Information', desc: 'Every fact comes from government portals, TNAU, WHO, or trusted authorities.' },
  { icon: Heart, title: 'Rural-Centered', desc: 'Designed for farmers, elderly users, and communities with limited digital access.' },
  { icon: Zap, title: 'Tamil-Native', desc: 'Tamil is the primary language — not an afterthought. Simple, natural Tamil responses.' },
  { icon: Users, title: 'Human Support', desc: 'AI handles common queries. Humans handle what AI cannot — with priority escalation.' },
  { icon: Award, title: 'Honest AI', desc: 'We acknowledge limitations. No hallucinations. No fake sources. No false certainty.' },
];

const TECH_STACK = [
  { name: 'React + Vite', role: 'Frontend Framework' },
  { name: 'FastAPI (Python)', role: 'AI Backend' },
  { name: 'Google Gemini', role: 'AI Language Model' },
  { name: 'Firebase Firestore', role: 'Database' },
  { name: 'Firebase Auth', role: 'Authentication' },
  { name: 'Web Speech API', role: 'Voice I/O (Browser)' },
];

export default function About() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section style={{
        background: '#000000',
        padding: '5.5rem 0 3.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span className="section-label">Our Mission</span>
          </div>
          <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>
            AI-powered access for rural India
          </h1>
          <p style={{ fontSize: '1.0625rem', color: 'var(--gray-400)', lineHeight: 1.8, marginBottom: '2rem' }}>
            Grama Mitra was built to solve a real problem: millions of rural families struggle to access 
            reliable information about farming, government entitlements, and health — because most digital 
            services assume English literacy, smartphones, and stable internet.
          </p>
          <p style={{ fontSize: '1.1rem', color: 'var(--green-400)', lineHeight: 1.8, marginBottom: '2.5rem', fontFamily: 'var(--font-tamil)', fontWeight: 600 }}>
            நாங்கள் நம்புகிறோம் — ஒவ்வொரு விவசாயிக்கும், ஒவ்வொரு குடும்பத்திற்கும், 
            நம்பகமான தகவல் கிடைக்க வேண்டும். தங்கள் மொழியில். தங்கள் குரலில்.
          </p>
          <Link to="/assistant" className="btn btn-primary btn-lg" style={{ padding: '1rem 2.5rem', fontWeight: 700 }}>
            Try the Assistant <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Problem + Solution */}
      <section className="section" style={{ background: '#050507', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
            <div>
              <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.5rem', lineHeight: 1.3 }}>The Problem</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  'Farmers struggle to navigate complex government scheme portals',
                  'Health information is only available in English or complex medical language',
                  'Crop disease advice often comes from unreliable social media sources',
                  'Feature phone users have no access to digital information services',
                  'Emergency health situations go unrecognized due to lack of awareness',
                ].map((p, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', color: '#f1f5f9', fontSize: '0.975rem', lineHeight: 1.65 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <span style={{ color: 'var(--red-400)', fontSize: '0.9rem', fontWeight: 800 }}>×</span>
                    </div>
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h2 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#ffffff', marginBottom: '1.5rem', lineHeight: 1.3 }}>Our Solution</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  'Tamil-first voice + text interface — no English required',
                  'Verified knowledge base from TNAU, government portals, WHO',
                  'Automatic emergency detection and escalation to professional help',
                  'WhatsApp + IVR channels for non-smartphone users',
                  'Human handoff system for uncertain or sensitive queries',
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', color: '#f1f5f9', fontSize: '0.975rem', lineHeight: 1.65 }}>
                    <CheckCircle size={20} color="var(--green-400)" style={{ flexShrink: 0, marginTop: 2 }} />
                    <span>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section" style={{ background: '#000000' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <span className="section-label">Our Values</span>
            </div>
            <h2 className="section-title">What guides us</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {TEAM_VALUES.map((v, i) => (
              <div key={i} className="card card-hover" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '2.25rem 2rem' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 'var(--radius-xl)',
                  background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <v.icon size={26} color="var(--green-400)" />
                </div>
                <div>
                  <div className="font-bold" style={{ color: '#ffffff', marginBottom: '0.5rem', fontSize: '1.15rem' }}>{v.title}</div>
                  <div style={{ color: '#cbd5e1', lineHeight: 1.75, fontSize: '0.925rem' }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="section" style={{ background: '#050507', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container-sm">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <span className="section-label">Technology</span>
            </div>
            <h2 className="section-title">Built with modern, reliable tools</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {TECH_STACK.map((t, i) => (
              <div key={i} className="card-hover" style={{
                padding: '1.75rem 1.25rem', background: 'var(--color-surface-raised)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)', textAlign: 'center',
              }}>
                <div className="font-bold" style={{ color: '#ffffff', marginBottom: '0.45rem', fontSize: '1.1rem' }}>{t.name}</div>
                <div className="text-xs" style={{ color: 'var(--green-400)', letterSpacing: '0.04em', fontWeight: 600 }}>{t.role}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/assistant" className="btn btn-primary btn-lg" style={{ padding: '1.125rem 2.5rem', fontWeight: 700, fontSize: '1.0625rem' }} aria-label="Experience Grama Mitra Today">
              Experience Grama Mitra Today <ArrowRight size={18} />
            </Link>
          </div>

          <div style={{ marginTop: '2.5rem', padding: '1.75rem 2rem', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-xl)' }}>
            <div className="font-semibold" style={{ color: '#6ee7b7', marginBottom: '0.5rem', fontSize: '1.05rem' }}>🛡️ Responsible AI & System Architecture</div>
            <div style={{ color: '#d1fae5', lineHeight: 1.7, fontSize: '0.925rem' }}>
              Grama Mitra is grounded in verified agricultural and government sources, backed by our real-time intent classification and health safety architecture.
              Our unified multi-channel engine seamlessly powers browser voice interactions, WhatsApp inquiries, and toll-free IVR channels.
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
