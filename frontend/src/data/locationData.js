// ================================================================
// GRAMA MITRA — Location & Officer Scoped Dataset
// Tamil Nadu Administrative Structure: District -> Block -> Village
// ================================================================

export const LOCATION_DATA = {
  Thanjavur: {
    blocks: {
      Kumbakonam: ['Kovilur', 'Ammapettai', 'Melattur', 'Sathanur', 'Dharasuram'],
      Pattukkottai: ['Tiruchitrambalam', 'Peravurani', 'Adirampattinam', 'Kallaperambur'],
      Orathanadu: ['Vadavoor', 'Kannanthangudi', 'Pappanad', 'Tiruvonam'],
      Thiruvaiyaru: ['Kandiyur', 'Tiruchattrurai', 'Tiruppanthuruthi', 'Tiruchopuram'],
    },
  },
  Madurai: {
    blocks: {
      Melur: ['Kottampatti', 'Vellalur', 'Naviniyatti', 'Uranganpatti'],
      Vadipatti: ['Alanganallur', 'Palamedu', 'Sholavandan', 'Konnapatti'],
      Thirumangalam: ['Kallikudi', 'T.Kallupatti', 'Karisalkulam', 'Sinduputhur'],
    },
  },
  Coimbatore: {
    blocks: {
      Pollachi: ['Anaimalai', 'Negamam', 'Kinathukadavu', 'Zamin Uthukuli'],
      Thondamuthur: ['Velliangiri', 'Narasipuram', 'Alandurai', 'Booluvampatti'],
    },
  },
  Salem: {
    blocks: {
      Attur: ['Thalaivasal', 'Peddanaickenpalayam', 'Gangavalli', 'Mallur'],
      Omalur: ['Mecheri', 'Kadayampatti', 'Taramangalam', 'Kamalapuram'],
    },
  },
  Cuddalore: {
    blocks: {
      Chidambaram: ['Annamalai Nagar', 'Parangipettai', 'Bhuvanagiri', 'Killai'],
      Panruti: ['Nellikuppam', 'Kadampuliyur', 'Kavanthur', 'Melpattambakkam'],
    },
  },
  Tiruchirappalli: {
    blocks: {
      Lalgudi: ['Poovalur', 'Pullambadi', 'Manachanallur', 'Anbil'],
      Musiri: ['Thottiyam', 'Thuraiyur', 'Moovanur', 'Kattuputhur'],
    },
  },
};

export function getDistricts() {
  return Object.keys(LOCATION_DATA);
}

export function getBlocks(district) {
  if (!district || !LOCATION_DATA[district]) return [];
  return Object.keys(LOCATION_DATA[district].blocks);
}

export function getVillages(district, block) {
  if (!district || !block || !LOCATION_DATA[district] || !LOCATION_DATA[district].blocks[block]) return [];
  return LOCATION_DATA[district].blocks[block];
}

// ── Realistic Data Sets for Officer Dashboards ──

export const VILLAGES_MASTER = [
  { id: 'v-01', name: 'Kovilur', block: 'Kumbakonam', district: 'Thanjavur', totalFarmers: 420, activeRequests: 14, officerName: 'Agriculture Officer R. Sundaram', status: 'Active Monitoring' },
  { id: 'v-02', name: 'Ammapettai', block: 'Kumbakonam', district: 'Thanjavur', totalFarmers: 380, activeRequests: 8, officerName: 'Assistant AO K. Meena', status: 'Normal' },
  { id: 'v-03', name: 'Melattur', block: 'Kumbakonam', district: 'Thanjavur', totalFarmers: 290, activeRequests: 19, officerName: 'AO M. Selvam', status: 'Alert: Pest Warning' },
  { id: 'v-04', name: 'Sathanur', block: 'Kumbakonam', district: 'Thanjavur', totalFarmers: 310, activeRequests: 5, officerName: 'AO P. Rajan', status: 'Normal' },
  { id: 'v-05', name: 'Dharasuram', block: 'Kumbakonam', district: 'Thanjavur', totalFarmers: 250, activeRequests: 11, officerName: 'Assistant AO V. Lakshmi', status: 'Active Monitoring' },
];

export const DEMO_FARMERS = [
  { id: 'f-101', name: 'K. Ramasamy', village: 'Kovilur', block: 'Kumbakonam', district: 'Thanjavur', phone: '+91 98421 44510', landSize: '3.5 Acres', crop: 'Paddy (CO-51)', status: 'Active', pmKisan: 'Approved', kcc: 'Issued' },
  { id: 'f-102', name: 'M. Palanisamy', village: 'Kovilur', block: 'Kumbakonam', district: 'Thanjavur', phone: '+91 97892 11029', landSize: '5.0 Acres', crop: 'Sugarcane (CO-86032)', status: 'Active', pmKisan: 'Approved', kcc: 'Pending' },
  { id: 'f-103', name: 'S. Dhanalakshmi', village: 'Kovilur', block: 'Kumbakonam', district: 'Thanjavur', phone: '+91 94433 88120', landSize: '2.0 Acres', crop: 'Banana (Grand Naine)', status: 'Needs Assistance', pmKisan: 'Under Review', kcc: 'Issued' },
  { id: 'f-104', name: 'V. Murugan', village: 'Kovilur', block: 'Kumbakonam', district: 'Thanjavur', phone: '+91 99401 55321', landSize: '4.2 Acres', crop: 'Paddy (ADT-45)', status: 'Active', pmKisan: 'Approved', kcc: 'Issued' },
  { id: 'f-105', name: 'T. Kannan', village: 'Kovilur', block: 'Kumbakonam', district: 'Thanjavur', phone: '+91 98940 77210', landSize: '1.8 Acres', crop: 'Cotton', status: 'Pest Alert', pmKisan: 'Approved', kcc: 'Not Applied' },
  { id: 'f-106', name: 'A. Arumugam', village: 'Melattur', block: 'Kumbakonam', district: 'Thanjavur', phone: '+91 97880 33412', landSize: '6.0 Acres', crop: 'Paddy & Pulses', status: 'Pest Alert', pmKisan: 'Approved', kcc: 'Issued' },
];

export const DEMO_AGRI_ISSUES = [
  { id: 'iss-01', title: 'Yellow Leaf Spot & Blast Symptoms in Paddy', village: 'Kovilur', block: 'Kumbakonam', severity: 'High', date: '2026-09-18', affectedArea: '42 Acres', status: 'Advisory Sent', treatment: 'Tricyclazole 75% WP @ 1g/L spray recommended.' },
  { id: 'iss-02', title: 'Brown Plant Hopper (BPH) Infestation', village: 'Melattur', block: 'Kumbakonam', severity: 'Emergency', date: '2026-09-19', affectedArea: '68 Acres', status: 'Field Officer Inspection', treatment: 'Buprofezin 25% SC @ 1.25 ml/L & field drainage.' },
  { id: 'iss-03', title: 'Iron Deficiency Chlorosis in Nursery', village: 'Kovilur', block: 'Kumbakonam', severity: 'Medium', date: '2026-09-17', affectedArea: '15 Acres', status: 'Resolved', treatment: '0.5% Ferrous Sulfate + 0.1% Citric Acid spray applied.' },
  { id: 'iss-04', title: 'Sugarcane Top Shoot Borer Warning', village: 'Sathanur', block: 'Kumbakonam', severity: 'Low', date: '2026-09-15', affectedArea: '20 Acres', status: 'Monitoring', treatment: 'Release of Trichogramma chilonis parasitoide.' },
];

export const DEMO_SCHEME_REQUESTS = [
  { id: 'sr-01', farmerName: 'K. Ramasamy', village: 'Kovilur', scheme: 'PM-KISAN installment verification', date: '2026-09-19', status: 'Verified', docStatus: 'Patta & eKYC Complete' },
  { id: 'sr-02', farmerName: 'S. Dhanalakshmi', village: 'Kovilur', scheme: 'PMFBY Crop Insurance Claim (Kharif)', date: '2026-09-18', status: 'Under Field Inspection', docStatus: 'Adangal Uploaded' },
  { id: 'sr-03', farmerName: 'M. Palanisamy', village: 'Kovilur', scheme: 'Kisan Credit Card (KCC) Loan Subvention', date: '2026-09-17', status: 'Pending Approval', docStatus: 'Bank NOC Awaited' },
  { id: 'sr-04', farmerName: 'A. Arumugam', village: 'Melattur', scheme: 'Drip Irrigation Subsidized Kit (PMKSY)', date: '2026-09-16', status: 'Approved', docStatus: '100% Subsidy Sanctioned' },
];
