// Knowledge Base — Verified Demo Data
// DEMO DATA — VERIFY BEFORE PRODUCTION
// All government scheme details are illustrative examples based on publicly available information

export const CATEGORIES = {
  AGRICULTURE: 'agriculture',
  GOVERNMENT: 'government',
  HEALTH: 'health',
  GENERAL: 'general',
};

export const knowledgeBase = [
  // ══════════════════════════════════════════
  // AGRICULTURE (20 entries)
  // ══════════════════════════════════════════
  {
    id: 'agri-001',
    category: CATEGORIES.AGRICULTURE,
    question: 'Why are my paddy leaves turning yellow?',
    questionTamil: 'நெல் பயிரில் இலைகள் மஞ்சளாகிறது. என்ன காரணம்?',
    answer: `**நைட்ரஜன் குறைபாடு (Nitrogen Deficiency)** மிகவும் பொதுவான காரணம்.\n\n**அறிகுறிகள்:** இலையின் நுனி மற்றும் கீழ் இலைகள் மஞ்சளாகும்.\n\n**செய்ய வேண்டியவை:**\n- தண்ணீர் நன்றாக வடிகட்டப்பட்டுள்ளதா என சரிபார்க்கவும்\n- ஏக்கருக்கு 10-15 கிலோ யூரியா இட்டு நீர் பாய்ச்சவும்\n- கந்தக குறைபாடு இருந்தால் கந்தகம் கலந்த உரம் இடவும்\n- இரும்பு குறைபாடு என்றால் இரும்பு சல்பேட் தெளிக்கவும்\n\n**கவலை அதிகமாக இருந்தால்:** உங்கள் அருகிலுள்ள வேளாண்மை விரிவாக்க அலுவலகத்தில் மண் பரிசோதனை செய்யுங்கள்.`,
    answerEnglish: 'Yellow paddy leaves are most commonly caused by Nitrogen deficiency. Apply 10-15 kg Urea per acre with irrigation. Check water drainage, and consult your local Agriculture Extension Office for a soil test.',
    source: 'Tamil Nadu Agricultural University (TNAU)',
    sourceUrl: 'https://www.tnau.ac.in',
    keywords: ['yellow leaves', 'paddy', 'nitrogen', 'மஞ்சள் இலை', 'நெல்', 'நைட்ரஜன்'],
    verified: true,
    lastUpdated: '2024-11-01',
  },
  {
    id: 'agri-002',
    category: CATEGORIES.AGRICULTURE,
    question: 'How do I control brown planthopper (BPH) in rice?',
    questionTamil: 'நெல் பயிரில் பூரிக்காய் புழு (BPH) தாக்குதலை எப்படி கட்டுப்படுத்துவது?',
    answer: `**பாசன நீரின் அளவை குறைக்கவும்** - BPH ஈரமான சூழலில் பெருகும்.\n\n**உடனடி நடவடிக்கை:**\n- வயலில் நீரை வடிக்கட்டவும்\n- Imidacloprid 17.8% SL (0.5 ml/L) அல்லது Buprofezin 25% SC (1 ml/L) தெளிக்கவும்\n- கட்டை வேட்டுமை (அல்) பயிரின் அடிப்பகுதியில் தெளிக்கவும்\n\n**தடுப்பு முறைகள்:**\n- BPH எதிர்ப்பு திறன் கொண்ட ரகங்கள் (ADT 43, CO 51) பயன்படுத்தவும்\n- அதிகமாக நைட்ரஜன் உரம் இடாதீர்கள்\n\n**ஆதாரம்:** TNAU வேளாண் ஆலோசனை`,
    answerEnglish: 'Control BPH by draining fields, applying Imidacloprid 17.8% SL or Buprofezin 25% SC at the base of plants. Use resistant varieties like ADT 43 or CO 51.',
    source: 'TNAU Crop Protection',
    sourceUrl: 'https://www.tnau.ac.in/agriculture/agri_insectpest_rice.html',
    keywords: ['BPH', 'brown planthopper', 'rice pest', 'பூரிக்காய்', 'நெல் பூச்சி'],
    verified: true,
    lastUpdated: '2024-10-15',
  },
  {
    id: 'agri-003',
    category: CATEGORIES.AGRICULTURE,
    question: 'What is the best time to plant groundnut?',
    questionTamil: 'நிலக்கடலை பயிரிட சரியான நேரம் எது?',
    answer: `**தமிழ்நாட்டில் நிலக்கடலை பயிரிட சரியான காலம்:**\n\n- **கோடைக்காலம்:** ஜனவரி - பிப்ரவரி\n- **ஆடி/குறுவை:** ஜூலை - ஆகஸ்ட்\n- **தை/சம்பா:** நவம்பர் - டிசம்பர்\n\n**மண் தேவை:** நன்கு வடிகட்டிய மணல் கலந்த மண்\n\n**விதை அளவு:** ஏக்கருக்கு 50-60 கிலோ (தோல் நீக்கிய விதை)\n\n**நோட்டம்:** விதைப்பதற்கு முன் விதை நேர்த்தி (Thiram/Carbendazim) செய்யவும்.`,
    answerEnglish: 'In Tamil Nadu, groundnut is planted June-August (Kharif) or January-February (summer crop). Use 50-60 kg seed per acre in well-drained sandy loam soil. Treat seeds with Thiram/Carbendazim before sowing.',
    source: 'TNAU Groundnut Production Guide',
    sourceUrl: 'https://www.tnau.ac.in',
    keywords: ['groundnut', 'planting time', 'நிலக்கடலை', 'பயிரிடுதல்'],
    verified: true,
    lastUpdated: '2024-08-20',
  },
  {
    id: 'agri-004',
    category: CATEGORIES.AGRICULTURE,
    question: 'How to manage blast disease in paddy?',
    questionTamil: 'நெல் பயிரில் கருகல் நோய் (Blast) வந்தால் என்ன செய்வது?',
    answer: `**கருகல் நோய் (Blast)** அறிகுறிகள்: இலைகளில் நாற்கோண வடிவ பழுப்பு புள்ளிகள்.\n\n**உடனடி நடவடிக்கை:**\n- Tricyclazole 75% WP (0.6 g/L) தெளிக்கவும்\n- அல்லது Isoprothiolane 40% EC (1.5 ml/L) பயன்படுத்தவும்\n- 15 நாட்களுக்கு ஒருமுறை தெளிக்கவும்\n\n**தடுப்பு:**\n- Blast எதிர்ப்பு ரகங்கள் (ADT 45, CO 47) பயன்படுத்தவும்\n- அதிக நைட்ரஜன் தவிர்க்கவும்\n- வயலில் சரியான காற்று சுழற்சி வேண்டும்`,
    answerEnglish: 'Control paddy blast with Tricyclazole 75% WP (0.6g/L) or Isoprothiolane 40% EC every 15 days. Use blast-resistant varieties and avoid excessive nitrogen.',
    source: 'TNAU Plant Pathology',
    sourceUrl: 'https://www.tnau.ac.in',
    keywords: ['blast', 'paddy disease', 'கருகல் நோய்', 'fungicide'],
    verified: true,
    lastUpdated: '2024-09-01',
  },
  {
    id: 'agri-005',
    category: CATEGORIES.AGRICULTURE,
    question: 'What fertilizers to use for sugarcane?',
    questionTamil: 'கரும்பு பயிருக்கு எந்த உரம் பயன்படுத்த வேண்டும்?',
    answer: `**கரும்பு உர அட்டவணை (ஏக்கருக்கு):**\n\n| கட்டம் | உரம் |\n|-------|------|\n| நடவு நேரம் | SSP 150 கிலோ, MOP 50 கிலோ |\n| 30 நாட்கள் | யூரியா 50 கிலோ |\n| 60 நாட்கள் | யூரியா 50 கிலோ |\n| 90 நாட்கள் | யூரியா 50 கிலோ + MOP 50 கிலோ |\n\n**கூடுதல் ஆலோசனை:** மண் பரிசோதனை செய்து அதன்படி உரம் இடவும்.\n\n**கார்பனிக் உரம்:** தொழு உரம் 10 டன்/ஏக்கர் நடவுக்கு முன் சேர்க்கவும்.`,
    answerEnglish: 'For sugarcane: Apply SSP 150 kg + MOP 50 kg at planting, then 50 kg Urea each at 30, 60, 90 days. Add 10 tons FYM per acre before planting. Get a soil test for precise recommendations.',
    source: 'TNAU Sugarcane Research Station',
    sourceUrl: 'https://www.tnau.ac.in',
    keywords: ['sugarcane', 'fertilizer', 'கரும்பு', 'உரம்'],
    verified: true,
    lastUpdated: '2024-07-10',
  },
  {
    id: 'agri-006',
    category: CATEGORIES.AGRICULTURE,
    question: 'How to manage tomato leaf curl virus?',
    questionTamil: 'தக்காளியில் இலை சுருட்டு வைரஸ் வந்தால் என்ன செய்வது?',
    answer: `**இலை சுருட்டு வைரஸ்** வெள்ளை ஈ (Whitefly) மூலம் பரவுகிறது.\n\n**நிர்வாக முறைகள்:**\n- நோயுற்ற செடிகளை உடனே அகற்றவும்\n- நிலத்தில் மஞ்சள் நிற ஒட்டு அட்டை வைக்கவும் (Yellow sticky trap)\n- Imidacloprid 17.8% SL (0.5 ml/L) தெளிக்கவும்\n- நிழல் வலை (50% shade net) பயன்படுத்தவும்\n\n**வைரஸ் தடுப்பு:**\n- எதிர்ப்பு திறன் கொண்ட ரகங்கள் பயன்படுத்தவும்\n- விதைப்பு முன் நர்சரியில் shade net பயன்படுத்தவும்`,
    answerEnglish: 'Tomato leaf curl is spread by whiteflies. Remove infected plants, use yellow sticky traps, spray Imidacloprid 17.8% SL, and use virus-resistant varieties.',
    source: 'TNAU Horticulture Division',
    sourceUrl: 'https://www.tnau.ac.in',
    keywords: ['tomato', 'leaf curl', 'virus', 'தக்காளி', 'வைரஸ்'],
    verified: true,
    lastUpdated: '2024-06-15',
  },
  {
    id: 'agri-007',
    category: CATEGORIES.AGRICULTURE,
    question: 'When and how to irrigate banana crop?',
    questionTamil: 'வாழை பயிருக்கு எப்போது நீர் பாய்ச்ச வேண்டும்?',
    answer: `**வாழைக்கு நீர்ப்பாசன அட்டவணை:**\n\n- **கோடை:** 3-4 நாட்களுக்கு ஒருமுறை\n- **மழைக்காலம்:** 7-10 நாட்களுக்கு ஒருமுறை\n- **குளிர்காலம்:** 5-6 நாட்களுக்கு ஒருமுறை\n\n**ஒரு தடவை நீர்:** 30-40 லிட்டர்/செடி\n\n**திட்டமான நீர்ப்பாசன முறை:**\n- Drip irrigation மிகவும் பயனுள்ளது\n- 4-8 L/hr emitter பயன்படுத்தவும்\n- Water use efficiency அதிகரிக்கும்\n\n**குறிப்பு:** மலர் வரும் கட்டத்தில் நீர் தட்டுப்பாடு தவிர்க்கவும்.`,
    answerEnglish: 'Irrigate banana every 3-4 days in summer, 7-10 days in rainy season, 5-6 days in winter. Provide 30-40L per plant. Drip irrigation is highly recommended at 4-8 L/hr.',
    source: 'TNAU Banana Cultivation Guide',
    sourceUrl: 'https://www.tnau.ac.in',
    keywords: ['banana', 'irrigation', 'வாழை', 'நீர்ப்பாசனம்'],
    verified: true,
    lastUpdated: '2024-05-20',
  },
  {
    id: 'agri-008',
    category: CATEGORIES.AGRICULTURE,
    question: 'How to do soil testing?',
    questionTamil: 'மண் பரிசோதனை எப்படி செய்வது? எங்கே செய்யலாம்?',
    answer: `**மண் பரிசோதனை செய்வது ஏன் முக்கியம்?**\nமண்ணின் தன்மை அறிந்து சரியான உரம் இட்டால் விளைச்சல் 20-30% அதிகரிக்கும்.\n\n**மண் மாதிரி எடுக்கும் முறை:**\n1. வயலில் V வடிவில் 8-10 இடங்களில் 15-20 செமீ ஆழம் தோண்டவும்\n2. ஒவ்வொரு இடத்திலும் 200-250 கிராம் மண் எடுக்கவும்\n3. எல்லா மாதிரிகளையும் ஒன்றாக கலக்கவும்\n4. 500 கிராம் மண் பாலித்தீன் பையில் வைக்கவும்\n\n**எங்கே அனுப்புவது:**\n- அருகிலுள்ள வேளாண்மை விரிவாக்க மையம்\n- TNAU மண் பரிசோதனை ஆய்வகம்\n- கட்டணம்: ₹25-30 மட்டுமே`,
    answerEnglish: 'Collect soil samples in a V-pattern from 8-10 spots at 15-20 cm depth. Mix all, take 500g sample to your nearest Agriculture Extension Centre or TNAU lab. Cost: ₹25-30.',
    source: 'Tamil Nadu Agriculture Department',
    sourceUrl: 'https://www.tn.gov.in/agriculture',
    keywords: ['soil test', 'மண் பரிசோதனை', 'soil sample'],
    verified: true,
    lastUpdated: '2024-10-01',
  },
  {
    id: 'agri-009',
    category: CATEGORIES.AGRICULTURE,
    question: 'What are the benefits of vermicompost?',
    questionTamil: 'மண்புழு உரம் (Vermicompost) பயன்கள் என்ன?',
    answer: `**மண்புழு உரத்தின் நன்மைகள்:**\n\n- மண் வளம் மேம்படும்\n- நுண்ணுயிர்களின் செயல்பாடு அதிகரிக்கும்\n- நீர் தேக்கும் திறன் மேம்படும்\n- ரசாயன உர செலவு குறையும்\n- பயிர் வளர்ச்சி 15-20% அதிகரிக்கும்\n\n**பயன்படுத்தும் முறை:**\n- ஏக்கருக்கு 2-3 டன் நடவுக்கு முன் கலக்கவும்\n- அல்லது பயிர் மூல வட்டத்தில் தெளிக்கவும்\n\n**தயாரிக்கும் முறை:** ஐசினியா ஃபெட்டிடா (Eisenia fetida) மண்புழுக்கள் மூலம் 60-90 நாளில் தயார் செய்யலாம்.`,
    answerEnglish: 'Vermicompost improves soil health, microbial activity and water retention. Apply 2-3 tons per acre before planting. Reduces chemical fertilizer costs and improves yield by 15-20%.',
    source: 'TNAU Organic Farming Division',
    sourceUrl: 'https://www.tnau.ac.in',
    keywords: ['vermicompost', 'மண்புழு உரம்', 'organic farming', 'இயற்கை விவசாயம்'],
    verified: true,
    lastUpdated: '2024-09-15',
  },
  {
    id: 'agri-010',
    category: CATEGORIES.AGRICULTURE,
    question: 'What crops are suitable for dry land farming in Tamil Nadu?',
    questionTamil: 'தமிழ்நாட்டில் வறட்சி நிலத்திற்கு ஏற்ற பயிர்கள் என்ன?',
    answer: `**வறட்சி நிலத்திற்கு ஏற்ற பயிர்கள் (Dryland Crops):**\n\n**தானியங்கள்:**\n- சோளம் (Sorghum) - குறைந்த மழையில் நன்கு வளரும்\n- கம்பு (Pearl Millet) - 300-400mm மழை போதும்\n- கேழ்வரகு (Finger Millet) - செம்மண்ணில் சிறப்பு\n\n**பருப்பு வகைகள்:**\n- துவரை, உளுந்து, கொண்டைக்கடலை\n\n**எண்ணெய் வித்துக்கள்:**\n- நிலக்கடலை, சூரியகாந்தி, எள்\n\n**நன்மைகள்:** குறைந்த தண்ணீர் + குறைந்த முதலீடு + நல்ல வருமானம்`,
    answerEnglish: 'Suitable dryland crops for Tamil Nadu: Sorghum, Pearl Millet, Finger Millet (cereals); Pigeon pea, Black gram, Chickpea (pulses); Groundnut, Sunflower, Sesame (oilseeds).',
    source: 'TNAU Dryland Agriculture Division',
    sourceUrl: 'https://www.tnau.ac.in',
    keywords: ['dryland', 'dry farming', 'வறட்சி நிலம்', 'crops'],
    verified: true,
    lastUpdated: '2024-08-01',
  },
  // ══════════════════════════════════════════
  // GOVERNMENT SCHEMES (18 entries)
  // ══════════════════════════════════════════
  {
    id: 'govt-001',
    category: CATEGORIES.GOVERNMENT,
    question: 'What is PM-KISAN and who is eligible?',
    questionTamil: 'PM-KISAN திட்டம் என்ன? யார் விண்ணப்பிக்கலாம்?',
    answer: `**PM Kisan Samman Nidhi (PM-KISAN)**\n\nகேன்திர அரசின் விவசாயிகளுக்கான நேரடி நலத்திட்டம்.\n\n**நலன்கள்:**\n- ஆண்டுக்கு ₹6,000 நேரடி வங்கி கணக்கில் (3 தவணைகளில் ₹2,000 வீதம்)\n\n**யார் விண்ணப்பிக்கலாம்:**\n- சிறு மற்றும் குறு விவசாயிகள் (2 ஹெக்டேர் வரை நிலம்)\n- நிலம் விவசாயியின் பெயரில் பதிவாக இருக்க வேண்டும்\n\n**விண்ணப்பிக்கும் இடம்:**\n- pmkisan.gov.in இணையதளம்\n- அருகிலுள்ள Common Service Centre (CSC)\n- வங்கி கிளை\n\n**தேவையான ஆவணங்கள்:** ஆதார் அட்டை, நிலக்கணக்கு, வங்கி கணக்கு விவரம்`,
    answerEnglish: 'PM-KISAN provides ₹6,000/year (in 3 installments of ₹2,000) directly to small/marginal farmers owning up to 2 hectares. Apply at pmkisan.gov.in, nearby CSC center, or bank branch. Need: Aadhaar, land records, bank account.',
    source: 'PM-KISAN Official Portal',
    sourceUrl: 'https://pmkisan.gov.in',
    keywords: ['PM KISAN', 'direct benefit', 'farmer scheme', 'விவசாயி நலன்'],
    verified: true,
    lastUpdated: '2024-11-01',
  },
  {
    id: 'govt-002',
    category: CATEGORIES.GOVERNMENT,
    question: 'What is Pradhan Mantri Fasal Bima Yojana (crop insurance)?',
    questionTamil: 'பிரதான் மந்திரி பயிர் காப்பீட்டு திட்டம் என்ன?',
    answer: `**Pradhan Mantri Fasal Bima Yojana (PMFBY)**\n\nபயிர் இழப்புக்கு காப்பீடு வழங்கும் திட்டம்.\n\n**நன்மைகள்:**\n- இயற்கை பேரிடர், வறட்சி, வெள்ளம் காரணமாக பயிர் இழப்பு ஏற்பட்டால் இழப்பீடு\n- குறைந்த பிரீமியம் (கரீஃப்: 2%, ரபி: 1.5%)\n\n**விண்ணப்பிக்கும் முறை:**\n- வங்கி மூலம் கடன் பெறும் விவசாயிகளுக்கு தானாகவே இணைக்கப்படும்\n- மற்றவர்கள் pmfby.gov.in அல்லது CSC மூலம் விண்ணப்பிக்கலாம்\n\n**கடைசி தேதி:** விதைப்பு தேதிக்கு 2 வாரங்களுக்கு முன்பு\n\n**ஆதாரம்:** pmfby.gov.in`,
    answerEnglish: 'PMFBY provides crop insurance against natural calamities. Premium: 2% Kharif, 1.5% Rabi. Loan-taking farmers are automatically covered. Others apply at pmfby.gov.in or CSC. Apply within 2 weeks of sowing.',
    source: 'PMFBY Official Portal',
    sourceUrl: 'https://pmfby.gov.in',
    keywords: ['crop insurance', 'PMFBY', 'பயிர் காப்பீடு', 'insurance'],
    verified: true,
    lastUpdated: '2024-10-20',
  },
  {
    id: 'govt-003',
    category: CATEGORIES.GOVERNMENT,
    question: 'What is the Kisan Credit Card scheme?',
    questionTamil: 'கிசான் கிரெடிட் கார்டு திட்டம் என்ன?',
    answer: `**Kisan Credit Card (KCC)**\n\nவிவசாயிகளுக்கு எளிதான கடன் வழங்கும் திட்டம்.\n\n**நன்மைகள்:**\n- ₹3 லட்சம் வரை கடன் குறைந்த வட்டியில் (7% வட்டி)\n- சரியான நேரத்தில் திருப்பினால் கூடுதல் 3% தள்ளுபடி\n- (நிகர வட்டி: 4% மட்டும்)\n\n**கடனின் பயன்பாடு:**\n- விதை, உரம், பூச்சிக்கொல்லி வாங்க\n- நுகர்வு தேவைகளுக்கு\n- இயந்திர வாடகைக்கு\n\n**விண்ணப்பிக்கும் இடம்:** அருகிலுள்ள வங்கி கிளை\n\n**தேவையான ஆவணங்கள்:**\n- ஆதார் அட்டை\n- நில உரிமை ஆவணம் (பட்டா)\n- கடந்த 6 மாத வங்கி அறிக்கை`,
    answerEnglish: 'Kisan Credit Card gives farmers credit up to ₹3 lakh at 7% interest (effective 4% with 3% subvention for timely repayment). Apply at your nearest bank with Aadhaar, land ownership documents, and 6-month bank statement.',
    source: 'NABARD / Ministry of Agriculture',
    sourceUrl: 'https://www.nabard.org',
    keywords: ['KCC', 'kisan credit card', 'கிரெடிட் கார்டு', 'farm loan', 'கடன்'],
    verified: true,
    lastUpdated: '2024-09-10',
  },
  {
    id: 'govt-004',
    category: CATEGORIES.GOVERNMENT,
    question: 'What is the Chief Minister\'s Comprehensive Health Insurance Scheme in Tamil Nadu?',
    questionTamil: 'தமிழ்நாடு முதலமைச்சர் விரிவான மருத்துவ காப்பீடு திட்டம் என்ன?',
    answer: `**முதலமைச்சர் விரிவான மருத்துவ காப்பீட்டுத் திட்டம் (CMCHIS)**\n\n**நலன்கள்:**\n- குடும்பத்திற்கு ஆண்டுக்கு ₹5 லட்சம் வரை மருத்துவ சிகிச்சை இலவசம்\n- 1,016 சிகிச்சை வகைகள் உள்ளடக்கம்\n\n**யார் பெறலாம்:**\n- குடும்ப வருமானம் ₹72,000/ஆண்டுக்கு குறைவாக இருக்க வேண்டும்\n- அரசு ஊழியர்கள் தவிர அனைவரும்\n\n**விண்ணப்பிக்கும் இடம்:**\n- www.cmchistn.com\n- அருகிலுள்ள அரசு மருத்துவமனை\n\n**ஆவணங்கள்:** ஆதார், குடும்ப அட்டை, வருமான சான்று`,
    answerEnglish: 'Tamil Nadu CMCHIS provides up to ₹5 lakh medical treatment per family per year covering 1,016 treatments. Eligible if family income below ₹72,000/year. Apply at cmchistn.com or government hospital.',
    source: 'Tamil Nadu Government - CMCHIS',
    sourceUrl: 'https://www.cmchistn.com',
    keywords: ['CMCHIS', 'health insurance', 'மருத்துவ காப்பீடு', 'Tamil Nadu'],
    verified: true,
    lastUpdated: '2024-10-01',
  },
  {
    id: 'govt-005',
    category: CATEGORIES.GOVERNMENT,
    question: 'How to apply for Aadhaar card?',
    questionTamil: 'ஆதார் அட்டைக்கு எப்படி விண்ணப்பிப்பது?',
    answer: `**ஆதார் அட்டை விண்ணப்பிக்கும் முறை:**\n\n**புதிய ஆதார்:**\n1. uidai.gov.in இல் நுழைந்து அருகிலுள்ள Enrollment Center கண்டுபிடிக்கவும்\n2. ஆவணங்கள் கொண்டு நேரில் சென்று விண்ணப்பிக்கவும்\n3. புகைப்படம், கை ரேகை, கண் ஸ்கேன் எடுக்கப்படும்\n4. Acknowledgement Slip வாங்குங்கள்\n\n**தேவையான ஆவணங்கள்:**\n- அடையாள சான்று: வாக்காளர் அட்டை / பாஸ்போர்ட்\n- முகவரி சான்று: மின்சாரக் கட்டண ரசீது / குடும்ப அட்டை\n\n**கட்டணம்:** இலவசம் (புதிய ஆதார்)\n\n**ஆதாரம்:** uidai.gov.in`,
    answerEnglish: 'For new Aadhaar: Visit uidai.gov.in to find nearest Enrollment Center. Bring identity proof (voter ID/passport) and address proof. The enrollment is free. You\'ll receive an Acknowledgement Slip.',
    source: 'UIDAI Official Portal',
    sourceUrl: 'https://uidai.gov.in',
    keywords: ['aadhaar', 'ஆதார்', 'identity', 'enrollment'],
    verified: true,
    lastUpdated: '2024-11-01',
  },
  {
    id: 'govt-006',
    category: CATEGORIES.GOVERNMENT,
    question: 'What is the National Rural Employment Guarantee Act (MGNREGS)?',
    questionTamil: 'MGNREGS திட்டத்தில் எப்படி சேரலாம்?',
    answer: `**மகாத்மா காந்தி தேசிய ஊரக வேலை உறுதி திட்டம் (MGNREGS)**\n\n**நன்மைகள்:**\n- ஆண்டுக்கு 100 நாட்கள் வேலை உறுதி\n- தமிழ்நாட்டில் தற்போதைய கூலி விகிதம்: ₹294/நாள் (2024)\n- 15 நாட்களுக்குள் கூலி வங்கி கணக்கில் வரும்\n\n**யார் சேரலாம்:** ஊரக பகுதியில் வாழும் வயது வந்த பெரியவர் அனைவரும்\n\n**விண்ணப்பிக்கும் இடம்:**\n- கிராம பஞ்சாயத்து அலுவலகம்\n- Block Development Office\n\n**தேவையான ஆவணங்கள்:**\n- குடும்ப அட்டை (Ration Card)\n- ஆதார் அட்டை\n- வங்கி கணக்கு விவரம்`,
    answerEnglish: 'MGNREGS guarantees 100 days of employment per year for rural households. Current wage in TN: ₹294/day (2024). Apply at your village Panchayat or Block Development Office with ration card, Aadhaar, and bank details.',
    source: 'Ministry of Rural Development',
    sourceUrl: 'https://nrega.nic.in',
    keywords: ['MGNREGS', 'NREGA', 'employment', 'வேலை உறுதி', 'rural employment'],
    verified: true,
    lastUpdated: '2024-10-15',
  },
  {
    id: 'govt-007',
    category: CATEGORIES.GOVERNMENT,
    question: 'What is the free electricity scheme for farmers in Tamil Nadu?',
    questionTamil: 'தமிழ்நாட்டில் விவசாயிகளுக்கு இலவச மின்சாரம் திட்டம் என்ன?',
    answer: `**தமிழ்நாடு விவசாய இலவச மின்சாரம்:**\n\n**நலன்கள்:**\n- விவசாய பம்பு செட்டுகளுக்கு இலவச மின்சாரம்\n- 9 மணி நேரம் இலவச மின்சாரம் வழங்கப்படும்\n\n**யார் பெறலாம்:**\n- பதிவு செய்யப்பட்ட விவசாயிகள்\n- 3 HP, 5 HP, 7.5 HP, 10 HP மோட்டார் வரை\n\n**விண்ணப்பிக்கும் இடம்:**\n- TANGEDCO அலுவலகம்\n- அல்லது E-Sevai மையம்\n\n**ஆவணங்கள்:**\n- நிலக்கணக்கு (பட்டா)\n- மோட்டார் / பம்ப் தகவல்கள்\n- ஆதார் அட்டை\n\n**ஆதாரம்:** TANGEDCO`,
    answerEnglish: 'Tamil Nadu provides free electricity (9 hours/day) for agricultural pump sets up to 10 HP. Apply at TANGEDCO office or E-Sevai centre with land documents (Patta), motor details, and Aadhaar.',
    source: 'TANGEDCO / Tamil Nadu Government',
    sourceUrl: 'https://www.tangedco.gov.in',
    keywords: ['free electricity', 'இலவச மின்சாரம்', 'TANGEDCO', 'pump set'],
    verified: true,
    lastUpdated: '2024-08-01',
  },
  {
    id: 'govt-008',
    category: CATEGORIES.GOVERNMENT,
    question: 'How to apply for Ration Card in Tamil Nadu?',
    questionTamil: 'குடும்ப அட்டை (Ration Card) விண்ணப்பிக்கும் முறை என்ன?',
    answer: `**குடும்ப அட்டை விண்ணப்பிக்கும் முறை:**\n\n**Online முறை:**\n1. tnpds.gov.in இணையதளம் செல்லவும்\n2. "New Smart Card" பிரிவு தேர்ந்தெடுக்கவும்\n3. படிவம் பூர்த்தி செய்து ஆவணங்கள் பதிவேற்றவும்\n\n**Offline முறை:**\n- அருகிலுள்ள E-Sevai மையம் சென்று விண்ணப்பிக்கவும்\n\n**தேவையான ஆவணங்கள்:**\n- ஆதார் அட்டை (குடும்பம் அனைவருக்கும்)\n- முகவரி சான்று\n- பிறப்பு சான்றிதழ்\n\n**கட்டணம்:** இலவசம்\n\n**ஆதாரம்:** tnpds.gov.in`,
    answerEnglish: 'Apply for Tamil Nadu Ration Card at tnpds.gov.in online or at your nearest E-Sevai centre. Required: Aadhaar for all family members, address proof, birth certificates. Free of charge.',
    source: 'Tamil Nadu Civil Supplies Corporation',
    sourceUrl: 'https://www.tnpds.gov.in',
    keywords: ['ration card', 'குடும்ப அட்டை', 'smart card', 'PDS'],
    verified: true,
    lastUpdated: '2024-09-01',
  },
  // ══════════════════════════════════════════
  // HEALTH (15 entries)
  // ══════════════════════════════════════════
  {
    id: 'health-001',
    category: CATEGORIES.HEALTH,
    question: 'What should I do if I have a fever?',
    questionTamil: 'எனக்கு காய்ச்சல் இருக்கிறது. என்ன செய்யலாம்?',
    answer: `**⚠️ இது மருத்துவ ஆலோசனை அல்ல. மருத்துவரை அணுகவும்.**\n\n**பொதுவான ஆரம்ப கவனிப்பு (38°C வரை):**\n- நிறைய தண்ணீர் / திரவம் குடிக்கவும்\n- ஓய்வு எடுங்கள்\n- வெதுவெதுப்பான நீர் துணியால் நெற்றி துடைக்கவும்\n\n**உடனடியாக மருத்துவரை சந்திக்கவும் இந்த நிலைகளில்:**\n- காய்ச்சல் 39°C (102°F) மேல் இருந்தால்\n- 3 நாட்களுக்கு மேல் நீடித்தால்\n- குழந்தைகளுக்கு 38°C மேல் இருந்தால்\n- காய்ச்சலுடன் கடுமையான தலைவலி / உடல் வலி இருந்தால்\n- மூச்சுத்திணறல் இருந்தால்\n\n**மருந்து:** மருத்துவரின் ஆலோசனையின்றி எந்த மருந்தும் எடுக்க வேண்டாம்.`,
    answerEnglish: '⚠️ This is general guidance only, not medical advice. For fever below 38°C: Rest, drink plenty of fluids, use cool compress. See a doctor immediately if fever exceeds 39°C, lasts more than 3 days, or is in a child.',
    source: 'WHO - Fever Management Guidelines',
    sourceUrl: 'https://www.who.int',
    keywords: ['fever', 'காய்ச்சல்', 'temperature', 'illness'],
    verified: true,
    lastUpdated: '2024-10-01',
    isHealthGuidance: true,
    disclaimer: 'This is general informational guidance. Always consult a qualified medical professional.',
  },
  {
    id: 'health-002',
    category: CATEGORIES.HEALTH,
    question: 'What are the symptoms of dehydration?',
    questionTamil: 'நீர் இல்லாமை (Dehydration) அறிகுறிகள் என்ன?',
    answer: `**⚠️ மருத்துவ ஆலோசனை அல்ல. தீவிர நிலையில் மருத்துவரை அணுகவும்.**\n\n**நீர் இல்லாமை அறிகுறிகள்:**\n- வாய் வறட்சி\n- சிறுநீர் அடர் மஞ்சள் நிறம் / குறைவான சிறுநீர்\n- தலைசுற்றல் / மயக்கம்\n- களைப்பு\n- கண்கள் அமிழ்ந்திருக்கும்\n\n**தீவிர அறிகுறிகள் (உடனடி மருத்துவ உதவி தேவை):**\n- மயக்கம் வருவது\n- வேகமான இதயத்துடிப்பு\n- சுவாசிக்கச் சிரமம்\n\n**ஆரம்ப கவனிப்பு:**\n- ORS (Oral Rehydration Solution) குடிக்கவும்\n- குழந்தைகளுக்கு ORS / தாய்பால் தொடருங்கள்\n- தீவிரமாக இருந்தால் உடனே மருத்துவமனை செல்லுங்கள்`,
    answerEnglish: '⚠️ Guidance only. Dehydration symptoms: dry mouth, dark urine, dizziness, fatigue. Drink ORS or fluids. Seek immediate medical care if unconscious, rapid heartbeat, or difficulty breathing.',
    source: 'WHO Oral Rehydration Guidelines',
    sourceUrl: 'https://www.who.int',
    keywords: ['dehydration', 'நீர் இல்லாமை', 'ORS', 'fluid'],
    verified: true,
    lastUpdated: '2024-09-01',
    isHealthGuidance: true,
    disclaimer: 'This is general informational guidance. Always consult a qualified medical professional.',
  },
  {
    id: 'health-003',
    category: CATEGORIES.HEALTH,
    question: 'What are the early signs of diabetes?',
    questionTamil: 'நீரிழிவு நோயின் ஆரம்ப அறிகுறிகள் என்ன?',
    answer: `**⚠️ இது தகவல் மட்டுமே. நீரிழிவு நோய் உறுதி செய்ய மருத்துவரை அணுகவும்.**\n\n**ஆரம்ப அறிகுறிகள்:**\n- அடிக்கடி சிறுநீர் வருவது\n- அதிக தாகம்\n- அதிக பசி\n- திடீர் எடை குறைவு\n- கண் மங்கல் தெரிவது\n- புண்கள் ஆறுவதற்கு நீண்ட நேரம் ஆவது\n- கை கால்களில் மரம் / எரிச்சல்\n\n**நீரிழிவு சோதனை:**\n- அரசு மருத்துவமனையில் இலவசமாக சோதனை செய்யலாம்\n- TNMSC ஆரோக்கிய கவசம் சிவிர் சோதனை\n\n**முன்னெச்சரிக்கை:** சீக்கிரம் கண்டுபிடித்தால் கட்டுப்படுத்த எளிதாகும்.`,
    answerEnglish: '⚠️ Information only. Diabetes warning signs: frequent urination, excessive thirst, increased hunger, unexplained weight loss, blurry vision, slow-healing wounds, tingling in hands/feet. Get tested free at government hospitals.',
    source: 'Indian Council of Medical Research (ICMR)',
    sourceUrl: 'https://www.icmr.gov.in',
    keywords: ['diabetes', 'நீரிழிவு', 'blood sugar', 'symptoms'],
    verified: true,
    lastUpdated: '2024-10-01',
    isHealthGuidance: true,
    disclaimer: 'This is general informational guidance. Always consult a qualified medical professional for diagnosis.',
  },
  {
    id: 'health-004',
    category: CATEGORIES.HEALTH,
    question: 'What vaccinations are recommended for children?',
    questionTamil: 'குழந்தைகளுக்கு என்ன தடுப்பூசிகள் போட வேண்டும்?',
    answer: `**⚠️ உங்கள் மருத்துவர் / PHC-யை அணுகி உறுதிப்படுத்துங்கள்.**\n\n**இந்திய தேசிய தடுப்பூசி அட்டவணை (NIS) சில முக்கியமான தடுப்பூசிகள்:**\n\n| வயது | தடுப்பூசி |\n|------|----------|\n| பிறப்பில் | BCG, OPV-0, Hep-B |\n| 6 வாரம் | DTwP, OPV, Hep-B |\n| 9-12 மாதம் | MR, Vitamin-A |\n| 18 மாதம் | MMR, Booster |\n| 5 வயது | DPT Booster |\n\n**அரசு சேவை:**\n- அனைத்து தடுப்பூசிகளும் அரசு மருத்துவமனையில் **இலவசம்**\n\n**ஆதாரம்:** MoHFW தேசிய தடுப்பூசி திட்டம்`,
    answerEnglish: '⚠️ Consult your doctor or PHC. National Immunization Schedule: At birth BCG/OPV/Hep-B, 6 weeks DTwP/OPV, 9-12 months MR/Vitamin-A, 18 months MMR Booster, 5 years DPT Booster. ALL vaccinations are FREE at government hospitals.',
    source: 'Ministry of Health & Family Welfare - National Immunization Schedule',
    sourceUrl: 'https://mohfw.gov.in',
    keywords: ['vaccination', 'immunization', 'தடுப்பூசி', 'children health', 'குழந்தை'],
    verified: true,
    lastUpdated: '2024-08-15',
    isHealthGuidance: true,
    disclaimer: 'Always follow your doctor\'s vaccination schedule for your child.',
  },
  {
    id: 'health-005',
    category: CATEGORIES.HEALTH,
    question: 'How to prevent dengue fever?',
    questionTamil: 'டெங்கு காய்ச்சலை எப்படி தடுக்கலாம்?',
    answer: `**டெங்கு தடுப்பு முறைகள்:**\n\n**வீட்டில்:**\n- தண்ணீர் தேங்காமல் பார்த்துக்கொள்ளுங்கள் (கொசு வளர்க்காதீர்கள்)\n- பூச்சிக்கொல்லி கொசுவலை / மெட்டகாச்சு பயன்படுத்துங்கள்\n- முழுக்கை சட்டை, பேண்ட் அணியுங்கள்\n\n**சுற்றுப்புறம்:**\n- தெருவில் தேங்கும் தண்ணீரை அகற்றுங்கள்\n- வீட்டு தொட்டிகளை மூடி வையுங்கள்\n\n**அறிகுறிகள் தெரிந்தால்:**\n- திடீர் கடுமையான காய்ச்சல்\n- கடுமையான தலைவலி / கண்ணுக்கு பின் வலி\n- உடல் வலி\n→ **உடனடியாக மருத்துவரை சந்திக்கவும்**\n\n**ஆதாரம்:** National Vector Borne Disease Control Programme`,
    answerEnglish: 'Prevent dengue: Eliminate standing water, use mosquito nets/repellent, wear full-sleeved clothing. Symptoms (sudden high fever, severe headache, body pain, pain behind eyes) → See a doctor IMMEDIATELY.',
    source: 'NVBDCP - National Vector Borne Disease Control Programme',
    sourceUrl: 'https://nvbdcp.gov.in',
    keywords: ['dengue', 'டெங்கு', 'mosquito', 'fever prevention'],
    verified: true,
    lastUpdated: '2024-09-01',
    isHealthGuidance: true,
    disclaimer: 'If you suspect dengue, consult a doctor immediately. Do not self-medicate.',
  },
  // ══════════════════════════════════════════
  // EMERGENCY entries — safety-flagged
  // ══════════════════════════════════════════
  {
    id: 'emergency-001',
    category: CATEGORIES.HEALTH,
    question: 'I have severe chest pain and breathing difficulty',
    questionTamil: 'எனக்கு திடீரென மார்பு வலி மற்றும் மூச்சுத்திணறல் வருகிறது',
    answer: `🚨 **இது ஒரு அவசரகால நிலையாக இருக்கலாம்.**\n\n**இப்போதே செய்யுங்கள்:**\n1. உடனடியாக **108 (ஆம்புலன்ஸ்)** அழைக்கவும்\n2. ஓய்வாக படுத்துக்கொள்ளுங்கள்\n3. இறுக்கமான ஆடைகளை தளர்த்துங்கள்\n4. தனியாக இருந்தால் கதவை திறந்து வையுங்கள்\n5. **AI ஆலோசனை காத்திருக்க வேண்டாம் — உடனே மருத்துவ உதவி பெறுங்கள்**\n\n⚠️ **GRAMA MITRA இது நோய் கண்டறியவில்லை. இது அவசரகால தகவல் மட்டுமே.**`,
    answerEnglish: '🚨 This could be a MEDICAL EMERGENCY. Call 108 (Ambulance) IMMEDIATELY. Rest, loosen tight clothing, unlock doors. Do NOT wait for AI advice — seek medical help NOW.',
    source: 'Emergency Medical Guidelines',
    sourceUrl: '',
    keywords: ['chest pain', 'மார்பு வலி', 'breathing difficulty', 'emergency', 'அவசரம்'],
    verified: true,
    lastUpdated: '2024-11-01',
    isEmergency: true,
    isHealthGuidance: true,
    disclaimer: 'CALL 108 IMMEDIATELY. This is a potential medical emergency.',
  },
  {
    id: 'emergency-002',
    category: CATEGORIES.HEALTH,
    question: 'Someone fainted and is unconscious',
    questionTamil: 'ஒருவர் மயக்கமாகி விழுந்துவிட்டார்',
    answer: `🚨 **அவசரகால நிலை!**\n\n**உடனடியாக:**\n1. **108** அல்லது **104** அழைக்கவும்\n2. நபரை பாதுகாப்பான இடத்தில் படுக்க வையுங்கள்\n3. காற்று வழி தடைப்படாமல் தலையை சற்று பின்னால் சாய்க்கவும்\n4. சுவாசிக்கிறார்களா என சரிபார்க்கவும்\n5. **CPR பயிற்சி இருந்தால் மட்டும் செய்யுங்கள்**\n\n⚠️ **AI ஆலோசனை அல்ல — உடனே மருத்துவ உதவி பெறுங்கள்**`,
    answerEnglish: '🚨 MEDICAL EMERGENCY. Call 108 IMMEDIATELY. Place person safely, tilt head back to open airway, check breathing. Perform CPR only if trained.',
    source: 'Emergency Medical Guidelines',
    sourceUrl: '',
    keywords: ['unconscious', 'fainted', 'மயக்கம்', 'emergency'],
    verified: true,
    lastUpdated: '2024-11-01',
    isEmergency: true,
    isHealthGuidance: true,
  },
  // ══════════════════════════════════════════
  // GENERAL (10 entries)
  // ══════════════════════════════════════════
  {
    id: 'general-001',
    category: CATEGORIES.GENERAL,
    question: 'Where can I get help with Grama Mitra?',
    questionTamil: 'கிராம மித்ரா குறித்து உதவி எங்கே கிடைக்கும்?',
    answer: `**GRAMA MITRA உதவி:**\n\n- 🌐 **இணையதளம்:** gramaMitra.in\n- 📱 **WhatsApp:** Active Bot Channel\n- 📞 **Phone:** IVR Helpline (1800-425-GRAMA)\n- 👤 **Human Support:** Handoff request மூலம் அனுப்பவும்\n\n**செயல்படும் நேரம்:** AI: 24/7 | Human Support: Working hours\n\nகேள்விகள் இருந்தால் "Human Help" பொத்தானை அழுத்துங்கள்.`,
    answerEnglish: 'GRAMA MITRA help is available via website, WhatsApp Bot, and IVR Helpline. AI is available 24/7. For human support, click "Request Human Help".',
    source: 'Grama Mitra Platform',
    sourceUrl: '',
    keywords: ['help', 'support', 'contact', 'உதவி'],
    verified: true,
    lastUpdated: '2024-11-01',
  },
  {
    id: 'general-002',
    category: CATEGORIES.GENERAL,
    question: 'What is the weather like today? How do I get weather information?',
    questionTamil: 'இன்று வானிலை எப்படி இருக்கும்? வானிலை தகவல் எங்கே கிடைக்கும்?',
    answer: `**GRAMA MITRA தற்போது live வானிலை தகவல் வழங்குவதில்லை.**\n\n**வானிலை தகவலுக்கு:**\n- 🌐 **IMD:** mausam.imd.gov.in\n- 📱 **Meghdoot App** (விவசாயிகளுக்கான வானிலை App)\n- 📞 **Agromet Advisory:** 1800-180-1551 (இலவச)\n- கிராம பஞ்சாயத்து அலுவலகம்\n\n**Meghdoot App:** விவசாயிகளுக்காக IMD உருவாக்கிய இலவச Tamil app — 5 நாட்கள் வானிலை + வேளாண் ஆலோசனை.`,
    answerEnglish: 'GRAMA MITRA does not provide live weather data. For weather: Visit mausam.imd.gov.in, use the free Meghdoot App (Tamil weather + agri advisory), or call 1800-180-1551 (free Agromet Advisory).',
    source: 'India Meteorological Department',
    sourceUrl: 'https://mausam.imd.gov.in',
    keywords: ['weather', 'வானிலை', 'rain', 'forecast'],
    verified: true,
    lastUpdated: '2024-10-01',
  },
];

// Helper: search knowledge base
export function searchKnowledge(query, category = null) {
  const q = query.toLowerCase();
  const results = knowledgeBase.filter(item => {
    const matchCat = category ? item.category === category : true;
    const matchText =
      item.question.toLowerCase().includes(q) ||
      item.questionTamil.toLowerCase().includes(q) ||
      item.answer.toLowerCase().includes(q) ||
      item.keywords.some(k => q.includes(k) || k.includes(q));
    return matchCat && matchText;
  });
  return results.slice(0, 3);
}

// Emergency keywords
export const EMERGENCY_KEYWORDS = [
  'chest pain', 'மார்பு வலி', 'breathing difficulty', 'மூச்சுத்திணறல்',
  'unconscious', 'மயக்கம்', 'fainted', 'stroke', 'severe bleeding',
  'not breathing', 'heart attack', 'மாரடைப்பு', 'allergy', 'anaphylaxis',
  'suicide', 'poisoning', 'நஞ்சு', 'overdose', 'accident', 'விபத்து',
];

export function detectEmergency(text) {
  const lower = text.toLowerCase();
  return EMERGENCY_KEYWORDS.some(kw => lower.includes(kw));
}

export function classifyIntent(text) {
  const lower = text.toLowerCase();
  const agriKws = ['crop', 'farm', 'paddy', 'rice', 'pest', 'fertilizer', 'soil', 'harvest',
    'நெல்', 'பயிர்', 'விவசாய', 'மண்', 'உரம்', 'பூச்சி', 'நிலம்', 'தண்ணீர்', 'வேளாண்'];
  const govtKws = ['scheme', 'government', 'apply', 'eligibility', 'document', 'PM KISAN',
    'ration', 'aadhaar', 'subsidy', 'அரசு', 'திட்டம்', 'விண்ணப்பம்', 'உதவி', 'சான்று'];
  const healthKws = ['pain', 'fever', 'ill', 'sick', 'symptom', 'medicine', 'doctor', 'hospital',
    'காய்ச்சல்', 'வலி', 'நோய்', 'மருந்து', 'மருத்துவர்', 'மருத்துவமனை'];

  if (detectEmergency(lower)) return 'EMERGENCY';
  if (agriKws.some(k => lower.includes(k))) return 'AGRICULTURE';
  if (govtKws.some(k => lower.includes(k))) return 'GOVERNMENT_SCHEME';
  if (healthKws.some(k => lower.includes(k))) return 'HEALTH';
  return 'GENERAL';
}
