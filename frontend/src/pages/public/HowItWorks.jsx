import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mic, Shield, Database, Brain, CheckCircle, AlertTriangle, Users, Zap } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';

const STEPS = [
  {
    n: 1, icon: Mic, color: 'var(--green-600)', bg: 'var(--green-50)',
    title: 'User Asks',
    desc: 'The user sends a question via voice (Tamil speech) or text through the website, WhatsApp, or phone IVR.',
    detail: 'Supports: Tamil text · Tamil speech · English text · WhatsApp messages · IVR phone calls',
  },
  {
    n: 2, icon: Brain, color: 'var(--blue-600)', bg: 'var(--blue-50)',
    title: 'Language & Intent Detection',
    desc: 'The AI identifies the language and classifies the intent — Agriculture, Government Scheme, Health, Emergency, or General.',
    detail: 'Intents: AGRICULTURE · GOVERNMENT_SCHEME · HEALTH · EMERGENCY · GENERAL · UNKNOWN',
  },
  {
    n: 3, icon: Shield, color: '#e11d48', bg: 'rgba(225, 29, 72, 0.15)',
    title: 'Safety Layer',
    desc: 'A dedicated safety classifier checks for emergency signals — severe chest pain, breathing difficulty, stroke symptoms, and other red flags.',
    detail: 'Emergency signals → Immediate escalation protocol activated. No AI response replaces 108 in emergencies.',
  },
  {
    n: 4, icon: Database, color: 'var(--amber-600)', bg: 'var(--amber-50)',
    title: 'Verified Knowledge Search',
    desc: 'The system searches a curated knowledge base of verified agricultural, government, and health FAQs sourced from TNAU, government portals, and health authorities.',
    detail: 'Sources: TNAU · pmkisan.gov.in · pmfby.gov.in · NABARD · WHO · MoHFW · NVBDCP',
  },
  {
    n: 5, icon: CheckCircle, color: 'var(--green-600)', bg: 'var(--green-50)',
    title: 'Relevance Check',
    desc: 'The retrieved knowledge is evaluated for relevance to the query. If no relevant verified information is found, the system does not hallucinate.',
    detail: 'Low relevance → honest explanation + human handoff offered. No fabricated answers.',
  },
  {
    n: 6, icon: Brain, color: 'var(--blue-600)', bg: 'var(--blue-50)',
    title: 'Grounded AI Generation',
    desc: 'Gemini AI generates a response grounded in the retrieved verified information — not free-form generation from training data.',
    detail: 'Powered by Google Gemini. Responses are constrained to verified knowledge. Sources are cited.',
  },
  {
    n: 7, icon: CheckCircle, color: 'var(--green-600)', bg: 'var(--green-50)',
    title: 'Response Validation & Confidence',
    desc: 'The response is validated and assigned a confidence score. Low-confidence responses trigger a human handoff recommendation.',
    detail: 'High Confidence (≥80%) · Moderate (60-79%) · Needs Clarification (<60%) → Handoff recommended',
  },
  {
    n: 8, icon: Mic, color: 'var(--green-700)', bg: 'var(--green-100)',
    title: 'Tamil Response Delivered',
    desc: 'The user receives a clear Tamil response — as text on screen, and optionally as spoken audio using Tamil text-to-speech.',
    detail: 'Text + Audio output. Source displayed. Emergency numbers cited when applicable.',
  },
  {
    n: 9, icon: Users, color: 'var(--gray-600)', bg: 'var(--gray-100)',
    title: 'Human Handoff (When Needed)',
    desc: 'If confidence is low, the query is sensitive, or the user requests human help — the interaction is escalated to the support team.',
    detail: 'Handoff priorities: Normal · High · Emergency. Admin dashboard shows full interaction history.',
  },
];

const PRINCIPLES = [
  { icon: Shield, title: 'Safety First', desc: 'Emergency situations are detected and escalated before any AI response is generated.' },
  { icon: Database, title: 'Grounded Responses', desc: 'AI only generates answers based on retrieved verified knowledge — never from memory alone.' },
  { icon: CheckCircle, title: 'Honest Uncertainty', desc: 'When confident answers aren\'t available, the system says so and connects users to help.' },
  { icon: Users, title: 'Human in the Loop', desc: 'Sensitive, uncertain, and emergency cases always have a human support pathway.' },
  { icon: Zap, title: 'Tamil-First', desc: 'Every response is optimized for Tamil comprehension — simple language, no jargon.' },
  { icon: AlertTriangle, title: 'No Hallucination', desc: 'Responses are validated against retrieved data. Fabricated information is blocked.' },
];

export default function HowItWorks() {
  return (
    <PublicLayout>
      {/* Header */}
      <section style={{
        background: '#000000',
        padding: '5.5rem 0 3.5rem',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div className="container">
          <div style={{ marginBottom: '1.75rem' }}>
            <span className="section-label">The Technology</span>
          </div>
          <h1 className="section-title">How Grama Mitra Works</h1>
          <p className="section-subtitle">
            A 9-step verified, safety-checked pipeline that ensures every rural user gets 
            trusted answers — or honest escalation.
          </p>
        </div>
      </section>

      {/* Pipeline */}
      <section className="section" style={{ background: '#050507', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="container-sm">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                {/* Left: Number + connector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 48, height: 48, borderRadius: '50%',
                    background: `linear-gradient(135deg, ${step.color}, ${step.color}99)`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: 800, fontSize: '0.95rem',
                    boxShadow: `0 6px 16px ${step.color}40`,
                    flexShrink: 0,
                  }}>
                    {step.n}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{ width: 2, flex: 1, minHeight: 36, background: 'var(--color-border)', margin: '0.5rem 0' }} />
                  )}
                </div>

                {/* Right: Content */}
                <div className="card card-hover" style={{ flex: 1, marginBottom: 0, padding: '1.75rem 2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 'var(--radius-md)',
                      background: step.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <step.icon size={18} color={step.color} />
                    </div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.3 }}>{step.title}</h3>
                  </div>
                  <p style={{ color: '#f1f5f9', fontSize: '1rem', lineHeight: 1.8, marginBottom: '0.85rem' }}>
                    {step.desc}
                  </p>
                  <div style={{ fontSize: '0.875rem', color: step.color, fontWeight: 700, lineHeight: 1.6, letterSpacing: '0.01em' }}>
                    {step.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="section" style={{ background: 'var(--color-bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <div style={{ marginBottom: '1.75rem' }}>
              <span className="section-label">Design Principles</span>
            </div>
            <h2 className="section-title">Built on responsible AI</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="card card-hover" style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', padding: '2.25rem 2rem' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--radius-lg)',
                  background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <p.icon size={24} color="var(--green-400)" />
                </div>
                <div>
                  <div className="font-bold" style={{ color: '#ffffff', marginBottom: '0.5rem', fontSize: '1.15rem' }}>{p.title}</div>
                  <div className="text-sm" style={{ color: '#e2e8f0', lineHeight: 1.75 }}>{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture note */}
      <section className="section" style={{ background: '#050507', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="container-sm">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ color: '#ffffff', fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)', fontWeight: 800 }}>System Architecture</h2>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 'var(--radius-2xl)',
            padding: '2.25rem',
            fontFamily: 'monospace',
            fontSize: '0.875rem',
            color: '#f8fafc',
            lineHeight: 2,
          }}>
            {[
              ['User Channels', 'Website · WhatsApp · Phone IVR Helpline', 'var(--green-400)'],
              ['↓', '', ''],
              ['API Layer', 'FastAPI + Firebase Authentication', 'var(--blue-400)'],
              ['↓', '', ''],
              ['AI Pipeline', 'Language → Intent → Safety → Knowledge → Gemini → Validate', 'var(--amber-400)'],
              ['↓', '', ''],
              ['Knowledge Base', 'Firestore + Verified FAQs (TNAU, Gov Portals, WHO)', 'var(--green-400)'],
              ['↓', '', ''],
              ['Safety Engine', 'Emergency Detection → 108 Escalation Protocol', '#f87171'],
              ['↓', '', ''],
              ['Response', 'Tamil Text + Audio + Source + Confidence', 'var(--green-400)'],
              ['↓', '', ''],
              ['Admin Dashboard', 'Firebase Firestore → Real-time Query/Handoff/Alert visibility', 'var(--blue-400)'],
            ].map(([label, detail, color], i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <span style={{ color: color || '#ffffff', minWidth: 200, fontWeight: label === '↓' ? 400 : 700 }}>{label}</span>
                {detail && <span style={{ color: '#cbd5e1', fontWeight: 500 }}>{detail}</span>}
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/assistant" className="btn btn-primary btn-lg" style={{ padding: '1.125rem 2.5rem', fontWeight: 700, fontSize: '1.0625rem' }} aria-label="Try Voice Assistant">
              Try the Assistant Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
