import React, { createContext, useContext, useState, useEffect } from 'react';

export const LANGUAGES = [
  { code: 'ta', name: 'தமிழ் (Tamil)', native: 'தமிழ்', flag: '🇮🇳', status: 'Supported', sttLang: 'ta-IN', ttsLang: 'ta-IN' },
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', status: 'Supported', sttLang: 'en-IN', ttsLang: 'en-IN' },
  { code: 'hi', name: 'हिन्दी (Hindi)', native: 'हिन्दी', flag: '🇮🇳', status: 'Supported', sttLang: 'hi-IN', ttsLang: 'hi-IN' },
  { code: 'te', name: 'తెలుగు (Telugu)', native: 'తెలుగు', flag: '🇮🇳', status: 'Experimental', sttLang: 'te-IN', ttsLang: 'te-IN' },
  { code: 'kn', name: 'கன்னட / ಕನ್ನಡ (Kannada)', native: 'கன்னட', flag: '🇮🇳', status: 'Experimental', sttLang: 'kn-IN', ttsLang: 'kn-IN' },
  { code: 'ml', name: 'மலையாளம் / മലയാളம் (Malayalam)', native: 'மலையாளம்', flag: '🇮🇳', status: 'Experimental', sttLang: 'ml-IN', ttsLang: 'ml-IN' },
  { code: 'mr', name: 'मराठी (Marathi)', native: 'मराठी', flag: '🇮🇳', status: 'Experimental', sttLang: 'mr-IN', ttsLang: 'mr-IN' },
];

const UI_STRINGS = {
  ta: {
    home: 'முகப்பு',
    services: 'சேவைகள்',
    howItWorks: 'செயல்முறை',
    assistant: 'குரல் உதவி',
    about: 'பற்றி',
    contact: 'தொடர்பு',
    admin: 'நிர்வாகம்',
    tryAssistant: 'உதவியாளரை முயற்சிக்கவும்',
    talkToGrama: 'கிராம மித்ராவிடம் பேசுங்கள்',
    exploreServices: 'சேவைகளை ஆராயுங்கள்',
    cropDiagnosis: 'பயிர் நோய் பகுப்பாய்வு',
    uploadPhoto: 'பயிர் படம் பதிவேற்று',
    tapToSpeak: 'தமிழில் பேச தட்டவும்',
    send: 'அனுப்பு',
    emergencyNotice: 'அவசர சிகிச்சை: 108 ஆம்புலன்ஸ் அழைக்கவும்',
  },
  en: {
    home: 'Home',
    services: 'Services',
    howItWorks: 'How It Works',
    assistant: 'Voice Assistant',
    about: 'About',
    contact: 'Contact',
    admin: 'Admin',
    tryAssistant: 'Try Assistant',
    talkToGrama: 'Talk to Grama Mitra',
    exploreServices: 'Explore Services',
    cropDiagnosis: 'Crop Disease Diagnosis',
    uploadPhoto: 'Upload Crop Photo',
    tapToSpeak: 'Tap to speak in English',
    send: 'Send',
    emergencyNotice: 'Emergency: Call 108 Ambulance immediately',
  },
  hi: {
    home: 'होम',
    services: 'सेवाएं',
    howItWorks: 'यह कैसे काम करता है',
    assistant: 'वॉइस सहायक',
    about: 'हमारे बारे में',
    contact: 'संपर्क करें',
    admin: 'एडमिन',
    tryAssistant: 'सहायक का उपयोग करें',
    talkToGrama: 'ग्राम मित्रा से बात करें',
    exploreServices: 'सेवाएं देखें',
    cropDiagnosis: 'फसल रोग निदान',
    uploadPhoto: 'फसल की फोटो अपलोड करें',
    tapToSpeak: 'हिंदी में बोलने के लिए टैप करें',
    send: 'भेजें',
    emergencyNotice: 'आपातकालीन सहायता: 108 एम्बुलेंस तुरंत कॉल करें',
  },
};

const LANG_KEY = 'grama_mitra_selected_language';

export const LanguageContext = createContext({
  language: 'ta',
  setLanguage: () => {},
  languages: LANGUAGES,
  t: (key) => key,
  currentLangObj: LANGUAGES[0],
});

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem(LANG_KEY) || 'ta';
  });

  const setLanguage = (langCode) => {
    setLanguageState(langCode);
    localStorage.setItem(LANG_KEY, langCode);
    applyGoogleTranslate(langCode);
  };

  const currentLangObj = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const t = (key) => {
    if (UI_STRINGS[language] && UI_STRINGS[language][key]) {
      return UI_STRINGS[language][key];
    }
    if (UI_STRINGS.en[key]) {
      return UI_STRINGS.en[key];
    }
    return key;
  };

  useEffect(() => {
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = function () {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement({
            pageLanguage: 'ta',
            includedLanguages: 'ta,en,hi,te,kn,ml,mr',
            autoDisplay: false,
          }, 'google_translate_element');
        }
      };

      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }

    const saved = localStorage.getItem(LANG_KEY) || 'ta';
    if (saved && saved !== 'ta') {
      setTimeout(() => applyGoogleTranslate(saved), 800);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languages: LANGUAGES, t, currentLangObj }}>
      <div id="google_translate_element" style={{ display: 'none', position: 'absolute', top: -9999, left: -9999 }} />
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

function applyGoogleTranslate(langCode) {
  const selectElem = document.querySelector('.goog-te-combo');
  if (selectElem) {
    selectElem.value = langCode;
    selectElem.dispatchEvent(new Event('change'));
  } else {
    document.cookie = `googtrans=/ta/${langCode}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=/ta/${langCode}; path=/`;
  }
}
