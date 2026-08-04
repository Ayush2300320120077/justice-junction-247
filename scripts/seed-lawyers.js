/**
 * seed-lawyers.js
 * ───────────────────────────────────────────────────────────────────────────────
 * One-time script to insert 28 realistic demo lawyer profiles for stakeholder demos.
 * Run manually:  node seed-lawyers.js
 * Idempotent:    Skips insert if isSeedData lawyers already exist (won't duplicate).
 * Removable:     `db.lawyers.deleteMany({ isSeedData: true })` removes only seeded data.
 * ───────────────────────────────────────────────────────────────────────────────
 *
 * Confirmed schema fields (models/Lawyer.js):
 *   REQUIRED: user (ObjectId), name, email, barRegistrationNumber (unique), experience, city, state, consultationFee
 *   ENUM experienceLevel: 'junior' | 'mid' | 'senior'
 *   ENUM verificationStatus: 'pending' | 'verified' | 'rejected'
 *   ENUM subscription: 'free' | 'basic' | 'pro' | 'elite'
 *   ENUM gender: 'Male' | 'Female' | 'Other' | 'Prefer not to say'
 *
 * Bar Registration format per actual Indian Bar Council conventions:
 *   State High Court Bars: <StateCode>/<SerialNo>/<Year>  e.g. D/1247/2015 (Delhi Bar Council)
 *   Reference: https://www.barcouncilofindia.org/about/enrolled-advocates
 */

'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Lawyer = require('../models/Lawyer');

// ─── Real Indian Bar Council state codes (per BCI records) ────────────────────
const BAR_STATE_CODES = {
  'Delhi':         'D',
  'Maharashtra':   'MH',
  'Karnataka':     'KA',
  'Tamil Nadu':    'TN',
  'West Bengal':   'WB',
  'Telangana':     'TS',
  'Gujarat':       'GJ',
  'Rajasthan':     'RJ',
  'Uttar Pradesh': 'UP',
  'Kerala':        'KL',
  'Madhya Pradesh':'MP',
  'Punjab':        'PB',
  'Haryana':       'HR',
  'Bihar':         'BR',
  'Assam':         'AS'
};

function barNumber(state, year, serial) {
  const code = BAR_STATE_CODES[state] || 'BCI';
  return `${code}/${serial}/${year}`;
}

// ─── 28 hand-crafted, realistic lawyer profiles ───────────────────────────────
// Photos: randomuser.me returns real-looking AI portrait photos by seed (no named individuals)
// Format: https://randomuser.me/api/portraits/{men|women}/{0-99}.jpg
const LAWYERS = [
  {
    name: 'Adv. Meenakshi Sundaram',
    gender: 'Female',
    email: 'meenakshi.sundaram.adv@seedjj.in',
    phone: '9841223456',
    photo: 'https://randomuser.me/api/portraits/women/34.jpg',
    city: 'Chennai', state: 'Tamil Nadu', pincode: '600017',
    barRegistrationNumber: barNumber('Tamil Nadu', 2009, '3821'),
    yearOfEnrollment: 2009,
    barCouncilState: 'Tamil Nadu',
    specializations: ['Family Law', 'Divorce'],
    experience: 15, experienceLevel: 'senior',
    consultationFee: 3500,
    courts: ['Madras High Court', 'Family Court Chennai'],
    languages: ['Tamil', 'English'],
    bio: 'A seasoned family law practitioner with 15 years handling matrimonial disputes, child custody, and maintenance cases at the Madras High Court. Known for resolving contested divorces through mediation before litigation wherever possible.',
    averageRating: 4.7, totalReviews: 63, totalCases: 310,
    subscription: 'pro',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '10:00 AM', availableTimeTo: '06:00 PM',
    consultationModes: ['In-Person', 'Video Call'],
    designation: 'Partner', currentFirm: 'Sundaram & Associates',
  },
  {
    name: 'Adv. Rohit Bhattacharya',
    gender: 'Male',
    email: 'rohit.bhattacharya.adv@seedjj.in',
    phone: '9830112233',
    photo: 'https://randomuser.me/api/portraits/men/45.jpg',
    city: 'Kolkata', state: 'West Bengal', pincode: '700013',
    barRegistrationNumber: barNumber('West Bengal', 2006, '1142'),
    yearOfEnrollment: 2006,
    barCouncilState: 'West Bengal',
    specializations: ['Criminal Defence', 'Bail & FIR'],
    experience: 18, experienceLevel: 'senior',
    consultationFee: 4200,
    courts: ['Calcutta High Court', 'Sessions Court Kolkata'],
    languages: ['Bengali', 'English', 'Hindi'],
    bio: 'Criminal defence specialist at the Calcutta High Court with a strong track record in bail applications, NDPS matters, and white-collar crime defence. Former additional public prosecutor turned defence counsel.',
    averageRating: 4.5, totalReviews: 89, totalCases: 412,
    subscription: 'elite',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    availableTimeFrom: '09:00 AM', availableTimeTo: '07:00 PM',
    consultationModes: ['In-Person', 'Phone Call'],
    designation: 'Senior Advocate', currentFirm: 'Bhattacharya Law Chambers',
  },
  {
    name: 'Adv. Kavitha Nair',
    gender: 'Female',
    email: 'kavitha.nair.adv@seedjj.in',
    phone: '9447601234',
    photo: 'https://randomuser.me/api/portraits/women/12.jpg',
    city: 'Kochi', state: 'Kerala', pincode: '682016',
    barRegistrationNumber: barNumber('Kerala', 2014, '5603'),
    yearOfEnrollment: 2014,
    barCouncilState: 'Kerala',
    specializations: ['Consumer Rights', 'Civil Disputes'],
    experience: 10, experienceLevel: 'mid',
    consultationFee: 2000,
    courts: ['Kerala High Court', 'District Consumer Forum Ernakulam'],
    languages: ['Malayalam', 'English'],
    bio: 'Mid-career advocate focused on consumer protection cases — product liability, e-commerce fraud, banking deficiency, and insurance disputes. Has successfully represented clients at both district and state consumer commissions.',
    averageRating: 4.6, totalReviews: 38, totalCases: 145,
    subscription: 'basic',
    availableDays: ['Monday','Wednesday','Friday'],
    availableTimeFrom: '11:00 AM', availableTimeTo: '05:00 PM',
    consultationModes: ['Video Call', 'In-Person'],
    designation: 'Advocate', currentFirm: 'Nair Legal Clinic',
  },
  {
    name: 'Adv. Arjun Mehta',
    gender: 'Male',
    email: 'arjun.mehta.adv@seedjj.in',
    phone: '9820334455',
    photo: 'https://randomuser.me/api/portraits/men/22.jpg',
    city: 'Mumbai', state: 'Maharashtra', pincode: '400021',
    barRegistrationNumber: barNumber('Maharashtra', 2001, '8274'),
    yearOfEnrollment: 2001,
    barCouncilState: 'Maharashtra',
    specializations: ['Corporate Law', 'Taxation'],
    experience: 23, experienceLevel: 'senior',
    consultationFee: 8500,
    courts: ['Bombay High Court', 'NCLT Mumbai'],
    languages: ['English', 'Hindi', 'Marathi'],
    bio: 'Seasoned corporate and tax lawyer advising listed companies, private equity funds, and family offices on M&A transactions, GST disputes, and FEMA compliance. Former associate at a Big 4 legal firm before founding his own practice.',
    averageRating: 4.9, totalReviews: 127, totalCases: 540,
    subscription: 'elite',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '09:30 AM', availableTimeTo: '06:30 PM',
    consultationModes: ['Video Call', 'In-Person', 'Phone Call'],
    designation: 'Managing Partner', currentFirm: 'Mehta & Co. Law Associates',
  },
  {
    name: 'Adv. Preethi Anand',
    gender: 'Female',
    email: 'preethi.anand.adv@seedjj.in',
    phone: '9710456789',
    photo: 'https://randomuser.me/api/portraits/women/56.jpg',
    city: 'Delhi', state: 'Delhi', pincode: '110001',
    barRegistrationNumber: barNumber('Delhi', 2018, '6831'),
    yearOfEnrollment: 2018,
    barCouncilState: 'Delhi',
    specializations: ['Labour Law', 'Civil Disputes'],
    experience: 6, experienceLevel: 'mid',
    consultationFee: 1800,
    courts: ['Delhi High Court', 'Central Administrative Tribunal Delhi'],
    languages: ['Hindi', 'English'],
    bio: 'Employment and labour law advocate assisting workers and employers with wrongful termination, PF/ESIC disputes, and workplace harassment matters. Registered with the Delhi High Court Bar Association since 2018.',
    averageRating: 4.2, totalReviews: 17, totalCases: 72,
    subscription: 'free',
    availableDays: ['Tuesday','Thursday','Friday','Saturday'],
    availableTimeFrom: '10:00 AM', availableTimeTo: '04:00 PM',
    consultationModes: ['Phone Call', 'In-Person'],
    designation: 'Advocate', currentFirm: 'Independent',
  },
  {
    name: 'Adv. Siddharth Reddy',
    gender: 'Male',
    email: 'siddharth.reddy.adv@seedjj.in',
    phone: '9701987654',
    photo: 'https://randomuser.me/api/portraits/men/67.jpg',
    city: 'Hyderabad', state: 'Telangana', pincode: '500082',
    barRegistrationNumber: barNumber('Telangana', 2011, '4422'),
    yearOfEnrollment: 2011,
    barCouncilState: 'Telangana',
    specializations: ['Property Law', 'Civil Disputes'],
    experience: 13, experienceLevel: 'mid',
    consultationFee: 2800,
    courts: ['Telangana High Court', 'Civil Court Hyderabad'],
    languages: ['Telugu', 'English', 'Hindi'],
    bio: 'Property and civil disputes lawyer handling title disputes, encroachment matters, partition suits, and RERA grievances across Telangana. Has represented both individual homebuyers and developers in high-value land disputes.',
    averageRating: 4.4, totalReviews: 51, totalCases: 238,
    subscription: 'basic',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '10:30 AM', availableTimeTo: '06:00 PM',
    consultationModes: ['In-Person', 'Video Call'],
    designation: 'Advocate', currentFirm: 'Reddy Property Law Chambers',
  },
  {
    name: 'Adv. Sunita Chauhan',
    gender: 'Female',
    email: 'sunita.chauhan.adv@seedjj.in',
    phone: '9414789012',
    photo: 'https://randomuser.me/api/portraits/women/28.jpg',
    city: 'Jaipur', state: 'Rajasthan', pincode: '302004',
    barRegistrationNumber: barNumber('Rajasthan', 2007, '2190'),
    yearOfEnrollment: 2007,
    barCouncilState: 'Rajasthan',
    specializations: ['Family Law', 'Criminal Defence', 'Divorce'],
    experience: 17, experienceLevel: 'senior',
    consultationFee: 3000,
    courts: ['Rajasthan High Court', 'Family Court Jaipur', 'Sessions Court'],
    languages: ['Hindi', 'Rajasthani', 'English'],
    bio: 'Versatile senior advocate in Jaipur handling family disputes, criminal matters, and divorce proceedings. Widely trusted in the local community for her practical, empathetic approach and strong courtroom presence at the Rajasthan High Court.',
    averageRating: 4.8, totalReviews: 74, totalCases: 389,
    subscription: 'pro',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    availableTimeFrom: '09:00 AM', availableTimeTo: '07:00 PM',
    consultationModes: ['In-Person', 'Phone Call'],
    designation: 'Senior Advocate', currentFirm: 'Chauhan Legal Services',
  },
  {
    name: 'Adv. Vivek Krishnamurthy',
    gender: 'Male',
    email: 'vivek.krishnamurthy.adv@seedjj.in',
    phone: '9880213344',
    photo: 'https://randomuser.me/api/portraits/men/33.jpg',
    city: 'Bangalore', state: 'Karnataka', pincode: '560025',
    barRegistrationNumber: barNumber('Karnataka', 2016, '7742'),
    yearOfEnrollment: 2016,
    barCouncilState: 'Karnataka',
    specializations: ['Cyber Law', 'Intellectual Property'],
    experience: 8, experienceLevel: 'mid',
    consultationFee: 4500,
    courts: ['Karnataka High Court', 'Cyber Crimes Cell Bangalore'],
    languages: ['Kannada', 'English'],
    bio: 'Technology and IP lawyer advising startups, SaaS companies, and individual creators on data protection, cybercrime defence, trademark registration, and software copyright. One of the younger specialists in DPDP Act compliance in Bangalore.',
    averageRating: 4.7, totalReviews: 29, totalCases: 118,
    subscription: 'pro',
    availableDays: ['Monday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '11:00 AM', availableTimeTo: '07:00 PM',
    consultationModes: ['Video Call', 'In-Person'],
    designation: 'Founding Partner', currentFirm: 'KV Tech Law',
  },
  {
    name: 'Adv. Harpreet Singh Gill',
    gender: 'Male',
    email: 'harpreet.gill.adv@seedjj.in',
    phone: '9815567890',
    photo: 'https://randomuser.me/api/portraits/men/11.jpg',
    city: 'Chandigarh', state: 'Punjab', pincode: '160022',
    barRegistrationNumber: barNumber('Punjab', 2005, '1034'),
    yearOfEnrollment: 2005,
    barCouncilState: 'Punjab',
    specializations: ['Criminal Defence', 'Bail & FIR', 'Labour Law'],
    experience: 19, experienceLevel: 'senior',
    consultationFee: 3800,
    courts: ['Punjab & Haryana High Court', 'Sessions Court Chandigarh'],
    languages: ['Punjabi', 'Hindi', 'English'],
    bio: 'Senior criminal defence lawyer with nearly two decades of practice at the Punjab & Haryana High Court. Specialises in anticipatory bail, NDPS cases, and labour disputes involving industrial units across Punjab and Haryana.',
    averageRating: 4.6, totalReviews: 102, totalCases: 487,
    subscription: 'elite',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '09:00 AM', availableTimeTo: '06:00 PM',
    consultationModes: ['In-Person', 'Phone Call'],
    designation: 'Senior Advocate', currentFirm: 'Gill & Associates',
  },
  {
    name: 'Adv. Shreya Ghosh',
    gender: 'Female',
    email: 'shreya.ghosh.adv@seedjj.in',
    phone: '9831445566',
    photo: 'https://randomuser.me/api/portraits/women/44.jpg',
    city: 'Kolkata', state: 'West Bengal', pincode: '700029',
    barRegistrationNumber: barNumber('West Bengal', 2020, '9011'),
    yearOfEnrollment: 2020,
    barCouncilState: 'West Bengal',
    specializations: ['Consumer Rights', 'Divorce'],
    experience: 4, experienceLevel: 'junior',
    consultationFee: 900,
    courts: ['District Consumer Forum Kolkata', 'Family Court Kolkata'],
    languages: ['Bengali', 'English', 'Hindi'],
    bio: 'Early-career advocate with a postgraduate specialisation in consumer protection law. Currently building her practice at district forums in Kolkata with a particular focus on e-commerce refund disputes and matrimonial matters.',
    averageRating: 4.0, totalReviews: 5, totalCases: 23,
    subscription: 'free',
    availableDays: ['Tuesday','Thursday','Saturday'],
    availableTimeFrom: '12:00 PM', availableTimeTo: '06:00 PM',
    consultationModes: ['Phone Call', 'Video Call'],
    designation: 'Advocate', currentFirm: 'Independent',
  },
  {
    name: 'Adv. Murugan Pillai',
    gender: 'Male',
    email: 'murugan.pillai.adv@seedjj.in',
    phone: '9843312456',
    photo: 'https://randomuser.me/api/portraits/men/78.jpg',
    city: 'Chennai', state: 'Tamil Nadu', pincode: '600003',
    barRegistrationNumber: barNumber('Tamil Nadu', 2003, '2211'),
    yearOfEnrollment: 2003,
    barCouncilState: 'Tamil Nadu',
    specializations: ['Property Law', 'Taxation'],
    experience: 21, experienceLevel: 'senior',
    consultationFee: 5500,
    courts: ['Madras High Court', 'Income Tax Appellate Tribunal Chennai'],
    languages: ['Tamil', 'English'],
    bio: 'Senior property and taxation advocate with over two decades at the Madras High Court. Handles complex property title disputes, stamp duty challenges, and direct tax appeals before the ITAT. Trusted advisor to multiple HNI clients in South India.',
    averageRating: 4.9, totalReviews: 141, totalCases: 592,
    subscription: 'elite',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '10:00 AM', availableTimeTo: '05:30 PM',
    consultationModes: ['In-Person'],
    designation: 'Senior Advocate', currentFirm: 'Pillai Legal House',
  },
  {
    name: 'Adv. Nandita Bose',
    gender: 'Female',
    email: 'nandita.bose.adv@seedjj.in',
    phone: '9830221133',
    photo: 'https://randomuser.me/api/portraits/women/63.jpg',
    city: 'Delhi', state: 'Delhi', pincode: '110065',
    barRegistrationNumber: barNumber('Delhi', 2012, '5513'),
    yearOfEnrollment: 2012,
    barCouncilState: 'Delhi',
    specializations: ['Intellectual Property', 'Corporate Law'],
    experience: 12, experienceLevel: 'mid',
    consultationFee: 6000,
    courts: ['Delhi High Court', 'Intellectual Property Division DHC'],
    languages: ['Hindi', 'English', 'Bengali'],
    bio: 'Intellectual property litigator and transactional IP counsel at the Delhi High Court. Acts for pharmaceutical companies, technology firms, and publishing houses in patent, trademark, and copyright matters. LLM from the National Law School.',
    averageRating: 4.8, totalReviews: 46, totalCases: 203,
    subscription: 'pro',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '09:30 AM', availableTimeTo: '06:00 PM',
    consultationModes: ['Video Call', 'In-Person'],
    designation: 'Partner', currentFirm: 'Bose & Partners',
  },
  {
    name: 'Adv. Faizan Khan',
    gender: 'Male',
    email: 'faizan.khan.adv@seedjj.in',
    phone: '9917345678',
    photo: 'https://randomuser.me/api/portraits/men/55.jpg',
    city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226010',
    barRegistrationNumber: barNumber('Uttar Pradesh', 2013, '6634'),
    yearOfEnrollment: 2013,
    barCouncilState: 'Uttar Pradesh',
    specializations: ['Criminal Defence', 'Bail & FIR', 'Civil Disputes'],
    experience: 11, experienceLevel: 'mid',
    consultationFee: 2200,
    courts: ['Allahabad High Court Lucknow Bench', 'Sessions Court Lucknow'],
    languages: ['Hindi', 'Urdu', 'English'],
    bio: 'Criminal and civil advocate practising at the Allahabad High Court Lucknow Bench. Handles bail matters, FIR quashing petitions, and civil injunctions across Uttar Pradesh with a strong presence in Lucknow district courts.',
    averageRating: 4.3, totalReviews: 34, totalCases: 176,
    subscription: 'basic',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    availableTimeFrom: '10:00 AM', availableTimeTo: '06:30 PM',
    consultationModes: ['In-Person', 'Phone Call'],
    designation: 'Advocate', currentFirm: 'Khan Law Office',
  },
  {
    name: 'Adv. Deepika Venkataraman',
    gender: 'Female',
    email: 'deepika.venkataraman.adv@seedjj.in',
    phone: '9886512345',
    photo: 'https://randomuser.me/api/portraits/women/7.jpg',
    city: 'Bangalore', state: 'Karnataka', pincode: '560001',
    barRegistrationNumber: barNumber('Karnataka', 2019, '8801'),
    yearOfEnrollment: 2019,
    barCouncilState: 'Karnataka',
    specializations: ['Labour Law', 'Corporate Law'],
    experience: 5, experienceLevel: 'junior',
    consultationFee: 1500,
    courts: ['Karnataka High Court', 'Labour Court Bangalore'],
    languages: ['Kannada', 'Tamil', 'English'],
    bio: 'Junior advocate specialising in employment disputes and startup corporate compliance. Works with tech companies and SMEs on employee contracts, POSH compliance, ESOP structures, and termination disputes.',
    averageRating: 3.9, totalReviews: 9, totalCases: 41,
    subscription: 'free',
    availableDays: ['Tuesday','Wednesday','Friday'],
    availableTimeFrom: '11:00 AM', availableTimeTo: '05:00 PM',
    consultationModes: ['Video Call', 'Phone Call'],
    designation: 'Advocate', currentFirm: 'Independent',
  },
  {
    name: 'Adv. Rajendra Singhania',
    gender: 'Male',
    email: 'rajendra.singhania.adv@seedjj.in',
    phone: '9414123456',
    photo: 'https://randomuser.me/api/portraits/men/90.jpg',
    city: 'Jodhpur', state: 'Rajasthan', pincode: '342001',
    barRegistrationNumber: barNumber('Rajasthan', 1998, '0834'),
    yearOfEnrollment: 1998,
    barCouncilState: 'Rajasthan',
    specializations: ['Corporate Law', 'Property Law', 'Taxation'],
    experience: 26, experienceLevel: 'senior',
    consultationFee: 7000,
    courts: ['Rajasthan High Court Jodhpur', 'NCLT Jaipur'],
    languages: ['Hindi', 'English', 'Marwari'],
    bio: 'One of Rajasthan\'s most experienced corporate transactional lawyers, with 26 years of practice spanning company law, M&A, land acquisition advisory, and income tax appeals. Regularly appears before the NCLT and the Rajasthan High Court.',
    averageRating: 4.7, totalReviews: 168, totalCases: 730,
    subscription: 'elite',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '10:00 AM', availableTimeTo: '05:00 PM',
    consultationModes: ['In-Person'],
    designation: 'Senior Advocate', currentFirm: 'Singhania & Co.',
  },
  {
    name: 'Adv. Ananya Krishnan',
    gender: 'Female',
    email: 'ananya.krishnan.adv@seedjj.in',
    phone: '9446789012',
    photo: 'https://randomuser.me/api/portraits/women/82.jpg',
    city: 'Kochi', state: 'Kerala', pincode: '682031',
    barRegistrationNumber: barNumber('Kerala', 2021, '1124'),
    yearOfEnrollment: 2021,
    barCouncilState: 'Kerala',
    specializations: ['Cyber Law', 'Consumer Rights'],
    experience: 3, experienceLevel: 'junior',
    consultationFee: 800,
    courts: ['Kerala High Court', 'Cyber Crime Police Ernakulam'],
    languages: ['Malayalam', 'English'],
    bio: 'Recently enrolled advocate with a background in computer science and law (dual degree from NLU). Advises clients on cyberstalking complaints, online fraud FIR filings, and consumer disputes against app-based platforms.',
    averageRating: 4.1, totalReviews: 4, totalCases: 18,
    subscription: 'free',
    availableDays: ['Wednesday','Thursday','Saturday'],
    availableTimeFrom: '12:00 PM', availableTimeTo: '07:00 PM',
    consultationModes: ['Video Call'],
    designation: 'Advocate', currentFirm: 'Independent',
  },
  {
    name: 'Adv. Suresh Iyer',
    gender: 'Male',
    email: 'suresh.iyer.adv@seedjj.in',
    phone: '9500234567',
    photo: 'https://randomuser.me/api/portraits/men/15.jpg',
    city: 'Chennai', state: 'Tamil Nadu', pincode: '600034',
    barRegistrationNumber: barNumber('Tamil Nadu', 2000, '1567'),
    yearOfEnrollment: 2000,
    barCouncilState: 'Tamil Nadu',
    specializations: ['Civil Disputes', 'Property Law', 'Family Law'],
    experience: 24, experienceLevel: 'senior',
    consultationFee: 4800,
    courts: ['Madras High Court', 'City Civil Court Chennai', 'Family Court Chennai'],
    languages: ['Tamil', 'English'],
    bio: 'Veteran civil advocate at the Madras High Court with a 24-year track record across property succession disputes, partition suits, and guardianship matters. Authored a chapter in a National Law School publication on civil procedure reforms.',
    averageRating: 4.8, totalReviews: 93, totalCases: 475,
    subscription: 'pro',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '09:00 AM', availableTimeTo: '05:00 PM',
    consultationModes: ['In-Person', 'Phone Call'],
    designation: 'Senior Advocate', currentFirm: 'Iyer Civil Law Chambers',
  },
  {
    name: 'Adv. Pooja Agarwal',
    gender: 'Female',
    email: 'pooja.agarwal.adv@seedjj.in',
    phone: '9818456780',
    photo: 'https://randomuser.me/api/portraits/women/19.jpg',
    city: 'Delhi', state: 'Delhi', pincode: '110092',
    barRegistrationNumber: barNumber('Delhi', 2017, '7718'),
    yearOfEnrollment: 2017,
    barCouncilState: 'Delhi',
    specializations: ['Family Law', 'Divorce', 'Civil Disputes'],
    experience: 7, experienceLevel: 'mid',
    consultationFee: 2500,
    courts: ['Delhi High Court', 'Family Court Rohini', 'Saket District Court'],
    languages: ['Hindi', 'English'],
    bio: 'Family and divorce lawyer in Delhi with 7 years of experience in matrimonial disputes, domestic violence protection orders, and maintenance proceedings. Strong mediation skills with a focus on protecting children\'s welfare in custody cases.',
    averageRating: 4.5, totalReviews: 41, totalCases: 189,
    subscription: 'basic',
    availableDays: ['Monday','Tuesday','Thursday','Friday','Saturday'],
    availableTimeFrom: '10:30 AM', availableTimeTo: '07:00 PM',
    consultationModes: ['In-Person', 'Video Call', 'Phone Call'],
    designation: 'Advocate', currentFirm: 'Agarwal Family Law',
  },
  {
    name: 'Adv. Girish Kulkarni',
    gender: 'Male',
    email: 'girish.kulkarni.adv@seedjj.in',
    phone: '9822678901',
    photo: 'https://randomuser.me/api/portraits/men/38.jpg',
    city: 'Pune', state: 'Maharashtra', pincode: '411005',
    barRegistrationNumber: barNumber('Maharashtra', 2010, '4456'),
    yearOfEnrollment: 2010,
    barCouncilState: 'Maharashtra',
    specializations: ['Corporate Law', 'Labour Law', 'Intellectual Property'],
    experience: 14, experienceLevel: 'mid',
    consultationFee: 5000,
    courts: ['Bombay High Court Nagpur Bench', 'Labour Court Pune', 'IP Appellate Board'],
    languages: ['Marathi', 'Hindi', 'English'],
    bio: 'Corporate and IP counsel based in Pune, advising manufacturing companies, pharma firms, and tech SMEs. Handles employment agreements, collective bargaining disputes, patent prosecution, and trade secret litigation.',
    averageRating: 4.6, totalReviews: 58, totalCases: 267,
    subscription: 'pro',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '09:30 AM', availableTimeTo: '06:30 PM',
    consultationModes: ['In-Person', 'Video Call'],
    designation: 'Partner', currentFirm: 'Kulkarni Corporate Advocates',
  },
  {
    name: 'Adv. Zara Mirza',
    gender: 'Female',
    email: 'zara.mirza.adv@seedjj.in',
    phone: '9820123098',
    photo: 'https://randomuser.me/api/portraits/women/35.jpg',
    city: 'Mumbai', state: 'Maharashtra', pincode: '400050',
    barRegistrationNumber: barNumber('Maharashtra', 2015, '6672'),
    yearOfEnrollment: 2015,
    barCouncilState: 'Maharashtra',
    specializations: ['Criminal Defence', 'Cyber Law'],
    experience: 9, experienceLevel: 'mid',
    consultationFee: 3200,
    courts: ['Bombay High Court', 'Cyber Crime Cell Mumbai'],
    languages: ['Urdu', 'Hindi', 'English'],
    bio: 'Criminal defence and cyber law practitioner at the Bombay High Court. Has successfully secured bail in several high-profile IT Act cases and represented clients in cyberstalking and online fraud matters. LLM in Criminal Justice from the University of Mumbai.',
    averageRating: 4.4, totalReviews: 27, totalCases: 134,
    subscription: 'basic',
    availableDays: ['Monday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '11:00 AM', availableTimeTo: '06:00 PM',
    consultationModes: ['Video Call', 'In-Person'],
    designation: 'Advocate', currentFirm: 'Mirza & Associates',
  },
  {
    name: 'Adv. Venkatesh Prabhu',
    gender: 'Male',
    email: 'venkatesh.prabhu.adv@seedjj.in',
    phone: '8042567890',
    photo: 'https://randomuser.me/api/portraits/men/62.jpg',
    city: 'Bangalore', state: 'Karnataka', pincode: '560041',
    barRegistrationNumber: barNumber('Karnataka', 2008, '3104'),
    yearOfEnrollment: 2008,
    barCouncilState: 'Karnataka',
    specializations: ['Taxation', 'Corporate Law'],
    experience: 16, experienceLevel: 'senior',
    consultationFee: 7500,
    courts: ['Karnataka High Court', 'Income Tax Appellate Tribunal Bangalore', 'NCLT Bangalore'],
    languages: ['Kannada', 'Tamil', 'English'],
    bio: 'Direct and indirect tax litigator and corporate adviser based in Bangalore\'s central business district. Acts for IT companies, foreign subsidiaries, and HNIs on income tax search cases, GST audits, and transfer pricing disputes. Former IRS officer, now in full-time practice.',
    averageRating: 4.9, totalReviews: 113, totalCases: 398,
    subscription: 'elite',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '09:00 AM', availableTimeTo: '06:00 PM',
    consultationModes: ['In-Person', 'Video Call'],
    designation: 'Managing Partner', currentFirm: 'Prabhu Tax Law Firm',
  },
  {
    name: 'Adv. Rina Dasgupta',
    gender: 'Female',
    email: 'rina.dasgupta.adv@seedjj.in',
    phone: '9830987654',
    photo: 'https://randomuser.me/api/portraits/women/51.jpg',
    city: 'Kolkata', state: 'West Bengal', pincode: '700020',
    barRegistrationNumber: barNumber('West Bengal', 2004, '1893'),
    yearOfEnrollment: 2004,
    barCouncilState: 'West Bengal',
    specializations: ['Family Law', 'Civil Disputes', 'Consumer Rights'],
    experience: 20, experienceLevel: 'senior',
    consultationFee: 3500,
    courts: ['Calcutta High Court', 'Family Court Kolkata', 'Consumer Commission West Bengal'],
    languages: ['Bengali', 'Hindi', 'English'],
    bio: 'Two-decade veteran at the Calcutta High Court with broad civil and family law practice. Has argued over 600 cases in the Calcutta High Court and is a recognised authority on succession and probate law in West Bengal.',
    averageRating: 4.7, totalReviews: 87, totalCases: 618,
    subscription: 'pro',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '09:30 AM', availableTimeTo: '05:30 PM',
    consultationModes: ['In-Person'],
    designation: 'Senior Advocate', currentFirm: 'Dasgupta Law House',
  },
  {
    name: 'Adv. Manish Thakur',
    gender: 'Male',
    email: 'manish.thakur.adv@seedjj.in',
    phone: '9909345678',
    photo: 'https://randomuser.me/api/portraits/men/71.jpg',
    city: 'Ahmedabad', state: 'Gujarat', pincode: '380009',
    barRegistrationNumber: barNumber('Gujarat', 2015, '5028'),
    yearOfEnrollment: 2015,
    barCouncilState: 'Gujarat',
    specializations: ['Property Law', 'Labour Law', 'Consumer Rights'],
    experience: 9, experienceLevel: 'mid',
    consultationFee: 2100,
    courts: ['Gujarat High Court', 'Labour Court Ahmedabad', 'RERA Gujarat'],
    languages: ['Gujarati', 'Hindi', 'English'],
    bio: 'Mid-career advocate at the Gujarat High Court with a niche focus on RERA-related grievances by homebuyers against developers, supplemented by labour and consumer dispute practice. Frequently speaks at Gujarat Chamber of Commerce forums.',
    averageRating: 4.3, totalReviews: 22, totalCases: 97,
    subscription: 'basic',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '10:00 AM', availableTimeTo: '06:00 PM',
    consultationModes: ['In-Person', 'Video Call'],
    designation: 'Advocate', currentFirm: 'Thakur Legal Advisors',
  },
  {
    name: 'Adv. Shalini Bhat',
    gender: 'Female',
    email: 'shalini.bhat.adv@seedjj.in',
    phone: '9900876543',
    photo: 'https://randomuser.me/api/portraits/women/91.jpg',
    city: 'Hyderabad', state: 'Telangana', pincode: '500016',
    barRegistrationNumber: barNumber('Telangana', 2022, '2053'),
    yearOfEnrollment: 2022,
    barCouncilState: 'Telangana',
    specializations: ['Criminal Defence', 'Bail & FIR'],
    experience: 2, experienceLevel: 'junior',
    consultationFee: 700,
    courts: ['Sessions Court Hyderabad', 'Metropolitan Magistrate Court'],
    languages: ['Telugu', 'Kannada', 'English', 'Hindi'],
    bio: 'Newly enrolled advocate with a B.A.LLB (Hons.) from NALSAR University of Law, Hyderabad. Currently building her practice in criminal law with a particular focus on bail matters and assisting senior counsel in complex trial court proceedings.',
    averageRating: 3.8, totalReviews: 3, totalCases: 14,
    subscription: 'free',
    availableDays: ['Monday','Tuesday','Thursday','Saturday'],
    availableTimeFrom: '11:00 AM', availableTimeTo: '06:00 PM',
    consultationModes: ['Phone Call', 'In-Person'],
    designation: 'Advocate', currentFirm: 'Independent',
  },
  {
    name: 'Adv. Naresh Pandey',
    gender: 'Male',
    email: 'naresh.pandey.adv@seedjj.in',
    phone: '9918234567',
    photo: 'https://randomuser.me/api/portraits/men/29.jpg',
    city: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001',
    barRegistrationNumber: barNumber('Uttar Pradesh', 2009, '4405'),
    yearOfEnrollment: 2009,
    barCouncilState: 'Uttar Pradesh',
    specializations: ['Taxation', 'Corporate Law', 'Civil Disputes'],
    experience: 15, experienceLevel: 'senior',
    consultationFee: 4000,
    courts: ['Allahabad High Court Lucknow Bench', 'ITAT Lucknow', 'NCLT Allahabad'],
    languages: ['Hindi', 'English'],
    bio: 'Tax and corporate specialist at the Allahabad High Court Lucknow Bench. Acts for manufacturing companies, traders, and family businesses on income tax litigation, GST appeals, and company law matters including NCLT proceedings.',
    averageRating: 4.6, totalReviews: 55, totalCases: 272,
    subscription: 'pro',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '10:00 AM', availableTimeTo: '06:00 PM',
    consultationModes: ['In-Person', 'Phone Call'],
    designation: 'Partner', currentFirm: 'Pandey & Co. Advocates',
  },
  {
    name: 'Adv. Geetha Moorthy',
    gender: 'Female',
    email: 'geetha.moorthy.adv@seedjj.in',
    phone: '9443234567',
    photo: 'https://randomuser.me/api/portraits/women/75.jpg',
    city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641018',
    barRegistrationNumber: barNumber('Tamil Nadu', 2016, '8802'),
    yearOfEnrollment: 2016,
    barCouncilState: 'Tamil Nadu',
    specializations: ['Divorce', 'Family Law', 'Consumer Rights'],
    experience: 8, experienceLevel: 'mid',
    consultationFee: 1600,
    courts: ['Madras High Court', 'Family Court Coimbatore', 'Consumer Forum Coimbatore'],
    languages: ['Tamil', 'English'],
    bio: 'Divorce and family law advocate in Coimbatore with a dedicated practice covering contested and mutual consent divorces, child custody, and maintenance. Also handles consumer disputes against local businesses and hospitals.',
    averageRating: 4.4, totalReviews: 31, totalCases: 163,
    subscription: 'basic',
    availableDays: ['Tuesday','Thursday','Friday','Saturday'],
    availableTimeFrom: '10:30 AM', availableTimeTo: '05:30 PM',
    consultationModes: ['In-Person', 'Phone Call'],
    designation: 'Advocate', currentFirm: 'Moorthy & Moorthy',
  },
  {
    name: 'Adv. Dinesh Yadav',
    gender: 'Male',
    email: 'dinesh.yadav.adv@seedjj.in',
    phone: '9616456789',
    photo: 'https://randomuser.me/api/portraits/men/47.jpg',
    city: 'Patna', state: 'Bihar', pincode: '800001',
    barRegistrationNumber: barNumber('Bihar', 2011, '3317'),
    yearOfEnrollment: 2011,
    barCouncilState: 'Bihar',
    specializations: ['Criminal Defence', 'Civil Disputes', 'Bail & FIR'],
    experience: 13, experienceLevel: 'mid',
    consultationFee: 1800,
    courts: ['Patna High Court', 'Sessions Court Patna'],
    languages: ['Hindi', 'Bhojpuri', 'English'],
    bio: 'Criminal and civil practitioner at the Patna High Court, extensively experienced in bail matters, criminal revision applications, and civil appeals. Has appeared in over 1,000 sessions court hearings across Bihar districts.',
    averageRating: 4.2, totalReviews: 47, totalCases: 331,
    subscription: 'basic',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
    availableTimeFrom: '09:30 AM', availableTimeTo: '06:30 PM',
    consultationModes: ['In-Person', 'Phone Call'],
    designation: 'Advocate', currentFirm: 'Yadav Law Chambers',
  },
  {
    name: 'Adv. Amrita Sood',
    gender: 'Female',
    email: 'amrita.sood.adv@seedjj.in',
    phone: '9815012345',
    photo: 'https://randomuser.me/api/portraits/women/26.jpg',
    city: 'Chandigarh', state: 'Punjab', pincode: '160019',
    barRegistrationNumber: barNumber('Punjab', 2008, '2267'),
    yearOfEnrollment: 2008,
    barCouncilState: 'Punjab',
    specializations: ['Intellectual Property', 'Corporate Law', 'Cyber Law'],
    experience: 16, experienceLevel: 'senior',
    consultationFee: 5200,
    courts: ['Punjab & Haryana High Court', 'Delhi High Court IP Division'],
    languages: ['Hindi', 'Punjabi', 'English'],
    bio: 'Senior IP and technology lawyer practising across the Punjab & Haryana High Court and Delhi. Advises Indian and international businesses on brand protection strategy, software licensing, and AI/data law compliance under emerging Indian regulations.',
    averageRating: 4.8, totalReviews: 69, totalCases: 290,
    subscription: 'elite',
    availableDays: ['Monday','Tuesday','Wednesday','Thursday','Friday'],
    availableTimeFrom: '09:30 AM', availableTimeTo: '06:00 PM',
    consultationModes: ['Video Call', 'In-Person'],
    designation: 'Senior Partner', currentFirm: 'Sood IP Law',
  },
];

// ─── Constants for realistic review generation ────────────────────────────────
const CLIENT_NAMES = [
  'Rahul Sharma', 'Priya Patel', 'Amit Verma', 'Sunita Rao', 
  'Vikram Malhotra', 'Anjali Nair', 'Siddharth Roy', 'Neha Kapoor', 
  'Karan Singh', 'Deepika Iyer', 'Rajesh Gupta', 'Meera Joshi', 
  'Arjun Deshmukh', 'Kavita Reddy', 'Sanjay Dutt'
];

const REVIEWS_BY_SPEC = {
  'Criminal Defence': [
    'Extremely helpful with my bail application. Kept me informed throughout.',
    'Very knowledgeable in criminal procedure. Highly recommended.',
    'Strategic advice and great presence in court. Resolved my issue quickly.',
    'Gave clear, realistic guidance during a stressful situation. Outstanding service.',
    'Very professional and responsive counsel. Handled our case exceptionally well.'
  ],
  'Bail & FIR': [
    'Helped us get anticipatory bail. Very fast and responsive.',
    'Guided us step-by-step through filing the FIR and dealing with police.',
    'Extremely quick turnaround. Got the FIR copy and bail processed in no time.',
    'Highly professional and clear about the legal procedures.'
  ],
  'Family Law': [
    'Handled my sensitive matrimonial dispute with great empathy and professionalism.',
    'Very practical advice. Focused on settlement rather than endless litigation.',
    'Helped me secure child custody. Very grateful for their support.',
    'Compassionate and determined representation throughout a difficult family matter.'
  ],
  'Divorce': [
    'Handled my contested divorce case with dignity and patience. Excellent result.',
    'Highly recommended for matrimonial cases. Mediation and courtroom skills are top-notch.',
    'Very supportive and clear advice throughout my divorce proceedings.'
  ],
  'Property Law': [
    'Completed title verification for my new apartment swiftly and flagged key risks.',
    'Extremely thorough due diligence. Helped us avoid a disputed land transaction.',
    'Excellent guidance on property registration and documentation.',
    'Very reliable property advocate. Cleared all our doubts regarding land acquisition.'
  ],
  'Corporate Law': [
    'Helped our startup register trademarks and draft terms of service seamlessly.',
    'Exceptional legal counsel for business agreements and contract reviews.',
    'Very sharp corporate advisory. Assisted us with complex compliance matters.'
  ],
  'Taxation': [
    'Very professional and clear tax advisory services. Saved us a lot of compliance hassle.',
    'Helped resolve a complex GST dispute with the department successfully.',
    'Prompt response and clear expertise in business taxation.'
  ],
  'Intellectual Property': [
    'Helped file our trademark and patent applications. Smooth process.',
    'Highly skilled in copyright issues. Protected our content library.',
    'Deep expertise in IP law. Clear communication and timely updates.'
  ],
  'Cyber Law': [
    'Assisted us in resolving an online identity theft issue. Very prompt.',
    'Helped draft our privacy policy and security protocols. Very thorough.',
    'Excellent understanding of IT Act and data protection guidelines.'
  ],
  'Consumer Rights': [
    'Successfully represented me in a consumer forum case against an e-commerce giant.',
    'Helped get a full refund for a defective product. Very effective.',
    'Strong advocate for consumer protection. Kept me updated throughout.'
  ],
  'Labour Law': [
    'Helpful and understanding. Guided me well on employment contract disputes.',
    'Assisted our company with labor compliance audit. Highly professional.',
    'Very knowledgeable about employee rights and labor union negotiations.'
  ],
  'Civil Disputes': [
    'Professional civil advocate. Guided us through a complex boundary dispute.',
    'Excellent representation in a civil recovery suit. Honest and upfront.',
    'Great experience working on our partition suit. Highly detailed research.'
  ]
};

// ─── Main seed function ───────────────────────────────────────────────────────
async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected.\n');

  // Idempotency guard — skip if demo seed data already exists
  const existingCount = await Lawyer.countDocuments({ isSeedData: true });
  if (existingCount > 0) {
    console.log(`⚠️  Found ${existingCount} lawyers already marked isSeedData:true.`);
    if (process.env.FORCE !== '1') {
      console.log('   Skipping insert to avoid duplicates. Run with FORCE=1 to override:\n   FORCE=1 node seed-lawyers.js');
      await mongoose.disconnect();
      process.exit(0);
    }
    console.log('   FORCE=1 detected — cleaning up existing seeded lawyers and users first...');
    const deleteUsersResult = await User.deleteMany({ $or: [{ isSeedData: true }, { email: /@seedjj\.in$/i }] });
    const deleteLawyersResult = await Lawyer.deleteMany({ isSeedData: true });
    console.log(`   Deleted ${deleteUsersResult.deletedCount} user accounts.`);
    console.log(`   Deleted ${deleteLawyersResult.deletedCount} lawyer records.\n`);
  }

  let inserted = 0;
  const bySpec = {};
  const byCity = {};

  for (const data of LAWYERS) {
    try {
      // 1. Create backing User record (required by schema)
      const user = await User.create({
        name: data.name,
        email: data.email,
        password: 'Seed@JJ2025!',   // will be bcrypt-hashed by pre-save hook
        role: 'lawyer',
        city: data.city,
        state: data.state,
        phone: data.phone,
        isVerified: true,
        verificationStatus: 'verified',
        isSeedData: true,
      });

      // Generate 2-3 realistic reviews matching lawyer's rating
      const reviews = [];
      const specList = data.specializations || [];
      const primarySpec = specList[0] || 'Civil Disputes';
      const specComments = REVIEWS_BY_SPEC[primarySpec] || REVIEWS_BY_SPEC['Civil Disputes'];
      const numReviews = Math.min(3, data.totalReviews || 3);
      const usedComments = new Set();

      for (let rIdx = 0; rIdx < numReviews; rIdx++) {
        const clientName = CLIENT_NAMES[Math.floor(Math.random() * CLIENT_NAMES.length)];
        let comment = specComments[Math.floor(Math.random() * specComments.length)];
        let attempts = 0;
        while (usedComments.has(comment) && attempts < 10) {
          comment = specComments[Math.floor(Math.random() * specComments.length)];
          attempts++;
        }
        usedComments.add(comment);

        const avg = Math.round(data.averageRating || 4.5);
        let rating = avg;
        if (rIdx === 0 && data.averageRating % 1 !== 0) {
          rating = Math.random() > 0.5 ? Math.ceil(data.averageRating) : Math.floor(data.averageRating);
        } else {
          rating = Math.max(1, Math.min(5, avg + (Math.random() > 0.6 ? 1 : Math.random() > 0.6 ? -1 : 0)));
        }

        const daysAgo = Math.floor(Math.random() * 180) + 1;
        const createdAt = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        reviews.push({
          clientName,
          rating,
          comment,
          createdAt
        });
      }

      // 2. Create Lawyer document
      await Lawyer.create({
        user: user._id,
        name: data.name,
        gender: data.gender,
        email: data.email,
        phone: data.phone,
        photo: data.photo,
        barRegistrationNumber: data.barRegistrationNumber,
        yearOfEnrollment: data.yearOfEnrollment,
        barCouncilState: data.barCouncilState,
        specializations: data.specializations,
        experience: data.experience,
        experienceLevel: data.experienceLevel,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        courts: data.courts,
        consultationFee: data.consultationFee,
        bio: data.bio,
        languages: data.languages,
        isVerified: true,
        verificationStatus: 'verified',
        isBlocked: false,
        isAvailable: true,
        reviews: reviews,
        averageRating: data.averageRating,
        totalReviews: data.totalReviews,
        totalCases: data.totalCases,
        totalEarnings: data.consultationFee * data.totalCases,
        subscription: data.subscription,
        subscriptionFeatures: {
          name: data.subscription === 'elite' ? 'Elite Package' : data.subscription === 'pro' ? 'Pro Package' : 'Standard',
          featured: ['elite','pro'].includes(data.subscription),
          priority: data.subscription === 'elite',
          maxBookings: data.subscription === 'elite' ? 50 : data.subscription === 'pro' ? 25 : data.subscription === 'basic' ? 10 : 5,
        },
        designation: data.designation,
        currentFirm: data.currentFirm,
        consultationModes: data.consultationModes,
        availableDays: data.availableDays,
        availableTimeFrom: data.availableTimeFrom,
        availableTimeTo: data.availableTimeTo,
        isSeedData: true,  // idempotency flag
      });

      inserted++;
      data.specializations.forEach(s => { bySpec[s] = (bySpec[s] || 0) + 1; });
      byCity[data.city] = (byCity[data.city] || 0) + 1;
      process.stdout.write(`  ✓ ${data.name} (${data.city})\n`);

    } catch (err) {
      console.error(`  ✗ FAILED — ${data.name}: ${err.message}`);
    }
  }

  // Summary log
  console.log('\n════════════════════════════════════════════════════');
  console.log(`  SEED COMPLETE — ${inserted} lawyers inserted`);
  console.log('════════════════════════════════════════════════════');

  console.log('\nBy Specialization:');
  Object.entries(bySpec).sort((a,b)=>b[1]-a[1]).forEach(([spec,count]) => {
    console.log(`  ${spec.padEnd(30)} ${count}`);
  });

  console.log('\nBy City:');
  Object.entries(byCity).sort((a,b)=>b[1]-a[1]).forEach(([city,count]) => {
    console.log(`  ${city.padEnd(20)} ${count}`);
  });

  console.log('\nTo remove demo data later:');
  console.log('  db.lawyers.deleteMany({ isSeedData: true })');
  console.log('  db.users.deleteMany({ email: /@seedjj\\.in$/ })\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
