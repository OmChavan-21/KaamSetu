// Maharashtra Divisions, Districts, Center GPS Coordinates and Famous Labor Chowks
// Architecture: Statewide Launch, Extensible to India

export const MAHARASHTRA_DIVISIONS = [
  { id: 'all', name: 'All Maharashtra', nameMr: 'संपूर्ण महाराष्ट्र' },
  { id: 'western', name: 'Western Maharashtra', nameMr: 'पश्चिम महाराष्ट्र' },
  { id: 'konkan', name: 'Konkan & Mumbai MMR', nameMr: 'कोकण व मुंबई' },
  { id: 'marathwada', name: 'Marathwada', nameMr: 'मराठवाडा' },
  { id: 'vidarbha', name: 'Vidarbha', nameMr: 'विदर्भ' },
  { id: 'north', name: 'North Maharashtra', nameMr: 'उत्तर महाराष्ट्र (खान्देश)' }
];

export const MAHARASHTRA_DISTRICTS = [
  // --- Western Maharashtra ---
  {
    id: 'Pune',
    name: 'Pune',
    nameMr: 'पुणे',
    division: 'western',
    divisionMr: 'पश्चिम महाराष्ट्र',
    lat: 18.5204,
    lng: 73.8567,
    chowks: [
      { id: 'Swargate', name: 'Swargate Chowk (स्वारगेट नाका)', lat: 18.5018, lng: 73.8580 },
      { id: 'Kothrud', name: 'Kothrud (कोथरूड)', lat: 18.5074, lng: 73.8077 },
      { id: 'Pimpri', name: 'Pimpri-Chinchwad (पिंपरी-चिंचवड)', lat: 18.6298, lng: 73.7997 },
      { id: 'Hadapsar', name: 'Hadapsar (हडपसर)', lat: 18.5089, lng: 73.9259 },
      { id: 'Katraj', name: 'Katraj Naka (कात्रज नाका)', lat: 18.4575, lng: 73.8677 },
      { id: 'Bhosari', name: 'Bhosari MIDC (भोसरी)', lat: 18.6258, lng: 73.8447 },
      { id: 'Wakad', name: 'Wakad (वाकड)', lat: 18.5987, lng: 73.7680 }
    ]
  },
  {
    id: 'Kolhapur',
    name: 'Kolhapur',
    nameMr: 'कोल्हापूर',
    division: 'western',
    divisionMr: 'पश्चिम महाराष्ट्र',
    lat: 16.6946,
    lng: 74.2238,
    chowks: [
      { id: 'Bindu Chowk', name: 'Bindu Chowk (बिंदू चौक - मुख्य मजूर नाका)', lat: 16.6946, lng: 74.2238 },
      { id: 'Rajarampuri', name: 'Rajarampuri (राजारामपुरी)', lat: 16.6923, lng: 74.2486 },
      { id: 'Shahupuri', name: 'Shahupuri (शाहूपुरी)', lat: 16.7027, lng: 74.2384 },
      { id: 'Tarabai Park', name: 'Tarabai Park (ताराबाई पार्क)', lat: 16.7099, lng: 74.2294 },
      { id: 'Rankala Chowk', name: 'Rankala Chowk (रंकाळा चौक)', lat: 16.6874, lng: 74.2127 },
      { id: 'Shiroli MIDC', name: 'Shiroli MIDC (शिरोली नाका)', lat: 16.7578, lng: 74.2829 },
      { id: 'Gandhinagar', name: 'Gandhinagar (गांधीनगर)', lat: 16.7082, lng: 74.2842 }
    ]
  },
  {
    id: 'Satara',
    name: 'Satara',
    nameMr: 'सातारा',
    division: 'western',
    divisionMr: 'पश्चिम महाराष्ट्र',
    lat: 17.6805,
    lng: 74.0183,
    chowks: [
      { id: 'Powai Naka', name: 'Powai Naka Chowk (पोवई नाका)', lat: 17.6842, lng: 74.0125 },
      { id: 'Rajwada', name: 'Rajwada Chowk (राजवाडा)', lat: 17.6888, lng: 74.0045 },
      { id: 'MIDC Satara', name: 'Old MIDC (सातारा एमआयडीसी)', lat: 17.6710, lng: 74.0320 }
    ]
  },
  {
    id: 'Sangli',
    name: 'Sangli',
    nameMr: 'सांगली',
    division: 'western',
    divisionMr: 'पश्चिम महाराष्ट्र',
    lat: 16.8524,
    lng: 74.5815,
    chowks: [
      { id: 'Sangli Bus Stand', name: 'ST Stand Chowk (एसटी स्टँड नाका)', lat: 16.8550, lng: 74.5780 },
      { id: 'Vishrambag', name: 'Vishrambag (विश्रामबाग)', lat: 16.8480, lng: 74.6020 },
      { id: 'Kupwad MIDC', name: 'Kupwad MIDC (कुपवाड नाका)', lat: 16.8720, lng: 74.6310 }
    ]
  },
  {
    id: 'Solapur',
    name: 'Solapur',
    nameMr: 'सोलापूर',
    division: 'western',
    divisionMr: 'पश्चिम महाराष्ट्र',
    lat: 17.6599,
    lng: 75.9064,
    chowks: [
      { id: 'Saat Rasta', name: 'Saat Rasta Chowk (सात रस्ता नाका)', lat: 17.6620, lng: 75.9040 },
      { id: 'Juma Patti', name: 'Juma Patti Chowk (जुम्मा पट्टी)', lat: 17.6715, lng: 75.9180 },
      { id: 'MIDC Solapur', name: 'Chhatrapati Shivaji MIDC (एमआयडीसी)', lat: 17.6410, lng: 75.8920 }
    ]
  },

  // --- Konkan & Mumbai MMR ---
  {
    id: 'Mumbai',
    name: 'Mumbai',
    nameMr: 'मुंबई',
    division: 'konkan',
    divisionMr: 'कोकण व मुंबई',
    lat: 19.0178,
    lng: 72.8478,
    chowks: [
      { id: 'Dadar Chowk', name: 'Dadar TT Chowk (दादर टीटी नाका)', lat: 19.0178, lng: 72.8478 },
      { id: 'Kurla West', name: 'Kurla Station Naka (कुर्ला नाका)', lat: 19.0726, lng: 72.8845 },
      { id: 'Andheri East', name: 'Andheri Chakala Naka (अंधेरी चकाला)', lat: 19.1136, lng: 72.8697 },
      { id: 'Borivali', name: 'Borivali West Station (बोरिवली नाका)', lat: 19.2307, lng: 72.8567 }
    ]
  },
  {
    id: 'Thane',
    name: 'Thane',
    nameMr: 'ठाणे',
    division: 'konkan',
    divisionMr: 'कोकण व मुंबई',
    lat: 19.2183,
    lng: 72.9781,
    chowks: [
      { id: 'Thane Station', name: 'Thane Station Naka (ठाणे स्टेशन नाका)', lat: 19.1860, lng: 72.9759 },
      { id: 'Majiwada', name: 'Majiwada Junction (माजीवडा)', lat: 19.2180, lng: 72.9860 },
      { id: 'Ghodbunder', name: 'Ghodbunder Naka (घोडबंदर)', lat: 19.2610, lng: 72.9620 }
    ]
  },
  {
    id: 'Navi Mumbai',
    name: 'Navi Mumbai',
    nameMr: 'नवी मुंबई',
    division: 'konkan',
    divisionMr: 'कोकण व मुंबई',
    lat: 19.0330,
    lng: 73.0297,
    chowks: [
      { id: 'Vashi', name: 'Vashi Plaza Chowk (वाशी प्लाझा)', lat: 19.0771, lng: 72.9986 },
      { id: 'APMC Market', name: 'Turbhe APMC Naka (तुर्भे एपीएमसी नाका)', lat: 19.0830, lng: 73.0180 },
      { id: 'Nerul', name: 'Nerul LP Naka (नेरूळ एलपी नाका)', lat: 19.0350, lng: 73.0190 }
    ]
  },

  // --- Marathwada ---
  {
    id: 'Chhatrapati Sambhajinagar',
    name: 'Chh. Sambhajinagar',
    nameMr: 'छत्रपती संभाजीनगर',
    division: 'marathwada',
    divisionMr: 'मराठवाडा',
    lat: 19.8762,
    lng: 75.3433,
    chowks: [
      { id: 'Kranti Chowk', name: 'Kranti Chowk (क्रांती चौक - मुख्य नाका)', lat: 19.8762, lng: 75.3433 },
      { id: 'CIDCO', name: 'CIDCO Cannaught (सिडको नाका)', lat: 19.8824, lng: 75.3610 },
      { id: 'Waluj MIDC', name: 'Waluj MIDC Naka (वाळूज एमआयडीसी)', lat: 19.8450, lng: 75.2410 },
      { id: 'Railway Station', name: 'Station Road Chowk (रेल्वे स्टेशन चौक)', lat: 19.8650, lng: 75.3190 }
    ]
  },
  {
    id: 'Nanded',
    name: 'Nanded',
    nameMr: 'नांदेड',
    division: 'marathwada',
    divisionMr: 'मराठवाडा',
    lat: 19.1383,
    lng: 77.3210,
    chowks: [
      { id: 'Shivaji Chowk', name: 'Chhatrapati Shivaji Chowk (शिवाजी चौक)', lat: 19.1530, lng: 77.3190 },
      { id: 'Workshop Naka', name: 'Workshop Naka (वर्कशॉप नाका)', lat: 19.1620, lng: 77.3080 },
      { id: 'Taroda Naka', name: 'Taroda Naka (तरोडा नाका)', lat: 19.1780, lng: 77.3340 }
    ]
  },
  {
    id: 'Latur',
    name: 'Latur',
    nameMr: 'लातूर',
    division: 'marathwada',
    divisionMr: 'मराठवाडा',
    lat: 18.4088,
    lng: 76.5604,
    chowks: [
      { id: 'Gandhi Chowk', name: 'Gandhi Chowk (गांधी चौक - मजूर नाका)', lat: 18.4088, lng: 76.5604 },
      { id: 'Ausa Road', name: 'Ausa Road Chowk (औसा रोड)', lat: 18.3980, lng: 76.5720 },
      { id: 'MIDC Latur', name: 'MIDC Additional (लातूर एमआयडीसी)', lat: 18.4310, lng: 76.5920 }
    ]
  },

  // --- Vidarbha ---
  {
    id: 'Nagpur',
    name: 'Nagpur',
    nameMr: 'नागपूर',
    division: 'vidarbha',
    divisionMr: 'विदर्भ',
    lat: 21.1458,
    lng: 79.0882,
    chowks: [
      { id: 'Sitabuldi', name: 'Sitabuldi Chowk (सीताबर्डी नाका)', lat: 21.1458, lng: 79.0882 },
      { id: 'Cotton Market', name: 'Cotton Market Naka (कॉटन मार्केट नाका)', lat: 21.1415, lng: 79.0960 },
      { id: 'Hingna MIDC', name: 'Hingna MIDC Chowk (हिंगणा एमआयडीसी)', lat: 21.1120, lng: 78.9940 },
      { id: 'Dharampeth', name: 'Dharampeth Chowk (धरमपेठ)', lat: 21.1490, lng: 79.0620 }
    ]
  },
  {
    id: 'Amravati',
    name: 'Amravati',
    nameMr: 'अमरावती',
    division: 'vidarbha',
    divisionMr: 'विदर्भ',
    lat: 20.9374,
    lng: 77.7796,
    chowks: [
      { id: 'Rajkamal Chowk', name: 'Rajkamal Chowk (राजकमल चौक - मजूर नाका)', lat: 20.9374, lng: 77.7796 },
      { id: 'Badnera', name: 'Badnera Naka (बडनेरा नाका)', lat: 20.8650, lng: 77.7290 },
      { id: 'MIDC Amravati', name: 'MIDC Nandgaon Peth (नांदगाव पेठ नाका)', lat: 21.0110, lng: 77.8320 }
    ]
  },

  // --- North Maharashtra (Khandesh) ---
  {
    id: 'Nashik',
    name: 'Nashik',
    nameMr: 'नाशिक',
    division: 'north',
    divisionMr: 'उत्तर महाराष्ट्र',
    lat: 19.9975,
    lng: 73.7898,
    chowks: [
      { id: 'CBS Naka', name: 'CBS Chowk (मध्यवर्ती बसस्थानक नाका)', lat: 19.9975, lng: 73.7898 },
      { id: 'Panchavati', name: 'Panchavati Karanja (पंचवटी कारंजा नाका)', lat: 20.0112, lng: 73.7925 },
      { id: 'Satpur MIDC', name: 'Satpur MIDC (सातपूर एमआयडीसी)', lat: 19.9860, lng: 73.7420 },
      { id: 'Ambad MIDC', name: 'Ambad MIDC Naka (अंबड एमआयडीसी)', lat: 19.9480, lng: 73.7310 }
    ]
  },
  {
    id: 'Jalgaon',
    name: 'Jalgaon',
    nameMr: 'जळगाव',
    division: 'north',
    divisionMr: 'उत्तर महाराष्ट्र',
    lat: 21.0077,
    lng: 75.5626,
    chowks: [
      { id: 'Tower Chowk', name: 'Tower Chowk (टॉवर चौक - मुख्य मजूर नाका)', lat: 21.0077, lng: 75.5626 },
      { id: 'MIDC Jalgaon', name: 'MIDC Ajanta Road (अजिंठा रोड एमआयडीसी)', lat: 21.0310, lng: 75.5890 }
    ]
  }
];

// Calculate Haversine distance in km
export function getHaversineDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 4.5;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = Math.round(R * c * 10) / 10;
  return isNaN(dist) ? 4.5 : dist;
}

// Find closest Maharashtra district from any GPS coordinates
export function findClosestDistrict(lat, lng) {
  let closest = MAHARASHTRA_DISTRICTS[0];
  let minDistance = Infinity;

  for (const dist of MAHARASHTRA_DISTRICTS) {
    const d = getHaversineDistanceKm(lat, lng, dist.lat, dist.lng);
    if (d < minDistance) {
      minDistance = d;
      closest = dist;
    }
  }

  return { district: closest, distanceKm: minDistance };
}
