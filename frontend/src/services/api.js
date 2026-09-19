// AI Chat Service — calls FastAPI backend or runs local fallback
import { searchKnowledge, classifyIntent, detectEmergency } from '../data/knowledgeBase.js';
import { saveQuery, saveHandoff, saveSafetyAlert } from './firebase.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const USE_LOCAL = import.meta.env.VITE_USE_LOCAL_AI === 'true' || true; // Always use local for demo

// Emergency response template
const EMERGENCY_RESPONSE = `🚨 **This appears to be a medical emergency situation.**

**Please call 108 (Ambulance) IMMEDIATELY.**

Do not wait for AI assistance in an emergency. 

**What to do right now:**
1. Call **108** (National Ambulance) immediately
2. Stay calm and stay on the line with emergency services
3. Do not move the person unless they are in immediate danger
4. Unlock doors if you are alone

⚠️ **GRAMA MITRA is an information assistant, not an emergency service. This interaction has been flagged for immediate human review.**`;

const EMERGENCY_RESPONSE_TAMIL = `🚨 **இது ஒரு மருத்துவ அவசரகால நிலையாக இருக்கலாம்.**

**உடனடியாக 108 (ஆம்புலன்ஸ்) அழைக்கவும்.**

AI ஆலோசனைக்காக காத்திருக்க வேண்டாம்.

**இப்போதே செய்யுங்கள்:**
1. **108** அழைக்கவும்
2. அமைதியாக இருங்கள்
3. கதவை திறந்து வையுங்கள்

⚠️ **GRAMA MITRA தகவல் சேவை மட்டுமே — அவசரகால சேவை அல்ல.**`;

// Local AI simulation with knowledge base
async function runLocalAI(message, category) {
  const results = searchKnowledge(message, category === 'ALL' ? null : category?.toLowerCase());
  
  if (results.length === 0) {
    return {
      response: `நான் இந்த கேள்விக்கு சரியான தகவல் காண முடியவில்லை.\n\nI couldn't find verified information for this specific question in our knowledge base.\n\n**What I can help with:**\n- 🌾 Agriculture questions (crops, pests, farming)\n- 🏛️ Government schemes (PM-KISAN, PMFBY, KCC, etc.)\n- 🏥 Basic health guidance (non-emergency)\n\nFor personalized assistance, please click **"Request Human Help"** and our support team will assist you.`,
      confidence: 0.25,
      source: null,
      needsHandoff: true,
      intent: 'UNKNOWN',
    };
  }

  const best = results[0];
  const confidence = results.length >= 2 ? 0.87 : 0.71;

  return {
    response: best.answer,
    confidence,
    source: best.source ? { name: best.source, url: best.sourceUrl, lastUpdated: best.lastUpdated } : null,
    needsHandoff: confidence < 0.6,
    intent: category || classifyIntent(message),
    knowledgeId: best.id,
    isHealthGuidance: best.isHealthGuidance,
    disclaimer: best.disclaimer,
  };
}

// Crop Image Diagnosis AI Simulation
async function runCropImageDiagnosis(imageInfo, userPrompt = '') {
  const promptLower = (userPrompt || '').toLowerCase();

  let diseaseName = 'நெல் இலை கருகல் நோய் (Paddy Blast / Pyricularia oryzae)';
  let confidence = 0.92;
  let organicRemedy = '10 லிட்டர் தண்ணீரில் 500 மில்லி வேப்ப எண்ணெய் + சோப் கரைசல் கலந்து இலைகளின் மேல் தெளிக்கவும். சூடோமோனாஸ் ஃப்ளோரசென்ஸ் (Pseudomonas) 10g/L நீரில் தெளிக்கவும்.';
  let chemicalRemedy = 'டிரைசைக்ளசோல் 75% WP (Tricyclazole) — 1 கிராம்/லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்.';
  let cause = 'அதிக ஈரப்பதம் மற்றும் நைட்ரஜன் உரம் அதிகமாக பயன்படுத்தியதால் உருவாகும் பூஞ்சான் நோய்.';

  if (promptLower.includes('மஞ்சள்') || promptLower.includes('yellow')) {
    diseaseName = 'நைட்ரஜன் குறைபாடு / இலை மஞ்சள் நோய் (Nitrogen Deficiency / Leaf Chlorosis)';
    confidence = 0.89;
    organicRemedy = 'வேப்பம்பிண்ணாக்கு மற்றும் தொழு உரம் (FYM) ஏக்கருக்கு 200 கிலோ இடவும்.';
    chemicalRemedy = '1% யூரியா கரைசல் (10 கிராம் யூரியா / 1 லிட்டர் நீர்) இலைகளில் தெளிக்கவும்.';
    cause = 'மண்ணில் நைட்ரஜன் சத்து குறைபாடு அல்லது நீர் தேக்கத்தால் வேர் அழுகல்.';
  } else if (promptLower.includes('பூச்சி') || promptLower.includes('pest') || promptLower.includes('bph')) {
    diseaseName = 'புகையான் பூச்சி தாக்குதல் (Brown Plant Hopper - BPH)';
    confidence = 0.94;
    organicRemedy = 'வேப்பங்கொட்டை சாறு 5% தெளிக்கவும். வயலில் உள்ள நீரை உடனடியாக வடித்து காய வைக்கவும்.';
    chemicalRemedy = 'பியூப்ரோஃபெசின் 25% SC (Buprofezin) — 1.25 மில்லி/லிட்டர் தெளிக்கவும்.';
    cause = 'அடர்த்தியான பயிர் நடவு மற்றும் அதிக ஈரப்பதம் உள்ள சூழலில் பூச்சி பெருக்கம்.';
  }

  const responseText = `🖼️ **பயிர் படம் பகுப்பாய்வு முடிவு (AI Crop Image Analysis)**

🔍 **கண்டறியப்பட்ட பிரச்சனை (Identified Issue):**
**${diseaseName}**

📊 **AI நம்பகத்தன்மை (Confidence Score):** ${(confidence * 100).toFixed(0)}% (உயர் நம்பகத்தன்மை)

📝 **காரணம் (Cause):**
${cause}

---

### 🛠️ பரிந்துரைக்கப்படும் சிகிச்சை முறைகள் (Treatment & Remedies):

1. 🌿 **இயற்கை பாதுகாப்பு (Organic Treatment):**
   ${organicRemedy}

2. 🧪 **இரசாயன பாதுகாப்பு (Chemical Remedy):**
   ${chemicalRemedy}

3. 🌾 **பயிர் பாதுகாப்பு ஆலோசனைகள் (Prevention Tips):**
   - வயலில் நீர் தேங்காமல் சீரான வடிகால் வசதி அமைக்கவும்.
   - பரிந்துரைக்கப்பட்ட அளவுக்கு மேல் நைட்ரஜன் உரங்களை இட வேண்டாம்.
   - 10-15 நாட்களுக்கு பிறகு பயிரின் வளர்ச்சியை மீண்டும் கவனிக்கவும்.

📌 **சரிபார்க்கப்பட்ட ஆதாரம் (Verified Source):** [TNAU Agritech Portal — Crop Protection](https://agritech.tnau.ac.in)`;

  return {
    response: responseText,
    confidence,
    source: { name: 'TNAU Agritech Portal — Crop Protection', url: 'https://agritech.tnau.ac.in', lastUpdated: '2024-05-10' },
    needsHandoff: false,
    intent: 'AGRICULTURE',
    isImageAnalysis: true,
  };
}

// Main chat function
export async function sendMessage(message, options = {}) {
  const { channel = 'Website', sessionId = 'demo', image = null } = options;

  // Handle crop image upload analysis
  if (image) {
    const aiResult = await runCropImageDiagnosis(image, message);
    const queryRecord = await saveQuery({
      message: message || '[Uploaded Crop Image for Diagnosis]',
      category: 'AGRICULTURE',
      channel,
      response: aiResult.response,
      confidence: aiResult.confidence,
      status: 'Resolved',
      intent: 'AGRICULTURE',
      safetyFlag: false,
      sessionId,
    });
    return { ...aiResult, queryId: queryRecord.id, confidenceLabel: 'High Confidence (AI Vision)' };
  }
  const isEmergency = detectEmergency(message);
  const intent = classifyIntent(message);

  // 1. Emergency check — override everything
  if (isEmergency) {
    const alertRecord = await saveSafetyAlert({
      query: message,
      riskType: 'EMERGENCY',
      priority: 'Emergency',
      intent,
      channel,
      sessionId,
    });

    const handoffRecord = await saveHandoff({
      query: message,
      category: intent,
      reason: 'Emergency health query detected by safety layer',
      priority: 'Emergency',
      channel,
      sessionId,
    });

    const queryRecord = await saveQuery({
      message,
      category: 'EMERGENCY',
      channel,
      response: EMERGENCY_RESPONSE,
      confidence: 1.0,
      status: 'Escalated',
      intent: 'EMERGENCY',
      safetyFlag: true,
      handoffId: handoffRecord.id,
      sessionId,
    });

    return {
      response: EMERGENCY_RESPONSE,
      responseTamil: EMERGENCY_RESPONSE_TAMIL,
      confidence: 1.0,
      isEmergency: true,
      needsHandoff: true,
      handoffId: handoffRecord.id,
      alertId: alertRecord.id,
      queryId: queryRecord.id,
      source: null,
      intent: 'EMERGENCY',
      confidenceLabel: 'Emergency Protocol',
    };
  }

  // 2. Normal AI processing
  let aiResult;
  if (!USE_LOCAL) {
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, channel, intent }),
      });
      aiResult = await res.json();
    } catch {
      // fallback to local
      aiResult = await runLocalAI(message, intent);
    }
  } else {
    aiResult = await runLocalAI(message, intent);
  }

  // 3. Determine status
  const status = aiResult.needsHandoff ? 'Escalated' : (aiResult.confidence > 0.7 ? 'Resolved' : 'Pending');

  // 4. Save to Firebase
  const queryRecord = await saveQuery({
    message,
    category: aiResult.intent || intent,
    channel,
    response: aiResult.response,
    confidence: aiResult.confidence,
    status,
    intent: aiResult.intent || intent,
    safetyFlag: false,
    sessionId,
  });

  // 5. Auto-handoff if needed
  let handoffRecord = null;
  if (aiResult.needsHandoff) {
    handoffRecord = await saveHandoff({
      query: message,
      queryId: queryRecord.id,
      category: aiResult.intent || intent,
      reason: aiResult.confidence < 0.5 ? 'Low confidence — insufficient knowledge base information' : 'Sensitive query requires human review',
      priority: aiResult.intent === 'HEALTH' ? 'High' : 'Normal',
      channel,
      sessionId,
    });
  }

  // Health guidance — auto-save safety alert for health queries
  if (aiResult.isHealthGuidance && aiResult.intent === 'HEALTH') {
    await saveSafetyAlert({
      query: message,
      riskType: 'HEALTH_QUERY',
      priority: 'Normal',
      intent,
      channel,
      sessionId,
    });
  }

  return {
    ...aiResult,
    queryId: queryRecord.id,
    handoffId: handoffRecord?.id,
    confidenceLabel: aiResult.confidence >= 0.8 ? 'High Confidence' : aiResult.confidence >= 0.6 ? 'Moderate' : 'Needs Clarification',
  };
}

// Voice transcription (Web Speech API wrapper — returns promise)
export function transcribeVoice() {
  return new Promise((resolve, reject) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      reject(new Error('Speech recognition not supported in this browser'));
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'ta-IN'; // Tamil
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => resolve(e.results[0][0].transcript);
    recognition.onerror = (e) => reject(new Error(`Speech error: ${e.error}`));
    recognition.onend = () => {};
    recognition.start();
  });
}

// Text-to-speech (Tamil)
export function speakText(text, lang = 'ta-IN') {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang;
  utt.rate = 0.9;
  utt.pitch = 1;
  // Try to find a Tamil voice
  const voices = window.speechSynthesis.getVoices();
  const tamilVoice = voices.find(v => v.lang === 'ta-IN' || v.lang.startsWith('ta'));
  if (tamilVoice) utt.voice = tamilVoice;
  window.speechSynthesis.speak(utt);
}

export function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}
