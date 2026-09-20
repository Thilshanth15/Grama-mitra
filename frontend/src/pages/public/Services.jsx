import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, Building2, Heart, ArrowRight, MessageSquare, CheckCircle, 
  AlertTriangle, Info, PhoneCall, ShieldCheck, Sparkles, Zap, 
  HelpCircle, ChevronRight, Volume2, Users, FileText
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';

const SERVICES = [
  {
    id: 'agriculture',
    icon: Leaf,
    badgeText: 'TNAU Verified AI Engine',
    theme: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      glow: 'rgba(16, 185, 129, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)',
      border: 'rgba(16, 185, 129, 0.3)',
      pillBg: 'rgba(16, 185, 129, 0.1)',
      pillText: '#6ee7b7',
      cardBg: 'rgba(6, 30, 20, 0.75)',
    },
    title: 'Agriculture & Pest Guidance',
    tagline: 'Science-backed farming support powered by TNAU knowledge base',
    desc: 'Empowering rural farmers with instant, localized crop advice, diagnostic pest identification, organic soil remedies, and weather-aware harvest schedules in Tamil.',
    canHelp: [
      'Identify crop diseases, leaf blights, and insect infestations',
      'TNAU recommended fertilizer schedules and organic dosages',
      'Drip and wetland irrigation timing tailored to season',
      'Seed selection, high-yield varieties, and planting windows',
      'Soil testing methods and pH correction guidance',
      'Dryland vs wetland cash crop rotation models',
      'Organic pest control (Neem kernel extract & bio-pesticides)',
      'Post-harvest preservation and local mandi pricing trends',
    ],
    examples: [
      { q: 'நெல் இலை மஞ்சளாகிறது — என்ன காரணம்?', en: 'Yellow paddy leaves — what is the cause and treatment?' },
      { q: 'நிலக்கடலை பயிரிட சரியான பருவம் மற்றும் உரம் எது?', en: 'Right season and fertilizer dosage for groundnut cultivation?' },
      { q: 'மண் பரிசோதனை செய்ய வேளாண் மையத்தை எப்படி தொடர்புகொள்வது?', en: 'How to contact nearest soil testing center?' },
    ],
    note: null,
    cta: 'Ask Agriculture AI',
  },
  {
    id: 'government',
    icon: Building2,
    badgeText: 'Direct Government Portal Sync',
    theme: {
      primary: '#3b82f6',
      secondary: '#2563eb',
      accent: '#60a5fa',
      glow: 'rgba(59, 130, 246, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%)',
      border: 'rgba(59, 130, 246, 0.3)',
      pillBg: 'rgba(59, 130, 246, 0.1)',
      pillText: '#93c5fd',
      cardBg: 'rgba(10, 25, 47, 0.75)',
    },
    title: 'Government Schemes & Subsidies',
    tagline: 'Eligibility checks, document checklists & step-by-step applications',
    desc: 'Demystifying complex government bureaucracy. Grama Mitra explains state and central welfare schemes, required certificate formats, and application deadlines.',
    canHelp: [
      'PM-KISAN ₹6,000 annual installment eligibility & e-KYC',
      'PMFBY crop insurance claim procedures & deadline alerts',
      'Kisan Credit Card (KCC) interest subvention & bank applications',
      'Pattah, Chitta, Ration Card, and Aadhaar linking guidance',
      'MGNREGS 100-day wage tracking and job card issuance',
      'TANGEDCO free agricultural electricity connection application',
      'TN CMCHIS ₹5 Lakh health insurance empanelled hospital list',
      'Drip irrigation & tractor purchase government subsidy applications',
    ],
    examples: [
      { q: 'PM-KISAN திட்டத்தில் 17வது தவணை பெற e-KYC செய்வது எப்படி?', en: 'How to complete e-KYC for 17th PM-KISAN installment?' },
      { q: 'பயிர் சேதத்திற்கு காப்பீடு பெற என்னென்ன சான்றிதழ்கள் வேண்டும்?', en: 'What certificates are required to claim crop insurance for storm damage?' },
      { q: 'புதிய ரேஷன் கார்டு பெற ஆன்லைனில் விண்ணப்பிப்பது எப்படி?', en: 'Step-by-step procedure to apply for new smart ration card?' },
    ],
    note: 'Grama Mitra presents official verified scheme guidelines. Final approvals and disbursement decisions rest with respective nodal government departments.',
    cta: 'Check Scheme Eligibility',
  },
  {
    id: 'health',
    icon: Heart,
    badgeText: 'Emergency-Escalation Safety Net',
    theme: {
      primary: '#f43f5e',
      secondary: '#e11d48',
      accent: '#fb7185',
      glow: 'rgba(244, 63, 94, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.15) 0%, rgba(225, 29, 72, 0.05) 100%)',
      border: 'rgba(244, 63, 94, 0.3)',
      pillBg: 'rgba(244, 63, 94, 0.1)',
      pillText: '#fca5a5',
      cardBg: 'rgba(38, 12, 20, 0.75)',
    },
    title: 'Rural Health & Hygiene Awareness',
    tagline: 'Preventive healthcare advice with automated 108 emergency detection',
    desc: 'Providing accessible health education, seasonal disease prevention tips, first-aid instructions, and maternal nutrition advice without medical guesswork.',
    canHelp: [
      'Common symptom guidance (fever, seasonal cough, hydration)',
      'Childhood immunization schedule & nearest PHC clinic timings',
      'Dengue, Chikungunya, and Malaria preventive sanitation steps',
      'First-aid protocols for heatstroke, minor burns, and snake bite basics',
      'Diabetes, hypertension, and anemia nutrition checklists',
      'Maternal care, Dr. Muthulakshmi Reddy Maternity Scheme benefits',
      'Free government medical camp dates and ambulance contacts',
      'Automatic high-risk query detection & immediate 108 emergency advice',
    ],
    examples: [
      { q: 'மழைக்காலத்தில் டெங்கு காய்ச்சல் வராமல் தடுக்க என்ன செய்ய வேண்டும்?', en: 'What preventive measures stop dengue fever during rainy season?' },
      { q: 'குழந்தைகளுக்கான அரசு தடுப்பூசி அட்டவணை மற்றும் விவரங்கள்?', en: 'What is the government vaccination schedule for infants?' },
      { q: 'பாம்பு கடி பட்டால் செய்ய வேண்டிய முதலுதவி என்ன?', en: 'What immediate first-aid must be performed for snake bites before hospital?' },
    ],
    note: '⚠️ Grama Mitra provides informational guidance only — not diagnosis or treatment. Emergency medical symptoms trigger immediate prompt to dial 108 or visit nearest PHC.',
    cta: 'Consult Health Assistant',
    isHealth: true,
  },
  {
    id: 'telephony',
    icon: PhoneCall,
    badgeText: 'Feature Phone & Offline Access',
    theme: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24',
      glow: 'rgba(245, 158, 11, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(217, 119, 6, 0.05) 100%)',
      border: 'rgba(245, 158, 11, 0.3)',
      pillBg: 'rgba(245, 158, 11, 0.1)',
      pillText: '#fde68a',
      cardBg: 'rgba(35, 23, 6, 0.75)',
    },
    title: 'Toll-Free Phone IVR & Voice Calls',
    tagline: 'Zero-internet accessibility for basic feature phone users',
    desc: 'Bridging the digital divide. Rural users can simply dial our toll-free phone number from any basic keypad phone, speak in Tamil, and receive synthesized AI voice answers.',
    canHelp: [
      'No smartphone or internet connection required',
      'Supports high-noise background Tamil speech recognition',
      'Real-time neural Tamil text-to-speech audio response',
      'WhatsApp voice note query resolution via official bot',
      'Instant SMS fallback for key scheme details and document links',
      'Works 24/7 even in remote areas with low network coverage',
    ],
    examples: [
      { q: 'தொலைபேசி அழைப்பு மூலமாக கேள்விகள் கேட்பது எப்படி?', en: 'How to ask questions via dial-in phone call?' },
      { q: 'வாட்ஸ்அப் மூலமாக குரல் செய்தி அனுப்பினால் பதில் வருமா?', en: 'Can I send voice notes on WhatsApp to get immediate answers?' },
    ],
    note: 'Dial 1800-GRAMA-AI from any landline or basic phone to talk directly with Grama Mitra in Tamil.',
    cta: 'Try Voice Telephony Demo',
  },
  {
    id: 'escalation',
    icon: Users,
    badgeText: 'Human-in-the-Loop Safeguard',
    theme: {
      primary: '#a855f7',
      secondary: '#9333ea',
      accent: '#c084fc',
      glow: 'rgba(168, 85, 247, 0.25)',
      gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.05) 100%)',
      border: 'rgba(168, 85, 247, 0.3)',
      pillBg: 'rgba(168, 85, 247, 0.1)',
      pillText: '#e9d5ff',
      cardBg: 'rgba(28, 14, 42, 0.75)',
    },
    title: 'Officer Escalation & Verification',
    tagline: 'Seamless routing of complex queries to District Officers & VAOs',
    desc: 'When an AI model encounters low confidence or unverified local policies, the query is automatically escalated to local Village Administrative Officers (VAO) and Block Officers.',
    canHelp: [
      'Automatic query confidence scoring before output generation',
      'Encrypted ticket logging in Officer Dashboard for review',
      'District Block Officer direct callback scheduling',
      'Transparent audit log showing safety checks & verification status',
      'Protects rural citizens from hallucinated or outdated advice',
    ],
    examples: [
      { q: 'எனது கிராமத்தின் VAO அலுவலரை எவ்வாறு தொடர்புகொள்வது?', en: 'How to contact local Village Administrative Officer?' },
      { q: 'எனது கேள்வி அதிகாரியிடம் அனுப்பப்பட்டதா என எங்கு பார்ப்பது?', en: 'Where to track my escalated ticket status?' },
    ],
    note: 'Ensures 100% accountable government service delivery with human verification.',
    cta: 'Learn About Escalation Pipeline',
  },
];

const COMPARISON_FEATURES = [
  { feature: 'Response Time', ai: 'Instant (< 2 seconds)', trad: '24 - 72 Hours', static: 'Manual Search (Minutes)' },
  { feature: 'Language Support', ai: 'Tamil Voice & Text + English', trad: 'Limited Regional Support', static: 'English Heavy Text' },
  { feature: 'Feature Phone Access', ai: 'Yes (Toll-Free Phone IVR)', trad: 'Busy Phone Lines', static: 'No (Web Only)' },
  { feature: 'Hallucination Safety', ai: 'Ground-Truth RAG + VAO Route', trad: 'Human Error Risk', static: 'Outdated Web Static Pages' },
  { feature: '24/7 Availability', ai: 'Yes (Uninterrupted AI Engine)', trad: 'Office Hours Only (9am-5pm)', static: 'Yes (Unguided)' },
];

export default function Services() {
  const [activeTab, setActiveTab] = useState('all');
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.log("Video autoplay initialized:", err);
      });
    }
  }, []);

  const filteredServices = activeTab === 'all' 
    ? SERVICES 
    : SERVICES.filter(s => s.id === activeTab);

  return (
    <PublicLayout>
      {/* Fixed Full-Screen Running Background Video */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        <video
          ref={videoRef}
          key="services-snki-bg-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(1.1) contrast(1.05)',
          }}
          src="/video/snki.mp4"
        >
          <source src="/video/snki.mp4" type="video/mp4" />
          <source src="/video/snki'.mp4" type="video/mp4" />
        </video>
        {/* Subtle Dark Translucent Gradient Overlay for Text Readability */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(3, 7, 18, 0.45) 0%, rgba(3, 7, 18, 0.25) 50%, rgba(3, 7, 18, 0.55) 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Dynamic Glow Styles */}
      <style>{`
        @keyframes pulseGlow {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 0;
          animation: pulseGlow 8s ease-in-out infinite alternate;
        }
        .service-glass-card {
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .service-glass-card:hover {
          transform: translateY(-4px);
        }
      `}</style>

      {/* Main Content Wrapper sitting above running video */}
      <div style={{ position: 'relative', zIndex: 1, background: 'transparent' }}>
        {/* Hero Section */}
        <section style={{
          position: 'relative',
          background: 'transparent',
          padding: '5rem 0 4rem',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          minHeight: '85vh',
          display: 'flex',
          alignItems: 'center',
        }}>
          {/* Colorful Glowing Orbs for ambiance */}
          <div className="glow-orb" style={{ top: '-10%', left: '15%', width: '450px', height: '450px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(0,0,0,0) 70%)' }} />
          <div className="glow-orb" style={{ top: '20%', right: '10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, rgba(0,0,0,0) 70%)' }} />
          <div className="glow-orb" style={{ bottom: '-10%', left: '40%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(244, 63, 94, 0.22) 0%, rgba(0,0,0,0) 70%)' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          {/* Central Ultra-Premium Glassmorphism Card Wrapper */}
          <div style={{
            maxWidth: '1020px',
            margin: '0 auto',
            padding: 'clamp(2rem, 5vw, 3.5rem) clamp(1.5rem, 4vw, 3rem)',
            borderRadius: '28px',
            background: 'rgba(6, 15, 28, 0.58)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255, 255, 255, 0.22)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.3), 0 0 30px rgba(59, 130, 246, 0.15)',
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 1.35rem', borderRadius: '9999px', background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.25)', backdropFilter: 'blur(12px)', marginBottom: '1.75rem', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
              <Sparkles size={16} style={{ color: '#34d399' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', background: 'linear-gradient(90deg, #34d399, #60a5fa, #fca5a5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Empowering Rural India Through AI
              </span>
            </div>

            <h1 style={{
              fontSize: 'clamp(2.4rem, 5vw, 4rem)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              marginBottom: '1.25rem',
              maxWidth: '900px',
              marginInline: 'auto',
              textShadow: '0 4px 20px rgba(0,0,0,0.6)',
            }}>
              Five Pillar Services. <br />
              <span style={{
                background: 'linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #f43f5e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 4px 15px rgba(59, 130, 246, 0.4))',
              }}>
                One Multi-Channel AI Engine.
              </span>
            </h1>

            <p style={{
              color: '#e2e8f0',
              fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
              maxWidth: '780px',
              margin: '0 auto 2.5rem',
              lineHeight: 1.7,
              fontWeight: 400,
              textShadow: '0 2px 10px rgba(0,0,0,0.7)',
            }}>
              Delivering verified agricultural science, government scheme access, health safeguards, and telephony access for rural citizens — natively in Tamil.
            </p>

            {/* Quick Domain Filter Tabs with Glassmorphism */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '0.75rem',
              maxWidth: '950px',
              margin: '0 auto',
            }}>
              <button
                onClick={() => setActiveTab('all')}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '9999px',
                  border: activeTab === 'all' ? '1px solid #60a5fa' : '1px solid rgba(255, 255, 255, 0.18)',
                  background: activeTab === 'all' ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.9), rgba(29, 78, 216, 0.9))' : 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: activeTab === 'all' ? '0 0 25px rgba(59, 130, 246, 0.6)' : '0 4px 15px rgba(0,0,0,0.2)',
                }}
              >
                🌟 All Services
              </button>
              {SERVICES.map(s => {
                const isActive = activeTab === s.id;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveTab(s.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.75rem 1.35rem',
                      borderRadius: '9999px',
                      border: isActive ? `1px solid ${s.theme.primary}` : '1px solid rgba(255, 255, 255, 0.18)',
                      background: isActive ? s.theme.gradient : 'rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: isActive ? s.theme.pillText : '#f1f5f9',
                      fontWeight: 800,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: isActive ? `0 0 25px ${s.theme.glow}` : '0 4px 15px rgba(0,0,0,0.2)',
                    }}
                  >
                    <s.icon size={16} style={{ color: s.theme.primary }} />
                    {s.title.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Services List Section */}
      <div style={{ background: 'rgba(2, 6, 23, 0.35)', padding: '4rem 0', backdropFilter: 'blur(10px)' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
          {filteredServices.map((service, idx) => {
            const IconComp = service.icon;
            return (
              <div
                key={service.id}
                id={service.id}
                className="service-glass-card"
                style={{
                  background: service.theme.cardBg,
                  border: `1px solid ${service.theme.border}`,
                  borderRadius: '24px',
                  padding: ' clamp(1.75rem, 4vw, 3rem)',
                  boxShadow: `0 12px 40px -10px ${service.theme.glow}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Background Accent Gradient Line */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${service.theme.primary}, ${service.theme.accent})`,
                }} />

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                  gap: '3rem',
                  alignItems: 'start',
                }}>
                  {/* Left Column: Details */}
                  <div>
                    {/* Badge */}
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.9rem', borderRadius: '9999px', background: service.theme.pillBg, border: `1px solid ${service.theme.border}`, color: service.theme.pillText, fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '1.25rem' }}>
                      <ShieldCheck size={14} style={{ color: service.theme.primary }} />
                      {service.badgeText}
                    </div>

                    {/* Title Header */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '1.25rem' }}>
                      <div style={{
                        width: 58,
                        height: 58,
                        borderRadius: '16px',
                        background: service.theme.gradient,
                        border: `1px solid ${service.theme.border}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 8px 20px ${service.theme.glow}`,
                      }}>
                        <IconComp size={28} style={{ color: service.theme.primary }} />
                      </div>
                      <div>
                        <h2 style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, marginBottom: '0.35rem' }}>
                          {service.title}
                        </h2>
                        <p style={{ fontSize: '0.98rem', color: service.theme.accent, fontWeight: 600 }}>
                          {service.tagline}
                        </p>
                      </div>
                    </div>

                    <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2rem' }}>
                      {service.desc}
                    </p>

                    {/* Capability Checklist */}
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: service.theme.primary, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                        Key Capabilities & Coverage:
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
                        {service.canHelp.map((item, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.625rem', fontSize: '0.92rem', color: '#f1f5f9', lineHeight: 1.5 }}>
                            <CheckCircle size={16} style={{ color: service.theme.primary, flexShrink: 0, marginTop: 3 }} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Note Box */}
                    {service.note && (
                      <div style={{
                        padding: '1.1rem 1.35rem',
                        borderRadius: '14px',
                        background: service.isHealth ? 'rgba(244, 63, 94, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                        border: service.isHealth ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)',
                        fontSize: '0.875rem',
                        lineHeight: 1.6,
                        color: service.isHealth ? '#fca5a5' : '#e2e8f0',
                        marginBottom: '2rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                      }}>
                        {service.isHealth ? <AlertTriangle size={18} style={{ color: '#f43f5e', flexShrink: 0, marginTop: 2 }} /> : <Info size={18} style={{ color: service.theme.primary, flexShrink: 0, marginTop: 2 }} />}
                        <span>{service.note}</span>
                      </div>
                    )}

                    <Link
                      to={`/assistant?cat=${service.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.9rem 2.25rem',
                        borderRadius: '14px',
                        background: `linear-gradient(135deg, ${service.theme.primary}, ${service.theme.secondary})`,
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '1rem',
                        textDecoration: 'none',
                        boxShadow: `0 8px 25px ${service.theme.glow}`,
                        transition: 'all 0.25s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    >
                      <MessageSquare size={18} />
                      {service.cta}
                      <ArrowRight size={18} />
                    </Link>
                  </div>

                  {/* Right Column: Interactive Example Queries */}
                  <div>
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: `1px solid ${service.theme.border}`,
                      borderRadius: '20px',
                      padding: '1.75rem',
                      boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.5)',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ffffff', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                          <Zap size={16} style={{ color: service.theme.primary }} />
                          Tamil Prompt Showcase
                        </div>
                        <span style={{ fontSize: '0.75rem', color: service.theme.pillText, background: service.theme.pillBg, padding: '0.2rem 0.6rem', borderRadius: '6px', fontWeight: 700 }}>
                          Click to Ask AI
                        </span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {service.examples.map((ex, i) => (
                          <Link
                            key={i}
                            to={`/assistant?q=${encodeURIComponent(ex.q)}`}
                            style={{
                              display: 'block',
                              padding: '1.25rem',
                              background: 'rgba(2, 6, 23, 0.7)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                              borderRadius: '14px',
                              textDecoration: 'none',
                              transition: 'all 0.25s ease',
                            }}
                            onMouseEnter={e => {
                              e.currentTarget.style.borderColor = service.theme.primary;
                              e.currentTarget.style.background = service.theme.gradient;
                              e.currentTarget.style.transform = 'translateX(4px)';
                            }}
                            onMouseLeave={e => {
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                              e.currentTarget.style.background = 'rgba(2, 6, 23, 0.7)';
                              e.currentTarget.style.transform = 'none';
                            }}
                          >
                            <div style={{ fontFamily: 'var(--font-tamil)', color: '#ffffff', fontWeight: 700, fontSize: '1.05rem', lineHeight: 1.6, marginBottom: '0.4rem' }}>
                              "{ex.q}"
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#94a3b8', fontStyle: 'italic', lineHeight: 1.5, marginBottom: '0.6rem' }}>
                              {ex.en}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: service.theme.accent, fontWeight: 800 }}>
                              Run instant Tamil RAG search <ChevronRight size={14} />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Service Capability Comparison Matrix for Judges */}
      <section className="section" style={{ background: 'rgba(3, 7, 18, 0.45)', backdropFilter: 'blur(10px)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', padding: '5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: '9999px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>
              Judges Technical Assessment
            </div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
              Why Grama Mitra Outperforms Helplines
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto' }}>
              A side-by-side comparison of AI-driven voice RAG vs legacy government portals and phone helplines.
            </p>
          </div>

          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '650px' }}>
                <thead>
                  <tr style={{ background: 'rgba(30, 41, 59, 0.8)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <th style={{ padding: '1.25rem 1.5rem', color: '#ffffff', fontWeight: 800, fontSize: '0.95rem' }}>Platform Feature</th>
                    <th style={{ padding: '1.25rem 1.5rem', color: '#34d399', fontWeight: 800, fontSize: '0.95rem', background: 'rgba(16, 185, 129, 0.1)' }}>
                      ✨ Grama Mitra AI Engine
                    </th>
                    <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 700, fontSize: '0.95rem' }}>Traditional Phone Call Center</th>
                    <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 700, fontSize: '0.95rem' }}>Static Web Portals</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((row, idx) => (
                    <tr key={idx} style={{ borderBottom: idx === COMPARISON_FEATURES.length - 1 ? 'none' : '1px solid rgba(255, 255, 255, 0.05)', background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.02)' }}>
                      <td style={{ padding: '1.25rem 1.5rem', color: '#f8fafc', fontWeight: 700, fontSize: '0.95rem' }}>{row.feature}</td>
                      <td style={{ padding: '1.25rem 1.5rem', color: '#6ee7b7', fontWeight: 800, fontSize: '0.95rem', background: 'rgba(16, 185, 129, 0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <CheckCircle size={16} style={{ color: '#10b981' }} />
                          {row.ai}
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>{row.trad}</td>
                      <td style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontSize: '0.9rem' }}>{row.static}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="section" style={{
        position: 'relative',
        background: 'linear-gradient(135deg, rgba(6, 78, 59, 0.85) 0%, rgba(2, 132, 199, 0.85) 50%, rgba(76, 29, 149, 0.85) 100%)',
        backdropFilter: 'blur(16px)',
        textAlign: 'center',
        padding: '5rem 0',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at center, rgba(0,0,0,0) 0%, rgba(0,0,0,0.6) 100%)',
        }} />
        <div className="container-sm" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: '#ffffff', marginBottom: '1.25rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
            Experience Grama Mitra in Action
          </h2>
          <p style={{ color: '#e2e8f0', fontSize: '1.15rem', marginBottom: '2.5rem', lineHeight: 1.7, maxWidth: '600px', marginInline: 'auto' }}>
            Try asking your agricultural, scheme, or health questions using Tamil speech or text right now.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
            <Link
              to="/assistant"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.625rem',
                padding: '1.1rem 2.5rem',
                borderRadius: '16px',
                background: '#ffffff',
                color: '#0f172a',
                fontWeight: 900,
                fontSize: '1.05rem',
                textDecoration: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}
            >
              <MessageSquare size={20} style={{ color: '#0284c7' }} />
              Open Voice & Text Assistant
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
      </div>
    </PublicLayout>
  );
}

