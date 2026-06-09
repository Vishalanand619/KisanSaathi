require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Scheme = require('../models/Scheme');
const MarketPrice = require('../models/MarketPrice');

const schemes = [
  {
    title: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
    description: 'An initiative by the government of India in which all farmers will get up to ₹6,000 per year as minimum income support.',
    eligibility: 'All landholding farmers families, which have cultivable landholding in their names.',
    benefits: '₹6000 per year in 3 equal installments of ₹2000 directly into bank accounts.',
    category: 'Financial Aid',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    schemeCode: 'PMK-001',
    documents: ['Aadhaar Card', 'Land holding papers', 'Bank account details'],
    helpline: '155261 / 011-24300606',
    website: 'https://pmkisan.gov.in/',
    deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  },
  {
    title: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    description: 'A comprehensive crop insurance scheme to provide insurance coverage and financial support to the farmers in the event of failure of any of the notified crops as a result of natural calamities, pests & diseases.',
    eligibility: 'All farmers growing notified crops in a notified area during the season who have insurable interest in the crop are eligible.',
    benefits: 'Comprehensive insurance cover against crop loss. Premium paid by farmers is very low (2% for Kharif, 1.5% for Rabi, 5% for commercial/horticultural crops).',
    category: 'Insurance',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    schemeCode: 'PMFBY-002',
    documents: ['Identity Proof (Aadhaar/PAN)', 'Address Proof', 'Crop Sowing Certificate/Land Records', 'Bank Passbook'],
    helpline: '14447',
    website: 'https://pmfby.gov.in/',
    deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  },
  {
    title: 'Kisan Credit Card (KCC)',
    description: 'The scheme aims at providing adequate and timely credit support from the banking system under a single window with flexible and simplified procedure to the farmers for their cultivation and other needs.',
    eligibility: 'All farmers-individuals / Joint borrowers who are owner cultivators, tenant farmers, oral lessees and share croppers.',
    benefits: 'Credit limit based on operational land holding, cropping pattern and scale of finance. Low interest rates with subvention for prompt repayment.',
    category: 'Credit',
    ministry: 'Department of Financial Services / NABARD',
    schemeCode: 'KCC-003',
    documents: ['Duly filled application form', 'Identity proof (Voter ID/Aadhaar/PAN)', 'Address proof', 'Land documents'],
    helpline: '1800-111-365',
    deadline: null
  },
  {
    title: 'Paramparagat Krishi Vikas Yojana (PKVY)',
    description: 'An extended component of Soil Health Management (SHM) under NMSA. It aims at supporting and promoting organic farming through cluster approach and PGS certification.',
    eligibility: 'Farmers willing to adopt organic farming in clusters. A cluster of 50 or more farmers having 50 acre land is required.',
    benefits: 'Financial assistance of ₹50,000 per hectare for 3 years, out of which ₹31,000 is directly provided for organic inputs.',
    category: 'Subsidy',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    schemeCode: 'PKVY-004',
    documents: ['Aadhaar Card', 'Land ownership documents', 'Bank account details', 'Cluster formation undertaking'],
    website: 'https://pgsindia-ncof.gov.in/',
    deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  },
  {
    title: 'Sub-Mission on Agricultural Mechanization (SMAM)',
    description: 'Promotes agricultural mechanization among small and marginal farmers and in areas where availability of farm power is low.',
    eligibility: 'All farmers are eligible. Special preference to small/marginal farmers, women, and SC/ST farmers.',
    benefits: 'Subsidy up to 40-50% for purchase of agricultural machinery like tractors, rotavators, power tillers, etc.',
    category: 'Subsidy',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    schemeCode: 'SMAM-005',
    documents: ['Aadhaar Card', 'Passport size photo', 'Right to Record (RoR) / Land details', 'Bank Passbook copy', 'Caste Certificate (if applicable)'],
    website: 'https://agrimachinery.nic.in/',
    deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  },
  {
    title: 'Pradhan Mantri Krishi Sinchayee Yojana (PMKSY)',
    description: 'Aims to improve farm productivity and ensure better utilization of the resources in the country through micro-irrigation and water conservation.',
    eligibility: 'All farmers, especially those dependent on rain-fed agriculture.',
    benefits: 'Subsidy on micro-irrigation setups like drip and sprinkler irrigation (up to 55% for small/marginal farmers).',
    category: 'Subsidy',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    schemeCode: 'PMKSY-006',
    documents: ['Aadhaar Card', 'Land holding papers', 'Quotation from registered dealer', 'Bank details'],
    website: 'https://pmksy.gov.in/',
    deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  },
  {
    title: 'National Agriculture Market (e-NAM)',
    description: 'A pan-India electronic trading portal which networks the existing APMC mandis to create a unified national market for agricultural commodities.',
    eligibility: 'Farmers, Traders, and FPOs registered with APMC mandis.',
    benefits: 'Transparent online trading, better price discovery, and direct payment to bank accounts.',
    category: 'Training', // Or 'Other'
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    schemeCode: 'ENAM-007',
    documents: ['Aadhaar Card', 'Bank account details', 'Mobile Number'],
    helpline: '1800-270-0224',
    website: 'https://enam.gov.in/',
    deadline: null
  },
  {
    title: 'Rashtriya Krishi Vikas Yojana (RKVY)',
    description: 'Incentivizes States to increase public investment in Agriculture & allied sectors to ensure inclusive and maximized agricultural growth.',
    eligibility: 'State Governments formulate projects; farmers benefit from state-level implementations and subsidies.',
    benefits: 'Support for infrastructure, crop development, and asset building at the local level.',
    category: 'Subsidy',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    schemeCode: 'RKVY-008',
    documents: ['As per specific state guidelines'],
    website: 'https://rkvy.nic.in/',
    deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  },
  {
    title: 'Mission for Integrated Development of Horticulture (MIDH)',
    description: 'Promotes holistic growth of the horticulture sector encompassing fruits, vegetables, root & tuber crops, mushrooms, spices, flowers, and coconut.',
    eligibility: 'Farmers growing horticultural crops, FPOs, and state agricultural departments.',
    benefits: 'Financial assistance for planting material, micro-irrigation, cold chain infrastructure, and post-harvest management.',
    category: 'Financial Aid',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    schemeCode: 'MIDH-009',
    documents: ['Aadhaar Card', 'Land ownership proof', 'Project proposal (for infrastructure)'],
    website: 'https://midh.gov.in/',
    deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  },
  {
    title: 'National Bamboo Mission (NBM)',
    description: 'Aims to increase the area under bamboo plantation in non-forest Government and private lands to supplement farm income.',
    eligibility: 'Farmers willing to cultivate bamboo, artisans, and entrepreneurs in the bamboo sector.',
    benefits: 'Assistance of ₹50,000 per hectare for bamboo cultivation, plus support for processing units.',
    category: 'Subsidy',
    ministry: 'Ministry of Agriculture & Farmers Welfare',
    schemeCode: 'NBM-010',
    documents: ['Aadhaar Card', 'Land holding documents', 'Bank account details'],
    website: 'https://nbm.nic.in/',
    deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
  }
];

const marketPrices = [
  { crop: 'Wheat', price: 2350, unit: 'quintal', market: 'Azadpur Mandi', state: 'Delhi', minPrice: 2200, maxPrice: 2400 },
  { crop: 'Wheat', price: 2275, unit: 'quintal', market: 'Karnal Mandi', state: 'Haryana', minPrice: 2150, maxPrice: 2350 },
  { crop: 'Rice (Paddy)', price: 2500, unit: 'quintal', market: 'Ludhiana Mandi', state: 'Punjab', minPrice: 2400, maxPrice: 2600 },
  { crop: 'Rice (Paddy)', price: 2450, unit: 'quintal', market: 'Karnal Mandi', state: 'Haryana', minPrice: 2350, maxPrice: 2550 },
  { crop: 'Onion', price: 1800, unit: 'quintal', market: 'Lasalgaon', state: 'Maharashtra', minPrice: 1500, maxPrice: 2200 },
  { crop: 'Onion', price: 1950, unit: 'quintal', market: 'Azadpur Mandi', state: 'Delhi', minPrice: 1600, maxPrice: 2300 },
  { crop: 'Tomato', price: 3200, unit: 'quintal', market: 'Kolar', state: 'Karnataka', minPrice: 2800, maxPrice: 3800 },
  { crop: 'Tomato', price: 3400, unit: 'quintal', market: 'Azadpur Mandi', state: 'Delhi', minPrice: 2900, maxPrice: 4000 },
  { crop: 'Cotton', price: 7100, unit: 'quintal', market: 'Rajkot', state: 'Gujarat', minPrice: 6800, maxPrice: 7500 },
  { crop: 'Cotton', price: 7250, unit: 'quintal', market: 'Bhatinda', state: 'Punjab', minPrice: 7000, maxPrice: 7600 },
  { crop: 'Soybean', price: 4600, unit: 'quintal', market: 'Indore', state: 'Madhya Pradesh', minPrice: 4400, maxPrice: 4800 },
  { crop: 'Soybean', price: 4750, unit: 'quintal', market: 'Latur', state: 'Maharashtra', minPrice: 4500, maxPrice: 4900 },
  { crop: 'Potato', price: 1200, unit: 'quintal', market: 'Agra', state: 'Uttar Pradesh', minPrice: 1000, maxPrice: 1400 },
  { crop: 'Potato', price: 1350, unit: 'quintal', market: 'Azadpur Mandi', state: 'Delhi', minPrice: 1100, maxPrice: 1550 },
  { crop: 'Sugarcane', price: 315, unit: 'quintal', market: 'Meerut', state: 'Uttar Pradesh', minPrice: 315, maxPrice: 315 },
  { crop: 'Maize', price: 1960, unit: 'quintal', market: 'Gulbarga', state: 'Karnataka', minPrice: 1850, maxPrice: 2050 }
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb+srv://anandvishal999999_db_user:MYLwqhmE7GoirDzV@cluster0.qj9s1rg.mongodb.net/kisansaathi';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected...');
    
    await Scheme.deleteMany();
    console.log('Existing schemes removed.');
    
    await MarketPrice.deleteMany();
    console.log('Existing market prices removed.');
    
    await Scheme.insertMany(schemes);
    console.log('Schemes seeded successfully!');
    
    await MarketPrice.insertMany(marketPrices);
    console.log('Market prices seeded successfully!');
    
    process.exit();
  } catch (err) {
    console.error('Error with data import:', err);
    process.exit(1);
  }
};

seedDB();
