import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mic, MicOff, Send, Volume2, VolumeX, RefreshCw, Users,
  Leaf, Building2, Heart, HelpCircle, AlertTriangle, Wifi, WifiOff,
  Info, ChevronDown, Camera, Image, X, Upload, FileText, CheckCircle2,
  Globe, Phone, Mail, Sparkles
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import ResponseCard from '../../components/ResponseCard.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { sendMessage, speakText, stopSpeaking } from '../../services/api.js';
import { useToast } from '../../hooks/useToast.js';
import { ToastContainer } from '../../components/Toast.jsx';
import { getDistricts, getBlocks, getVillages } from '../../data/locationData.js';

const SUGGESTED_QUESTIONS = {
  all: [
    { q: 'நெல் இலை மஞ்சளாகிறது — என்ன காரணம்?', label: 'Yellow paddy leaves', cat: 'Agriculture' },
    { q: 'PM-KISAN திட்டத்தில் எப்படி சேரலாம்?', label: 'PM-KISAN registration', cat: 'Government' },
    { q: 'எனக்கு காய்ச்சல் இருக்கிறது — என்ன செய்யலாம்?', label: 'Fever guidance', cat: 'Health' },
    { q: 'நெல் பயிரில் BPH பூச்சி வந்தால் என்ன செய்வது?', label: 'BPH pest control', cat: 'Agriculture' },
    { q: 'கிசான் கிரெடிட் கார்டு எப்படி பெறுவது?', label: 'Kisan Credit Card', cat: 'Government' },
    { q: 'எனக்கு திடீரென மார்பு வலி வருகிறது', label: 'Chest pain (emergency)', cat: 'Emergency' },
  ],
};

const CATEGORIES = [
  { id: 'all', label: 'All Topics', icon: HelpCircle, color: 'var(--gray-600)' },
  { id: 'agriculture', label: 'Agriculture', icon: Leaf, color: 'var(--green-600)' },
  { id: 'government', label: 'Gov Schemes', icon: Building2, color: 'var(--blue-600)' },
  { id: 'health', label: 'Health', icon: Heart, color: '#e11d48' },
];

const VOICE_STATES = {
  IDLE: 'idle',
  RECORDING: 'recording',
  PROCESSING: 'processing',
  DONE: 'done',
  ERROR: 'error',
};

export default function VoiceAssistant() {
  const { language, currentLangObj } = useLanguage();
  const [searchParams] = useSearchParams();
  const [voiceState, setVoiceState] = useState(VOICE_STATES.IDLE);
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [category, setCategory] = useState('all');
  const [speaking, setSpeaking] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isSpeechSupported, setIsSpeechSupported] = useState(false);
  const inputRef = useRef(null);
  const resultRef = useRef(null);
  const fileInputRef = useRef(null);
  const [showCallModal, setShowCallModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailForm, setEmailForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [emailSuccess, setEmailSuccess] = useState('');

  // Scheme Application Form State
  const districts = getDistricts();
  const [formDistrict, setFormDistrict] = useState('Thanjavur');
  const [formBlock, setFormBlock] = useState('Kumbakonam');
  const [formVillage, setFormVillage] = useState('Kovilur');
  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [selectedScheme, setSelectedScheme] = useState('PM-KISAN installment verification');
  const [docPatta, setDocPatta] = useState(true);
  const [docAadhar, setDocAadhar] = useState(true);
  const [docBank, setDocBank] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState('');

  const availableBlocks = getBlocks(formDistrict);
  const availableVillages = getVillages(formDistrict, formBlock);

  const handleSchemeSubmit = (e) => {
    e.preventDefault();
    if (!farmerName.trim() || !farmerPhone.trim()) {
      addToast('Please enter Farmer Name and Phone Number.', 'warning');
      return;
    }

    const docs = [];
    if (docPatta) docs.push('Patta & Chitta Verified');
    if (docAadhar) docs.push('Aadhar eKYC Linked');
    if (docBank) docs.push('Bank NOC Attached');
    const docStatusText = docs.length > 0 ? docs.join(' • ') : 'Application Received';

    const newApp = {
      id: `sr-user-${Date.now().toString().slice(-4)}`,
      farmerName: farmerName.trim(),
      village: formVillage || 'Kovilur',
      block: formBlock || 'Kumbakonam',
      district: formDistrict || 'Thanjavur',
      phone: farmerPhone.trim(),
      scheme: selectedScheme,
      date: new Date().toISOString().split('T')[0],
      status: 'Submitted (Pending Review)',
      docStatus: docStatusText,
    };

    const existing = JSON.parse(localStorage.getItem('grama_submitted_schemes') || '[]');
    localStorage.setItem('grama_submitted_schemes', JSON.stringify([newApp, ...existing]));

    window.dispatchEvent(new Event('scheme-application-submitted'));

    const successMsg = `Application #${newApp.id.toUpperCase()} Submitted Successfully! Transmitted to ${formDistrict} District (${formBlock} Block) Officer Dashboard.`;
    setSubmitSuccess(successMsg);
    addToast(successMsg, 'success');
    setFarmerName('');
    setFarmerPhone('');
    setTimeout(() => setSubmitSuccess(''), 7000);
  };

  useEffect(() => {
    setIsSpeechSupported('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

    // Handle pre-filled query from URL
    const q = searchParams.get('q');
    if (q) {
      setInput(q);
      setTimeout(() => handleSubmitDirect(q), 300);
    }
  }, []);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      if (!input.trim()) {
        setInput('பயிர் நோய் கண்டறிதல் (Crop Disease & Pest Diagnosis)');
      }
      addToast('📷 பயிர் படம் சேர்க்கப்பட்டது! Send கிளிக் செய்யவும்.', 'success');
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmitDirect = async (text, img = selectedImage) => {
    if (!text.trim() && !img) return;
    setVoiceState(VOICE_STATES.PROCESSING);
    setResult(null);
    try {
      const res = await sendMessage(text.trim(), { channel: 'Website', image: img, language });
      setResult(res);
      setVoiceState(VOICE_STATES.DONE);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    } catch (err) {
      setVoiceState(VOICE_STATES.ERROR);
      addToast('Unable to connect. Please check your connection.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() && !selectedImage) { addToast('Please type, upload a crop image, or speak your question.', 'warning'); return; }
    await handleSubmitDirect(input, selectedImage);
  };

  const handleDemoQuestion = (q) => {
    setInput(q);
    handleSubmitDirect(q);
  };

  const handleMicClick = () => {
    if (!isSpeechSupported) {
      addToast('Voice input is not supported in this browser. Please use Chrome or Edge.', 'warning');
      return;
    }

    if (voiceState === VOICE_STATES.RECORDING) {
      recognition?.stop();
      setVoiceState(VOICE_STATES.IDLE);
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    const sttLang = currentLangObj?.sttLang || (language === 'en' ? 'en-IN' : 'ta-IN');
    rec.lang = sttLang;
    rec.interimResults = false;
    rec.continuous = false;

    rec.onstart = () => setVoiceState(VOICE_STATES.RECORDING);
    rec.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      handleSubmitDirect(transcript);
    };
    rec.onerror = (e) => {
      if (e.error === 'no-speech') addToast(language === 'en' ? 'No speech detected. Please try again.' : 'குரல் கேட்கவில்லை. மீண்டும் முயற்சிக்கவும்.', 'warning');
      else addToast(`Voice error: ${e.error}`, 'error');
      setVoiceState(VOICE_STATES.IDLE);
    };
    rec.onend = () => { if (voiceState === VOICE_STATES.RECORDING) setVoiceState(VOICE_STATES.IDLE); };

    setRecognition(rec);
    rec.start();
  };

  const handleSpeak = () => {
    if (!result?.response) return;
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
      return;
    }
    const ttsLang = currentLangObj?.ttsLang || (language === 'en' ? 'en-IN' : 'ta-IN');
    speakText(result.response, ttsLang);
    setSpeaking(true);
    const utt = new SpeechSynthesisUtterance(result.response);
    utt.onend = () => setSpeaking(false);
  };

  const handleReset = () => {
    setInput('');
    setResult(null);
    setVoiceState(VOICE_STATES.IDLE);
    stopSpeaking();
    setSpeaking(false);
    inputRef.current?.focus();
  };

  const handleHandoff = (res) => {
    addToast(
      res.isEmergency
        ? '🚨 Emergency escalation sent. Please call 108 immediately.'
        : '✅ Human help request submitted. Our team will assist you.',
      res.isEmergency ? 'error' : 'success'
    );
  };

  const voiceStatusText = {
    [VOICE_STATES.IDLE]: isSpeechSupported
      ? (language === 'en' ? `Tap to speak in ${currentLangObj?.name || 'English'}` : 'Tap to speak in Tamil')
      : 'Voice not supported — type below',
    [VOICE_STATES.RECORDING]: language === 'en' ? 'Listening...' : 'கேட்கிறேன்… (Listening…)',
    [VOICE_STATES.PROCESSING]: language === 'en' ? 'Understanding your question...' : 'உங்கள் கேள்வியை புரிந்துகொள்கிறோம்…',
    [VOICE_STATES.DONE]: 'Response ready',
    [VOICE_STATES.ERROR]: language === 'en' ? 'Please try again.' : 'மீண்டும் முயற்சிக்கவும்.',
  };

  return (
    <PublicLayout>
      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Page header with Cinematic Ambient AI Radial Background */}
      <div style={{
        position: 'relative',
        background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(124, 58, 237, 0.25) 0%, rgba(16, 185, 129, 0.15) 45%, rgba(3, 3, 8, 1) 100%)',
        padding: '7rem 0 3.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
        color: '#fff',
        overflow: 'hidden',
      }}>
        {/* Ambient background glow orbs */}
        <div style={{
          position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
          width: '600px', height: '300px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(56, 189, 248, 0.18) 50%, transparent 70%)',
          filter: 'blur(70px)', pointerEvents: 'none', zIndex: 0,
        }} />

        <div className="container-sm" style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
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
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '24px', height: '24px', borderRadius: '50%',
                background: 'rgba(16, 185, 129, 0.3)', border: '1px solid rgba(52, 211, 153, 0.5)'
              }}>
                <Mic size={14} color="#34d399" />
              </span>
              {language === 'en' ? 'MULTILINGUAL VOICE & TEXT ASSISTANT' : 'தமிழ் & ஆங்கில AI குரல் உதவி'}
            </span>
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.75rem)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #ffffff 0%, #34d399 40%, #38bdf8 75%, #c084fc 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            lineHeight: 1.15,
            filter: 'drop-shadow(0 4px 20px rgba(16, 185, 129, 0.25))',
          }}>
            Ask Grama Mitra
          </h1>
          <p style={{ color: '#e2e8f0', fontSize: '1.18rem', fontWeight: 600, lineHeight: 1.7, maxWidth: 620, margin: '0 auto' }}>
            {language === 'en'
              ? 'Ask your question in English or Tamil — by voice, text, or crop image.'
              : 'உங்கள் கேள்வியை தமிழில் கேளுங்கள் — குரலில் அல்லது எழுத்தில்.'}
          </p>
        </div>
      </div>

      <div style={{
        position: 'relative',
        background: 'linear-gradient(180deg, #030308 0%, #080812 50%, #030308 100%)',
        minHeight: '75vh',
        padding: '3.5rem 0 5rem',
        color: '#ffffff',
      }}>
        {/* Secondary ambient glow */}
        <div style={{
          position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '400px',
          background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, rgba(16, 185, 129, 0.1) 50%, transparent 70%)',
          filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0,
        }} />

        <div className="container-sm" style={{ position: 'relative', zIndex: 2 }}>
          {/* Category selector — Premium Glass Squircles (Symmetrically Centered & Fully Unobstructed) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => {
              const isSelected = category === cat.id;
              const catGlowColor = cat.id === 'all' ? '#a855f7' : cat.id === 'agriculture' ? '#10b981' : cat.id === 'government' ? '#38bdf8' : '#e11d48';
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '0.55rem',
                    padding: '0.65rem 1.35rem',
                    borderRadius: '16px',
                    border: `1.5px solid ${isSelected ? catGlowColor : 'rgba(255, 255, 255, 0.14)'}`,
                    background: isSelected
                      ? `linear-gradient(135deg, ${catGlowColor}28 0%, rgba(15, 23, 42, 0.8) 100%)`
                      : 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(16px)',
                    color: isSelected ? '#ffffff' : 'var(--gray-300)',
                    fontWeight: isSelected ? 700 : 600,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isSelected
                      ? `0 8px 25px -4px ${catGlowColor}66, inset 0 1.5px 1px rgba(255, 255, 255, 0.4)`
                      : '0 2px 10px rgba(0,0,0,0.3)',
                    transform: isSelected ? 'translateY(-2px)' : 'none',
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.borderColor = `${catGlowColor}66`;
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                    }
                  }}
                >
                  <span style={{
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    width: '24px', height: '24px', borderRadius: '8px',
                    background: isSelected ? `${catGlowColor}44` : 'rgba(255,255,255,0.08)',
                    border: `1px solid ${isSelected ? catGlowColor : 'rgba(255,255,255,0.15)'}`
                  }}>
                    <cat.icon size={13} color={isSelected ? catGlowColor : '#ffffff'} />
                  </span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Central Voice Mic Orb */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div className="mic-wrapper" style={{ marginBottom: '1.5rem', display: 'inline-block' }}>
              <div className={`mic-aura ${voiceState === VOICE_STATES.RECORDING ? 'recording' : ''}`} />
              {voiceState === VOICE_STATES.RECORDING && <div className="pulse-ring" />}
              
              <div className="mic-outer-ring" style={{
                width: '136px', height: '136px',
                borderColor: voiceState === VOICE_STATES.RECORDING ? 'rgba(239, 68, 68, 0.6)' :
                  voiceState === VOICE_STATES.PROCESSING ? 'rgba(56, 189, 248, 0.65)' : 'rgba(56, 189, 248, 0.6)',
                boxShadow: voiceState === VOICE_STATES.RECORDING ? '0 0 45px rgba(239, 68, 68, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.4)' :
                  voiceState === VOICE_STATES.PROCESSING ? '0 0 45px rgba(56, 189, 248, 0.65), inset 0 1px 2px rgba(255, 255, 255, 0.4)' : '0 0 50px rgba(56, 189, 248, 0.65), 0 0 25px rgba(2, 132, 199, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.5)',
                background: 'rgba(15, 23, 42, 0.7)',
                backdropFilter: 'blur(20px)',
              }}>
                <button
                  className={`mic-button ${voiceState === VOICE_STATES.RECORDING ? 'recording' : voiceState === VOICE_STATES.PROCESSING ? 'processing' : 'idle'}`}
                  onClick={handleMicClick}
                  disabled={voiceState === VOICE_STATES.PROCESSING}
                  title={voiceState === VOICE_STATES.RECORDING ? 'Stop recording' : 'Start voice input'}
                  style={{
                    width: '98px', height: '98px',
                    opacity: voiceState === VOICE_STATES.PROCESSING ? 0.85 : 1,
                  }}
                  aria-label="Voice input button"
                >
                  {voiceState === VOICE_STATES.RECORDING ? (
                    <MicOff size={40} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.5))' }} />
                  ) : voiceState === VOICE_STATES.PROCESSING ? (
                    <div className="spinner" style={{ width: 38, height: 38, borderWidth: 3.5, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#ffffff' }} />
                  ) : (
                    <Mic size={40} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.4))' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Waveform (recording) */}
            {voiceState === VOICE_STATES.RECORDING && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <div className="waveform">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="waveform-bar" style={{
                      animationDelay: `${i * 0.07}s`,
                      background: 'linear-gradient(to top, #ef4444, #f87171, #fca5a5)',
                      height: `${16 + (i % 6) * 6}px`
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Status text */}
            <div style={{
              fontSize: '1.05rem',
              color: voiceState === VOICE_STATES.RECORDING ? '#f87171' :
                voiceState === VOICE_STATES.PROCESSING ? '#38bdf8' : '#ffffff',
              fontFamily: voiceState === VOICE_STATES.PROCESSING ? 'var(--font-tamil)' : 'inherit',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              letterSpacing: '0.01em',
            }}>
              {voiceState === VOICE_STATES.PROCESSING && <div className="spinner" style={{ width: 18, height: 18 }} />}
              {voiceState === VOICE_STATES.IDLE && (
                <span style={{
                  padding: '0.45rem 1.35rem',
                  borderRadius: '9999px',
                  background: 'rgba(56, 189, 248, 0.15)',
                  border: '1px solid rgba(56, 189, 248, 0.4)',
                  boxShadow: '0 4px 15px rgba(56, 189, 248, 0.25)',
                }}>
                  <strong style={{ color: '#38bdf8' }}>Tap microphone to speak</strong> in Tamil or English
                </span>
              )}
              {voiceState !== VOICE_STATES.IDLE && voiceStatusText[voiceState]}
            </div>

            {!isSpeechSupported && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', fontSize: '0.85rem', color: '#fbbf24' }}>
                <AlertTriangle size={15} />
                Use Chrome / Edge for microphone speech recognition
              </div>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageSelect}
            accept="image/*"
            style={{ display: 'none' }}
          />

          {/* Gemini-Style Ultra-Premium Vibrant Floating Chat Toolbar */}
          <form onSubmit={handleSubmit} style={{ marginBottom: '2.5rem' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(10, 10, 18, 0.98) 100%)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              border: selectedImage ? '2px solid #10b981' : '1px solid rgba(56, 189, 248, 0.38)',
              borderRadius: '9999px',
              padding: '0.65rem 0.85rem 0.65rem 0.85rem',
              boxShadow: '0 20px 60px -10px rgba(0, 0, 0, 0.95), 0 0 35px rgba(56, 189, 248, 0.2), inset 0 1.5px 2px rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            }}>
              {/* Left Action: Plus Icon Button with Glowing Blue Dot indicator */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach Crop Image or File for AI Diagnosis"
                style={{
                  position: 'relative',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: selectedImage
                    ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.35) 0%, rgba(5, 150, 105, 0.2) 100%)'
                    : 'rgba(255, 255, 255, 0.08)',
                  border: selectedImage ? '1px solid rgba(52, 211, 153, 0.6)' : '1px solid rgba(255, 255, 255, 0.2)',
                  color: selectedImage ? '#34d399' : '#ffffff',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.2s ease',
                  boxShadow: '0 4px 14px rgba(0, 0, 0, 0.4)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                  e.currentTarget.style.background = 'rgba(56, 189, 248, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.6)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.background = selectedImage ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.borderColor = selectedImage ? 'rgba(52, 211, 153, 0.6)' : 'rgba(255, 255, 255, 0.2)';
                }}
              >
                <span style={{ fontSize: '1.4rem', fontWeight: 300, lineHeight: 1 }}>+</span>
                {/* Glowing Blue Dot Indicator (Gemini style) */}
                <span style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: '#38bdf8',
                  boxShadow: '0 0 10px #38bdf8, 0 0 18px #38bdf8',
                }} />
              </button>

              {/* Image Thumbnail badge inside floating bar if attached */}
              {imagePreview && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.25rem 0.6rem',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid rgba(52, 211, 153, 0.45)',
                  borderRadius: '9999px',
                  flexShrink: 0,
                }}>
                  <img
                    src={imagePreview}
                    alt="Crop thumbnail"
                    style={{ width: 24, height: 24, objectFit: 'cover', borderRadius: '50%' }}
                  />
                  <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 700 }}>Image Attached</span>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', padding: 0 }}
                  >
                    <X size={12} />
                  </button>
                </div>
              )}

              {/* Center Input Textarea */}
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={language === 'en' ? 'Ask Grama Mitra...' : 'கேள்வி கேட்கவும்… (Ask Grama Mitra)'}
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontFamily: language === 'en' ? 'var(--font-sans)' : 'var(--font-tamil)',
                  fontSize: '1.05rem',
                  fontWeight: 500,
                  color: '#ffffff',
                  background: 'transparent',
                  padding: '0.4rem 0.5rem',
                  letterSpacing: '0.01em',
                }}
                disabled={voiceState === VOICE_STATES.PROCESSING}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); } }}
              />

              {/* Right Action Stack: AI Model Pill + Mic Icon Button + Send Button */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexShrink: 0 }}>
                {/* AI Model Badge (Gemini Flash-Lite style) */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(255, 255, 255, 0.18)',
                  color: '#e2e8f0',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                }}>
                  <span style={{ color: '#34d399', fontWeight: 800 }}>Grama-AI 2.0</span>
                  <ChevronDown size={13} color="#94a3b8" />
                </div>

                {/* Direct Mic Quick Button inside toolbar */}
                <button
                  type="button"
                  onClick={handleMicClick}
                  title="Voice Microphone Input"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: voiceState === VOICE_STATES.RECORDING ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.08)',
                    border: voiceState === VOICE_STATES.RECORDING ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid rgba(255, 255, 255, 0.18)',
                    color: voiceState === VOICE_STATES.RECORDING ? '#f87171' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Mic size={18} color={voiceState === VOICE_STATES.RECORDING ? '#f87171' : '#ffffff'} />
                </button>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={(!input.trim() && !selectedImage) || voiceState === VOICE_STATES.PROCESSING}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    height: '42px',
                    padding: '0 1.35rem',
                    borderRadius: '9999px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    border: '1px solid rgba(255, 255, 255, 0.4)',
                    boxShadow: '0 6px 20px rgba(16, 185, 129, 0.5), inset 0 1.5px 1px rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    opacity: (!input.trim() && !selectedImage) || voiceState === VOICE_STATES.PROCESSING ? 0.5 : 1,
                  }}
                  onMouseEnter={e => {
                    if (input.trim() || selectedImage) {
                      e.currentTarget.style.transform = 'scale(1.04)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(16, 185, 129, 0.75), inset 0 1.5px 1px rgba(255, 255, 255, 0.8)';
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.5), inset 0 1.5px 1px rgba(255, 255, 255, 0.6)';
                  }}
                >
                  {voiceState === VOICE_STATES.PROCESSING ? (
                    <div className="spinner" style={{ width: 16, height: 16 }} />
                  ) : (
                    <>
                      <span>Send</span>
                      <Send size={15} />
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Crop Image Diagnostics Presets — Centered */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', marginTop: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.84rem', color: '#cbd5e1', fontWeight: 700 }}>🌾 Quick Crop Presets:</span>
              <button
                type="button"
                onClick={() => {
                  const fakeFile = new File(['fake'], 'paddy_leaf_yellowing.jpg', { type: 'image/jpeg' });
                  setSelectedImage(fakeFile);
                  setImagePreview('https://images.unsplash.com/photo-1592982537447-6f2a6a0c7c18?w=150&auto=format&fit=crop');
                  setInput('நெல் இலை மஞ்சளாகிறது — பயிர் நோய் பகுப்பாய்வு செய்க');
                  addToast('🌾 Sample Rice Leaf Image attached!', 'info');
                }}
                style={{
                  fontSize: '0.825rem', padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(15, 23, 42, 0.7) 100%)',
                  color: '#34d399',
                  border: '1px solid rgba(52, 211, 153, 0.4)', borderRadius: '9999px',
                  cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem',
                  boxShadow: '0 4px 15px rgba(16, 185, 129, 0.25)',
                  transition: 'all 0.2s ease',
                }}
                aria-label="Preset: Yellow leaf disease sample"
              >
                <Camera size={14} color="#34d399" />
                நெல் இலை மஞ்சள் (Yellow Leaf)
              </button>
              <button
                type="button"
                onClick={() => {
                  const fakeFile = new File(['fake'], 'bph_pest_damage.jpg', { type: 'image/jpeg' });
                  setSelectedImage(fakeFile);
                  setImagePreview('https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=150&auto=format&fit=crop');
                  setInput('புகையான் பூச்சி தாக்குதல் — நோய் கண்டறிந்து மருந்து கூறவும்');
                  addToast('🐛 Sample Pest Image attached!', 'info');
                }}
                style={{
                  fontSize: '0.825rem', padding: '0.5rem 1rem',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(15, 23, 42, 0.7) 100%)',
                  color: '#fbbf24',
                  border: '1px solid rgba(251, 191, 36, 0.4)', borderRadius: '9999px',
                  cursor: 'pointer', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.45rem',
                  boxShadow: '0 4px 15px rgba(245, 158, 11, 0.25)',
                  transition: 'all 0.2s ease',
                }}
                aria-label="Preset: Pest attack sample"
              >
                <Camera size={14} color="#fbbf24" />
                பூச்சி தாக்குதல் (Pest Attack)
              </button>
            </div>
          </form>

          {/* Result */}
          <div ref={resultRef}>
            <ResponseCard
              result={result}
              loading={voiceState === VOICE_STATES.PROCESSING}
              onRetry={handleReset}
              onHandoff={handleHandoff}
            />
          </div>

          {/* Listen button after response */}
          {result && result.response && (
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
              <button
                className="btn btn-sm btn-ghost"
                onClick={handleSpeak}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}
              >
                {speaking ? <VolumeX size={16} color="#ef4444" /> : <Volume2 size={16} color="#34d399" />}
                {speaking ? 'Stop' : (language === 'en' ? 'Listen to Answer' : 'Listen in Tamil')}
              </button>
              <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                {result.queryId && `Query ID: ${result.queryId}`}
              </span>
            </div>
          )}

          {/* Suggested questions */}
          {!result && voiceState === VOICE_STATES.IDLE && (
            <div style={{ marginTop: '3rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ height: 1, flex: 1, background: 'rgba(255, 255, 255, 0.14)' }} />
                <span className="text-sm" style={{ color: '#cbd5e1', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Suggested questions & common inquiries
                </span>
                <div style={{ height: 1, flex: 1, background: 'rgba(255, 255, 255, 0.14)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {SUGGESTED_QUESTIONS.all
                  .filter(dq => category === 'all' || dq.cat.toLowerCase() === category)
                  .slice(0, 5)
                  .map((dq, i) => (
                    <button
                      key={i}
                      className="demo-question"
                      onClick={() => handleDemoQuestion(dq.q)}
                      style={{
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(15, 23, 42, 0.7) 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.14)',
                        borderRadius: '16px',
                        padding: '1rem 1.35rem',
                        backdropFilter: 'blur(12px)',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.45)';
                        e.currentTarget.style.boxShadow = '0 8px 25px rgba(56, 189, 248, 0.25)';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
                        e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>{dq.q}</span>
                        <span style={{
                          fontSize: '0.725rem', padding: '0.2rem 0.65rem',
                          background: dq.cat === 'Emergency' ? 'rgba(239, 68, 68, 0.25)' : 'rgba(56, 189, 248, 0.25)',
                          color: dq.cat === 'Emergency' ? '#f87171' : '#38bdf8',
                          border: dq.cat === 'Emergency' ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(56, 189, 248, 0.4)',
                          borderRadius: '9999px', fontWeight: 700, flexShrink: 0,
                        }}>
                          {dq.cat}
                        </span>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Info disclaimer */}
          <div style={{
            marginTop: '3.5rem', padding: '1.35rem 1.6rem',
            background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.12) 0%, rgba(15, 23, 42, 0.6) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            backdropFilter: 'blur(16px)',
            borderRadius: '20px', display: 'flex', gap: '1.15rem', alignItems: 'flex-start',
            fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.75,
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
          }}>
            <Info size={20} style={{ flexShrink: 0, marginTop: 3, color: '#38bdf8' }} />
            <div>
              <strong style={{ color: '#fff' }}>About Grama Mitra AI:</strong> Responses are based on verified knowledge from TNAU, government portals, and health authorities.
              Health responses are informational only — not a substitute for professional medical advice.
              Emergency situations trigger automatic escalation. 
              <span style={{ color: '#34d399', fontWeight: 600 }}> Integrated multi-channel AI architecture for web, WhatsApp, and toll-free IVR.</span>
            </div>
          </div>

          {/* ── MULTI-CHANNEL DIRECT ACCESS (WEBSITE, TOLL-FREE, EMAIL) ── */}
          <div style={{
            marginTop: '3.5rem',
            padding: '2.25rem 2rem',
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 20, 36, 0.98) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            borderRadius: '24px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(14, 165, 233, 0.15)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: '9999px',
                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(168, 85, 247, 0.2))',
                border: '1px solid rgba(56, 189, 248, 0.4)', color: '#38bdf8', fontSize: '0.82rem', fontWeight: 900,
                textTransform: 'uppercase', marginBottom: '0.85rem', boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)',
              }}>
                <Sparkles size={15} color="#38bdf8" /> Official Platform Access Points
              </div>
              <h3 style={{ fontSize: 'clamp(1.35rem, 3vw, 1.85rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em', marginBottom: '0.5rem' }}>
                Direct Access Channels / <span style={{ color: '#34d399' }}>நேரடி அணுகல் வழிகள்</span>
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.975rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.6 }}>
                Connect directly through our official website portal, 24/7 toll-free helpline, or official email support channel.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {/* 1. Website */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.1rem' }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: '16px', background: 'rgba(6, 182, 212, 0.2)',
                    border: '1px solid rgba(6, 182, 212, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Globe size={24} color="#22d3ee" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Website Access</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', marginTop: '0.15rem' }}>Grama Mitra Web</div>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.35rem', lineHeight: 1.5 }}>
                      gramaMitra.in — 24/7 AI Tamil Voice & Image Diagnosis Portal
                    </div>
                  </div>
                </div>
                <a
                  href="/assistant"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                    padding: '0.75rem 1.25rem', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    color: '#ffffff', fontWeight: 900, fontSize: '0.9rem', textDecoration: 'none',
                    boxShadow: '0 4px 18px rgba(6, 182, 212, 0.45)', transition: 'all 0.2s ease',
                  }}
                >
                  <Globe size={16} /> Access Website Portal
                </a>
              </div>

              {/* 2. Toll-Free Helpline */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.1rem' }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: '16px', background: 'rgba(245, 158, 11, 0.2)',
                    border: '1px solid rgba(245, 158, 11, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Phone size={24} color="#fbbf24" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Toll-Free Helpline</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', marginTop: '0.15rem' }}>1800-180-1551</div>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.35rem', lineHeight: 1.5 }}>
                      1800-GRAMA-AI Direct Phone Helpline for Farmers
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowCallModal(true);
                    speakText("Vanakkam! Welcome to Grama Mitra 1800 Toll-Free Helpline.", language === 'en' ? 'en-IN' : 'ta-IN');
                  }}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                    padding: '0.75rem 1.25rem', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: '#ffffff', fontWeight: 900, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(245, 158, 11, 0.45)', transition: 'all 0.2s ease',
                  }}
                >
                  <Phone size={16} /> Call Toll-Free Helpline
                </button>
              </div>

              {/* 3. Email Support */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                borderRadius: '20px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1.25rem',
                boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.1rem' }}>
                  <div style={{
                    width: 50, height: 50, borderRadius: '16px', background: 'rgba(16, 185, 129, 0.2)',
                    border: '1px solid rgba(16, 185, 129, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                  }}>
                    <Mail size={24} color="#34d399" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Support</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', marginTop: '0.15rem' }}>hello@gramaMitra.in</div>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '0.35rem', lineHeight: 1.5 }}>
                      Official Desk Support & Department Inquiries
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmailModal(true)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
                    padding: '0.75rem 1.25rem', borderRadius: '14px',
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: '#ffffff', fontWeight: 900, fontSize: '0.9rem', border: 'none', cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(16, 185, 129, 0.45)', transition: 'all 0.2s ease',
                  }}
                >
                  <Mail size={16} /> Send Email Inquiry
                </button>
              </div>
            </div>
          </div>

          {/* ── GOVERNMENT SCHEME APPLICATION FORM SECTION ── */}
          <div style={{
            marginTop: '4rem',
            paddingTop: '3rem',
            borderTop: '1px solid rgba(56, 189, 248, 0.25)',
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 1rem', borderRadius: '9999px',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2))',
                border: '1px solid rgba(52, 211, 153, 0.4)', color: '#34d399', fontSize: '0.82rem', fontWeight: 900,
                textTransform: 'uppercase', marginBottom: '1rem', boxShadow: '0 0 15px rgba(16, 185, 129, 0.2)',
              }}>
                <FileText size={15} color="#34d399" /> Government Scheme Direct Application
              </div>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
                Online Scheme Application Format / <span style={{ color: '#38bdf8' }}>அரசு திட்டங்கள் விண்ணப்பப் படிவம்</span>
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: '750px', margin: '0 auto', lineHeight: 1.7 }}>
                Fill out your details below to apply for PM-KISAN, PMFBY crop insurance, or KCC loans directly through the Voice Assistant. Submitted applications are instantly transmitted directly to the **District & Block Officer Dashboard**.
              </p>
            </div>

            {/* Success Notification Banner */}
            {submitSuccess && (
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 182, 212, 0.25) 100%)',
                border: '1px solid #10b981',
                borderRadius: '18px',
                padding: '1.25rem 1.75rem',
                marginBottom: '2rem',
                color: '#34d399',
                fontSize: '1rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                boxShadow: '0 8px 30px rgba(16, 185, 129, 0.3)',
              }}>
                <CheckCircle2 size={26} color="#34d399" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {/* Form Card Container (Ultra-Premium Dark Glassmorphism Theme) */}
            <form onSubmit={handleSchemeSubmit} style={{
              background: 'linear-gradient(135deg, rgba(13, 27, 42, 0.95) 0%, rgba(8, 18, 32, 0.98) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              borderRadius: '24px',
              padding: '2.5rem',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(14, 165, 233, 0.15)',
              backdropFilter: 'blur(20px)',
              position: 'relative',
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.75rem' }}>
                {/* Farmer Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.5rem' }}>
                    Farmer Full Name / விவசாயி பெயர் *
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    placeholder="e.g. K. Ramasamy / கே. இராமசாமி"
                    style={{
                      width: '100%', background: '#091524', border: '1px solid rgba(56, 189, 248, 0.35)',
                      borderRadius: '12px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.95rem',
                      outline: 'none', boxSizing: 'border-box', fontWeight: 700,
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                    }}
                  />
                </div>

                {/* Mobile Number */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#34d399', marginBottom: '0.5rem' }}>
                    Mobile / Phone Number / தொலைபேசி எண் *
                  </label>
                  <input
                    type="tel"
                    required
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    placeholder="e.g. +91 98421 44510"
                    style={{
                      width: '100%', background: '#091524', border: '1px solid rgba(56, 189, 248, 0.35)',
                      borderRadius: '12px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.95rem',
                      outline: 'none', boxSizing: 'border-box', fontWeight: 700,
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
                    }}
                  />
                </div>

                {/* District */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#a78bfa', marginBottom: '0.5rem' }}>
                    District / மாவட்டம்
                  </label>
                  <select
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    style={{
                      width: '100%', background: '#091524', border: '1px solid rgba(56, 189, 248, 0.35)',
                      borderRadius: '12px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.95rem',
                      outline: 'none', boxSizing: 'border-box', fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    {districts.map((d) => <option key={d} value={d} style={{ background: '#091524', color: '#ffffff' }}>{d}</option>)}
                  </select>
                </div>

                {/* Block */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#60a5fa', marginBottom: '0.5rem' }}>
                    Block / வட்டம்
                  </label>
                  <select
                    value={formBlock}
                    onChange={(e) => setFormBlock(e.target.value)}
                    style={{
                      width: '100%', background: '#091524', border: '1px solid rgba(56, 189, 248, 0.35)',
                      borderRadius: '12px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.95rem',
                      outline: 'none', boxSizing: 'border-box', fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    {availableBlocks.map((b) => <option key={b} value={b} style={{ background: '#091524', color: '#ffffff' }}>{b}</option>)}
                  </select>
                </div>

                {/* Village */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#f472b6', marginBottom: '0.5rem' }}>
                    Village / கிராமம்
                  </label>
                  <select
                    value={formVillage}
                    onChange={(e) => setFormVillage(e.target.value)}
                    style={{
                      width: '100%', background: '#091524', border: '1px solid rgba(56, 189, 248, 0.35)',
                      borderRadius: '12px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.95rem',
                      outline: 'none', boxSizing: 'border-box', fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    {availableVillages.map((v) => <option key={v} value={v} style={{ background: '#091524', color: '#ffffff' }}>{v}</option>)}
                  </select>
                </div>

                {/* Scheme Choice */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 800, color: '#fbbf24', marginBottom: '0.5rem' }}>
                    Target Scheme & Service / திட்டம் தேர்வு *
                  </label>
                  <select
                    value={selectedScheme}
                    onChange={(e) => setSelectedScheme(e.target.value)}
                    style={{
                      width: '100%', background: '#091524', border: '1px solid rgba(56, 189, 248, 0.35)',
                      borderRadius: '12px', padding: '0.75rem 1rem', color: '#ffffff', fontSize: '0.95rem',
                      outline: 'none', boxSizing: 'border-box', fontWeight: 700, cursor: 'pointer',
                    }}
                  >
                    <option value="PM-KISAN installment verification" style={{ background: '#091524', color: '#ffffff' }}>PM-KISAN installment verification (ரூ. 6,000 / ஆண்டு)</option>
                    <option value="PMFBY Crop Insurance Claim (Kharif)" style={{ background: '#091524', color: '#ffffff' }}>PMFBY Crop Insurance Claim / பயிர் காப்பீடு</option>
                    <option value="Kisan Credit Card (KCC) Loan Subvention" style={{ background: '#091524', color: '#ffffff' }}>Kisan Credit Card (KCC) Loan Subvention / கிசான் கடன் அட்டை</option>
                    <option value="Drip Irrigation Subsidized Kit (PMKSY)" style={{ background: '#091524', color: '#ffffff' }}>Drip Irrigation Subsidized Kit (PMKSY) / சொட்டு நீர் பாசனம்</option>
                    <option value="Subsidized Fertilizer & Quality Seed Supply" style={{ background: '#091524', color: '#ffffff' }}>Subsidized Fertilizer & Quality Seed Supply / மானிய உரம்</option>
                  </select>
                </div>
              </div>

              {/* Document Verification Checkboxes */}
              <div style={{
                background: 'rgba(9, 21, 36, 0.85)',
                border: '1px solid rgba(52, 211, 153, 0.35)',
                borderRadius: '16px',
                padding: '1.25rem 1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 900, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.85rem' }}>
                  Document Checklist & Verification Status / இணைக்கப்பட்ட சான்றுகள்:
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer', fontSize: '0.9rem', color: '#ffffff', fontWeight: 700 }}>
                    <input type="checkbox" checked={docPatta} onChange={(e) => setDocPatta(e.target.checked)} style={{ accentColor: '#10b981', width: 18, height: 18 }} />
                    <span>Patta / Chitta Land Record (பட்டா / சிட்டா)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer', fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
                    <input type="checkbox" checked={docAadhar} onChange={(e) => setDocAadhar(e.target.checked)} style={{ accentColor: '#10b981', width: 18, height: 18 }} />
                    <span>Aadhar eKYC Linked (ஆதார் இணைப்பு)</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', cursor: 'pointer', fontSize: '0.9rem', color: '#ffffff', fontWeight: 600 }}>
                    <input type="checkbox" checked={docBank} onChange={(e) => setDocBank(e.target.checked)} style={{ accentColor: '#10b981', width: 18, height: 18 }} />
                    <span>Bank Passbook NOC (வங்கி கணக்கு நகல்)</span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  type="submit"
                  style={{
                    padding: '1rem 2.5rem',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                    border: '1px solid rgba(52, 211, 153, 0.6)',
                    color: '#ffffff',
                    fontWeight: 900,
                    fontSize: '1.05rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    boxShadow: '0 0 30px rgba(16, 185, 129, 0.5), 0 10px 20px rgba(6, 182, 212, 0.3)',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(16, 185, 129, 0.7)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(16, 185, 129, 0.5), 0 10px 20px rgba(6, 182, 212, 0.3)';
                  }}
                >
                  <Send size={20} color="#ffffff" />
                  <span>Submit Scheme Application / விண்ணப்பத்தை அனுப்புக</span>
                </button>
              </div>
            </form>
          </div>
          {/* ── LIVE INTERACTIVE TOLL-FREE AI HELPLINE CALL MODAL ── */}
          {showCallModal && (
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(2, 6, 15, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}>
              <div style={{
                width: '100%',
                maxWidth: '480px',
                background: 'linear-gradient(135deg, #091524 0%, #050d18 100%)',
                border: '2px solid rgba(245, 158, 11, 0.6)',
                borderRadius: '28px',
                padding: '2.5rem 2rem',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 45px rgba(245, 158, 11, 0.35)',
                textAlign: 'center',
                color: '#ffffff',
                position: 'relative',
              }}>
                {/* Top Close Button */}
                <button
                  onClick={() => {
                    setShowCallModal(false);
                    stopSpeaking();
                  }}
                  style={{
                    position: 'absolute', top: 18, right: 18,
                    background: 'rgba(255,255,255,0.1)', border: 'none',
                    color: '#94a3b8', borderRadius: '50%', width: 36, height: 36,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <X size={20} />
                </button>

                {/* Pulsing Phone Icon */}
                <div style={{
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3), rgba(217, 119, 6, 0.4))',
                  border: '3px solid #f59e0b',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem',
                  boxShadow: '0 0 35px rgba(245, 158, 11, 0.6)',
                }}>
                  <Phone size={38} color="#fbbf24" />
                </div>

                <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
                  Toll-Free AI Voice Helpline
                </div>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.25rem' }}>
                  1800-180-1551
                </h2>
                <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.45rem' }}>
                  <span style={{ width: 9, height: 9, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }}></span>
                  Line Active • Connected to Grama Mitra IVR
                </div>

                {/* Audio Prompt Card */}
                <div style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '18px',
                  padding: '1.35rem',
                  marginBottom: '1.75rem',
                  textAlign: 'left',
                  fontSize: '0.925rem',
                  color: '#e2e8f0',
                  lineHeight: 1.6,
                }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#f59e0b', textTransform: 'uppercase', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Volume2 size={15} color="#f59e0b" /> IVR Voice Helpline Prompt / குரல் சேவை:
                  </div>
                  <p style={{ margin: 0, fontStyle: 'italic', color: '#ffffff', fontWeight: 700 }}>
                    "வணக்கம்! கிராம மித்ரா இலவச தொலைபேசி சேவைக்கு நல்வரவு. பயிர் நோய், அரசு திட்டங்கள், உரம் குறித்து பேசவும்..."
                  </p>
                  <div style={{ marginTop: '0.65rem', fontSize: '0.82rem', color: '#94a3b8' }}>
                    (English: "Welcome to Grama Mitra 1800 Toll-Free Helpline. Speak your agricultural question now...")
                  </div>
                </div>

                {/* Interactive Call Buttons */}
                <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      handleMicClick();
                    }}
                    style={{
                      padding: '0.85rem 1.5rem',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      boxShadow: '0 6px 20px rgba(16, 185, 129, 0.45)',
                    }}
                  >
                    <Mic size={18} /> Speak to Helpline
                  </button>

                  <a
                    href="tel:18001801551"
                    style={{
                      padding: '0.85rem 1.25rem',
                      borderRadius: '14px',
                      background: 'rgba(245, 158, 11, 0.18)',
                      border: '1px solid rgba(245, 158, 11, 0.4)',
                      color: '#fbbf24',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                    }}
                  >
                    Direct Mobile Call
                  </a>

                  <button
                    onClick={() => {
                      setShowCallModal(false);
                      stopSpeaking();
                    }}
                    style={{
                      padding: '0.85rem 1.35rem',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      border: 'none',
                      color: '#ffffff',
                      fontWeight: 900,
                      fontSize: '0.92rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.55rem',
                      boxShadow: '0 6px 20px rgba(239, 68, 68, 0.45)',
                    }}
                  >
                    <Phone size={18} style={{ transform: 'rotate(135deg)' }} /> End Call
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* ── OFFICIAL EMAIL INQUIRY MODAL ── */}
          {showEmailModal && (
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(2, 6, 15, 0.88)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              zIndex: 99999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}>
              <div style={{
                width: '100%',
                maxWidth: '520px',
                background: 'linear-gradient(135deg, #091524 0%, #050d18 100%)',
                border: '2px solid rgba(52, 211, 153, 0.6)',
                borderRadius: '28px',
                padding: '2.5rem 2rem',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 45px rgba(52, 211, 153, 0.35)',
                color: '#ffffff',
                position: 'relative',
              }}>
                {/* Top Close Button */}
                <button
                  onClick={() => {
                    setShowEmailModal(false);
                    setEmailSuccess('');
                  }}
                  style={{
                    position: 'absolute', top: 18, right: 18,
                    background: 'rgba(255,255,255,0.1)', border: 'none',
                    color: '#94a3b8', borderRadius: '50%', width: 36, height: 36,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', transition: 'all 0.2s',
                  }}
                >
                  <X size={20} />
                </button>

                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                  <div style={{
                    width: 68,
                    height: 68,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.3), rgba(6, 182, 212, 0.4))',
                    border: '2px solid #34d399',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                    boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)',
                  }}>
                    <Mail size={32} color="#34d399" />
                  </div>

                  <div style={{ fontSize: '0.78rem', fontWeight: 900, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>
                    Official Email Desk
                  </div>
                  <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#ffffff', marginBottom: '0.25rem' }}>
                    hello@gramaMitra.in
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                    Direct email channel for farmer support & government partnerships
                  </p>
                </div>

                {emailSuccess ? (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
                    border: '1px solid #10b981', borderRadius: '18px', padding: '1.5rem', textAlign: 'center', color: '#34d399',
                  }}>
                    <CheckCircle2 size={40} color="#34d399" style={{ margin: '0 auto 0.75rem' }} />
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem' }}>Email Inquiry Transmitted!</h3>
                    <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '1.25rem' }}>
                      Your message has been logged and sent to <strong>hello@gramaMitra.in</strong>. Our team will respond shortly.
                    </p>
                    <button
                      onClick={() => {
                        setShowEmailModal(false);
                        setEmailSuccess('');
                      }}
                      style={{
                        padding: '0.75rem 1.5rem', borderRadius: '12px', background: '#10b981', color: '#fff',
                        fontWeight: 800, border: 'none', cursor: 'pointer',
                      }}
                    >
                      Close Window
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (!emailForm.email.trim() || !emailForm.message.trim()) {
                        addToast('Please enter your email and message.', 'warning');
                        return;
                      }
                      setEmailSuccess('Message sent successfully!');
                      addToast('✉️ Email inquiry sent to hello@gramaMitra.in', 'success');
                      setEmailForm({ name: '', email: '', subject: '', message: '' });
                    }}
                    style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
                  >
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem' }}>
                        Your Name / பெயர்
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. K. Ramasamy"
                        value={emailForm.name}
                        onChange={(e) => setEmailForm(f => ({ ...f, name: e.target.value }))}
                        style={{
                          width: '100%', background: '#091524', border: '1px solid rgba(56, 189, 248, 0.35)',
                          borderRadius: '10px', padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem' }}>
                        Your Email Address / மின்னஞ்சல் *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. farmer@gmail.com"
                        value={emailForm.email}
                        onChange={(e) => setEmailForm(f => ({ ...f, email: e.target.value }))}
                        style={{
                          width: '100%', background: '#091524', border: '1px solid rgba(56, 189, 248, 0.35)',
                          borderRadius: '10px', padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem' }}>
                        Subject / தலைப்பு
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Crop Advisory Request / Scheme Inquiry"
                        value={emailForm.subject}
                        onChange={(e) => setEmailForm(f => ({ ...f, subject: e.target.value }))}
                        style={{
                          width: '100%', background: '#091524', border: '1px solid rgba(56, 189, 248, 0.35)',
                          borderRadius: '10px', padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem' }}>
                        Message Details / செய்தி *
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Type your inquiry or message here..."
                        value={emailForm.message}
                        onChange={(e) => setEmailForm(f => ({ ...f, message: e.target.value }))}
                        style={{
                          width: '100%', background: '#091524', border: '1px solid rgba(56, 189, 248, 0.35)',
                          borderRadius: '10px', padding: '0.65rem 0.85rem', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box',
                        }}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <button
                        type="submit"
                        style={{
                          flex: 1, padding: '0.85rem', borderRadius: '12px',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                          border: 'none', color: '#fff', fontWeight: 900, fontSize: '0.92rem',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                          boxShadow: '0 4px 18px rgba(16, 185, 129, 0.4)',
                        }}
                      >
                        <Send size={16} /> Send Email Inquiry
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('hello@gramaMitra.in');
                          addToast('📋 Copied hello@gramaMitra.in to clipboard!', 'info');
                        }}
                        style={{
                          padding: '0.85rem 1rem', borderRadius: '12px',
                          background: 'rgba(56, 189, 248, 0.15)',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          color: '#38bdf8', fontWeight: 800, fontSize: '0.85rem',
                          cursor: 'pointer',
                        }}
                      >
                        Copy Email
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
