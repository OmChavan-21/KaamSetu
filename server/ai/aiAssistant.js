// Multilingual AI Assistant for KaamSetu AI
// Powered by Google Gemini API (gemini-3.5-flash & gemini-3.1-flash-lite)
// Handles conversational queries & live chat translation in Marathi (मराठी), Hindi (हिंदी), and English across all 36 Maharashtra districts.

import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Primary and fallback models
const PRIMARY_MODEL = 'gemini-3.5-flash';
const FALLBACK_MODEL = 'gemini-3.1-flash-lite';

/**
 * Call Google Gemini REST API with timeout & retry
 */
async function callGemini(prompt, systemInstruction = '', model = PRIMARY_MODEL, timeoutMs = 7000) {
  if (!GEMINI_API_KEY) throw new Error('No GEMINI_API_KEY set');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1200,
        responseMimeType: 'application/json'
      }
    };

    if (systemInstruction) {
      payload.systemInstruction = {
        parts: [{ text: systemInstruction }]
      };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!res.ok) {
      const errBody = await res.text().catch(() => '');
      throw new Error(`Gemini ${model} returned HTTP ${res.status}: ${errBody}`);
    }

    const data = await res.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) throw new Error('Empty response content from Gemini');

    // Clean any markdown fences if present
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
    return JSON.parse(cleaned);
  } finally {
    clearTimeout(timer);
  }
}

const SAATHI_SYSTEM_PROMPT = `You are KaamSetu Saathi (कामसेतू साथी), an intelligent and respectful multilingual AI assistant for KaamSetu (कामसेतू)—Maharashtra's leading hyper-local blue-collar artisan & gig platform.
Platform Mission: Connect home-owners, shopkeepers, and contractors directly with verified daily-wage artisans (naka workers) across all 36 districts of Maharashtra (e.g. Kolhapur, Pune, Mumbai, Thane, Palghar, Raigad, Nashik, Chhatrapati Sambhajinagar, Nagpur, Solapur, Satara, Sangli, Amravati, Nanded, etc.).
Trades Supported: Electrician, Plumber, Painter, Carpenter, Mason, Welder.

Key Features you can explain:
1. Instant AI Match by distance, trade, rating, and budget.
2. Aadhaar KYC & Skill verification with trust badges.
3. Daily wage transparency (fair wage standards ₹500 - ₹900/day).
4. Live gig chat with instant Marathi-Hindi-English translation.
5. Worker mode and contractor mode portals.

Instructions:
1. Detect user's language (Marathi 'mr', Hindi 'hi', or English 'en'). If user speaks Marathi or Marathi transliteration, respond in fluent, respectful Marathi. If Hindi, respond in Hindi. If English, respond in English.
2. Extract the user's intent:
   - "FIND_WORKER": User wants a worker (e.g., "मला कोल्हापूर बिंदू चौकात प्लंबर हवा आहे ₹550")
   - "QUESTION": User asking how KaamSetu works, trust/Aadhaar verification, payment, pricing, etc.
   - "GREETING": Hello, namaskar, general pleasantry.
3. If user wants a worker, extract:
   - trade: "Electrician" | "Plumber" | "Painter" | "Carpenter" | "Mason" | "Welder" | ""
   - district: Standard Maharashtra district name (e.g. "Kolhapur", "Pune", "Mumbai", "Nashik", "Nagpur", "Thane", "Satara", "Sangli", "Solapur", "Chhatrapati Sambhajinagar", etc.) or null if unspecified.
   - location: The specific chowk / area / locality mentioned (e.g. "Bindu Chowk", "Kothrud", "Dadar", "Sitabuldi") or district.
   - budget: number (integer) or null.
   - timing: "Today" | "Tomorrow" | "Available Now" | "Immediate"
   - needDescription: clean summary of what is needed.
4. If user asked a question, provide a clear, helpful 2-4 sentence explanation in "responseText", and set trade/district to null/empty in filters.
5. Return strictly valid JSON with this exact schema:
{
  "responseText": "String (warm response in Marathi/Hindi/English)",
  "detectedLang": "mr" | "hi" | "en",
  "intent": "FIND_WORKER" | "QUESTION" | "GREETING",
  "filters": {
    "trade": "String",
    "district": "String or null",
    "location": "String",
    "budget": "Number or null",
    "timing": "String",
    "needDescription": "String"
  }
}`;

/**
 * Main assistant message handler
 */
export async function processAssistantMessage(message, language = 'en', context = {}) {
  const cleanMsg = (message || '').trim();
  const currentDistrict = context.userDistrict || context.userCity || 'Kolhapur';

  // 1. Try Gemini 3.5 Flash, then fallback to Gemini 3.1 Flash Lite
  try {
    const userPrompt = `Current User District Context: ${currentDistrict}
Preferred UI Language: ${language}
User Message: "${cleanMsg}"`;

    try {
      const geminiResult = await callGemini(userPrompt, SAATHI_SYSTEM_PROMPT, PRIMARY_MODEL, 6500);
      return {
        query: cleanMsg,
        detectedLang: geminiResult.detectedLang || language,
        intent: geminiResult.intent || 'FIND_WORKER',
        responseText: geminiResult.responseText,
        filters: {
          trade: geminiResult.filters?.trade || '',
          district: geminiResult.filters?.district || (geminiResult.filters?.trade ? currentDistrict : null),
          location: geminiResult.filters?.location || currentDistrict,
          budget: typeof geminiResult.filters?.budget === 'number' ? geminiResult.filters.budget : 650,
          timing: geminiResult.filters?.timing || 'Today',
          needDescription: geminiResult.filters?.needDescription || cleanMsg
        },
        source: 'gemini-3.5-flash'
      };
    } catch (primaryErr) {
      console.warn('Gemini 3.5-flash fallback triggered:', primaryErr.message);
      const geminiResult = await callGemini(userPrompt, SAATHI_SYSTEM_PROMPT, FALLBACK_MODEL, 6500);
      return {
        query: cleanMsg,
        detectedLang: geminiResult.detectedLang || language,
        intent: geminiResult.intent || 'FIND_WORKER',
        responseText: geminiResult.responseText,
        filters: {
          trade: geminiResult.filters?.trade || '',
          district: geminiResult.filters?.district || (geminiResult.filters?.trade ? currentDistrict : null),
          location: geminiResult.filters?.location || currentDistrict,
          budget: typeof geminiResult.filters?.budget === 'number' ? geminiResult.filters.budget : 650,
          timing: geminiResult.filters?.timing || 'Today',
          needDescription: geminiResult.filters?.needDescription || cleanMsg
        },
        source: 'gemini-3.1-flash-lite'
      };
    }
  } catch (apiErr) {
    console.warn('Gemini API call failed, falling back to enhanced offline Maharashtra engine:', apiErr.message);
    return processOfflineMessage(cleanMsg, language, currentDistrict);
  }
}

/**
 * Offline Heuristic & Maharashtra Pattern Engine (Zero-downtime fallback)
 */
function processOfflineMessage(cleanMsg, language = 'en', currentDistrict = 'Kolhapur') {
  // Detect language
  let detectedLang = language;
  const isDevanagari = /[\u0900-\u097F]/.test(cleanMsg);
  if (isDevanagari) {
    if (/(मला|आहे|उद्या|हवा|हवी|पाहिजे|कामासाठी|पुण्यात|कोल्हापुरात|करा|नाही|काय|कसे|कशी|आहात|नमस्कार|चौकात|भाजी|कामगार|कारागीर|प्लंबर|सुतार|गवंडी)/i.test(cleanMsg)) {
      detectedLang = 'mr';
    } else {
      detectedLang = 'hi';
    }
  }

  // Check for general platform questions
  const isQuestion = /आधार|वेरिफिकेशन|पैसे|कसे काम करते|काय आहे|how it works|aadhaar|verify|payment|pricing/i.test(cleanMsg);
  if (isQuestion) {
    let qResponse = '';
    if (detectedLang === 'mr') {
      qResponse = 'कामसेतू हे महाराष्ट्रातील कुशल कारागीर आणि कंत्राटदार यांना जोडणारे व्यासपीठ आहे. येथे सर्व कामगारांची आधार पडताळणी (Aadhaar KYC) आणि कौशल्य चाचणी केली जाते. तुम्ही थेट कॉल करून किंवा ॲपवरून बुक करू शकता!';
    } else if (detectedLang === 'hi') {
      qResponse = 'कामसेतू महाराष्ट्र का प्रमुख ब्लू-कॉलर प्लेटफॉर्म है। यहाँ सभी कारीगरों का आधार सत्यापन और स्किल वेरिफिकेशन किया जाता है ताकि आपको विश्वसनीय कारीगर मिल सकें।';
    } else {
      qResponse = 'KaamSetu is Maharashtra\'s hyper-local blue-collar artisan platform. All workers have verified Aadhaar KYC and skill badges, allowing you to hire with confidence.';
    }

    return {
      query: cleanMsg,
      detectedLang,
      intent: 'QUESTION',
      responseText: qResponse,
      filters: { trade: '', district: currentDistrict, location: currentDistrict, budget: null, timing: '', needDescription: cleanMsg },
      source: 'offline-engine'
    };
  }

  // Extract Trade
  let trade = '';
  if (/electrician|wireman|wiring|fuse|switchboard|इलेक्ट्रिशियन|वायरिंग|विजेचे काम|बिजली/i.test(cleanMsg)) {
    trade = 'Electrician';
  } else if (/plumber|pipe|tap|leakage|water|प्लंबर|नळ|पाईप|गळती/i.test(cleanMsg)) {
    trade = 'Plumber';
  } else if (/painter|paint|putty|color|पेंटर|रंगारी|रंगकाम|पुट्टी/i.test(cleanMsg)) {
    trade = 'Painter';
  } else if (/carpenter|wood|furniture|door|lock|कारपेंटर|सुतार|फर्निचर|लाकूड|दरवाजा/i.test(cleanMsg)) {
    trade = 'Carpenter';
  } else if (/mason|mistri|brick|cement|plaster|गवंडी|मिस्त्री|बांधकाम|प्लास्टर/i.test(cleanMsg)) {
    trade = 'Mason';
  } else if (/welder|welding|grill|gate|वेल्डर|लोहार|वेल्डिंग|ग्रील/i.test(cleanMsg)) {
    trade = 'Welder';
  }

  // Extract District across Maharashtra
  const maharashtraDistricts = [
    { id: 'Kolhapur', regex: /kolhapur|कोल्हापूर|कोल्हापुर|बिंदू चौक|राजारामपुरी|शाहूपुरी/i },
    { id: 'Pune', regex: /pune|पुणे|पुण्यात|kothrud|swargate|hadapsar|baner|wakad|hinjewadi|camp/i },
    { id: 'Mumbai', regex: /mumbai|मुंबई|dadar|andheri|borivali|kurla|bandra/i },
    { id: 'Thane', regex: /thane|ठाणे/i },
    { id: 'Nashik', regex: /nashik|नाशिक/i },
    { id: 'Nagpur', regex: /nagpur|नागपूर|सीताबर्डी/i },
    { id: 'Chhatrapati Sambhajinagar', regex: /aurangabad|sambhajinagar|संभाजीनगर/i },
    { id: 'Solapur', regex: /solapur|सोलापूर/i },
    { id: 'Satara', regex: /satara|सातारा/i },
    { id: 'Sangli', regex: /sangli|सांगली/i },
    { id: 'Amravati', regex: /amravati|अमरावती/i },
    { id: 'Nanded', regex: /nanded|नांदेड/i }
  ];

  let detectedDistrict = currentDistrict;
  for (const d of maharashtraDistricts) {
    if (d.regex.test(cleanMsg)) {
      detectedDistrict = d.id;
      break;
    }
  }

  // Extract Location (Localities / Chowks)
  let location = detectedDistrict;
  const localities = [
    { name: 'Bindu Chowk, Kolhapur', regex: /bindu chowk|बिंदू चौक/i },
    { name: 'Rajarampuri, Kolhapur', regex: /rajarampuri|राजारामपुरी/i },
    { name: 'Shahupuri, Kolhapur', regex: /shahupuri|शाहूपुरी/i },
    { name: 'Kothrud, Pune', regex: /kothrud|कोथरूड|कोथरुड/i },
    { name: 'Swargate, Pune', regex: /swargate|स्वारगेट/i },
    { name: 'Hinjewadi, Pune', regex: /hinjewadi|हिंजवडी/i },
    { name: 'Hadapsar, Pune', regex: /hadapsar|हडपसर/i },
    { name: 'Dadar, Mumbai', regex: /dadar|दादर/i },
    { name: 'Andheri, Mumbai', regex: /andheri|अंधेरी/i },
    { name: 'Sitabuldi, Nagpur', regex: /sitabuldi|सीताबर्डी/i }
  ];

  for (const loc of localities) {
    if (loc.regex.test(cleanMsg)) {
      location = loc.name;
      break;
    }
  }

  // Extract Budget if mentioned (e.g. 500, 600, 700, ₹650)
  let budget = 650;
  const budgetMatch = cleanMsg.match(/(?:₹|rs\.?|inr)?\s*([4-9]\d{2}|1\d{3})/i);
  if (budgetMatch) {
    budget = parseInt(budgetMatch[1], 10);
  }

  // Extract Timing
  let timing = 'Today';
  if (/tomorrow|उद्या|कल/i.test(cleanMsg)) {
    timing = 'Tomorrow';
  } else if (/urgent|immediately|emergency|right now|आत्ताच|तुरंत|अभी/i.test(cleanMsg)) {
    timing = 'Available Now';
  }

  // Localized response
  let responseText = '';
  if (detectedLang === 'mr') {
    if (trade) {
      const tradeMr = trade === 'Electrician' ? 'इलेक्ट्रिशियन' : trade === 'Plumber' ? 'प्लंबर' : trade === 'Painter' ? 'पेंटर' : trade === 'Carpenter' ? 'सुतार' : trade === 'Mason' ? 'गवंडी' : trade === 'Welder' ? 'वेल्डर' : trade;
      responseText = `नक्कीच! मी ${detectedDistrict} (${location}) परिसरामध्ये कुशल ${tradeMr} शोधत आहे. बजेट: ₹${budget}/दिवस (${timing}). खाली सर्वोत्तम जुळणारे कारागीर (AI Match) दाखवले आहेत.`;
    } else {
      responseText = `नमस्कार! मी कामसेतू साथी आहे. तुम्हाला ${detectedDistrict} किंवा महाराष्ट्रात कोणत्या कामासाठी कारागीर हवा आहे? (उदा. इलेक्ट्रिशियन, प्लंबर, कारपेंटर किंवा पेंटर)`;
    }
  } else if (detectedLang === 'hi') {
    if (trade) {
      const tradeHi = trade === 'Electrician' ? 'इलेक्ट्रीशियन' : trade === 'Plumber' ? 'प्लंबर' : trade === 'Painter' ? 'पेंटर' : trade === 'Carpenter' ? 'कारपेंटर' : trade;
      responseText = `बिल्कुल! मैं ${detectedDistrict} (${location}) में कुशल ${tradeHi} खोज रहा हूँ। बजट: ₹${budget}/दिन (${timing})। नीचे शीर्ष AI सिफारिशें दिखाई गई हैं।`;
    } else {
      responseText = `नमस्ते! मैं कामसेतू साथी हूँ। आपको ${detectedDistrict} में किस काम के लिए कारीगर चाहिए? जैसे इलेक्ट्रीशियन, प्लंबर, पेंटर आदि।`;
    }
  } else {
    if (trade) {
      responseText = `Understood! Searching for top-rated verified ${trade}s near ${location} with budget up to ₹${budget}/day (${timing}). Showing best AI Match recommendations.`;
    } else {
      responseText = `Hello! I am KaamSetu Saathi. Which trade are you looking for in ${detectedDistrict}? (e.g. Electrician, Plumber, Painter, Carpenter, Mason)`;
    }
  }

  return {
    query: cleanMsg,
    detectedLang,
    intent: trade ? 'FIND_WORKER' : 'GREETING',
    responseText,
    filters: {
      trade,
      district: detectedDistrict,
      location,
      budget,
      timing,
      needDescription: cleanMsg
    },
    source: 'offline-engine'
  };
}

/**
 * Intelligent Gig Chat Translation with Gemini and Fallback Dictionary
 */
const phraseDictionary = {
  // English -> Marathi
  "en-mr": {
    "please bring your 10mm drill": "कृपया तुमचा 10mm ड्रिल सोबत आणा",
    "please bring your 10mm drill and safety tester": "कृपया तुमचा 10mm ड्रिल आणि टेस्टर सोबत आणा",
    "please bring your 10mm drill and tester.": "कृपया तुमचा 10mm ड्रिल आणि टेस्टर सोबत आणा.",
    "i have arrived at the location": "मी कामाच्या ठिकाणी पोहोचलो आहे",
    "i have arrived at the site": "मी कामाच्या ठिकाणी पोहोचलो आहे",
    "job started. everything looks good.": "काम सुरू केले आहे. सर्व व्यवस्थित आहे.",
    "work is completed, please inspect": "काम पूर्ण झाले आहे, कृपया तपासून घ्या",
    "payment sent via upi": "युपीआय द्वारे पैसे पाठवले आहेत",
    "are you available right now?": "तुम्ही आता लगेच कामासाठी उपलब्ध आहात का?",
    "can we do this for ₹600/day?": "हे काम ₹600 प्रति दिन दराने चालेल का?",
    "yes, i will reach in 15 minutes": "होय, मी 15 मिनिटांत पोहोचतो",
    "hello": "नमस्कार",
    "thank you": "धन्यवाद",
    "what time will you arrive?": "तुम्ही किती वाजता पोहोचणार आहात?",
    "i am on the way": "मी रस्त्यात आहे, लवकरच पोहोचतो"
  },
  // English -> Hindi
  "en-hi": {
    "please bring your 10mm drill": "कृपया अपनी 10mm ड्रिल साथ लाएं",
    "please bring your 10mm drill and tester.": "कृपया अपनी 10mm ड्रिल और टेस्टर साथ लाएं।",
    "i have arrived at the location": "मैं काम की जगह पर पहुँच गया हूँ",
    "job started. everything looks good.": "काम शुरू हो गया है। सब ठीक है।",
    "work is completed, please inspect": "काम पूरा हो गया है, कृपया जांच लें",
    "payment sent via upi": "यूपीआई से भुगतान भेज दिया गया है",
    "are you available right now?": "क्या आप अभी काम के लिए उपलब्ध हैं?",
    "can we do this for ₹600/day?": "क्या यह काम ₹600 प्रतिदिन में हो सकता है?",
    "yes, i will reach in 15 minutes": "हाँ, मैं 15 मिनट में पहुँच रहा हूँ",
    "hello": "नमस्ते",
    "thank you": "धन्यवाद",
    "what time will you arrive?": "आप कितने बजे पहुँचेंगे?",
    "i am on the way": "मैं रास्ते में हूँ"
  },
  // Marathi -> English
  "mr-en": {
    "मी निघालो आहे. 15 मिनिटांत पोहोचतो.": "I have left. Will reach the site in 15 minutes.",
    "मी कामाच्या ठिकाणी पोहोचलो आहे": "I have arrived at the location",
    "काम पूर्ण झाले आहे, कृपया तपासून घ्या": "Work is completed, please inspect",
    "होय, मी 15 मिनिटांत पोहोचतो": "Yes, I will reach in 15 minutes",
    "कृपया तुमचा 10mm ड्रिल सोबत आणा": "Please bring your 10mm drill",
    "युपीआय द्वारे पैसे पाठवले आहेत": "Payment sent via UPI",
    "नमस्कार": "Hello",
    "धन्यवाद": "Thank you"
  },
  // Hindi -> English
  "hi-en": {
    "मैं निकल गया हूँ। 15 मिनट में पहुँच रहा हूँ।": "I have left. Will reach the site in 15 minutes.",
    "मैं काम की जगह पर पहुँच गया हूँ": "I have arrived at the location",
    "काम पूरा हो गया है, कृपया जांच लें": "Work is completed, please inspect",
    "हाँ, मैं 15 मिनट में पहुँच रहा हूँ": "Yes, I will reach in 15 minutes",
    "कृपया अपनी 10mm ड्रिल साथ लाएं": "Please bring your 10mm drill",
    "नमस्ते": "Hello",
    "धन्यवाद": "Thank you"
  }
};

const translationCache = new Map();

export async function translateText(text, targetLang = 'mr') {
  if (!text) return '';
  const clean = text.trim();
  const lower = clean.toLowerCase();

  const isDevanagari = /[\u0900-\u097F]/.test(clean);
  const srcLang = isDevanagari ? 'mr' : 'en';
  const cacheKey = `${srcLang}->${targetLang}:${clean}`;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  // 1. Check dictionary first
  const dictKey = `${srcLang}-${targetLang}`;
  const dict = phraseDictionary[dictKey];
  if (dict && (dict[clean] || dict[lower])) {
    const result = dict[clean] || dict[lower];
    translationCache.set(cacheKey, result);
    return result;
  }

  // 2. Translate with Gemini if available
  if (GEMINI_API_KEY) {
    for (const model of [PRIMARY_MODEL, FALLBACK_MODEL]) {
      try {
        const targetName = targetLang === 'mr' ? 'Marathi' : targetLang === 'hi' ? 'Hindi' : 'English';
        const prompt = `Translate this short construction/worker gig chat message to ${targetName}. Return ONLY the direct translation without quotation marks or explanations: "${clean}"`;

        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 5000);

        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1, maxOutputTokens: 300 }
          }),
          signal: controller.signal
        });
        clearTimeout(timer);

        if (res.ok) {
          const data = await res.json();
          const translated = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (translated) {
            const finalClean = translated.replace(/^["'«»]|["'«»]$/g, '').trim();
            translationCache.set(cacheKey, finalClean);
            return finalClean;
          }
        }
      } catch (e) {
        // try fallback model
      }
    }
  }

  // 3. Fallback to dictionary cross-check or original
  for (const [key, map] of Object.entries(phraseDictionary)) {
    if (key.endsWith(`-${targetLang}`) && map[lower]) {
      return map[lower];
    }
  }

  return clean;
}
