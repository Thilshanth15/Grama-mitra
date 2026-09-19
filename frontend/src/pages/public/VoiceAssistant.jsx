import React, { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Mic, MicOff, Send, Volume2, VolumeX, RefreshCw, Users,
  Leaf, Building2, Heart, HelpCircle, AlertTriangle, Wifi, WifiOff,
  Info, ChevronDown, Camera, Image, X, Upload
} from 'lucide-react';
import PublicLayout from '../../layouts/PublicLayout.jsx';
import ResponseCard from '../../components/ResponseCard.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { sendMessage, speakText, stopSpeaking } from '../../services/api.js';
import { useToast } from '../../hooks/useToast.js';
import { ToastContainer } from '../../components/Toast.jsx';

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
  const { toasts, addToast, removeToast } = useToast();
  const inputRef = useRef(null);
  const resultRef = useRef(null);
  const fileInputRef = useRef(null);

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
                  voiceState === VOICE_STATES.PROCESSING ? 'rgba(56, 189, 248, 0.6)' : 'rgba(52, 211, 153, 0.5)',
                boxShadow: voiceState === VOICE_STATES.RECORDING ? '0 0 45px rgba(239, 68, 68, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.4)' :
                  voiceState === VOICE_STATES.PROCESSING ? '0 0 45px rgba(56, 189, 248, 0.6), inset 0 1px 2px rgba(255, 255, 255, 0.4)' : '0 0 45px rgba(16, 185, 129, 0.5), inset 0 1px 2px rgba(255, 255, 255, 0.4)',
                background: 'rgba(15, 23, 42, 0.6)',
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
                  padding: '0.4rem 1.25rem',
                  borderRadius: '9999px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.35)',
                  boxShadow: '0 2px 10px rgba(16, 185, 129, 0.2)',
                }}>
                  <strong style={{ color: '#34d399' }}>Tap microphone to speak</strong> in Tamil or English
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
        </div>
      </div>
    </PublicLayout>
  );
}
