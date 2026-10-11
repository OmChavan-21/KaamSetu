// Multilingual AI Assistant for KaamSetu AI
// Handles conversational queries in English, Hindi (हिंदी), and Marathi (मराठी)
// Slide 7 & 12 feature implementation

export async function processAssistantMessage(message, language = 'en') {
  const cleanMsg = (message || '').trim();

  // Detect language if not specified
  let detectedLang = language;
  const isDevanagari = /[\u0900-\u097F]/.test(cleanMsg);
  if (isDevanagari) {
    if (/\b(मला|आहे|उद्या|हवा|हवी|पाहिजे|कामासाठी|पुण्यात|करा|नाही|काय)\b/i.test(cleanMsg)) {
      detectedLang = 'mr';
    } else {
      detectedLang = 'hi';
    }
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

  // Extract Location (Pune localities with Marathi/Hindi spellings)
  let location = 'Pune';
  const localities = [
    { name: 'Kothrud', regex: /kothrud|कोथरूड|कोथरुड|vanaz/i },
    { name: 'Swargate', regex: /swargate|स्वारगेट/i },
    { name: 'Pimpri', regex: /pimpri|chinchwad|pcmc|पिंपरी|चिंचवड/i },
    { name: 'Hadapsar', regex: /hadapsar|हडपसर|magarpatta/i },
    { name: 'Katraj', regex: /katraj|कात्रज|bibwewadi/i },
    { name: 'Baner', regex: /baner|बाणेर|balewadi/i },
    { name: 'Wakad', regex: /wakad|वाकड/i },
    { name: 'Hinjewadi', regex: /hinjewadi|हिंजवडी/i },
    { name: 'Wagholi', regex: /wagholi|वाघोली|kharadi/i },
    { name: 'Bhosari', regex: /bhosari|भोसरी/i },
    { name: 'Camp', regex: /camp|कॅम्प/i },
    { name: 'Shivajinagar', regex: /shivajinagar|शिवाजीनगर/i }
  ];

  for (const loc of localities) {
    if (loc.regex.test(cleanMsg)) {
      location = loc.name;
      break;
    }
  }

  // Extract Budget if mentioned (e.g. 600, 700, ₹650)
  let budget = 700;
  const budgetMatch = cleanMsg.match(/(?:₹|rs\.?|inr)?\s*([4-9]\d{2}|1\d{3})/i);
  if (budgetMatch) {
    budget = parseInt(budgetMatch[1], 10);
  }

  // Extract Timing
  let timing = 'Today';
  if (/tomorrow|उद्या|कल/i.test(cleanMsg)) {
    timing = 'Tomorrow';
  } else if (/urgent|immediately|right now|आत्ताच|तुरंत|अभी/i.test(cleanMsg)) {
    timing = 'Available Now';
  }

  // Build localized AI response text
  let responseText = '';
  if (detectedLang === 'mr') {
    if (trade) {
      const tradeNameMr = trade === 'Electrician' ? 'इलेक्ट्रिशियन' : trade === 'Plumber' ? 'प्लंबर' : trade === 'Painter' ? 'पेंटर' : trade === 'Carpenter' ? 'सुतार' : trade;
      responseText = `नक्कीच! मी ${location} परिसरामध्ये ${tradeNameMr} शोधत आहे. बजेट: ₹${budget}/दिवस. खाली सर्वोत्तम जुळणारे कारागीर (AI Match) दाखवले आहेत.`;
    } else {
      responseText = `मी तुम्हाला जवळचा कुशल कारागीर शोधण्यात मदत करतो. तुम्हाला कोणत्या कामासाठी कारागीर हवा आहे? उदा. इलेक्ट्रिशियन, प्लंबर, कारपेंटर किंवा पेंटर?`;
    }
  } else if (detectedLang === 'hi') {
    if (trade) {
      const tradeNameHi = trade === 'Electrician' ? 'इलेक्ट्रीशियन' : trade === 'Plumber' ? 'प्लंबर' : trade === 'Painter' ? 'पेंटर' : trade === 'Carpenter' ? 'कारपेंटर' : trade;
      responseText = `बिल्कुल! मैं ${location} में ${tradeNameHi} खोज रहा हूँ। बजट: ₹${budget}/दिन। नीचे शीर्ष AI सिफारिशें दिखाई गई हैं।`;
    } else {
      responseText = `नमस्ते! मैं आपको नजदीकी कुशल कामगार ढूंढने में मदद कर सकता हूँ। आपको किस काम के लिए कारीगर चाहिए? जैसे इलेक्ट्रीशियन, प्लंबर, पेंटर आदि।`;
    }
  } else {
    // English default
    if (trade) {
      responseText = `Understood! Searching for top-rated ${trade}s near ${location} with budget up to ₹${budget}/day (${timing}). Here are the best AI-ranked recommendations.`;
    } else {
      responseText = `Hello! I can help you find verified skilled workers nearby in Pune. What trade are you looking for? (e.g. Electrician, Plumber, Painter, Carpenter)`;
    }
  }

  return {
    query: cleanMsg,
    detectedLang,
    responseText,
    filters: {
      trade,
      location,
      budget,
      timing,
      needDescription: cleanMsg
    }
  };
}

export function translateText(text, targetLang = 'mr') {
  if (!text) return '';
  const clean = text.trim();

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

  const lower = clean.toLowerCase();
  const isDevanagari = /[\u0900-\u097F]/.test(clean);
  const srcLang = isDevanagari ? 'mr' : 'en';
  const key = `${srcLang}-${targetLang}`;

  const dict = phraseDictionary[key];
  if (dict) {
    if (dict[clean]) return dict[clean];
    if (dict[lower]) return dict[lower];
  }

  // Cross check other dictionaries
  for (const [dictKey, map] of Object.entries(phraseDictionary)) {
    if (dictKey.endsWith(`-${targetLang}`) && map[lower]) {
      return map[lower];
    }
  }

  return clean;
}
