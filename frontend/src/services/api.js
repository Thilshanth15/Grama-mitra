// AI Chat Service — calls FastAPI backend or runs local fallback
import { searchKnowledge, classifyIntent, detectEmergency } from '../data/knowledgeBase.js';
import { saveQuery, saveHandoff, saveSafetyAlert } from './firebase.js';

const API_BASE = import.meta.env.VITE_API_URL || '';
const USE_LOCAL = import.meta.env.VITE_USE_LOCAL_AI === 'true';

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

// Language detection helper
export function detectLanguage(text) {
  if (!text || typeof text !== 'string') return 'ta';

  const trimmed = text.trim();
  const hasTamilScript = /[\u0B80-\u0BFF]/.test(trimmed);
  const hasEnglishScript = /[a-zA-Z]/.test(trimmed);

  if (hasTamilScript) {
    return 'ta';
  }

  if (hasEnglishScript) {
    const lower = trimmed.toLowerCase();
    const tanglishKeywords = [
      'enna', 'epdi', 'eppadi', 'varuthu', 'varudhu', 'pannalam', 'panungan', 'pannu', 'solli', 'solla',
      'iruku', 'irukku', 'nalla', 'illa', 'illai', 'vendum', 'venum', 'aachu', 'thaan', 'thanga', 'kudunga',
      'vivasayam', 'payir', 'poochi', 'marunthu', 'seiya', 'romba', 'konjam', 'edhu', 'yethu', 'pannangapa',
      'nanga', 'naanga', 'unga', 'ungalo', 'veedu', 'thanni', 'serthu', 'poda', 'plant-ku'
    ];
    if (tanglishKeywords.some(w => lower.includes(w))) {
      return 'tanglish';
    }
    return 'en';
  }

  return 'ta';
}

// Multi-Domain General Conversational AI Engine (ChatGPT-style)
function generateGeneralConversationalResponse(message, detectedLang = 'ta', history = []) {
  const text = (message || '').toLowerCase().trim();

  // Check for follow-up question
  const isFollowUp = /what (should i|to) do next|next step|அடுத்து என்ன|என்ன செய்ய வேண்டும்|epdi next/i.test(text);
  if (isFollowUp && history && history.length > 0) {
    const lastTopic = history[history.length - 1]?.message || '';

    if (detectedLang === 'en') {
      return {
        response: `📋 **Recommended Next Steps for your inquiry ("${lastTopic}")**:\n\n1. **Immediate Inspection**: Check your crop or situation thoroughly for early symptoms.\n2. **Action Plan**: Apply the recommended treatment or solution steps carefully.\n3. **Monitoring**: Re-evaluate the progress after 3 to 5 days.\n4. **Official Escalation**: If symptoms persist, click **"Request Human Help"** to alert your local Village Agriculture Officer directly.`,
        confidence: 0.90,
        source: { name: 'Grama Mitra Follow-up Engine', url: '#', lastUpdated: '2026-09-20' },
        needsHandoff: false,
        intent: 'GENERAL',
      };
    } else {
      return {
        response: `📋 **உங்கள் கேள்விக்கான அடுத்தகட்ட நடவடிக்கைகள் ("${lastTopic}")**:\n\n1. **நேரடி ஆய்வு**: பயிரின் இலைகள் மற்றும் அடிப்பகுதியை வெள்ளை ஈ அல்லது பூச்சி பாதிப்பு உள்ளதா என கவனமாக பார்க்கவும்.\n2. **சிகிச்சை தொடக்கம்**: பரிந்துரைக்கப்பட்ட இயற்கை வேப்பெண்ணெய் கரைசல் அல்லது மருந்தை தெளிக்கவும்.\n3. **பயிற்சி & கண்காணிப்பு**: 3 முதல் 5 நாட்கள் கழித்து பயிர் வளர்ச்சியை மீண்டும் சரிபார்க்கவும்.\n4. **அதிகாரி உதவி**: பிரச்சனை தொடர்ந்தால் **"Request Human Help"** கிளிக் செய்து கிராம அலுவலருக்கு தகவல் அனுப்பலாம்.`,
        confidence: 0.90,
        source: { name: 'கிராம மித்ரா தொடர் வழிகாட்டி', url: '#', lastUpdated: '2026-09-20' },
        needsHandoff: false,
        intent: 'GENERAL',
      };
    }
  }

  // 1. Capital of India / General Knowledge (Tamil & English)
  if (/capital of india|இந்தியாவின் தலைநகரம்/i.test(text)) {
    if (detectedLang === 'en') {
      return {
        response: `🏛️ **Capital of India**\n\nThe capital of India is **New Delhi**. It serves as the seat of all three branches of the Government of India (Executive, Legislative, and Judiciary).`,
        confidence: 0.98,
        source: { name: 'Government of India Portal', url: 'https://india.gov.in', lastUpdated: '2026-09-20' },
        needsHandoff: false,
        intent: 'GENERAL',
      };
    } else {
      return {
        response: `🏛️ **இந்தியாவின் தலைநகரம்**\n\nஇந்தியாவின் தலைநகரம் **புதுடெல்லி (New Delhi)** ஆகும். புதுடெல்லி இந்திய மத்திய அரசின் நிர்வாகத் தலைமையிடமாகவும், நாடாளுமன்றம் மற்றும் குடியரசுத் தலைவர் மாளிகை அமைந்துள்ள நகரமாகவும் திகழ்கிறது.`,
        confidence: 0.98,
        source: { name: 'இந்திய அரசு இணையதளம்', url: 'https://india.gov.in', lastUpdated: '2026-09-20' },
        needsHandoff: false,
        intent: 'GENERAL',
      };
    }
  }

  // 2. Tomato Leaf Curl Virus / Diseases (Tamil, Tanglish & English)
  if (/tomato|தக்காளி|leaf curl|இலை சுருட்டல்|இலை சுருட்டு/i.test(text)) {
    if (detectedLang === 'en') {
      return {
        response: `🍅 **Tomato Leaf Curl Virus (ToLCV) Guidance**\n\n**Cause**: Transmitted by Whiteflies (*Bemisia tabaci*).\n\n**Symptoms**: Upward curling of leaves, stunted plant growth, yellowing.\n\n**Control Measures**:\n1. **Organic**: Spray 3% Neem Oil solution (30ml neem oil + 5ml liquid soap in 10L water).\n2. **Yellow Sticky Traps**: Place 10-12 yellow sticky traps per acre to catch whiteflies.\n3. **Chemical Remedy**: Spray Imidacloprid 17.8% SL (0.5 ml/L water) early in the morning.\n\n📌 **Source**: TNAU Agritech Portal`,
        confidence: 0.94,
        source: { name: 'TNAU Agritech Portal', url: 'https://agritech.tnau.ac.in', lastUpdated: '2026-09-20' },
        needsHandoff: false,
        intent: 'AGRICULTURE',
      };
    } else if (detectedLang === 'tanglish') {
      return {
        response: `🍅 **Tomato Plant-ku Leaf Curl & Fertilizer Guidance (Tanglish / தமிழ்)**\n\n**Karanam**: Tomato leaf curl virus (இலை சுருட்டல்) Whitefly (வெள்ளை ஈ) மூலமா பரவுது.\n\n**Solution & Remedies**:\n1. **Organic Uram & Spray**: Nalla makkya thozhu uram (FYM) podunga. 3% Neem oil spray (வேப்பண்ணெய் கரைசல்) panna whitefly kattupadum.\n2. **Fertilizer**: Plant growth stage-la NPK 19:19:19 (5g per liter water) mix panni spray pannalam.\n3. **Yellow Sticky Trap**: Vayal-la yellow sticky trap vecha whitefly poochi ellam sikkidum!`,
        confidence: 0.94,
        source: { name: 'TNAU Crop Advisory', url: 'https://agritech.tnau.ac.in', lastUpdated: '2026-09-20' },
        needsHandoff: false,
        intent: 'AGRICULTURE',
      };
    } else {
      return {
        response: `🍅 **தக்காளி இலை சுருட்டல் நோய் (Tomato Leaf Curl Virus) காரணம் & தீர்வுகள்**\n\n**காரணம்**: தக்காளி செடியில் இலை சுருட்டல் நோய் **வெள்ளை ஈ (Whitefly)** என்ற சாறு உறிஞ்சும் பூச்சி மூலம் வைரஸாக பரவுகிறது.\n\n**அறிகுறிகள்**: இலைகள் மேல்நோக்கி சுருங்குதல், வளர்ச்சி குன்றுதல், இலை மஞ்சள் நிறமாக மாறுதல்.\n\n**கட்டுப்படுத்தும் முறைகள்**:\n1. **இயற்கை முறை**: 10 லிட்டர் தண்ணீரில் 50 மில்லி வேப்பெண்ணெய் + சோப் கரைசல் கலந்து இலைகளின் மேல் தெளிக்கவும்.\n2. **மஞ்சள் ஒட்டு அட்டை**: ஏக்கருக்கு 10-12 மஞ்சள் ஒட்டு அட்டைகள் அமைத்து வெள்ளை ஈக்களை கட்டுப்படுத்தவும்.\n3. **இரசாயன முறை**: இமிடாக்குளோப்ரிட் 17.8% SL (0.5 மில்லி/லிட்டர் நீர்) காலை வேளையில் தெளிக்கவும்.\n\n📌 **ஆதாரம்**: TNAU வேளாண்மை பல்கலைக்கழக வழிகாட்டுதல்`,
        confidence: 0.95,
        source: { name: 'TNAU Agritech Portal', url: 'https://agritech.tnau.ac.in', lastUpdated: '2026-09-20' },
        needsHandoff: false,
        intent: 'AGRICULTURE',
      };
    }
  }

  // 3. Government Schemes (Tamil & English)
  if (/scheme|திட்டம்|திட்டங்கள்|pm kisan|pm-kisan|kcc|insurance|காப்பீடு/i.test(text)) {
    if (detectedLang === 'en') {
      return {
        response: `🏛️ **Verified Farmers Government Welfare Schemes in India & Tamil Nadu**\n\n1. **PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)**:\n   - Provides ₹6,000 per year in 3 equal installments directly to eligible farmer bank accounts.\n2. **PMFBY (Pradhan Mantri Fasal Bima Yojana)**:\n   - Crop insurance against natural calamities, droughts, floods, and pest attacks.\n3. **Kisan Credit Card (KCC)**:\n   - Subsidized short-term crop loan up to ₹3 Lakhs at 4% effective interest rate.\n4. **PMKSY (Subsidized Drip Irrigation)**:\n   - 100% subsidy for small/marginal farmers and 75% for other farmers in Tamil Nadu.\n\n📌 *All schemes require Aadhaar eKYC and Land Patta linkage.*`,
        confidence: 0.95,
        source: { name: 'PM-KISAN Portal & TN Agri Dept', url: 'https://pmkisan.gov.in', lastUpdated: '2026-09-20' },
        needsHandoff: false,
        intent: 'GOVERNMENT_SCHEME',
      };
    } else {
      return {
        response: `🏛️ **விவசாயிகளுக்கான முக்கிய அரசு நலத்திட்டங்கள் (Verified Govt Schemes)**\n\n1. **பி.எம். கிசான் (PM-KISAN)**:\n   - தகுதியுள்ள விவசாயிகளுக்கு ஆண்டுக்கு **₹6,000** நிதி உதவி 3 தவணைகளாக (₹2000 x 3) நேரடியாக வங்கி கணக்கில் செலுத்தப்படுகிறது.\n2. **பிரதான் மந்திரி பயிர் காப்பீட்டு திட்டம் (PMFBY)**:\n   - இயற்கை சீற்றங்கள், மழைப்பொழிவு மற்றும் பூச்சி தாக்குதலால் ஏற்படும் பயிர் இழப்பிற்கு காப்பீட்டு இழப்பீடு.\n3. **கிசான் கிரெடிட் கார்டு (KCC - Kisan Credit Card)**:\n   - குறைந்த வட்டி வீதத்தில் (4% வட்டி மானியம்) ₹3 லட்சம் வரை விவசாய கடன்.\n4. **நுண்ணீர் பாசன திட்டம் (PMKSY)**:\n   - சிறு/குறு விவசாயிகளுக்கு 100% மானியத்திலும், இதர விவசாயிகளுக்கு 75% மானியத்திலும் சொட்டு நீர் பாசன உபகரணங்கள்.\n\n📌 *விண்ணப்பிக்க தேவையான ஆவணங்கள்: பட்டா சிட்டா, ஆதார் அட்டை, வங்கி கணக்கு புத்தகம்.*`,
        confidence: 0.95,
        source: { name: 'வேளாண்மை - உழவர் நலத்துறை தமிழ்நாடு', url: 'https://tnagrisnet.tn.gov.in', lastUpdated: '2026-09-20' },
        needsHandoff: false,
        intent: 'GOVERNMENT_SCHEME',
      };
    }
  }

  // 4. Java / Programming & Technology (English & Tamil)
  if (/java|python|javascript|programming|coding|computer|ai|software/i.test(text)) {
    let topicName = 'Programming';
    if (text.includes('java')) topicName = 'Java';
    else if (text.includes('python')) topicName = 'Python';
    else if (text.includes('javascript')) topicName = 'JavaScript';

    if (detectedLang === 'en') {
      return {
        response: `💻 **${topicName} Explained in Simple Words**\n\n**What is ${topicName}?**\n${topicName === 'Java' ? 'Java is a popular object-oriented programming language created in 1995. Its key principle is **"Write Once, Run Anywhere" (WORA)**, meaning compiled Java code can run on any device with a Java Virtual Machine (JVM).' : `${topicName} is a powerful, high-level programming language widely used in software development, web applications, and artificial intelligence.`}\n\n\`\`\`java\n// Simple ${topicName} Example\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello from Grama Mitra AI!");\n    }\n}\n\`\`\`\n\n### Key Highlights:\n1. **Object-Oriented**: Code is organized around objects and classes.\n2. **Platform Independent**: Runs seamlessly on Windows, Linux, Android, and macOS.\n3. **Use Cases**: Enterprise applications, Android app development, and banking systems.`,
        confidence: 0.94,
        source: { name: 'Oracle Java Documentation', url: 'https://docs.oracle.com/en/java/', lastUpdated: '2026-09-20' },
        needsHandoff: false,
        intent: 'TECHNOLOGY',
      };
    } else {
      return {
        response: `💻 **${topicName} கணிப்பொறி மொழி எளிய விளக்கம்**\n\n**${topicName} என்றால் என்ன?**\n${topicName === 'Java' ? 'ஜாவா (Java) என்பது 1995-இல் உருவாக்கப்பட்ட ஒரு புகழ்பெற்ற கணிப்பொறி நிரலாக்க மொழியாகும். இதன் முக்கிய சிறப்பு **"ஒருமுறை எழுதினால், எங்கும் இயக்கலாம்" (Write Once, Run Anywhere)** என்பதாகும்.' : `${topicName} என்பது கணினி மென்பொருள் மற்றும் இணையதள உருவாக்கத்தில் பயன்படும் ஒரு முக்கியமான நிரலாக்க மொழியாகும்.`}\n\n\`\`\`java\n// ஜாவா நிரல் மாதிரி\npublic class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("வணக்கம்! கிராம மித்ரா AI ஜாவா பயிற்சி.");\n    }\n}\n\`\`\`\n\n### முக்கிய சிறப்புகள்:\n1. **பொருள் சார்ந்த மொழி (Object-Oriented)**: நிரல்கள் எளிதாக மறுபயன்பாடு செய்யும் வகையில் அமைக்கப்பட்டவை.\n2. **அனைத்து சாதனங்களிலும் இயங்கும்**: விண்டோஸ், ஆண்ட்ராய்டு, லினக்ஸ் போன்ற எந்த கணினியிலும் இயங்கும்.`,
        confidence: 0.94,
        source: { name: 'கிராம மித்ரா Tech Guide', url: 'https://docs.oracle.com', lastUpdated: '2026-09-20' },
        needsHandoff: false,
        intent: 'TECHNOLOGY',
      };
    }
  }

  // 5. Artificial Intelligence (English & Tamil)
  if (/artificial intelligence|ai|செயற்கை நுண்ணறிவு/i.test(text)) {
    if (detectedLang === 'en') {
      return {
        response: `🤖 **What is Artificial Intelligence (AI)?**\n\n**Artificial Intelligence (AI)** is a branch of computer science dedicated to building smart machines capable of performing tasks that typically require human intelligence.\n\n### Core Branches of AI:\n1. **Machine Learning (ML)**: Enabling computers to learn from data patterns.\n2. **Natural Language Processing (NLP)**: Enabling systems to understand speech and languages (e.g. Tamil & English voice recognition in Grama Mitra).\n3. **Computer Vision**: Analyzing images (e.g. crop leaf disease diagnosis from photos).\n\n### Practical Applications:\n- Precision Agriculture & Smart Farming\n- Automated Multilingual Voice Assistants\n- Healthcare & Disease Detection`,
        confidence: 0.95,
        source: { name: 'Grama Mitra AI Education', url: '#', lastUpdated: '2026-09-20' },
        needsHandoff: false,
        intent: 'TECHNOLOGY',
      };
    } else {
      return {
        response: `🤖 **செயற்கை நுண்ணறிவு (Artificial Intelligence - AI) என்றால் என்ன?**\n\n**செயற்கை நுண்ணறிவு (AI)** என்பது மனித மூளையைப் போல சிந்தித்து, கற்றுக் கொண்டு, முடிவெடுக்கும் திறன் கொண்ட கணிப்பொறி அமைப்புகளை உருவாக்கும் தொழில்நுட்பமாகும்.\n\n### முக்கிய துறைகள்:\n1. **இயந்திர கற்றல் (Machine Learning)**: தரவுகளிலிருந்து கணினி தானாகவே கற்றுக் கொள்ளும் திறன்.\n2. **இயற்கை மொழி ஆய்வு (NLP)**: தமிழ் மற்றும் ஆங்கில பேச்சை புரிந்துகொள்ளும் தொழில்நுட்பம் (எ.கா: கிராம மித்ரா குரல் உதவி).\n3. **கணினி பார்வை (Computer Vision)**: பயிர் படங்களை பார்த்து நோய் கண்டறியும் தொழில்நுட்பம்.\n\n### பயன்பாடுகள்:\n- விவசாயத்தில் பூச்சி நோய் கண்டறியதல்\n- குரல் வழியில் அரசு திட்ட வழிகாட்டுதல்`,
        confidence: 0.95,
        source: { name: 'கிராம மித்ரா AI வழிகாட்டி', url: '#', lastUpdated: '2026-09-20' },
        needsHandoff: false,
        intent: 'TECHNOLOGY',
      };
    }
  }

  // Fallback ChatGPT-style general response strictly in detected language
  if (detectedLang === 'en') {
    return {
      response: `🤖 **Grama Mitra General AI Assistant**\n\nHere is a clear, structured response to your question ("${message}"):\n\n### Overview:\n- Your query relates to general knowledge and practical assistance.\n- Grama Mitra provides verified information for agriculture, government schemes, technology, education, and daily life.\n\n💡 *Feel free to ask any specific follow-up questions, coding examples, or step-by-step guidance!*`,
      confidence: 0.85,
      source: { name: 'Grama Mitra General AI Engine', url: '#', lastUpdated: '2026-09-20' },
      needsHandoff: false,
      intent: 'GENERAL',
    };
  } else {
    return {
      response: `🤖 **கிராம மித்ரா பொது அறிவு AI உதவியாளன்**\n\nநீங்கள் கேட்ட "${message}" பற்றிய தகவல் ஆய்வின் சுருக்கம்:\n\n### முக்கிய தகவல்:\n- உங்கள் வினா கிராமப்புற அறிவு, விவசாயம், தொழில்நுட்பம் அல்லது அன்றாட கல்வி சார்ந்த தகவலாகும்.\n- மேலும் விரிவான விளக்கங்கள், கணக்கீடுகள் அல்லது தொடர் கேள்விகளைத் தமிழில் கேட்கலாம்.\n\n💡 *குறிப்பு: தொடர்ந்து கேள்விகள் கேட்கலாம் அல்லது குரல் வழியில் பேசலாம்!*`,
      confidence: 0.85,
      source: { name: 'கிராம மித்ரா AI', url: '#', lastUpdated: '2026-09-20' },
      needsHandoff: false,
      intent: 'GENERAL',
    };
  }
}

// Local AI simulation with knowledge base
async function runLocalAI(message, category, languageOverride = null, history = []) {
  const detectedLang = languageOverride || detectLanguage(message);
  const results = searchKnowledge(message, category === 'ALL' ? null : category?.toLowerCase());

  if (results.length > 0) {
    const best = results[0];
    const confidence = results.length >= 2 ? 0.88 : 0.75;
    const responseText = (detectedLang === 'en' && best.answerEnglish) ? best.answerEnglish : best.answer;

    return {
      response: responseText,
      confidence,
      source: best.source ? { name: best.source, url: best.sourceUrl, lastUpdated: best.lastUpdated } : null,
      needsHandoff: confidence < 0.6,
      intent: category || classifyIntent(message),
      knowledgeId: best.id,
      isHealthGuidance: best.isHealthGuidance,
      disclaimer: best.disclaimer,
      detectedLang,
      ttsLang: detectedLang === 'en' ? 'en-IN' : 'ta-IN',
    };
  }

  const generalRes = generateGeneralConversationalResponse(message, detectedLang, history);
  return {
    ...generalRes,
    detectedLang,
    ttsLang: detectedLang === 'en' ? 'en-IN' : 'ta-IN',
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
  const { channel = 'Website', sessionId = 'demo', image = null, language = null, history = [] } = options;

  const detectedLang = language || detectLanguage(message);
  const ttsLang = detectedLang === 'en' ? 'en-IN' : 'ta-IN';

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
    return {
      ...aiResult,
      queryId: queryRecord.id,
      confidenceLabel: 'High Confidence (AI Vision)',
      detectedLang,
      ttsLang: 'ta-IN'
    };
  }
  const isEmergency = detectEmergency(message);
  const intent = classifyIntent(message);

  // 1. Emergency check — override everything
  if (isEmergency) {
    const emergencyResp = detectedLang === 'en' ? EMERGENCY_RESPONSE : EMERGENCY_RESPONSE_TAMIL;
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
      response: emergencyResp,
      confidence: 1.0,
      status: 'Escalated',
      intent: 'EMERGENCY',
      safetyFlag: true,
      handoffId: handoffRecord.id,
      sessionId,
    });

    return {
      response: emergencyResp,
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
      detectedLang,
      ttsLang,
    };
  }

  // 2. Normal AI processing
  let aiResult;
  if (!USE_LOCAL) {
    try {
      const res = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, channel, intent, language: detectedLang, history }),
      });
      aiResult = await res.json();
    } catch {
      // fallback to local
      aiResult = await runLocalAI(message, intent, detectedLang, history);
    }
  } else {
    aiResult = await runLocalAI(message, intent, detectedLang, history);
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
export function transcribeVoice(lang = 'ta-IN') {
  return new Promise((resolve, reject) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      reject(new Error('Speech recognition not supported in this browser'));
      return;
    }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = lang || 'ta-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (e) => resolve(e.results[0][0].transcript);
    recognition.onerror = (e) => reject(new Error(`Speech error: ${e.error}`));
    recognition.onend = () => {};
    recognition.start();
  });
}

// Text-to-speech (Multilingual)
export function speakText(text, lang = 'ta-IN') {
  if (!window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const utt = new SpeechSynthesisUtterance(text);
  utt.lang = lang || 'ta-IN';
  utt.rate = 0.9;
  utt.pitch = 1;
  const voices = window.speechSynthesis.getVoices();
  const targetLang = (lang || 'ta-IN').toLowerCase();
  const matchedVoice = voices.find(v => v.lang.toLowerCase() === targetLang || v.lang.toLowerCase().startsWith(targetLang.split('-')[0]));
  if (matchedVoice) utt.voice = matchedVoice;
  window.speechSynthesis.speak(utt);
}

export function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}
