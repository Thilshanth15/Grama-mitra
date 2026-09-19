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

      {/* Page header */}
      <div style={{
        background: '#000000',
        padding: '5.5rem 0 3.5rem',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#fff',
      }}>
        <div className="container-sm" style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '1.75rem' }}>
            <span className="section-label" style={{ display: 'inline-flex', gap: '0.5rem' }}>
              <Mic size={15} />
              {language === 'en' ? 'Multilingual Voice & Text Assistant' : 'Tamil Voice & Text Assistant'}
            </span>
          </div>
          <h1 className="section-title" style={{ marginBottom: '1.25rem' }}>
            Ask Grama Mitra
          </h1>
          <p style={{ color: 'var(--green-400)', fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.7 }}>
            {language === 'en'
              ? 'Ask your question in English or Tamil — by voice or text.'
              : 'உங்கள் கேள்வியை தமிழில் கேளுங்கள் — குரலில் அல்லது எழுத்தில்.'}
          </p>
        </div>
      </div>

      <div style={{ background: '#000000', minHeight: '70vh', padding: '3.5rem 0 5rem' }}>
        <div className="container-sm">
          {/* Category selector — Symmetrically Centered */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.65rem', marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '9999px',
                  border: `1.5px solid ${category === cat.id ? cat.color : 'rgba(255, 255, 255, 0.16)'}`,
                  background: category === cat.id ? (cat.id === 'all' ? 'rgba(255, 255, 255, 0.16)' : cat.color + '25') : 'rgba(255, 255, 255, 0.05)',
                  color: category === cat.id ? (cat.id === 'all' ? '#ffffff' : cat.color) : 'var(--gray-300)',
                  fontWeight: category === cat.id ? 700 : 500,
                  fontSize: '0.875rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: category === cat.id ? `0 4px 15px ${cat.color}33` : 'none',
                }}
              >
                <cat.icon size={15} />
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Voice button + status */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            {/* Ultra-Premium Voice Mic Orb */}
            <div className="mic-wrapper" style={{ marginBottom: '1.25rem' }}>
              <div className={`mic-aura ${voiceState === VOICE_STATES.RECORDING ? 'recording' : ''}`} />
              {voiceState === VOICE_STATES.RECORDING && <div className="pulse-ring" />}
              
              <div className="mic-outer-ring" style={{
                borderColor: voiceState === VOICE_STATES.RECORDING ? 'rgba(239, 68, 68, 0.45)' :
                  voiceState === VOICE_STATES.PROCESSING ? 'rgba(56, 189, 248, 0.45)' : 'rgba(52, 211, 153, 0.35)',
                boxShadow: voiceState === VOICE_STATES.RECORDING ? '0 0 35px -5px rgba(239, 68, 68, 0.45)' :
                  voiceState === VOICE_STATES.PROCESSING ? '0 0 35px -5px rgba(56, 189, 248, 0.45)' : '0 0 35px -5px rgba(16, 185, 129, 0.4)',
              }}>
                <button
                  className={`mic-button ${voiceState === VOICE_STATES.RECORDING ? 'recording' : voiceState === VOICE_STATES.PROCESSING ? 'processing' : 'idle'}`}
                  onClick={handleMicClick}
                  disabled={voiceState === VOICE_STATES.PROCESSING}
                  title={voiceState === VOICE_STATES.RECORDING ? 'Stop recording' : 'Start voice input'}
                  style={{ opacity: voiceState === VOICE_STATES.PROCESSING ? 0.8 : 1 }}
                  aria-label="Voice input button"
                >
                  {voiceState === VOICE_STATES.RECORDING ? (
                    <MicOff size={36} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
                  ) : voiceState === VOICE_STATES.PROCESSING ? (
                    <div className="spinner" style={{ width: 34, height: 34, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: '#ffffff' }} />
                  ) : (
                    <Mic size={36} color="#ffffff" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.35))' }} />
                  )}
                </button>
              </div>
            </div>

            {/* Waveform (recording) */}
            {voiceState === VOICE_STATES.RECORDING && (
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <div className="waveform">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="waveform-bar" style={{
                      animationDelay: `${i * 0.08}s`,
                      background: 'linear-gradient(to top, #ef4444, #f87171)',
                      height: `${14 + (i % 5) * 6}px`
                    }} />
                  ))}
                </div>
              </div>
            )}

            {/* Status text */}
            <div style={{
              fontSize: '1rem',
              color: voiceState === VOICE_STATES.RECORDING ? '#f87171' :
                voiceState === VOICE_STATES.PROCESSING ? '#38bdf8' : '#ffffff',
              fontFamily: voiceState === VOICE_STATES.PROCESSING ? 'var(--font-tamil)' : 'inherit',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              letterSpacing: '0.01em',
            }}>
              {voiceState === VOICE_STATES.PROCESSING && <div className="spinner" style={{ width: 16, height: 16 }} />}
              {voiceState === VOICE_STATES.IDLE && (
                <span>
                  <strong style={{ color: '#34d399' }}>Tap to speak</strong> in Tamil or English
                </span>
              )}
              {voiceState !== VOICE_STATES.IDLE && voiceStatusText[voiceState]}
            </div>

            {!isSpeechSupported && (
              <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.375rem', fontSize: '0.8rem', color: '#fbbf24' }}>
                <AlertTriangle size={14} />
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

          {/* Text & Image Input Form */}
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              background: 'var(--color-surface)',
              border: selectedImage ? '2px solid var(--green-500)' : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-xl)',
              padding: '0.875rem',
              boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
              transition: 'all 0.2s',
            }}>
              {/* Image Preview Thumbnail if attached */}
              {imagePreview && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.625rem',
                  padding: '0.375rem 0.75rem',
                  background: 'var(--green-50)',
                  border: '1px solid var(--green-200)',
                  borderRadius: 'var(--radius-lg)',
                  maxWidth: 'fit-content',
                }}>
                  <img
                    src={imagePreview}
                    alt="Crop preview"
                    style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: '0.375rem', border: '1px solid var(--green-300)' }}
                  />
                  <div style={{ fontSize: '0.8125rem', color: 'var(--green-900)', fontWeight: 600 }}>
                    📷 {selectedImage?.name || 'Crop_Image.jpg'}
                    <div style={{ fontSize: '0.7rem', color: 'var(--green-600)', fontWeight: 400 }}>AI Crop Disease Diagnosis Attached</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    style={{ background: 'none', border: 'none', color: 'var(--red-500)', cursor: 'pointer', padding: '0.2rem', marginLeft: '0.25rem' }}
                    title="Remove image"
                  >
                    <X size={15} />
                  </button>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.625rem', alignItems: 'flex-end' }}>
                {/* Crop Image Upload Button (Circled in UI) */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="btn btn-sm btn-ghost"
                  title="Upload Crop Image for Disease Diagnosis"
                  style={{
                    color: selectedImage ? 'var(--green-600)' : 'var(--gray-500)',
                    background: selectedImage ? 'var(--green-100)' : 'var(--gray-100)',
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--gray-200)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <Camera size={18} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, display: 'inline' }}>
                    {selectedImage ? 'Image Added' : 'Crop Photo'}
                  </span>
                </button>

                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={language === 'en' ? 'Type your question or attach crop photo...' : 'அல்லது இங்கே தட்டச்சு செய்யுங்கள்… (Type question or attach crop photo)'}
                  style={{
                    flex: 1, border: 'none', outline: 'none', resize: 'none',
                    fontFamily: language === 'en' ? 'var(--font-sans)' : 'var(--font-tamil)', fontSize: '0.9375rem',
                    color: '#ffffff', background: 'transparent',
                    minHeight: '48px', maxHeight: '120px',
                    lineHeight: 1.5, padding: '0.25rem 0.25rem',
                  }}
                  rows={2}
                  disabled={voiceState === VOICE_STATES.PROCESSING}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
                />

                <div style={{ display: 'flex', gap: '0.375rem', alignItems: 'center' }}>
                  {result && (
                    <button type="button" onClick={handleReset} className="btn btn-sm btn-ghost" title="Clear">
                      <RefreshCw size={15} />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn btn-sm btn-primary"
                    disabled={(!input.trim() && !selectedImage) || voiceState === VOICE_STATES.PROCESSING}
                    style={{ minWidth: 80 }}
                  >
                    {voiceState === VOICE_STATES.PROCESSING ? <div className="spinner" style={{ width: 15, height: 15 }} /> : <><Send size={15} /> Send</>}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Crop Image Diagnostics Presets — Centered */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8125rem', color: 'var(--gray-400)', fontWeight: 600 }}>🌾 Crop Presets:</span>
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
                  fontSize: '0.8125rem', padding: '0.45rem 0.85rem',
                  background: 'rgba(16, 185, 129, 0.14)', color: 'var(--green-300)',
                  border: '1px solid rgba(52, 211, 153, 0.3)', borderRadius: 'var(--radius-full)',
                  cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.375rem',
                  transition: 'all 0.15s',
                }}
                aria-label="Preset: Yellow leaf disease sample"
              >
                <Camera size={13} />
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
                  fontSize: '0.8125rem', padding: '0.45rem 0.85rem',
                  background: 'rgba(245, 158, 11, 0.14)', color: 'var(--amber-300)',
                  border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: 'var(--radius-full)',
                  cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.375rem',
                  transition: 'all 0.15s',
                }}
                aria-label="Preset: Pest attack sample"
              >
                <Camera size={13} />
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
            <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <button
                className="btn btn-sm btn-ghost"
                onClick={handleSpeak}
                style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}
              >
                {speaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                {speaking ? 'Stop' : (language === 'en' ? 'Listen to Answer' : 'Listen in Tamil')}
              </button>
              <span style={{ fontSize: '0.75rem', color: 'var(--gray-400)' }}>
                {result.queryId && `Query ID: ${result.queryId}`}
              </span>
            </div>
          )}

          {/* Suggested questions */}
          {!result && voiceState === VOICE_STATES.IDLE && (
            <div style={{ marginTop: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ height: 1, flex: 1, background: 'var(--color-border)' }} />
                <span className="text-sm" style={{ color: 'var(--gray-400)', fontWeight: 500 }}>Suggested questions & common inquiries</span>
                <div style={{ height: 1, flex: 1, background: 'var(--color-border)' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {SUGGESTED_QUESTIONS.all
                  .filter(dq => category === 'all' || dq.cat.toLowerCase() === category)
                  .slice(0, 5)
                  .map((dq, i) => (
                    <button key={i} className="demo-question" onClick={() => handleDemoQuestion(dq.q)}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                        <span>{dq.q}</span>
                        <span style={{
                          fontSize: '0.7rem', padding: '0.15rem 0.5rem',
                          background: dq.cat === 'Emergency' ? 'var(--red-100)' : 'var(--gray-100)',
                          color: dq.cat === 'Emergency' ? 'var(--red-600)' : 'var(--gray-500)',
                          borderRadius: 'var(--radius-full)', fontWeight: 600, flexShrink: 0,
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
            marginTop: '3rem', padding: '1.25rem 1.5rem',
            background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.22)',
            borderRadius: 'var(--radius-xl)', display: 'flex', gap: '1rem', alignItems: 'flex-start',
            fontSize: '0.875rem', color: 'var(--blue-200)', lineHeight: 1.7,
          }}>
            <Info size={18} style={{ flexShrink: 0, marginTop: 2, color: 'var(--blue-400)' }} />
            <div>
              <strong style={{ color: '#fff' }}>About Grama Mitra:</strong> Responses are based on verified information from TNAU, government portals, and health authorities.
              Health responses are informational only — not a substitute for professional medical advice.
              Emergency situations are automatically escalated. 
              <span style={{ color: 'var(--green-300)' }}> Integrated multi-channel AI architecture for web, WhatsApp, and toll-free IVR.</span>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
