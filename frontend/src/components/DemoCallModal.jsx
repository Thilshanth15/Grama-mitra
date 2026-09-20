import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mic, MicOff, Volume2, VolumeX, Grid, X, CheckCircle2, AlertCircle, Sparkles, RefreshCw } from 'lucide-react';
import { sendMessage, speakText, stopSpeaking } from '../services/api.js';

export default function DemoCallModal({ isOpen, onClose, initialLang = 'ta' }) {
  const [callStatus, setCallStatus] = useState('connecting'); // 'connecting' | 'connected' | 'ended'
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [showKeypad, setShowKeypad] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcriptLog, setTranscriptLog] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [recognition, setRecognition] = useState(null);
  const timerRef = useRef(null);

  // Initialize Call Connection & Ringing
  useEffect(() => {
    if (isOpen) {
      setCallStatus('connecting');
      setCallDuration(0);
      setTranscriptLog([]);
      setIsMuted(false);
      setIsSpeakerOn(true);
      setShowKeypad(false);

      // Simulate network connection delay (1.5s)
      const connTimer = setTimeout(() => {
        setCallStatus('connected');
        
        // Start Call Duration Timer
        timerRef.current = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);

        // IVR Welcome Greeting
        const greetingTa = 'வணக்கம்! கிராம மித்ரா 1800 இலவச விவசாய குரல் உதவி மையத்திற்கு நல்வரவு. உங்கள் கேள்வியை இப்போது கேட்கலாம் அல்லது விசை 1 அழுத்தவும்.';
        const greetingEn = 'Welcome to Grama Mitra 1800 Kisan AI Voice Helpline. You can speak your agricultural question now, or press key 1 for PM-KISAN, key 2 for Pest advisory.';
        
        const welcomeText = initialLang === 'en' ? greetingEn : greetingTa;
        const welcomeLog = {
          sender: 'IVR',
          text: welcomeText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setTranscriptLog([welcomeLog]);
        setIsAiSpeaking(true);

        if (isSpeakerOn) {
          speakText(welcomeText, initialLang === 'en' ? 'en-IN' : 'ta-IN');
          setTimeout(() => setIsAiSpeaking(false), 5000);
        } else {
          setIsAiSpeaking(false);
        }
      }, 1500);

      return () => {
        clearTimeout(connTimer);
        if (timerRef.current) clearInterval(timerRef.current);
        stopSpeaking();
      };
    }
  }, [isOpen]);

  // Clean up on unmount or close
  const handleEndCall = () => {
    setCallStatus('ended');
    stopSpeaking();
    if (recognition) recognition.stop();
    if (timerRef.current) clearInterval(timerRef.current);

    setTimeout(() => {
      onClose();
    }, 400);
  };

  // Format Duration into MM:SS
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Speech Recognition Handling
  const startVoiceInput = () => {
    if (isMuted) return;
    if (!('SpeechRecognition' in window) && !('webkitSpeechRecognition' in window)) {
      alert('Voice speech recognition is not supported in this browser. Please type or use Chrome.');
      return;
    }

    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = initialLang === 'en' ? 'en-IN' : 'ta-IN';
    rec.interimResults = false;

    rec.onstart = () => {
      setIsListening(true);
      stopSpeaking();
      setIsAiSpeaking(false);
    };

    rec.onresult = async (e) => {
      const userText = e.results[0][0].transcript;
      setIsListening(false);
      if (!userText.trim()) return;

      // Add user utterance to transcript log
      const userLog = {
        sender: 'You',
        text: userText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setTranscriptLog(prev => [...prev, userLog]);

      // Call AI Service
      setIsAiSpeaking(true);
      try {
        const res = await sendMessage(userText, { channel: 'Phone IVR', language: initialLang });
        const aiText = res.response || 'சாரி, தகவல் கிடைக்கவில்லை. (Sorry, no response available)';
        
        const aiLog = {
          sender: 'IVR',
          text: aiText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setTranscriptLog(prev => [...prev, aiLog]);

        if (isSpeakerOn) {
          speakText(aiText, initialLang === 'en' ? 'en-IN' : 'ta-IN');
        }
      } catch (err) {
        console.error('Call AI Error:', err);
      } finally {
        setIsAiSpeaking(false);
      }
    };

    rec.onerror = () => setIsListening(false);
    rec.onend = () => setIsListening(false);

    setRecognition(rec);
    rec.start();
  };

  // Dialpad Touch Tone Actions
  const handleKeypress = async (key) => {
    const keyActions = {
      '1': {
        prompt: initialLang === 'en' ? 'Selected Key 1: PM-KISAN Scheme Status & Verification Desk' : 'விசை 1 தேர்வு செய்யப்பட்டது: PM-KISAN திட்ட தகவல்',
        aiQuery: 'PM-KISAN installment status verification'
      },
      '2': {
        prompt: initialLang === 'en' ? 'Selected Key 2: Crop Pest & Disease Diagnostic Emergency' : 'விசை 2 தேர்வு செய்யப்பட்டது: பயிர் நோய் தடுப்பு ஆலோசனை',
        aiQuery: 'Paddy leaf yellowing and BPH pest remedy'
      },
      '3': {
        prompt: initialLang === 'en' ? 'Selected Key 3: Direct Handoff to District Agricultural Officer' : 'விசை 3 தேர்வு செய்யப்பட்டது: மாவட்ட அதிகாரி நேரடி இணைப்பு',
        aiQuery: 'District Officer contact number'
      },
      '4': {
        prompt: initialLang === 'en' ? 'Selected Key 4: Mandi Market Prices & Weather Forecast' : 'விசை 4 தேர்வு செய்யப்பட்டது: சந்தை விலை விவரம்',
        aiQuery: 'Market mandi price paddy Tamil Nadu'
      }
    };

    const action = keyActions[key] || {
      prompt: `Key ${key} pressed`,
      aiQuery: `Information for key ${key}`
    };

    const keyLog = {
      sender: 'Keypad',
      text: `[DTMF Tone ${key}] ${action.prompt}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setTranscriptLog(prev => [...prev, keyLog]);

    stopSpeaking();
    setIsAiSpeaking(true);
    try {
      const res = await sendMessage(action.aiQuery, { channel: 'Phone IVR Keypad', language: initialLang });
      const aiText = res.response;
      setTranscriptLog(prev => [...prev, {
        sender: 'IVR',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);

      if (isSpeakerOn) {
        speakText(aiText, initialLang === 'en' ? 'en-IN' : 'ta-IN');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiSpeaking(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(2, 6, 18, 0.92)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.25rem',
    }}>
      {/* Smartphone Call Frame Container */}
      <div style={{
        width: '100%',
        maxWidth: '440px',
        height: '680px',
        maxHeight: '90vh',
        background: 'linear-gradient(180deg, #091322 0%, #040912 100%)',
        border: '2px solid rgba(245, 158, 11, 0.5)',
        borderRadius: '36px',
        boxShadow: '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(245, 158, 11, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        color: '#ffffff',
      }}>
        {/* Phone Notch & Header */}
        <div style={{
          padding: '1.25rem 1.5rem 0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'rgba(15, 23, 42, 0.6)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#34d399', fontWeight: 800 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 10px #34d399' }} />
            HD VOICE IVR
          </div>
          <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 900, letterSpacing: '0.05em' }}>
            TOLL-FREE AI HELPLINE
          </div>
          <button
            onClick={handleEndCall}
            style={{
              background: 'rgba(255,255,255,0.1)', border: 'none', color: '#94a3b8',
              borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Call Info Header */}
        <div style={{ padding: '1.5rem 1.5rem 0.75rem', textAlign: 'center', flexShrink: 0 }}>
          {/* Avatar Ring */}
          <div style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 1rem',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.3) 0%, rgba(16, 185, 129, 0.3) 100%)',
            border: '2.5px solid #f59e0b',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 35px rgba(245, 158, 11, 0.45)',
            position: 'relative',
          }}>
            <Phone size={36} color="#fbbf24" style={{ animation: callStatus === 'connecting' ? 'bounce 1s infinite' : 'none' }} />
            {(isListening || isAiSpeaking) && (
              <div style={{
                position: 'absolute', inset: -6, borderRadius: '50%',
                border: '2px dashed #34d399', animation: 'spin 4s linear infinite',
              }} />
            )}
          </div>

          <h2 style={{ fontSize: '1.65rem', fontWeight: 900, margin: '0 0 0.25rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            1800-180-1551
          </h2>
          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#34d399', marginBottom: '0.25rem' }}>
            Grama Mitra Kisan IVR Call
          </div>

          {/* Status & Live Duration */}
          <div style={{ fontSize: '1rem', fontWeight: 900, color: callStatus === 'connecting' ? '#fbbf24' : '#60a5fa' }}>
            {callStatus === 'connecting' ? (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <RefreshCw size={14} className="spin" /> Dialing & Connecting...
              </span>
            ) : (
              <span>Call Duration {formatDuration(callDuration)}</span>
            )}
          </div>

          {/* Audio Wave Visualizer */}
          <div style={{ height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '0.5rem' }}>
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                style={{
                  width: '3px',
                  height: isAiSpeaking || isListening ? `${10 + (i % 4) * 5}px` : '4px',
                  background: isAiSpeaking ? '#f59e0b' : isListening ? '#34d399' : 'rgba(255,255,255,0.2)',
                  borderRadius: '3px',
                  transition: 'height 0.15s ease',
                }}
              />
            ))}
          </div>
        </div>

        {/* Live Audio Call Transcript Container */}
        <div style={{
          flex: 1,
          margin: '0 1.25rem 1rem',
          padding: '1rem',
          background: 'rgba(5, 10, 20, 0.75)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '20px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
        }}>
          {transcriptLog.length === 0 ? (
            <div style={{ textTransform: 'uppercase', fontSize: '0.75rem', color: '#64748b', textAlign: 'center', marginTop: '2rem', letterSpacing: '0.05em' }}>
              Connecting Live Audio Stream...
            </div>
          ) : (
            transcriptLog.map((log, idx) => (
              <div
                key={idx}
                style={{
                  alignSelf: log.sender === 'You' ? 'flex-end' : log.sender === 'Keypad' ? 'center' : 'flex-start',
                  maxWidth: '85%',
                  background: log.sender === 'You'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : log.sender === 'Keypad'
                    ? 'rgba(245, 158, 11, 0.2)'
                    : 'rgba(30, 41, 59, 0.9)',
                  border: log.sender === 'Keypad' ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(255,255,255,0.1)',
                  padding: '0.65rem 0.9rem',
                  borderRadius: log.sender === 'You' ? '16px 16px 2px 16px' : log.sender === 'Keypad' ? '10px' : '16px 16px 16px 2px',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  color: '#ffffff',
                }}
              >
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: log.sender === 'You' ? '#a7f3d0' : '#fbbf24', marginBottom: '0.2rem', display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                  <span>{log.sender}</span>
                  <span style={{ opacity: 0.7 }}>{log.time}</span>
                </div>
                <div>{log.text}</div>
              </div>
            ))
          )}
        </div>

        {/* DTMF Keypad View (if active) */}
        {showKeypad && (
          <div style={{
            position: 'absolute', bottom: 100, left: 20, right: 20,
            background: 'rgba(10, 15, 28, 0.95)', border: '1.5px solid rgba(245, 158, 11, 0.5)',
            borderRadius: '24px', padding: '1.25rem', backdropFilter: 'blur(20px)',
            boxShadow: '0 15px 40px rgba(0,0,0,0.8)', zIndex: 10,
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#fbbf24', textAlign: 'center', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
              IVR Touch-Tone Dialpad
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
              {[
                { k: '1', label: 'PM-KISAN' },
                { k: '2', label: 'Pest Advisory' },
                { k: '3', label: 'Officer' },
                { k: '4', label: 'Mandi Price' },
                { k: '5', label: 'Weather' },
                { k: '6', label: 'KCC Loan' },
                { k: '7', label: 'Fertilizer' },
                { k: '8', label: 'Health' },
                { k: '9', label: 'Emergency' },
                { k: '*', label: 'Repeat' },
                { k: '0', label: 'Operator' },
                { k: '#', label: 'End Menu' },
              ].map(item => (
                <button
                  key={item.k}
                  onClick={() => handleKeypress(item.k)}
                  style={{
                    padding: '0.65rem 0.25rem',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fbbf24' }}>{item.k}</span>
                  <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom Call Controls & Actions */}
        <div style={{
          padding: '1rem 1.5rem 1.5rem',
          background: 'rgba(10, 15, 28, 0.95)',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          flexShrink: 0,
        }}>
          {/* Main Voice Mic Push-to-Talk Button */}
          <button
            onClick={startVoiceInput}
            disabled={callStatus !== 'connected' || isListening}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '16px',
              background: isListening
                ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              border: 'none',
              color: '#ffffff',
              fontWeight: 900,
              fontSize: '0.95rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              boxShadow: isListening ? '0 0 25px rgba(239, 68, 68, 0.6)' : '0 6px 20px rgba(16, 185, 129, 0.45)',
            }}
          >
            <Mic size={20} />
            {isListening
              ? 'Listening to your voice... (பேசுங்கள்)'
              : 'Speak into Call / குரலில் பேசுங்கள்'}
          </button>

          {/* Secondary Control Row */}
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            {/* Mute Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              style={{
                width: 48, height: 48, borderRadius: '50%',
                background: isMuted ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.08)',
                border: `1.5px solid ${isMuted ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                color: isMuted ? '#ef4444' : '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
              title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
            >
              {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* Keypad Toggle */}
            <button
              onClick={() => setShowKeypad(!showKeypad)}
              style={{
                width: 48, height: 48, borderRadius: '50%',
                background: showKeypad ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.08)',
                border: `1.5px solid ${showKeypad ? '#f59e0b' : 'rgba(255,255,255,0.2)'}`,
                color: showKeypad ? '#fbbf24' : '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
              title="Toggle Dialpad"
            >
              <Grid size={20} />
            </button>

            {/* Speaker Toggle */}
            <button
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              style={{
                width: 48, height: 48, borderRadius: '50%',
                background: !isSpeakerOn ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255,255,255,0.08)',
                border: `1.5px solid ${!isSpeakerOn ? '#ef4444' : 'rgba(255,255,255,0.2)'}`,
                color: !isSpeakerOn ? '#ef4444' : '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
              }}
              title={isSpeakerOn ? 'Mute Speaker' : 'Unmute Speaker'}
            >
              {isSpeakerOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            {/* Red End Call Button */}
            <button
              onClick={handleEndCall}
              style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                border: 'none',
                color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                boxShadow: '0 6px 20px rgba(239, 68, 68, 0.6)',
              }}
              title="End Call"
            >
              <Phone size={24} style={{ transform: 'rotate(135deg)' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
