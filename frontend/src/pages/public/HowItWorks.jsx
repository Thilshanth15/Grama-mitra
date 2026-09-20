import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Mic, Shield, Database, Brain, CheckCircle, AlertTriangle, Users, Zap,
  Globe, Search, Cpu, Sparkles, Sliders, Volume2, ShieldCheck, HeartHandshake, Layers
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';

const STEPS = [
  {
    n: 1,
    icon: Mic,
    color: '#10b981',
    lightColor: '#34d399',
    bg: 'rgba(16, 185, 129, 0.16)',
    border: 'rgba(52, 211, 153, 0.4)',
    glow: 'rgba(16, 185, 129, 0.35)',
    title: '1. User Asks (Voice or Text)',
    desc: 'The user sends a question via voice (Tamil speech) or text through the website, WhatsApp bot, or toll-free IVR phone line.',
    detail: 'Supports: Tamil text · Tamil speech · English text · WhatsApp voice notes · IVR phone calls',
    tag: 'Input Intake',
  },
  {
    n: 2,
    icon: Globe,
    color: '#0284c7',
    lightColor: '#38bdf8',
    bg: 'rgba(14, 165, 233, 0.16)',
    border: 'rgba(56, 189, 248, 0.4)',
    glow: 'rgba(14, 165, 233, 0.35)',
    title: '2. Language & Intent Classification',
    desc: 'The AI identifies the incoming language (Tamil/English) and classifies intent into Agriculture, Government Scheme, Health, Emergency, or General query.',
    detail: 'Classifiers: AGRICULTURE · GOVERNMENT_SCHEME · HEALTH · EMERGENCY · GENERAL',
    tag: 'NLP Classification',
  },
  {
    n: 3,
    icon: Shield,
    color: '#e11d48',
    lightColor: '#f87171',
    bg: 'rgba(225, 29, 72, 0.16)',
    border: 'rgba(251, 113, 133, 0.4)',
    glow: 'rgba(225, 29, 72, 0.35)',
    title: '3. Safety & Emergency Filter',
    desc: 'A dedicated safety layer scans for medical emergencies (chest pain, stroke, severe breathing difficulty) and safety hazards before any LLM execution.',
    detail: 'Emergency signals → Automatic 108 Ambulance escalation protocol activated instantly.',
    tag: 'Safety Layer',
  },
  {
    n: 4,
    icon: Database,
    color: '#f59e0b',
    lightColor: '#fbbf24',
    bg: 'rgba(245, 158, 11, 0.16)',
    border: 'rgba(251, 191, 36, 0.4)',
    glow: 'rgba(245, 158, 11, 0.35)',
    title: '4. Verified Knowledge Search (RAG)',
    desc: 'The system queries a curated vector knowledge base of verified FAQs sourced from Tamil Nadu Agricultural University (TNAU), PM-KISAN, PMFBY, and WHO.',
    detail: 'Verified Sources: TNAU · pmkisan.gov.in · pmfby.gov.in · NABARD · WHO · MoHFW',
    tag: 'Retrieval Augmented',
  },
  {
    n: 5,
    icon: Search,
    color: '#7c3aed',
    lightColor: '#c084fc',
    bg: 'rgba(124, 58, 237, 0.16)',
    border: 'rgba(192, 132, 252, 0.4)',
    glow: 'rgba(124, 58, 237, 0.35)',
    title: '5. Relevance & Anti-Hallucination Check',
    desc: 'Retrieved context is scored for relevance. If no verified information matches the user query, the AI refrains from fabricating answers.',
    detail: 'Low relevance threshold → Triggers honest explanation + human support escalation.',
    tag: 'Anti-Hallucination',
  },
  {
    n: 6,
    icon: Brain,
    color: '#db2777',
    lightColor: '#f472b6',
    bg: 'rgba(219, 39, 119, 0.16)',
    border: 'rgba(249, 168, 212, 0.4)',
    glow: 'rgba(219, 39, 119, 0.35)',
    title: '6. Grounded Gemini AI Generation',
    desc: 'Google Gemini AI generates a clear, friendly response strictly constrained to the retrieved verified facts — citing official sources.',
    detail: 'LLM Engine: Google Gemini Pro / Flash · Strict Grounding Constraints · Source Citation',
    tag: 'Grounded LLM',
  },
  {
    n: 7,
    icon: Sliders,
    color: '#0d9488',
    lightColor: '#2dd4bf',
    bg: 'rgba(13, 148, 136, 0.16)',
    border: 'rgba(45, 212, 191, 0.4)',
    glow: 'rgba(13, 148, 136, 0.35)',
    title: '7. Confidence Validation',
    desc: 'Every generated output is assigned a confidence score. High confidence responses pass automatically; low confidence queries prompt human review.',
    detail: 'Scores: High (≥80%) · Moderate (60-79%) · Needs Clarification (<60% → Escalation)',
    tag: 'Quality Scoring',
  },
  {
    n: 8,
    icon: Volume2,
    color: '#059669',
    lightColor: '#6ee7b7',
    bg: 'rgba(5, 150, 105, 0.16)',
    border: 'rgba(110, 231, 183, 0.4)',
    glow: 'rgba(5, 150, 105, 0.35)',
    title: '8. Tamil Text + Audio Output',
    desc: 'The verified answer is delivered in simple, clear Tamil as both formatted text on screen and natural spoken Tamil audio via TTS.',
    detail: 'Multilingual Output: Simple Tamil Text + Clear Tamil Audio Speech + Verified Source Badges',
    tag: 'Voice & Text',
  },
  {
    n: 9,
    icon: HeartHandshake,
    color: '#2563eb',
    lightColor: '#60a5fa',
    bg: 'rgba(37, 99, 235, 0.16)',
    border: 'rgba(96, 165, 250, 0.4)',
    glow: 'rgba(37, 99, 235, 0.35)',
    title: '9. Seamless Human Handoff',
    desc: 'When AI confidence is low or sensitive help is needed, village and district officers step in via the live officer dashboard.',
    detail: 'Live Officer Escalation: District Block Officer & Village Officer real-time portal sync.',
    tag: 'Human-in-the-Loop',
  },
];

const PRINCIPLES = [
  { icon: ShieldCheck, title: 'Safety First', desc: 'Emergency situations are detected and escalated to 108 before any AI processing.', color: '#ef4444', bg: 'rgba(239, 68, 68, 0.15)', border: 'rgba(239, 68, 68, 0.3)' },
  { icon: Database, title: 'Grounded Facts', desc: 'AI only generates answers grounded in TNAU and Government verified FAQs.', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)', border: 'rgba(56, 189, 248, 0.3)' },
  { icon: CheckCircle, title: 'Honest AI', desc: 'When confident answers aren\'t available, Grama Mitra admits it and routes to humans.', color: '#34d399', bg: 'rgba(52, 211, 153, 0.15)', border: 'rgba(52, 211, 153, 0.3)' },
  { icon: Users, title: 'Officer Sync', desc: 'Village and District Block officers get instant dashboard notifications for handoffs.', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)', border: 'rgba(192, 132, 252, 0.3)' },
  { icon: Zap, title: 'Simple Tamil', desc: 'Every response is crafted in jargon-free rural Tamil for maximum comprehension.', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.15)', border: 'rgba(251, 191, 36, 0.3)' },
  { icon: AlertTriangle, title: 'Zero Hallucinations', desc: 'Outputs are cross-validated against source documents to prevent hallucinated advice.', color: '#f472b6', bg: 'rgba(244, 114, 182, 0.15)', border: 'rgba(244, 114, 182, 0.3)' },
];

const ARCH_LAYERS = [
  { title: 'User Channels', desc: 'Website Voice & Text · WhatsApp Bot · Toll-Free Phone IVR', color: '#34d399', bg: 'rgba(16, 185, 129, 0.14)', border: 'rgba(52, 211, 153, 0.35)' },
  { title: 'API & Gateway', desc: 'FastAPI Backend + Firebase Auth + Telephony Manager', color: '#38bdf8', bg: 'rgba(14, 165, 233, 0.14)', border: 'rgba(56, 189, 248, 0.35)' },
  { title: 'AI Pipeline', desc: 'Language → Intent → Safety → Knowledge Retrieval → Gemini → Validate', color: '#c084fc', bg: 'rgba(124, 58, 237, 0.14)', border: 'rgba(192, 132, 252, 0.35)' },
  { title: 'Knowledge Base', desc: 'Firestore Vectors + Verified FAQs (TNAU, Govt Portals, WHO)', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.14)', border: 'rgba(251, 191, 36, 0.35)' },
  { title: 'Safety Engine', desc: 'Red Flag Detection → 108 Emergency Ambulance Escalation Protocol', color: '#f87171', bg: 'rgba(225, 29, 72, 0.14)', border: 'rgba(251, 113, 133, 0.35)' },
  { title: 'Multilingual Output', desc: 'Simple Tamil Text + Tamil TTS Spoken Audio + Citation Badges', color: '#2dd4bf', bg: 'rgba(13, 148, 136, 0.14)', border: 'rgba(45, 212, 191, 0.35)' },
  { title: 'Officer Dashboard', desc: 'District & Village Officer Portals for Live Handoffs & Analytics', color: '#60a5fa', bg: 'rgba(37, 99, 235, 0.14)', border: 'rgba(96, 165, 250, 0.35)' },
];

export default function HowItWorks() {
  return (
    <PublicLayout>
      {/* Hero Header with Cinematic Ambient AI Mesh */}
      <section style={{
        position: 'relative',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124, 58, 237, 0.25) 0%, rgba(16, 185, 129, 0.15) 45%, rgba(3, 3, 8, 1) 100%)',
        padding: '7rem 0 4rem',
        textAlign: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '300px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(56, 189, 248, 0.18) 50%, transparent 70%)',
          filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.6rem',
              padding: '0.45rem 1.35rem',
              borderRadius: '9999px',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(124, 58, 237, 0.18) 100%)',
              border: '1px solid rgba(52, 211, 153, 0.4)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: '#34d399',
              letterSpacing: '0.04em',
            }}>
              <Cpu size={15} color="#34d399" />
              AI ARCHITECTURE & 9-STEP PIPELINE
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #ffffff 0%, #34d399 35%, #38bdf8 70%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            lineHeight: 1.15,
            filter: 'drop-shadow(0 4px 20px rgba(16, 185, 129, 0.25))',
          }}>
            How Grama Mitra Works
          </h1>
          <p style={{ color: '#e2e8f0', fontSize: '1.18rem', fontWeight: 600, lineHeight: 1.75, maxWidth: 720, margin: '0 auto' }}>
            A 9-step verified, safety-checked AI pipeline that delivers trusted guidance to rural communities — backed by TNAU and Government data.
          </p>
        </div>
      </section>

      {/* Pipeline 9 Steps — Ultra-Vibrant Colorful Glass Cards */}
      <section className="section" style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #030308 0%, #080812 50%, #030308 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div className="container-sm">
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <span className="section-label" style={{ color: '#38bdf8', borderColor: 'rgba(56, 189, 248, 0.35)', background: 'rgba(56, 189, 248, 0.12)' }}>
              Step-by-Step Flow
            </span>
            <h2 className="section-title">The 9-Step Grounded Pipeline</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
            {STEPS.map((step, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                  position: 'relative',
                }}
              >
                {/* Left Number Orb & Connector */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: 54,
                    height: 54,
                    borderRadius: '18px',
                    background: `linear-gradient(135deg, ${step.color} 0%, ${step.color}99 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '1.25rem',
                    boxShadow: `0 0 25px ${step.glow}, inset 0 1.5px 2px rgba(255, 255, 255, 0.5)`,
                    border: '1.5px solid rgba(255, 255, 255, 0.4)',
                    flexShrink: 0,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}>
                    {step.n}
                  </div>
                  {i < STEPS.length - 1 && (
                    <div style={{
                      width: 3,
                      flex: 1,
                      minHeight: 48,
                      background: `linear-gradient(to bottom, ${step.color}, ${STEPS[i + 1].color})`,
                      margin: '0.75rem 0',
                      borderRadius: '9999px',
                      opacity: 0.65,
                      boxShadow: `0 0 10px ${step.color}`,
                    }} />
                  )}
                </div>

                {/* Right Content Card — Colorful Glassmorphism */}
                <div
                  style={{
                    flex: 1,
                    background: `linear-gradient(135deg, ${step.bg} 0%, rgba(15, 23, 42, 0.75) 100%)`,
                    border: `1.5px solid ${step.border}`,
                    borderRadius: '24px',
                    padding: '2rem 2.25rem',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    boxShadow: `0 15px 40px -10px ${step.glow}, inset 0 1px 1px rgba(255, 255, 255, 0.25)`,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-4px) scale(1.01)';
                    e.currentTarget.style.boxShadow = `0 25px 55px -5px ${step.glow}, 0 0 30px ${step.glow}`;
                    e.currentTarget.style.borderColor = step.lightColor;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = `0 15px 40px -10px ${step.glow}, inset 0 1px 1px rgba(255, 255, 255, 0.25)`;
                    e.currentTarget.style.borderColor = step.border;
                  }}
                >
                  {/* Top Bar: Icon + Title + Tag Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <div style={{
                        width: 42,
                        height: 42,
                        borderRadius: '12px',
                        background: step.bg,
                        border: `1px solid ${step.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 4px 15px ${step.glow}`,
                      }}>
                        <step.icon size={22} color={step.lightColor} />
                      </div>
                      <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                        {step.title}
                      </h3>
                    </div>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                      padding: '0.3rem 0.85rem',
                      borderRadius: '9999px',
                      background: step.bg,
                      color: step.lightColor,
                      border: `1px solid ${step.border}`,
                      boxShadow: `0 2px 10px ${step.glow}`,
                    }}>
                      {step.tag}
                    </span>
                  </div>

                  <p style={{ color: '#f1f5f9', fontSize: '1.025rem', lineHeight: 1.8, marginBottom: '1.15rem', fontWeight: 400 }}>
                    {step.desc}
                  </p>

                  <div style={{
                    fontSize: '0.875rem',
                    color: step.lightColor,
                    fontWeight: 700,
                    lineHeight: 1.6,
                    padding: '0.75rem 1.15rem',
                    background: 'rgba(0, 0, 0, 0.35)',
                    border: `1px solid ${step.border}`,
                    borderRadius: '14px',
                    letterSpacing: '0.01em',
                  }}>
                    💡 {step.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible AI Principles — Vivid Colorful Cards */}
      <section className="section" style={{ position: 'relative', background: '#000000', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
        {/* Full-Screen Rural Farming Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
          }}
          src="/video/snki'.mp4"
        />

        {/* Subtle Dark Overlay for Text & Card Readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          zIndex: 1,
          pointerEvents: 'none',
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: '4.5rem' }}>
            <h2 className="section-title">Built on Responsible AI</h2>
            <p className="section-subtitle">
              Every component is engineered for safety, transparency, zero hallucinations, and high rural accessibility.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.25rem' }}>
            {PRINCIPLES.map((p, i) => (
              <div
                key={i}
                style={{
                  background: `linear-gradient(135deg, ${p.bg} 0%, rgba(15, 23, 42, 0.75) 100%)`,
                  border: `1px solid ${p.border}`,
                  borderRadius: '24px',
                  padding: '2.25rem 2rem',
                  display: 'flex',
                  gap: '1.25rem',
                  alignItems: 'flex-start',
                  backdropFilter: 'blur(16px)',
                  boxShadow: `0 12px 30px -5px ${p.bg}, inset 0 1px 1px rgba(255, 255, 255, 0.2)`,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                  e.currentTarget.style.borderColor = p.color;
                  e.currentTarget.style.boxShadow = `0 20px 45px -5px ${p.bg}, 0 0 25px ${p.color}44`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = p.border;
                  e.currentTarget.style.boxShadow = `0 12px 30px -5px ${p.bg}, inset 0 1px 1px rgba(255, 255, 255, 0.2)`;
                }}
              >
                <div style={{
                  width: 54, height: 54, borderRadius: '16px',
                  background: p.bg, border: `1px solid ${p.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  boxShadow: `0 4px 15px ${p.bg}`,
                }}>
                  <p.icon size={26} color={p.color} />
                </div>
                <div>
                  <h3 style={{ color: '#ffffff', marginBottom: '0.65rem', fontSize: '1.2rem', fontWeight: 800 }}>{p.title}</h3>
                  <p style={{ color: '#cbd5e1', fontSize: '0.9375rem', lineHeight: 1.7, fontWeight: 400 }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive System Architecture Diagram (Judges Wow Component) */}
      <section className="section" style={{ background: '#030308' }}>
        <div className="container-sm">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <span className="section-label" style={{ color: '#c084fc', borderColor: 'rgba(192, 132, 252, 0.35)', background: 'rgba(192, 132, 252, 0.12)' }}>
                System Architecture Flow
              </span>
            </div>
            <h2 className="section-title">End-to-End System Blueprint</h2>
            <p className="section-subtitle">
              How queries travel across web, voice, vector retrieval, and live officer handoffs.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {ARCH_LAYERS.map((layer, i) => (
              <React.Fragment key={i}>
                <div style={{
                  background: `linear-gradient(135deg, ${layer.bg} 0%, rgba(15, 23, 42, 0.85) 100%)`,
                  border: `1.5px solid ${layer.border}`,
                  borderRadius: '20px',
                  padding: '1.5rem 2rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.5rem',
                  backdropFilter: 'blur(16px)',
                  boxShadow: `0 10px 30px -5px ${layer.bg}, inset 0 1px 1px rgba(255, 255, 255, 0.25)`,
                  transition: 'all 0.25s ease',
                  flexWrap: 'wrap',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '32px', height: '32px', borderRadius: '10px',
                      background: layer.bg, border: `1px solid ${layer.border}`,
                      color: layer.color, fontWeight: 800, fontSize: '0.85rem'
                    }}>
                      0{i + 1}
                    </span>
                    <span style={{ color: layer.color, fontWeight: 800, fontSize: '1.15rem' }}>
                      {layer.title}
                    </span>
                  </div>
                  <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '0.95rem' }}>
                    {layer.desc}
                  </span>
                </div>
                {i < ARCH_LAYERS.length - 1 && (
                  <div style={{ textAlign: 'center', color: layer.color, fontSize: '1.25rem', fontWeight: 900, opacity: 0.8 }}>
                    ↓
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/assistant" className="btn btn-primary btn-lg" style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              padding: '1.125rem 2.75rem',
              fontWeight: 800,
              fontSize: '1.0625rem',
              boxShadow: '0 12px 35px rgba(16, 185, 129, 0.5), inset 0 1.5px 2px rgba(255, 255, 255, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '18px',
            }}>
              Try Voice Assistant Live <ArrowRight size={19} />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

