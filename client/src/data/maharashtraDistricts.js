// Maharashtra Divisions, Districts, Coordinates and Famous Labor Chowks
// Powering statewide launch across 36 districts

export const MAHARASHTRA_DIVISIONS = [
  { id: 'all', name: 'All Maharashtra', nameMr: 'संपूर्ण महाराष्ट्र' },
  { id: 'western', name: 'Western Maharashtra', nameMr: 'पश्चिम महाराष्ट्र' },
  { id: 'konkan', name: 'Konkan & Mumbai MMR', nameMr: 'कोकण व मुंबई' },
  { id: 'marathwada', name: 'Marathwada', nameMr: 'मराठवाडा' },
  { id: 'vidarbha', name: 'Vidarbha', nameMr: 'विदर्भ' },
  { id: 'north', name: 'North Maharashtra', nameMr: 'उत्तर महाराष्ट्र' }
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
      { id: 'Swargate', name: 'Swargate Chowk (स्वारगेट नाका)' },
      { id: 'Kothrud', name: 'Kothrud (कोथरूड)' },
      { id: 'Pimpri', name: 'Pimpri-Chinchwad (पिंपरी-चिंचवड)' },
      { id: 'Hadapsar', name: 'Hadapsar (हडपसर)' },
      { id: 'Katraj', name: 'Katraj Naka (कात्रज नाका)' },
      { id: 'Baner', name: 'Baner (बाणेर)' },
      { id: 'Bhosari', name: 'Bhosari MIDC (भोसरी)' },
      { id: 'Wakad', name: 'Wakad (वाकड)' }
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
      { id: 'Bindu Chowk', name: 'Bindu Chowk (बिंदू चौक - मुख्य मजूर नाका)' },
      { id: 'Rajarampuri', name: 'Rajarampuri (राजारामपुरी)' },
      { id: 'Shahupuri', name: 'Shahupuri (शाहूपुरी)' },
      { id: 'Tarabai Park', name: 'Tarabai Park (ताराबाई पार्क)' },
      { id: 'Rankala Chowk', name: 'Rankala Chowk (रंकाळा चौक)' },
      { id: 'Shiroli MIDC', name: 'Shiroli MIDC (शिरोली नाका)' },
      { id: 'Gandhinagar', name: 'Gandhinagar (गांधीनगर)' }
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
      { id: 'Powai Naka', name: 'Powai Naka Chowk (पोवई नाका)' },
      { id: 'Rajwada', name: 'Rajwada Chowk (राजवाडा)' },
      { id: 'MIDC Satara', name: 'Old MIDC (सातारा एमआयडीसी)' }
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
      { id: 'Sangli Bus Stand', name: 'ST Stand Chowk (एसटी स्टँड नाका)' },
      { id: 'Vishrambag', name: 'Vishrambag (विश्रामबाग)' },
      { id: 'Kupwad MIDC', name: 'Kupwad MIDC (कुपवाड नाका)' }
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
      { id: 'Saat Rasta', name: 'Saat Rasta Chowk (सात रस्ता नाका)' },
      { id: 'Juma Patti', name: 'Juma Patti Chowk (जुम्मा पट्टी)' },
      { id: 'MIDC Solapur', name: 'MIDC Industrial Chowk (एमआयडीसी नाका)' }
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
      { id: 'Dadar Chowk', name: 'Dadar TT Chowk (दादर टीटी नाका)' },
      { id: 'Kurla West', name: 'Kurla Station Naka (कुर्ला नाका)' },
      { id: 'Andheri East', name: 'Andheri Chakala (अंधेरी चकाला नाका)' },
      { id: 'Borivali', name: 'Borivali Station (बोरिवली नाका)' }
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
      { id: 'Thane Station', name: 'Thane Station Naka (ठाणे स्टेशन नाका)' },
      { id: 'Majiwada', name: 'Majiwada Junction (माजीवडा)' },
      { id: 'Ghodbunder', name: 'Ghodbunder Naka (घोडबंदर नाका)' }
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
      { id: 'Vashi', name: 'Vashi Plaza Chowk (वाशी प्लाझा)' },
      { id: 'APMC Market', name: 'Turbhe APMC Naka (तुर्भे एपीएमसी नाका)' },
      { id: 'Nerul', name: 'Nerul LP Naka (नेरूळ एलपी नाका)' }
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
      { id: 'Kranti Chowk', name: 'Kranti Chowk (क्रांती चौक - मुख्य नाका)' },
      { id: 'CIDCO', name: 'CIDCO Cannaught (सिडको नाका)' },
      { id: 'Waluj MIDC', name: 'Waluj MIDC Naka (वाळूज एमआयडीसी)' },
      { id: 'Railway Station', name: 'Station Road Chowk (रेल्वे स्टेशन चौक)' }
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
      { id: 'Shivaji Chowk', name: 'Chhatrapati Shivaji Chowk (शिवाजी चौक)' },
      { id: 'Workshop Naka', name: 'Workshop Naka (वर्कशॉप नाका)' },
      { id: 'Taroda Naka', name: 'Taroda Naka (तरोडा नाका)' }
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
      { id: 'Gandhi Chowk', name: 'Gandhi Chowk (गांधी चौक - मजूर नाका)' },
      { id: 'Ausa Road', name: 'Ausa Road Chowk (औसा रोड)' },
      { id: 'MIDC Latur', name: 'Additional MIDC (लातूर एमआयडीसी)' }
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
      { id: 'Sitabuldi', name: 'Sitabuldi Chowk (सीताबर्डी नाका)' },
      { id: 'Cotton Market', name: 'Cotton Market Naka (कॉटन मार्केट नाका)' },
      { id: 'Hingna MIDC', name: 'Hingna MIDC Chowk (हिंगणा एमआयडीसी)' },
      { id: 'Dharampeth', name: 'Dharampeth Chowk (धरमपेठ)' }
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
      { id: 'Rajkamal Chowk', name: 'Rajkamal Chowk (राजकमल चौक - मजूर नाका)' },
      { id: 'Badnera', name: 'Badnera Naka (बडनेरा नाका)' },
      { id: 'MIDC Amravati', name: 'MIDC Nandgaon Peth (नांदगाव पेठ नाका)' }
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
      { id: 'CBS Naka', name: 'CBS Chowk (मध्यवर्ती बसस्थानक नाका)' },
      { id: 'Panchavati', name: 'Panchavati Karanja (पंचवटी कारंजा नाका)' },
      { id: 'Satpur MIDC', name: 'Satpur MIDC (सातपूर एमआयडीसी)' },
      { id: 'Ambad MIDC', name: 'Ambad MIDC Naka (अंबड एमआयडीसी)' }
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
      { id: 'Tower Chowk', name: 'Tower Chowk (टॉवर चौक - मुख्य मजूर नाका)' },
      { id: 'MIDC Jalgaon', name: 'MIDC Ajanta Road (अजिंठा रोड एमआयडीसी)' }
    ]
  }
];

export function getClientHaversineDistanceKm(lat1, lon1, lat2, lon2) {
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

export function findClosestMaharashtraDistrict(lat, lng) {
  let closest = MAHARASHTRA_DISTRICTS[0];
  let minDistance = Infinity;

  for (const dist of MAHARASHTRA_DISTRICTS) {
    const d = getClientHaversineDistanceKm(lat, lng, dist.lat, dist.lng);
    if (d < minDistance) {
      minDistance = d;
      closest = dist;
    }
  }

  return { district: closest, distanceKm: minDistance };
}
