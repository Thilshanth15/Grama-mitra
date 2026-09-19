import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Building2, Heart, ArrowRight, MessageSquare, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';

const SERVICES = [
  {
    id: 'agriculture',
    icon: Leaf,
    color: 'var(--green-600)',
    bg: 'var(--green-50)',
    gradientFrom: '#f0fdf4',
    title: 'Agriculture Guidance',
    tagline: 'Science-backed farming support from TNAU',
    desc: 'Get reliable crop management advice, pest identification, fertilizer recommendations, and farming best practices — all from TNAU-verified sources. No guesswork, just trusted agricultural science.',
    canHelp: [
      'Identify crop diseases and pests',
      'Fertilizer schedules and dosages',
      'Irrigation timing and methods',
      'Seed selection and planting seasons',
      'Soil health and testing guidance',
      'Dryland and wetland crop recommendations',
      'Organic farming practices',
      'Post-harvest handling basics',
    ],
    examples: [
      { q: 'நெல் இலை மஞ்சளாகிறது — என்ன காரணம்?', en: 'Yellow paddy leaves — what is the cause?' },
      { q: 'நிலக்கடலை பயிரிட சரியான நேரம் எது?', en: 'When is the right time to plant groundnut?' },
      { q: 'மண் பரிசோதனை எங்கே செய்யலாம்?', en: 'Where can I get soil tested?' },
    ],
    note: null,
    cta: 'Ask Agriculture Question',
  },
  {
    id: 'government',
    icon: Building2,
    color: 'var(--blue-600)',
    bg: 'var(--blue-50)',
    gradientFrom: '#eff6ff',
    title: 'Government Schemes',
    tagline: 'Eligibility, documents, and application guidance',
    desc: 'Navigate complex government schemes with ease. Grama Mitra provides clear eligibility criteria, required documents, and step-by-step application guidance for agricultural, health, and rural welfare schemes.',
    canHelp: [
      'PM-KISAN direct benefit transfer',
      'PMFBY crop insurance',
      'Kisan Credit Card (KCC)',
      'Aadhaar and ration card services',
      'MGNREGS rural employment',
      'TANGEDCO farmer electricity scheme',
      'Tamil Nadu health insurance (CMCHIS)',
      'State agriculture subsidy schemes',
    ],
    examples: [
      { q: 'PM-KISAN திட்டத்தில் எப்படி சேரலாம்?', en: 'How to enroll in PM-KISAN scheme?' },
      { q: 'பயிர் காப்பீடு திட்டத்திற்கு தேவையான ஆவணங்கள்?', en: 'Documents needed for crop insurance?' },
      { q: 'குடும்ப அட்டை விண்ணப்பிக்கும் முறை என்ன?', en: 'How to apply for ration card?' },
    ],
    note: 'Grama Mitra displays verified scheme information only. Always confirm final eligibility and deadlines with the official government portal.',
    cta: 'Ask About Schemes',
  },
  {
    id: 'health',
    icon: Heart,
    color: '#e11d48',
    bg: 'rgba(225, 29, 72, 0.15)',
    gradientFrom: 'rgba(225, 29, 72, 0.1)',
    title: 'Basic Health Guidance',
    tagline: 'Informational guidance — not medical diagnosis',
    desc: 'Get general health information, preventive care guidance, vaccination schedules, and basic wellness advice. For emergency situations, Grama Mitra immediately escalates to ensure you get the right help.',
    canHelp: [
      'Common illness information (fever, cold, etc.)',
      'Child vaccination schedules (free government clinics)',
      'Dengue, malaria prevention guidance',
      'Dehydration and first-aid basics',
      'Diabetes and hypertension awareness',
      'Government health scheme information',
      'When to seek professional care',
      'Emergency escalation (108 routing)',
    ],
    examples: [
      { q: 'எனக்கு காய்ச்சல் இருக்கிறது — என்ன செய்யலாம்?', en: 'I have a fever — what should I do?' },
      { q: 'குழந்தைகளுக்கு என்ன தடுப்பூசிகள் போட வேண்டும்?', en: 'What vaccinations are needed for children?' },
      { q: 'டெங்கு காய்ச்சலை தடுக்க என்ன செய்யலாம்?', en: 'How to prevent dengue fever?' },
    ],
    note: '⚠️ Grama Mitra provides general health information only — not diagnosis or treatment. Always consult a qualified doctor for medical advice. Emergency symptoms trigger automatic escalation to 108.',
    cta: 'Ask Health Question',
    isHealth: true,
  },
];

export default function Services() {
  return (
    <PublicLayout>
      {/* Header */}
      <section style={{
        background: '#000000',
        padding: '5.5rem 0 3.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span className="section-label">Our Services</span>
          </div>
          <h1 className="section-title">
            Three areas. One trusted assistant.
          </h1>
          <p className="section-subtitle">
            Verified guidance across agriculture, government schemes, and basic health — 
            available in Tamil through voice or text.
          </p>
        </div>
      </section>

      {/* Services */}
      {SERVICES.map((service, idx) => (
        <section
          key={service.id}
          id={service.id}
          className="section"
          style={{
            background: idx % 2 === 0 ? '#050507' : '#000000',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="container">
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '3rem',
              alignItems: 'start',
            }}>
              {/* Left: Info */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 'var(--radius-xl)',
                    background: service.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <service.icon size={26} color={service.color} />
                  </div>
                  <div>
                    <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2rem)', fontWeight: 800, color: 'var(--gray-900)', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                      {service.title}
                    </h2>
                    <div style={{ fontSize: '0.95rem', color: service.color, fontWeight: 600, letterSpacing: '0.01em' }}>
                      {service.tagline}
                    </div>
                  </div>
                </div>

                <p style={{ color: '#e2e8f0', lineHeight: 1.8, fontSize: '1rem', marginBottom: '2rem' }}>
                  {service.desc}
                </p>

                <div style={{ marginBottom: '2rem' }}>
                  <div className="font-semibold text-sm" style={{ color: 'var(--green-400)', marginBottom: '1rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    What Grama Mitra can help with:
                  </div>
                  <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {service.canHelp.map((item, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.95rem', color: '#f1f5f9', lineHeight: 1.6 }}>
                        <CheckCircle size={16} color={service.color} style={{ flexShrink: 0, marginTop: 3 }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {service.note && (
                  <div className={`highlight-box ${service.isHealth ? 'red' : 'blue'}`} style={{ marginBottom: '2rem', padding: '1.25rem 1.5rem', fontSize: '0.875rem', lineHeight: 1.65 }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                      {service.isHealth ? <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} /> : <Info size={16} style={{ flexShrink: 0, marginTop: 2 }} />}
                      <span>{service.note}</span>
                    </div>
                  </div>
                )}

                <Link
                  to={`/assistant?cat=${service.id}`}
                  className="btn btn-primary"
                  style={{ background: service.color, borderColor: service.color, padding: '0.9rem 2rem', fontWeight: 700, fontSize: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.625rem' }}
                  aria-label={`${service.cta} for ${service.title}`}
                >
                  <MessageSquare size={17} />
                  {service.cta}
                  <ArrowRight size={17} />
                </Link>
              </div>

              {/* Right: Example questions */}
              <div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: `1px solid rgba(255, 255, 255, 0.12)`,
                  borderRadius: 'var(--radius-2xl)',
                  padding: '1.75rem',
                }}>
                  <div className="font-semibold text-sm" style={{ color: '#ffffff', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Example Questions
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {service.examples.map((ex, i) => (
                      <Link
                        key={i}
                        to={`/assistant?q=${encodeURIComponent(ex.q)}`}
                        style={{
                          display: 'block',
                          padding: '1.35rem 1.5rem',
                          background: 'var(--color-surface-raised)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-xl)',
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          textDecoration: 'none',
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.borderColor = service.color;
                          e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.5)';
                          e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.borderColor = 'var(--color-border)';
                          e.currentTarget.style.boxShadow = 'none';
                          e.currentTarget.style.transform = 'none';
                        }}
                        aria-label={`Ask: ${ex.q}`}
                      >
                        <div style={{ fontFamily: 'var(--font-tamil)', color: '#ffffff', marginBottom: '0.5rem', lineHeight: 1.65, fontWeight: 600, fontSize: '1.1rem' }}>
                          {ex.q}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#cbd5e1', fontStyle: 'italic', lineHeight: 1.5 }}>
                          {ex.en}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem', fontSize: '0.85rem', color: service.color, fontWeight: 700 }}>
                          Try this question <ArrowRight size={13} />
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="section" style={{ background: '#000000', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div className="container-sm">
          <h2 style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 800, color: '#ffffff', marginBottom: '1.25rem' }}>
            Ready to ask your question?
          </h2>
          <p style={{ color: '#e2e8f0', fontSize: '1.0625rem', marginBottom: '2.5rem', lineHeight: 1.75 }}>
            Voice or text, Tamil or English — get verified answers in seconds.
          </p>
          <Link to="/assistant" className="btn btn-primary btn-lg">
            Open Voice Assistant <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
