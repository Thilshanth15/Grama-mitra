import React, { createContext, useContext, useState, useEffect } from 'react';

export const LANGUAGES = [
  { code: 'ta', name: 'தமிழ் (Tamil)', native: 'தமிழ்', flag: '🇮🇳', status: 'Supported', sttLang: 'ta-IN', ttsLang: 'ta-IN' },
  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', status: 'Supported', sttLang: 'en-IN', ttsLang: 'en-IN' },
  { code: 'hi', name: 'हिन्दी (Hindi)', native: 'हिन्दी', flag: '🇮🇳', status: 'Supported', sttLang: 'hi-IN', ttsLang: 'hi-IN' },
  { code: 'te', name: 'తెలుగు (Telugu)', native: 'తెలుగు', flag: '🇮🇳', status: 'Experimental', sttLang: 'te-IN', ttsLang: 'te-IN' },
  { code: 'kn', name: 'கன்னட / ಕನ್ನಡ (Kannada)', native: 'கன்னட', flag: '🇮🇳', status: 'Experimental', sttLang: 'kn-IN', ttsLang: 'kn-IN' },
  { code: 'ml', name: 'மலையாளம் / മലയാളം (Malayalam)', native: 'மலையாளம்', flag: '🇮🇳', status: 'Experimental', sttLang: 'ml-IN', ttsLang: 'ml-IN' },
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
    talkToGrama: 'AI உதவியாளரிடம் கேட்கவும்',
    exploreServices: 'ஆலோசனை சேவைகளை ஆராயுங்கள்',
    cropDiagnosis: 'பயிர் நோய் பகுப்பாய்வு',
    uploadPhoto: 'பயிர் படம் பதிவேற்று',
    tapToSpeak: 'தமிழில் பேச தட்டவும்',
    send: 'அனுப்பு',
    districtOfficer: 'மாவட்ட / வட்டார அதிகாரி',
    villageOfficer: 'கிராம நிர்வாக அதிகாரி',
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
    talkToGrama: 'Ask AI Assistant',
    exploreServices: 'Discover Advisory Services',
    cropDiagnosis: 'Crop Disease Diagnosis',
    uploadPhoto: 'Upload Crop Photo',
    tapToSpeak: 'Tap to speak in English',
    send: 'Send',
    districtOfficer: 'District / Block Officer',
    villageOfficer: 'Village Officer',
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
    talkToGrama: 'AI सहायक से पूछें',
    exploreServices: 'सलाहकार सेवाएं देखें',
    cropDiagnosis: 'फसल रोग निदान',
    uploadPhoto: 'फसल की फोटो अपलोड करें',
    tapToSpeak: 'हिंदी में बोलने के लिए टैप करें',
    send: 'भेजें',
    districtOfficer: 'जिला / ब्लॉक अधिकारी',
    villageOfficer: 'ग्राम अधिकारी',
    emergencyNotice: 'आपातकालीन सहायता: 108 एम्बुलेंस तुरंत कॉल करें',
  },
  te: {
    home: 'హోమ్',
    services: 'సేవలు',
    howItWorks: 'ఇది ఎలా పనిచేస్తుంది',
    assistant: 'వాయిస్ అసిస్టెంట్',
    about: 'గురించి',
    contact: 'సందర్శించండి',
    admin: 'అడ్మిన్',
    tryAssistant: 'అసిస్టెంట్‌ని ప్రయత్నించండి',
    talkToGrama: 'AI అసిస్టెంట్‌ని అడగండి',
    exploreServices: 'సలహా సేవలను అన్వేషించండి',
    cropDiagnosis: 'పంట వ్యాధి నిర్ధారణ',
    uploadPhoto: 'పంట ఫోటోను అప్‌లోడ్ చేయండి',
    tapToSpeak: 'మాట్లాడటానికి నొక్కండి',
    send: 'పంపండి',
    districtOfficer: 'జిల్లా / బ్లాక్ అధికారి',
    villageOfficer: 'గ్రామ అధికారి',
    emergencyNotice: 'అత్యవసర సహాయం: 108 అంబులెన్స్‌కు కాల్ చేయండి',
  },
  kn: {
    home: 'ಮುಖಪುಟ',
    services: 'ಸೇವೆಗಳು',
    howItWorks: 'ಇದು ಹೇಗೆ ಕಾರ್ಯನಿರ್ವಹಿಸುತ್ತದೆ',
    assistant: 'ಧ್ವನಿ ಸಹಾಯಕ',
    about: 'ಕುರಿತು',
    contact: 'ಸಂಪರ್ಕಿಸಿ',
    admin: 'ಅಡ್ಮಿನ್',
    tryAssistant: 'ಸಹಾಯಕನನ್ನು ಬಳಸಿ',
    talkToGrama: 'AI ಸಹಾಯಕರಲ್ಲಿ ಕೇಳಿ',
    exploreServices: 'ಸಲಹಾ ಸೇವೆಗಳನ್ನು ಪರಿಶೀಲಿಸಿ',
    cropDiagnosis: 'ಬೆಳೆ ರೋಗ ನಿರ್ಣಯ',
    uploadPhoto: 'ಬೆಳೆ ಫೋಟೋ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    tapToSpeak: 'ಮಾತನಾಡಲು ಟ್ಯಾಪ್ ಮಾಡಿ',
    send: 'ಕಳುಹಿಸಿ',
    districtOfficer: 'ಜಿಲ್ಲಾ / ಬ್ಲಾಕ್ ಅಧಿಕಾರಿ',
    villageOfficer: 'ಗ್ರಾಮ ಅಧಿಕಾರಿ',
    emergencyNotice: 'ತುರ್ತು ನೆರವು: ತಕ್ಷಣ 108 ಆಂಬ್ಯುಲೆನ್ಸ್‌ಗೆ ಕರೆ ಮಾಡಿ',
  },
  ml: {
    home: 'ഹോം',
    services: 'സേവനങ്ങൾ',
    howItWorks: 'ഇത് എങ്ങനെ പ്രവർത്തിക്കുന്നു',
    assistant: 'വോയിസ് അസിസ്റ്റൻ്റ്',
    about: 'കുറിച്ച്',
    contact: 'ബന്ധപ്പെടുക',
    admin: 'അഡ്മിൻ',
    tryAssistant: 'അസിസ്റ്റൻ്റിനെ ശ്രമിക്കുക',
    talkToGrama: 'AI അസിസ്റ്റൻ്റിനോട് ചോദിക്കുക',
    exploreServices: 'ഉപദേശക സേവനങ്ങൾ കാണുക',
    cropDiagnosis: 'വിള രോഗ നിർണ്ണയം',
    uploadPhoto: 'വിള ചിത്രം അപ്‌ലോഡ് ചെയ്യുക',
    tapToSpeak: 'സംസാരിക്കാൻ ടാപ്പ് ചെയ്യുക',
    send: 'അയക്കുക',
    districtOfficer: 'ജില്ലാ / ബ്ലോക്ക് ഓഫീസർ',
    villageOfficer: 'വില്ലേജ് ഓഫീസർ',
    emergencyNotice: 'അടിയന്തിര സഹായം: ഉടൻ 108 ആംബുലൻസ് വിളിക്കുക',
  },
  mr: {
    home: 'मुख्यपृष्ठ',
    services: 'सेवा',
    howItWorks: 'हे कसे कार्य करते',
    assistant: 'व्हॉइस असिस्टंट',
    about: 'आमच्याबद्दल',
    contact: 'संपर्क',
    admin: 'ॲडमिन',
    tryAssistant: 'सहायक वापरा',
    talkToGrama: 'AI सहायकाला विचारा',
    exploreServices: 'सल्लागार सेवा शोधा',
    cropDiagnosis: 'पिक रोग निदान',
    uploadPhoto: 'पिकाचा फोटो अपलोड करा',
    tapToSpeak: 'बोलण्यासाठी टॅप करा',
    send: 'पाठवा',
    districtOfficer: 'जिल्हा / ब्लॉक अधिकारी',
    villageOfficer: 'ग्राम अधिकारी',
    emergencyNotice: 'आणीबाणी मदत: 108 रुग्णवाहिकेला त्वरित कॉल करा',
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
    if (UI_STRINGS.en && UI_STRINGS.en[key]) {
      return UI_STRINGS.en[key];
    }
    return key;
  };

  useEffect(() => {
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = function () {
        if (window.google && window.google.translate) {
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'ta,en,hi,te,kn,ml,mr',
            autoDisplay: false,
          }, 'google_translate_element');

          const saved = localStorage.getItem(LANG_KEY) || 'ta';
          if (saved && saved !== 'en') {
            setTimeout(() => applyGoogleTranslate(saved), 500);
          }
        }
      };

      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else {
      const saved = localStorage.getItem(LANG_KEY) || 'ta';
      if (saved && saved !== 'en') {
        setTimeout(() => applyGoogleTranslate(saved), 300);
      }
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
  const tryApply = (attempts = 0) => {
    const selectElem = document.querySelector('.goog-te-combo');
    if (selectElem) {
      selectElem.value = langCode;
      selectElem.dispatchEvent(new Event('change'));
    } else if (attempts < 12) {
      setTimeout(() => tryApply(attempts + 1), 250);
    } else {
      document.cookie = `googtrans=/en/${langCode}; path=/; domain=${window.location.hostname}`;
      document.cookie = `googtrans=/en/${langCode}; path=/`;
    }
  };
  tryApply();
}
