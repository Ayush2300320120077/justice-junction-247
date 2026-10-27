// Comprehensive Demo Lawyers Database — 117 Verified Advocates
const demoLawyers = [
  {
    "_id": "demo-001",
    "name": "Adv. Vikas Anand",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 3,
    "experienceLevel": "junior",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 26,
    "totalReviews": 26,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "D/1001/2021",
    "barRegistrationNumber": "D/1001/2021",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari Courts",
      "Patiala House Courts",
      "Saket District Court"
    ],
    "bio": "Dedicated young consumer protection lawyer offering accessible legal guidance for online shopping fraud, false advertising, and defective electronics."
  },
  {
    "_id": "demo-002",
    "name": "Adv. Preeti Somaiya",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 4,
    "experienceLevel": "junior",
    "fee": 800,
    "consultationFee": 800,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 34,
    "totalReviews": 34,
    "languages": [
      "Hindi",
      "Marathi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1002/2020",
    "barRegistrationNumber": "MH/1002/2020",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil Court Mumbai",
      "Esplanade Metropolitan Court",
      "Bandra Family Court"
    ],
    "bio": "Legal aid advocate providing affordable consultation for domestic discord, senior citizen maintenance claims, and early-stage matrimonial disputes."
  },
  {
    "_id": "demo-003",
    "name": "Adv. Harishchandra Rao",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 5,
    "experienceLevel": "junior",
    "fee": 750,
    "consultationFee": 750,
    "rating": 3.8,
    "averageRating": 3.8,
    "reviewCount": 19,
    "totalReviews": 19,
    "languages": [
      "Kannada",
      "English",
      "Hindi",
      "Tulu"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1003/2019",
    "barRegistrationNumber": "KA/1003/2019",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court",
      "Family Court Bengaluru"
    ],
    "bio": "General civil litigant handling small-claims property rent recovery, agreement breaches, and neighbor encroachment disputes."
  },
  {
    "_id": "demo-004",
    "name": "Adv. Meera Sundar",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 4,
    "experienceLevel": "junior",
    "fee": 600,
    "consultationFee": 600,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 21,
    "totalReviews": 21,
    "languages": [
      "Tamil",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1004/2020",
    "barRegistrationNumber": "TN/1004/2020",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "George Town Court",
      "Egmore Magistrate Court"
    ],
    "bio": "Pro-bono & affordable legal counsel for contract laborers, delivery partners, and domestic workers seeking rightful wages and safety compensation."
  },
  {
    "_id": "demo-005",
    "name": "Adv. Arvind Trivedi",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 6,
    "experienceLevel": "junior",
    "fee": 1000,
    "consultationFee": 1000,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 41,
    "totalReviews": 41,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "GJ/1005/2018",
    "barRegistrationNumber": "GJ/1005/2018",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "City Civil Court Ahmedabad",
      "Mirzapur Court"
    ],
    "bio": "Consultant for small shop owners and retail traders dealing with GST late filing notices, input credit mismatches, and income tax scrutiny."
  },
  {
    "_id": "demo-006",
    "name": "Adv. Tanya Bhatia",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 2,
    "experienceLevel": "junior",
    "fee": 700,
    "consultationFee": 700,
    "rating": 3.9,
    "averageRating": 3.9,
    "reviewCount": 15,
    "totalReviews": 15,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "D/1006/2022",
    "barRegistrationNumber": "D/1006/2022",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari Courts",
      "Patiala House Courts",
      "Saket District Court"
    ],
    "bio": "Junior cyberlaw advocate assisting victims of impersonation, OTP scams, unauthorized photos, and cyber-bullying across NCR."
  },
  {
    "_id": "demo-007",
    "name": "Adv. Suresh Choudhary",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 5,
    "experienceLevel": "junior",
    "fee": 900,
    "consultationFee": 900,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 28,
    "totalReviews": 28,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/1007/2019",
    "barRegistrationNumber": "RJ/1007/2019",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court",
      "Jaipur Sessions Court",
      "Jaipur Metro Court"
    ],
    "bio": "Assists rural and suburban land purchasers with khata registry verification, patwari records checking, and title clearance."
  },
  {
    "_id": "demo-008",
    "name": "Adv. Jyoti Mukherjee",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 4,
    "experienceLevel": "junior",
    "fee": 600,
    "consultationFee": 600,
    "rating": 3.7,
    "averageRating": 3.7,
    "reviewCount": 18,
    "totalReviews": 18,
    "languages": [
      "Bengali",
      "Hindi",
      "English",
      "Odia"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "WB/1008/2020",
    "barRegistrationNumber": "WB/1008/2020",
    "barCouncilState": "West Bengal",
    "courts": [
      "Calcutta High Court",
      "City Civil Court Kolkata",
      "Alipore District Court",
      "Sealdah Court"
    ],
    "bio": "Fights against unfair telecom billing, delayed flat handover interest, and unauthorized credit card charges."
  },
  {
    "_id": "demo-009",
    "name": "Adv. Imran Farooqui",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 6,
    "experienceLevel": "junior",
    "fee": 1000,
    "consultationFee": 1000,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 37,
    "totalReviews": 37,
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1009/2018",
    "barRegistrationNumber": "UP/1009/2018",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court (Lucknow Bench)",
      "District Court Lucknow",
      "Kaiserbagh Court"
    ],
    "bio": "Assists poor families with station bail, police non-cognizable complaint filings, and first-time summons representation in Lucknow courts."
  },
  {
    "_id": "demo-010",
    "name": "Adv. Deepa Kothari",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 3,
    "experienceLevel": "junior",
    "fee": 1000,
    "consultationFee": 1000,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 22,
    "totalReviews": 22,
    "languages": [
      "Marathi",
      "English",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1010/2021",
    "barRegistrationNumber": "MH/1010/2021",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Shivajinagar District Court",
      "Bombay High Court",
      "Pune Family Court"
    ],
    "bio": "Assists solo founders, college entrepreneurs, and freelancer agencies with simple partnership deeds, NDA drafting, and service contracts."
  },
  {
    "_id": "demo-011",
    "name": "Adv. Rameshwar Prasad",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Patna",
    "state": "Bihar",
    "experience": 7,
    "experienceLevel": "junior",
    "fee": 800,
    "consultationFee": 800,
    "rating": 3.6,
    "averageRating": 3.6,
    "reviewCount": 14,
    "totalReviews": 14,
    "languages": [
      "Hindi",
      "Bhojpuri",
      "English",
      "Odia"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "BR/1011/2017",
    "barRegistrationNumber": "BR/1011/2017",
    "barCouncilState": "Bihar",
    "courts": [
      "Patna High Court",
      "Patna Civil Court",
      "Danapur Sub-Divisional Court"
    ],
    "bio": "Handles village panchayat boundary arbitrations, recovery suits under ₹1 lakh, and minor contractual disagreements."
  },
  {
    "_id": "demo-012",
    "name": "Adv. Biju Mathew",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Kochi",
    "state": "Kerala",
    "experience": 5,
    "experienceLevel": "junior",
    "fee": 950,
    "consultationFee": 950,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 25,
    "totalReviews": 25,
    "languages": [
      "Malayalam",
      "English",
      "Tulu"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KL/1012/2019",
    "barRegistrationNumber": "KL/1012/2019",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "Ernakulam District Court"
    ],
    "bio": "Kerala High Court junior advocate addressing plantation worker wage settlements, factory overtime disputes, and contract termination."
  },
  {
    "_id": "demo-013",
    "name": "Adv. Priya Sharma",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 14,
    "experienceLevel": "mid",
    "fee": 3500,
    "consultationFee": 3500,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 87,
    "totalReviews": 87,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "D/1013/2010",
    "barRegistrationNumber": "D/1013/2010",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari Courts",
      "Patiala House Courts",
      "Saket District Court"
    ],
    "bio": "14 years of criminal litigation experience across Delhi District Courts and Delhi High Court. Specializes in white-collar crime, bail applications, and trial defence."
  },
  {
    "_id": "demo-014",
    "name": "Adv. Sunita Reddy",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 11,
    "experienceLevel": "mid",
    "fee": 2500,
    "consultationFee": 2500,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 63,
    "totalReviews": 63,
    "languages": [
      "English",
      "Hindi",
      "Telugu"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TS/1014/2013",
    "barRegistrationNumber": "TS/1014/2013",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Secunderabad Court",
      "Nampally Criminal Court"
    ],
    "bio": "Property law specialist handling RERA disputes, title verification, and land acquisition cases across Telangana courts."
  },
  {
    "_id": "demo-015",
    "name": "Adv. Amit Chaturvedi",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 18,
    "experienceLevel": "senior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 94,
    "totalReviews": 94,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/1015/2006",
    "barRegistrationNumber": "RJ/1015/2006",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court",
      "Jaipur Sessions Court",
      "Jaipur Metro Court"
    ],
    "bio": "18 years in labour and employment law. Represents workers and employers in PF/ESI disputes, wrongful termination, and industrial tribunal matters."
  },
  {
    "_id": "demo-016",
    "name": "Adv. Deepika Joshi",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 6,
    "experienceLevel": "junior",
    "fee": 2000,
    "consultationFee": 2000,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 29,
    "totalReviews": 29,
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1016/2018",
    "barRegistrationNumber": "MH/1016/2018",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Shivajinagar District Court",
      "Bombay High Court",
      "Pune Family Court"
    ],
    "bio": "IT Act specialist handling online fraud, data privacy, social media harassment, and cryptocurrency-related legal matters."
  },
  {
    "_id": "demo-017",
    "name": "Adv. Vikram Singh",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 3000,
    "consultationFee": 3000,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 78,
    "totalReviews": 78,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "D/1017/2009",
    "barRegistrationNumber": "D/1017/2009",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari Courts",
      "Patiala House Courts",
      "Saket District Court"
    ],
    "bio": "Experienced divorce lawyer handling both mutual consent and contested divorces. Expertise in alimony negotiation, child custody, and DV Act cases."
  },
  {
    "_id": "demo-018",
    "name": "Adv. Lakshmi Iyer",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 12,
    "experienceLevel": "mid",
    "fee": 3500,
    "consultationFee": 3500,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 66,
    "totalReviews": 66,
    "languages": [
      "English",
      "Hindi",
      "Gujarati"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/1018/2012",
    "barRegistrationNumber": "GJ/1018/2012",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "City Civil Court Ahmedabad",
      "Mirzapur Court"
    ],
    "bio": "Tax law expert specializing in GST disputes, income tax assessments, and tax planning for SMEs and HNIs across Gujarat."
  },
  {
    "_id": "demo-019",
    "name": "Adv. Shalini Verma",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 16,
    "experienceLevel": "senior",
    "fee": 3200,
    "consultationFee": 3200,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 91,
    "totalReviews": 91,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "D/1019/2008",
    "barRegistrationNumber": "D/1019/2008",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari Courts",
      "Patiala House Courts",
      "Saket District Court"
    ],
    "bio": "Family law advocate focusing on domestic violence cases, maintenance claims under CrPC 125, and Hindu Marriage Act disputes."
  },
  {
    "_id": "demo-020",
    "name": "Adv. Neha Gupta",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 2500,
    "consultationFee": 2500,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 33,
    "totalReviews": 33,
    "languages": [
      "English",
      "Hindi",
      "Kannada",
      "Tulu"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1020/2016",
    "barRegistrationNumber": "KA/1020/2016",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court",
      "Family Court Bengaluru"
    ],
    "bio": "Civil litigation specialist representing clients in money recovery suits, injunctions, specific performance, and partnership disputes."
  },
  {
    "_id": "demo-021",
    "name": "Adv. Sanjay Mathur",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 19,
    "experienceLevel": "senior",
    "fee": 2800,
    "consultationFee": 2800,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 103,
    "totalReviews": 103,
    "languages": [
      "Hindi",
      "English",
      "Urdu"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1021/2005",
    "barRegistrationNumber": "UP/1021/2005",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court (Lucknow Bench)",
      "District Court Lucknow",
      "Kaiserbagh Court"
    ],
    "bio": "19 years defending clients in POCSO, murder, and organised crime trials across Allahabad High Court. Known for meticulous cross-examination technique."
  },
  {
    "_id": "demo-022",
    "name": "Adv. Kavya Nair",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 7,
    "experienceLevel": "junior",
    "fee": 1800,
    "consultationFee": 1800,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 38,
    "totalReviews": 38,
    "languages": [
      "English",
      "Tamil",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1022/2017",
    "barRegistrationNumber": "TN/1022/2017",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "George Town Court",
      "Egmore Magistrate Court"
    ],
    "bio": "Consumer rights advocate with strong track record in District Consumer Forum cases. Handles product defect and e-commerce refund disputes."
  },
  {
    "_id": "demo-023",
    "name": "Adv. Madan Bafna",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 13,
    "experienceLevel": "mid",
    "fee": 2500,
    "consultationFee": 2500,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 62,
    "totalReviews": 62,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "RJ/1023/2011",
    "barRegistrationNumber": "RJ/1023/2011",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court",
      "Jaipur Sessions Court",
      "Jaipur Metro Court"
    ],
    "bio": "Rajasthan High Court advocate specializing in bail, quashing of FIRs, and anticipatory bail in POCSO and SC/ST Act matters."
  },
  {
    "_id": "demo-024",
    "name": "Adv. Pradeep Bhattacharya",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 17,
    "experienceLevel": "senior",
    "fee": 3000,
    "consultationFee": 3000,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 79,
    "totalReviews": 79,
    "languages": [
      "Bengali",
      "Hindi",
      "English",
      "Odia"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "WB/1024/2007",
    "barRegistrationNumber": "WB/1024/2007",
    "barCouncilState": "West Bengal",
    "courts": [
      "Calcutta High Court",
      "City Civil Court Kolkata",
      "Alipore District Court",
      "Sealdah Court"
    ],
    "bio": "Calcutta High Court advocate handling partition suits, benami property cases, and urban land ceiling disputes across West Bengal."
  },
  {
    "_id": "demo-025",
    "name": "Adv. Anita Krishnamurthy",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 12,
    "experienceLevel": "mid",
    "fee": 2600,
    "consultationFee": 2600,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 67,
    "totalReviews": 67,
    "languages": [
      "Tamil",
      "English",
      "Hindi",
      "Malayalam"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1025/2012",
    "barRegistrationNumber": "TN/1025/2012",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "George Town Court",
      "Egmore Magistrate Court"
    ],
    "bio": "Specialist in inter-religion marriages, NRI divorce proceedings, and guardianship petitions at Madras High Court."
  },
  {
    "_id": "demo-026",
    "name": "Adv. Rekha Pillai",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 13,
    "experienceLevel": "mid",
    "fee": 3000,
    "consultationFee": 3000,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 72,
    "totalReviews": 72,
    "languages": [
      "English",
      "Kannada",
      "Hindi",
      "Tulu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1026/2011",
    "barRegistrationNumber": "KA/1026/2011",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court",
      "Family Court Bengaluru"
    ],
    "bio": "Labour law expert representing IT/BPO employees in wrongful termination, ESOP disputes, and sexual harassment complaints under POSH Act."
  },
  {
    "_id": "demo-027",
    "name": "Adv. Gopal Rao",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 6,
    "experienceLevel": "junior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 24,
    "totalReviews": 24,
    "languages": [
      "Telugu",
      "English",
      "Hindi",
      "Urdu"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TS/1027/2018",
    "barRegistrationNumber": "TS/1027/2018",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Secunderabad Court",
      "Nampally Criminal Court"
    ],
    "bio": "Corporate and commercial lawyer handling shareholders' agreements, due diligence, and GST compliance for SMEs in Telangana."
  },
  {
    "_id": "demo-028",
    "name": "Adv. Rahul Bose",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 11,
    "experienceLevel": "mid",
    "fee": 3500,
    "consultationFee": 3500,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 58,
    "totalReviews": 58,
    "languages": [
      "English",
      "Hindi",
      "Kannada",
      "Tulu"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1028/2013",
    "barRegistrationNumber": "KA/1028/2013",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court",
      "Family Court Bengaluru"
    ],
    "bio": "Cyber law expert with background in digital forensics. Handles data breaches, ransomware incidents, and social media defamation suits."
  },
  {
    "_id": "demo-029",
    "name": "Adv. Pallavi Dixit",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 9,
    "experienceLevel": "mid",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 46,
    "totalReviews": 46,
    "languages": [
      "Hindi",
      "English",
      "Urdu"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1029/2015",
    "barRegistrationNumber": "UP/1029/2015",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court (Lucknow Bench)",
      "District Court Lucknow",
      "Kaiserbagh Court"
    ],
    "bio": "Family court advocate in Allahabad HC jurisdiction handling mutual consent divorces, maintenance, and child custody in UP courts."
  },
  {
    "_id": "demo-030",
    "name": "Adv. Anil Varghese",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 6,
    "experienceLevel": "junior",
    "fee": 2000,
    "consultationFee": 2000,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 18,
    "totalReviews": 18,
    "languages": [
      "English",
      "Malayalam",
      "Kannada",
      "Tulu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1030/2018",
    "barRegistrationNumber": "KA/1030/2018",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court",
      "Family Court Bengaluru"
    ],
    "bio": "Startup-focused IP attorney assisting tech companies with trade secret protection, open-source compliance, and SaaS licensing."
  },
  {
    "_id": "demo-031",
    "name": "Adv. Rajesh Menon",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 5000,
    "consultationFee": 5000,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 112,
    "totalReviews": 112,
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1031/2002",
    "barRegistrationNumber": "MH/1031/2002",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil Court Mumbai",
      "Esplanade Metropolitan Court",
      "Bandra Family Court"
    ],
    "bio": "Senior family law advocate with 22 years of practice in Bombay High Court. Handles complex divorce, custody, and maintenance disputes with sensitivity."
  },
  {
    "_id": "demo-032",
    "name": "Adv. Mohammed Farhan",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 9,
    "experienceLevel": "mid",
    "fee": 4000,
    "consultationFee": 4000,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 51,
    "totalReviews": 51,
    "languages": [
      "English",
      "Hindi",
      "Kannada",
      "Tulu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1032/2015",
    "barRegistrationNumber": "KA/1032/2015",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court",
      "Family Court Bengaluru"
    ],
    "bio": "Corporate law advisor specializing in startup compliance, FEMA regulations, and contract drafting for tech companies in Bengaluru."
  },
  {
    "_id": "demo-033",
    "name": "Adv. Arjun Kapoor",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 10,
    "experienceLevel": "mid",
    "fee": 4500,
    "consultationFee": 4500,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 42,
    "totalReviews": 42,
    "languages": [
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1033/2014",
    "barRegistrationNumber": "MH/1033/2014",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil Court Mumbai",
      "Esplanade Metropolitan Court",
      "Bandra Family Court"
    ],
    "bio": "IP rights advocate handling trademark registration, copyright infringement, and patent prosecution for creative and tech industries."
  },
  {
    "_id": "demo-034",
    "name": "Adv. Rohan Deshmukh",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 20,
    "experienceLevel": "senior",
    "fee": 6000,
    "consultationFee": 6000,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 120,
    "totalReviews": 120,
    "languages": [
      "Hindi",
      "English",
      "Marathi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1034/2004",
    "barRegistrationNumber": "MH/1034/2004",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil Court Mumbai",
      "Esplanade Metropolitan Court",
      "Bandra Family Court"
    ],
    "bio": "Senior criminal advocate with 20 years of experience in bail applications, anticipatory bail, and FIR quashing across Maharashtra courts."
  },
  {
    "_id": "demo-035",
    "name": "Adv. Karthik Rajan",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 24,
    "experienceLevel": "senior",
    "fee": 7500,
    "consultationFee": 7500,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 145,
    "totalReviews": 145,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1035/2000",
    "barRegistrationNumber": "TN/1035/2000",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "George Town Court",
      "Egmore Magistrate Court"
    ],
    "bio": "Veteran property law advocate with deep expertise in land title disputes, RERA compliance, and civil litigation across Tamil Nadu courts."
  },
  {
    "_id": "demo-036",
    "name": "Adv. Ritu Agarwal",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 8000,
    "consultationFee": 8000,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 88,
    "totalReviews": 88,
    "languages": [
      "English",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1036/2009",
    "barRegistrationNumber": "MH/1036/2009",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil Court Mumbai",
      "Esplanade Metropolitan Court",
      "Bandra Family Court"
    ],
    "bio": "Senior corporate attorney with expertise in M&A transactions, SEBI compliance, and private equity deals. Former in-house counsel at a Fortune 500 company."
  },
  {
    "_id": "demo-037",
    "name": "Adv. Suresh Chandrasekar",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 20,
    "experienceLevel": "senior",
    "fee": 5500,
    "consultationFee": 5500,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 132,
    "totalReviews": 132,
    "languages": [
      "Kannada",
      "English",
      "Tamil",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1037/2004",
    "barRegistrationNumber": "KA/1037/2004",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court",
      "Family Court Bengaluru"
    ],
    "bio": "20 years handling complex divorce cases involving business asset division, international custody disputes, and NRI matrimonial matters."
  },
  {
    "_id": "demo-038",
    "name": "Adv. Prashant Dewan",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 28,
    "experienceLevel": "senior",
    "fee": 10000,
    "consultationFee": 10000,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 201,
    "totalReviews": 201,
    "languages": [
      "Hindi",
      "English",
      "Urdu"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "D/1038/1996",
    "barRegistrationNumber": "D/1038/1996",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari Courts",
      "Patiala House Courts",
      "Saket District Court"
    ],
    "bio": "Former ITAT member now in private practice. Represents high-value clients before ITAT, High Court, and Supreme Court in income tax, wealth tax, and customs matters."
  },
  {
    "_id": "demo-039",
    "name": "Adv. Natasha Chadha",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 14,
    "experienceLevel": "mid",
    "fee": 6000,
    "consultationFee": 6000,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 77,
    "totalReviews": 77,
    "languages": [
      "English",
      "Hindi",
      "Punjabi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "D/1039/2010",
    "barRegistrationNumber": "D/1039/2010",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari Courts",
      "Patiala House Courts",
      "Saket District Court"
    ],
    "bio": "Delhi High Court IP litigant with expertise in design patent oppositions, software copyright, and celebrity personality rights."
  },
  {
    "_id": "demo-040",
    "name": "Adv. Gurpreet Sandhu",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Chandigarh",
    "state": "Punjab & Haryana",
    "experience": 16,
    "experienceLevel": "senior",
    "fee": 5000,
    "consultationFee": 5000,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 98,
    "totalReviews": 98,
    "languages": [
      "Hindi",
      "Punjabi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "PH/1040/2008",
    "barRegistrationNumber": "PH/1040/2008",
    "barCouncilState": "Punjab & Haryana",
    "courts": [
      "Punjab & Haryana High Court",
      "District Court Chandigarh"
    ],
    "bio": "Specialist in anticipatory bail, Section 498A (matrimonial cruelty), and NDPS bail across Punjab & Haryana and Delhi High Courts."
  },
  {
    "_id": "demo-041",
    "name": "Adv. Ashish Mehrotra",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 20,
    "experienceLevel": "senior",
    "fee": 9000,
    "consultationFee": 9000,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 143,
    "totalReviews": 143,
    "languages": [
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "D/1041/2004",
    "barRegistrationNumber": "D/1041/2004",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari Courts",
      "Patiala House Courts",
      "Saket District Court"
    ],
    "bio": "Senior partner-level corporate lawyer advising Fortune 500 companies, handling NCLT insolvency proceedings, and cross-border M&A transactions."
  },
  {
    "_id": "demo-042",
    "name": "Adv. Priyanka Chopra-Legal",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 12,
    "experienceLevel": "mid",
    "fee": 5000,
    "consultationFee": 5000,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 74,
    "totalReviews": 74,
    "languages": [
      "Kannada",
      "English",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1042/2012",
    "barRegistrationNumber": "KA/1042/2012",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court",
      "Family Court Bengaluru"
    ],
    "bio": "IP rights specialist for India's tech and gaming startups. Handles software licensing, brand protection, and domain name disputes."
  },
  {
    "_id": "demo-043",
    "name": "Adv. Naseem Akhtar",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 17,
    "experienceLevel": "senior",
    "fee": 4500,
    "consultationFee": 4500,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 94,
    "totalReviews": 94,
    "languages": [
      "Urdu",
      "Telugu",
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TS/1043/2007",
    "barRegistrationNumber": "TS/1043/2007",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Secunderabad Court",
      "Nampally Criminal Court"
    ],
    "bio": "Telangana HC advocate specializing in urgent bail hearings, FIR quashing under Sec 482, and preventive detention challenges."
  },
  {
    "_id": "demo-044",
    "name": "Adv. Mala Krishnaswamy",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 20,
    "experienceLevel": "senior",
    "fee": 4200,
    "consultationFee": 4200,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 138,
    "totalReviews": 138,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "TS/1044/2004",
    "barRegistrationNumber": "TS/1044/2004",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Secunderabad Court",
      "Nampally Criminal Court"
    ],
    "bio": "20-year veteran in Hyderabad Family Courts handling Hindu succession, Muslim personal law disputes, and elderly parental rights."
  },
  {
    "_id": "demo-045",
    "name": "Adv. Vandana Shah",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 12,
    "experienceLevel": "mid",
    "fee": 4500,
    "consultationFee": 4500,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 69,
    "totalReviews": 69,
    "languages": [
      "English",
      "Hindi",
      "Gujarati",
      "Marathi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1045/2012",
    "barRegistrationNumber": "MH/1045/2012",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil Court Mumbai",
      "Esplanade Metropolitan Court",
      "Bandra Family Court"
    ],
    "bio": "Bombay High Court civil litigant specializing in cheque bounce (NI Act), contract enforcement, and commercial disputes."
  },
  {
    "_id": "demo-046",
    "name": "Adv. Narendra Shetty",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 4500,
    "consultationFee": 4500,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 83,
    "totalReviews": 83,
    "languages": [
      "Kannada",
      "English",
      "Hindi",
      "Tulu"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1046/2009",
    "barRegistrationNumber": "KA/1046/2009",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court",
      "Family Court Bengaluru"
    ],
    "bio": "Indirect and direct tax advocate practising before Karnataka HC and CESTAT. Specializes in customs duty drawbacks and service tax disputes."
  },
  {
    "_id": "demo-047",
    "name": "Adv. Deepak Kumar Singh",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Patna",
    "state": "Bihar",
    "experience": 25,
    "experienceLevel": "senior",
    "fee": 1800,
    "consultationFee": 1800,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 156,
    "totalReviews": 156,
    "languages": [
      "Hindi",
      "English",
      "Bhojpuri",
      "Odia"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "BR/1047/1999",
    "barRegistrationNumber": "BR/1047/1999",
    "barCouncilState": "Bihar",
    "courts": [
      "Patna High Court",
      "Patna Civil Court",
      "Danapur Sub-Divisional Court"
    ],
    "bio": "Patna High Court practitioner with 25 years in civil suits, debt recovery tribunals, and execution of decrees. Trusted by major banks for recovery cases."
  },
  {
    "_id": "demo-048",
    "name": "Adv. Kunal Singhania",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 5,
    "experienceLevel": "junior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 3.4,
    "averageRating": 3.4,
    "reviewCount": 11,
    "totalReviews": 11,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "D/1048/2019",
    "barRegistrationNumber": "D/1048/2019",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari Courts",
      "Patiala House Courts",
      "Saket District Court"
    ],
    "bio": "Provides corporate compliance advice and vendor agreements for small eCommerce retailers in Delhi NCR."
  },
  {
    "_id": "demo-049",
    "name": "Adv. Rajeshwar Rao",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 7,
    "experienceLevel": "junior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 3.5,
    "averageRating": 3.5,
    "reviewCount": 16,
    "totalReviews": 16,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "TS/1049/2017",
    "barRegistrationNumber": "TS/1049/2017",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Secunderabad Court",
      "Nampally Criminal Court"
    ],
    "bio": "Assists with local municipal property tax disputes, building permissions, and mutation challenges."
  },
  {
    "_id": "demo-050",
    "name": "Adv. Sunaina Patil",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 4,
    "experienceLevel": "junior",
    "fee": 1200,
    "consultationFee": 1200,
    "rating": 3.6,
    "averageRating": 3.6,
    "reviewCount": 12,
    "totalReviews": 12,
    "languages": [
      "Marathi",
      "English",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1050/2020",
    "barRegistrationNumber": "MH/1050/2020",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Shivajinagar District Court",
      "Bombay High Court",
      "Pune Family Court"
    ],
    "bio": "Handles mutual consent divorce filings and counseling documentation for couples in Pune and Pimpri-Chinchwad."
  },
  {
    "_id": "demo-051",
    "name": "Adv. Trilok Nath",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 1800,
    "consultationFee": 1800,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 10,
    "totalReviews": 10,
    "languages": [
      "Hindi",
      "Urdu"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "UP/1051/2016",
    "barRegistrationNumber": "UP/1051/2016",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court (Lucknow Bench)",
      "District Court Lucknow",
      "Kaiserbagh Court"
    ],
    "bio": "Litigator handling challans, vehicular accident claims, and trial representation in Lucknow district courts."
  },
  {
    "_id": "demo-052",
    "name": "Adv. Anindita Sen",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 6,
    "experienceLevel": "junior",
    "fee": 1400,
    "consultationFee": 1400,
    "rating": 3.7,
    "averageRating": 3.7,
    "reviewCount": 15,
    "totalReviews": 15,
    "languages": [
      "Bengali",
      "Hindi",
      "English",
      "Odia"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "WB/1052/2018",
    "barRegistrationNumber": "WB/1052/2018",
    "barCouncilState": "West Bengal",
    "courts": [
      "Calcutta High Court",
      "City Civil Court Kolkata",
      "Alipore District Court",
      "Sealdah Court"
    ],
    "bio": "Civil disputes advocate in Alipore courts representing clients in tenant eviction and partition matters."
  },
  {
    "_id": "demo-053",
    "name": "Adv. Baldev Singh Dhillon",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Chandigarh",
    "state": "Punjab & Haryana",
    "experience": 9,
    "experienceLevel": "mid",
    "fee": 2000,
    "consultationFee": 2000,
    "rating": 3.5,
    "averageRating": 3.5,
    "reviewCount": 14,
    "totalReviews": 14,
    "languages": [
      "Punjabi",
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "PH/1053/2015",
    "barRegistrationNumber": "PH/1053/2015",
    "barCouncilState": "Punjab & Haryana",
    "courts": [
      "Punjab & Haryana High Court",
      "District Court Chandigarh"
    ],
    "bio": "Represents industrial workmen and packaging company laborers in Mohali and Panchkula industrial areas."
  },
  {
    "_id": "demo-054",
    "name": "Adv. Harinarayan Vyas",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 10,
    "experienceLevel": "mid",
    "fee": 1800,
    "consultationFee": 1800,
    "rating": 3.8,
    "averageRating": 3.8,
    "reviewCount": 23,
    "totalReviews": 23,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/1054/2014",
    "barRegistrationNumber": "RJ/1054/2014",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court",
      "Jaipur Sessions Court",
      "Jaipur Metro Court"
    ],
    "bio": "Handles local commercial tax audits, Mandi tax disputes, and GST registrations for gem and textile traders."
  },
  {
    "_id": "demo-055",
    "name": "Adv. Senthil Murugan",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 5,
    "experienceLevel": "junior",
    "fee": 1100,
    "consultationFee": 1100,
    "rating": 3.4,
    "averageRating": 3.4,
    "reviewCount": 9,
    "totalReviews": 9,
    "languages": [
      "Tamil",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1055/2019",
    "barRegistrationNumber": "TN/1055/2019",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "George Town Court",
      "Egmore Magistrate Court"
    ],
    "bio": "Represents buyers facing problems with vehicle dealerships, delayed delivery of electronics, and hospital overcharging."
  },
  {
    "_id": "demo-056",
    "name": "Adv. Farhan Qureshi",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 4,
    "experienceLevel": "junior",
    "fee": 1600,
    "consultationFee": 1600,
    "rating": 3.6,
    "averageRating": 3.6,
    "reviewCount": 13,
    "totalReviews": 13,
    "languages": [
      "Hindi",
      "Urdu",
      "English",
      "Marathi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1056/2020",
    "barRegistrationNumber": "MH/1056/2020",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil Court Mumbai",
      "Esplanade Metropolitan Court",
      "Bandra Family Court"
    ],
    "bio": "Cybercrime consultant advising victims of cyber-stalking, phishing calls, and hacked email accounts."
  },
  {
    "_id": "demo-057",
    "name": "Adv. George Kurian",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Kochi",
    "state": "Kerala",
    "experience": 6,
    "experienceLevel": "junior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 3.7,
    "averageRating": 3.7,
    "reviewCount": 17,
    "totalReviews": 17,
    "languages": [
      "Malayalam",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KL/1057/2018",
    "barRegistrationNumber": "KL/1057/2018",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "Ernakulam District Court"
    ],
    "bio": "Assists spice exporters and food processing units with trademark filing and GI tag registrations in Kerala."
  },
  {
    "_id": "demo-058",
    "name": "Adv. Aparna Garg",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 2,
    "experienceLevel": "junior",
    "fee": 500,
    "consultationFee": 500,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 8,
    "totalReviews": 8,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "D/2058/2022",
    "barRegistrationNumber": "D/2058/2022",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari Courts",
      "Patiala House Courts",
      "Saket District Court"
    ],
    "bio": "2 years of specialized legal practice in Criminal Defence across Delhi and Delhi High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-059",
    "name": "Adv. Chetan Iyer",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 9,
    "experienceLevel": "mid",
    "fee": 4000,
    "consultationFee": 4000,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 21,
    "totalReviews": 21,
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/2059/2015",
    "barRegistrationNumber": "MH/2059/2015",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil Court Mumbai",
      "Esplanade Metropolitan Court",
      "Bandra Family Court"
    ],
    "bio": "9 years of specialized legal practice in Family Law across Mumbai and Bombay High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-060",
    "name": "Adv. Gautam Kalam",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 16,
    "experienceLevel": "senior",
    "fee": 1600,
    "consultationFee": 1600,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 34,
    "totalReviews": 34,
    "languages": [
      "English",
      "Kannada"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/2060/2008",
    "barRegistrationNumber": "KA/2060/2008",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court",
      "Family Court Bengaluru"
    ],
    "bio": "16 years of specialized legal practice in Property Law across Bengaluru and Karnataka High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-061",
    "name": "Adv. Ishaan Kulkarni",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 23,
    "experienceLevel": "senior",
    "fee": 5000,
    "consultationFee": 5000,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 47,
    "totalReviews": 47,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TS/2061/2001",
    "barRegistrationNumber": "TS/2061/2001",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Secunderabad Court",
      "Nampally Criminal Court"
    ],
    "bio": "23 years of specialized legal practice in Corporate Law across Hyderabad and Telangana High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-062",
    "name": "Adv. Kunal Mukherjee",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 30,
    "experienceLevel": "senior",
    "fee": 2000,
    "consultationFee": 2000,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 60,
    "totalReviews": 60,
    "languages": [
      "Tamil",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "TN/2062/1994",
    "barRegistrationNumber": "TN/2062/1994",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "George Town Court",
      "Egmore Magistrate Court"
    ],
    "bio": "30 years of specialized legal practice in Consumer Rights across Chennai and Madras High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-063",
    "name": "Adv. Mohit Pandey",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 6,
    "experienceLevel": "junior",
    "fee": 1000,
    "consultationFee": 1000,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 73,
    "totalReviews": 73,
    "languages": [
      "Bengali",
      "Hindi",
      "English",
      "Odia"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "WB/2063/2018",
    "barRegistrationNumber": "WB/2063/2018",
    "barCouncilState": "West Bengal",
    "courts": [
      "Calcutta High Court",
      "City Civil Court Kolkata",
      "Alipore District Court",
      "Sealdah Court"
    ],
    "bio": "6 years of specialized legal practice in Labour Law across Kolkata and Calcutta High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-064",
    "name": "Adv. Pallav Rathore",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 13,
    "experienceLevel": "mid",
    "fee": 2400,
    "consultationFee": 2400,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 86,
    "totalReviews": 86,
    "languages": [
      "Marathi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/2064/2011",
    "barRegistrationNumber": "MH/2064/2011",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Shivajinagar District Court",
      "Bombay High Court",
      "Pune Family Court"
    ],
    "bio": "13 years of specialized legal practice in Civil Disputes across Pune and Shivajinagar District Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-065",
    "name": "Adv. Prateek Sen",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 20,
    "experienceLevel": "senior",
    "fee": 7000,
    "consultationFee": 7000,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 99,
    "totalReviews": 99,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/2065/2004",
    "barRegistrationNumber": "RJ/2065/2004",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court",
      "Jaipur Sessions Court",
      "Jaipur Metro Court"
    ],
    "bio": "20 years of specialized legal practice in Divorce across Jaipur and Rajasthan High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-066",
    "name": "Adv. Sameer Shukla",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 27,
    "experienceLevel": "senior",
    "fee": 2800,
    "consultationFee": 2800,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 112,
    "totalReviews": 112,
    "languages": [
      "Gujarati",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "GJ/2066/1997",
    "barRegistrationNumber": "GJ/2066/1997",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "City Civil Court Ahmedabad",
      "Mirzapur Court"
    ],
    "bio": "27 years of specialized legal practice in Taxation across Ahmedabad and Gujarat High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-067",
    "name": "Adv. Saurabh Srivastava",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 3,
    "experienceLevel": "junior",
    "fee": 8000,
    "consultationFee": 8000,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 125,
    "totalReviews": 125,
    "languages": [
      "Hindi",
      "English",
      "Urdu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/2067/2021",
    "barRegistrationNumber": "UP/2067/2021",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court (Lucknow Bench)",
      "District Court Lucknow",
      "Kaiserbagh Court"
    ],
    "bio": "3 years of specialized legal practice in Intellectual Property across Lucknow and Allahabad High Court (Lucknow Bench). Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-068",
    "name": "Adv. Siddharth Tripathi",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Patna",
    "state": "Bihar",
    "experience": 10,
    "experienceLevel": "mid",
    "fee": 950,
    "consultationFee": 950,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 138,
    "totalReviews": 138,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "BR/2068/2014",
    "barRegistrationNumber": "BR/2068/2014",
    "barCouncilState": "Bihar",
    "courts": [
      "Patna High Court",
      "Patna Civil Court",
      "Danapur Sub-Divisional Court"
    ],
    "bio": "10 years of specialized legal practice in Cyber Law across Patna and Patna High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-069",
    "name": "Adv. Uday Varma",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Chandigarh",
    "state": "Punjab & Haryana",
    "experience": 17,
    "experienceLevel": "senior",
    "fee": 9000,
    "consultationFee": 9000,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 151,
    "totalReviews": 151,
    "languages": [
      "Punjabi",
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "PH/2069/2007",
    "barRegistrationNumber": "PH/2069/2007",
    "barCouncilState": "Punjab & Haryana",
    "courts": [
      "Punjab & Haryana High Court",
      "District Court Chandigarh"
    ],
    "bio": "17 years of specialized legal practice in Bail & FIR across Chandigarh and Punjab & Haryana High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-070",
    "name": "Adv. Varun Banerjee",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Kochi",
    "state": "Kerala",
    "experience": 24,
    "experienceLevel": "senior",
    "fee": 1600,
    "consultationFee": 1600,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 164,
    "totalReviews": 164,
    "languages": [
      "Malayalam",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "KL/2070/2000",
    "barRegistrationNumber": "KL/2070/2000",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "Ernakulam District Court"
    ],
    "bio": "24 years of specialized legal practice in Criminal Defence across Kochi and Kerala High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-071",
    "name": "Adv. Yash Bhat",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 31,
    "experienceLevel": "senior",
    "fee": 3500,
    "consultationFee": 3500,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 177,
    "totalReviews": 177,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "D/2071/1993",
    "barRegistrationNumber": "D/2071/1993",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari Courts",
      "Patiala House Courts",
      "Saket District Court"
    ],
    "bio": "31 years of specialized legal practice in Family Law across Delhi and Delhi High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-072",
    "name": "Adv. Abhinav Desai",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 7,
    "experienceLevel": "junior",
    "fee": 2000,
    "consultationFee": 2000,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 10,
    "totalReviews": 10,
    "languages": [
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/2072/2017",
    "barRegistrationNumber": "MH/2072/2017",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil Court Mumbai",
      "Esplanade Metropolitan Court",
      "Bandra Family Court"
    ],
    "bio": "7 years of specialized legal practice in Property Law across Mumbai and Bombay High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-073",
    "name": "Adv. Ananya Gowda",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 14,
    "experienceLevel": "mid",
    "fee": 900,
    "consultationFee": 900,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 23,
    "totalReviews": 23,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/2073/2010",
    "barRegistrationNumber": "KA/2073/2010",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court",
      "Family Court Bengaluru"
    ],
    "bio": "14 years of specialized legal practice in Corporate Law across Bengaluru and Karnataka High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-074",
    "name": "Adv. Aparna Jha",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 21,
    "experienceLevel": "senior",
    "fee": 2400,
    "consultationFee": 2400,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 36,
    "totalReviews": 36,
    "languages": [
      "Telugu",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "TS/2074/2003",
    "barRegistrationNumber": "TS/2074/2003",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Secunderabad Court",
      "Nampally Criminal Court"
    ],
    "bio": "21 years of specialized legal practice in Consumer Rights across Hyderabad and Telangana High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-075",
    "name": "Adv. Chetan Kashyap",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 28,
    "experienceLevel": "senior",
    "fee": 5500,
    "consultationFee": 5500,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 49,
    "totalReviews": 49,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/2075/1996",
    "barRegistrationNumber": "TN/2075/1996",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "George Town Court",
      "Egmore Magistrate Court"
    ],
    "bio": "28 years of specialized legal practice in Labour Law across Chennai and Madras High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-076",
    "name": "Adv. Gautam Majumdar",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 4,
    "experienceLevel": "junior",
    "fee": 2800,
    "consultationFee": 2800,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 62,
    "totalReviews": 62,
    "languages": [
      "Bengali",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "WB/2076/2020",
    "barRegistrationNumber": "WB/2076/2020",
    "barCouncilState": "West Bengal",
    "courts": [
      "Calcutta High Court",
      "City Civil Court Kolkata",
      "Alipore District Court",
      "Sealdah Court"
    ],
    "bio": "4 years of specialized legal practice in Civil Disputes across Kolkata and Calcutta High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-077",
    "name": "Adv. Ishaan Namboodiri",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 11,
    "experienceLevel": "mid",
    "fee": 6500,
    "consultationFee": 6500,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 75,
    "totalReviews": 75,
    "languages": [
      "Marathi",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/2077/2013",
    "barRegistrationNumber": "MH/2077/2013",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Shivajinagar District Court",
      "Bombay High Court",
      "Pune Family Court"
    ],
    "bio": "11 years of specialized legal practice in Divorce across Pune and Shivajinagar District Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-078",
    "name": "Adv. Kunal Pillai",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 18,
    "experienceLevel": "senior",
    "fee": 850,
    "consultationFee": 850,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 88,
    "totalReviews": 88,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "RJ/2078/2006",
    "barRegistrationNumber": "RJ/2078/2006",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court",
      "Jaipur Sessions Court",
      "Jaipur Metro Court"
    ],
    "bio": "18 years of specialized legal practice in Taxation across Jaipur and Rajasthan High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-079",
    "name": "Adv. Mohit Saxena",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 25,
    "experienceLevel": "senior",
    "fee": 7500,
    "consultationFee": 7500,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 101,
    "totalReviews": 101,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/2079/1999",
    "barRegistrationNumber": "GJ/2079/1999",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "City Civil Court Ahmedabad",
      "Mirzapur Court"
    ],
    "bio": "25 years of specialized legal practice in Intellectual Property across Ahmedabad and Gujarat High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-080",
    "name": "Adv. Pallav Shah",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 32,
    "experienceLevel": "senior",
    "fee": 1600,
    "consultationFee": 1600,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 114,
    "totalReviews": 114,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/2080/1992",
    "barRegistrationNumber": "UP/2080/1992",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court (Lucknow Bench)",
      "District Court Lucknow",
      "Kaiserbagh Court"
    ],
    "bio": "32 years of specialized legal practice in Cyber Law across Lucknow and Allahabad High Court (Lucknow Bench). Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-081",
    "name": "Adv. Prateek Sood",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Patna",
    "state": "Bihar",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 8500,
    "consultationFee": 8500,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 127,
    "totalReviews": 127,
    "languages": [
      "Hindi",
      "English",
      "Bhojpuri"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "BR/2081/2016",
    "barRegistrationNumber": "BR/2081/2016",
    "barCouncilState": "Bihar",
    "courts": [
      "Patna High Court",
      "Patna Civil Court",
      "Danapur Sub-Divisional Court"
    ],
    "bio": "8 years of specialized legal practice in Bail & FIR across Patna and Patna High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-082",
    "name": "Adv. Sameer Swami",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Chandigarh",
    "state": "Punjab & Haryana",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 2000,
    "consultationFee": 2000,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 140,
    "totalReviews": 140,
    "languages": [
      "Punjabi",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "PH/2082/2009",
    "barRegistrationNumber": "PH/2082/2009",
    "barCouncilState": "Punjab & Haryana",
    "courts": [
      "Punjab & Haryana High Court",
      "District Court Chandigarh"
    ],
    "bio": "15 years of specialized legal practice in Criminal Defence across Chandigarh and Punjab & Haryana High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-083",
    "name": "Adv. Saurabh Upadhyay",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Kochi",
    "state": "Kerala",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 800,
    "consultationFee": 800,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 153,
    "totalReviews": 153,
    "languages": [
      "Malayalam",
      "English",
      "Tamil"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KL/2083/2002",
    "barRegistrationNumber": "KL/2083/2002",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "Ernakulam District Court"
    ],
    "bio": "22 years of specialized legal practice in Family Law across Kochi and Kerala High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-084",
    "name": "Adv. Siddharth Yadav",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 2400,
    "consultationFee": 2400,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 166,
    "totalReviews": 166,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "D/2084/1995",
    "barRegistrationNumber": "D/2084/1995",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari Courts",
      "Patiala House Courts",
      "Saket District Court"
    ],
    "bio": "29 years of specialized legal practice in Property Law across Delhi and Delhi High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-085",
    "name": "Adv. Uday Bansal",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 5,
    "experienceLevel": "junior",
    "fee": 4000,
    "consultationFee": 4000,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 179,
    "totalReviews": 179,
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/2085/2019",
    "barRegistrationNumber": "MH/2085/2019",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil Court Mumbai",
      "Esplanade Metropolitan Court",
      "Bandra Family Court"
    ],
    "bio": "5 years of specialized legal practice in Corporate Law across Mumbai and Bombay High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-086",
    "name": "Adv. Varun Choudhary",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 12,
    "experienceLevel": "mid",
    "fee": 2800,
    "consultationFee": 2800,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 12,
    "totalReviews": 12,
    "languages": [
      "English",
      "Kannada"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "KA/2086/2012",
    "barRegistrationNumber": "KA/2086/2012",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court",
      "Family Court Bengaluru"
    ],
    "bio": "12 years of specialized legal practice in Consumer Rights across Bengaluru and Karnataka High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-087",
    "name": "Adv. Yash Garg",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 19,
    "experienceLevel": "senior",
    "fee": 5000,
    "consultationFee": 5000,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 25,
    "totalReviews": 25,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TS/2087/2005",
    "barRegistrationNumber": "TS/2087/2005",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Secunderabad Court",
      "Nampally Criminal Court"
    ],
    "bio": "19 years of specialized legal practice in Labour Law across Hyderabad and Telangana High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-088",
    "name": "Adv. Abhinav Iyer",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 26,
    "experienceLevel": "senior",
    "fee": 750,
    "consultationFee": 750,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 38,
    "totalReviews": 38,
    "languages": [
      "Tamil",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/2088/1998",
    "barRegistrationNumber": "TN/2088/1998",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "George Town Court",
      "Egmore Magistrate Court"
    ],
    "bio": "26 years of specialized legal practice in Civil Disputes across Chennai and Madras High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-089",
    "name": "Adv. Ananya Kalam",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 2,
    "experienceLevel": "junior",
    "fee": 6000,
    "consultationFee": 6000,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 51,
    "totalReviews": 51,
    "languages": [
      "Bengali",
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "WB/2089/2022",
    "barRegistrationNumber": "WB/2089/2022",
    "barCouncilState": "West Bengal",
    "courts": [
      "Calcutta High Court",
      "City Civil Court Kolkata",
      "Alipore District Court",
      "Sealdah Court"
    ],
    "bio": "2 years of specialized legal practice in Divorce across Kolkata and Calcutta High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-090",
    "name": "Adv. Aparna Kulkarni",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 9,
    "experienceLevel": "mid",
    "fee": 1600,
    "consultationFee": 1600,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 64,
    "totalReviews": 64,
    "languages": [
      "Marathi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "MH/2090/2015",
    "barRegistrationNumber": "MH/2090/2015",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Shivajinagar District Court",
      "Bombay High Court",
      "Pune Family Court"
    ],
    "bio": "9 years of specialized legal practice in Taxation across Pune and Shivajinagar District Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-091",
    "name": "Adv. Chetan Mukherjee",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 16,
    "experienceLevel": "senior",
    "fee": 7000,
    "consultationFee": 7000,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 77,
    "totalReviews": 77,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/2091/2008",
    "barRegistrationNumber": "RJ/2091/2008",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court",
      "Jaipur Sessions Court",
      "Jaipur Metro Court"
    ],
    "bio": "16 years of specialized legal practice in Intellectual Property across Jaipur and Rajasthan High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-092",
    "name": "Adv. Gautam Pandey",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 23,
    "experienceLevel": "senior",
    "fee": 2000,
    "consultationFee": 2000,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 90,
    "totalReviews": 90,
    "languages": [
      "Gujarati",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/2092/2001",
    "barRegistrationNumber": "GJ/2092/2001",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "City Civil Court Ahmedabad",
      "Mirzapur Court"
    ],
    "bio": "23 years of specialized legal practice in Cyber Law across Ahmedabad and Gujarat High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-093",
    "name": "Adv. Ishaan Rathore",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 30,
    "experienceLevel": "senior",
    "fee": 700,
    "consultationFee": 700,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 103,
    "totalReviews": 103,
    "languages": [
      "Hindi",
      "English",
      "Urdu"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/2093/1994",
    "barRegistrationNumber": "UP/2093/1994",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court (Lucknow Bench)",
      "District Court Lucknow",
      "Kaiserbagh Court"
    ],
    "bio": "30 years of specialized legal practice in Bail & FIR across Lucknow and Allahabad High Court (Lucknow Bench). Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-094",
    "name": "Adv. Kunal Sen",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Patna",
    "state": "Bihar",
    "experience": 6,
    "experienceLevel": "junior",
    "fee": 2400,
    "consultationFee": 2400,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 116,
    "totalReviews": 116,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "BR/2094/2018",
    "barRegistrationNumber": "BR/2094/2018",
    "barCouncilState": "Bihar",
    "courts": [
      "Patna High Court",
      "Patna Civil Court",
      "Danapur Sub-Divisional Court"
    ],
    "bio": "6 years of specialized legal practice in Criminal Defence across Patna and Patna High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-095",
    "name": "Adv. Mohit Shukla",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Chandigarh",
    "state": "Punjab & Haryana",
    "experience": 13,
    "experienceLevel": "mid",
    "fee": 9000,
    "consultationFee": 9000,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 129,
    "totalReviews": 129,
    "languages": [
      "Punjabi",
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "PH/2095/2011",
    "barRegistrationNumber": "PH/2095/2011",
    "barCouncilState": "Punjab & Haryana",
    "courts": [
      "Punjab & Haryana High Court",
      "District Court Chandigarh"
    ],
    "bio": "13 years of specialized legal practice in Family Law across Chandigarh and Punjab & Haryana High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-096",
    "name": "Adv. Pallav Srivastava",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Kochi",
    "state": "Kerala",
    "experience": 20,
    "experienceLevel": "senior",
    "fee": 2800,
    "consultationFee": 2800,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 142,
    "totalReviews": 142,
    "languages": [
      "Malayalam",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KL/2096/2004",
    "barRegistrationNumber": "KL/2096/2004",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "Ernakulam District Court"
    ],
    "bio": "20 years of specialized legal practice in Property Law across Kochi and Kerala High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-097",
    "name": "Adv. Prateek Tripathi",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 27,
    "experienceLevel": "senior",
    "fee": 3500,
    "consultationFee": 3500,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 155,
    "totalReviews": 155,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "D/2097/1997",
    "barRegistrationNumber": "D/2097/1997",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari Courts",
      "Patiala House Courts",
      "Saket District Court"
    ],
    "bio": "27 years of specialized legal practice in Corporate Law across Delhi and Delhi High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-098",
    "name": "Adv. Sameer Varma",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 3,
    "experienceLevel": "junior",
    "fee": 650,
    "consultationFee": 650,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 168,
    "totalReviews": 168,
    "languages": [
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "MH/2098/2021",
    "barRegistrationNumber": "MH/2098/2021",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil Court Mumbai",
      "Esplanade Metropolitan Court",
      "Bandra Family Court"
    ],
    "bio": "3 years of specialized legal practice in Consumer Rights across Mumbai and Bombay High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-099",
    "name": "Adv. Saurabh Banerjee",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 10,
    "experienceLevel": "mid",
    "fee": 4500,
    "consultationFee": 4500,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 181,
    "totalReviews": 181,
    "languages": [
      "English",
      "Kannada",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/2099/2014",
    "barRegistrationNumber": "KA/2099/2014",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court",
      "Family Court Bengaluru"
    ],
    "bio": "10 years of specialized legal practice in Labour Law across Bengaluru and Karnataka High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-100",
    "name": "Adv. Siddharth Bhat",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 17,
    "experienceLevel": "senior",
    "fee": 1600,
    "consultationFee": 1600,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 14,
    "totalReviews": 14,
    "languages": [
      "Telugu",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TS/2100/2007",
    "barRegistrationNumber": "TS/2100/2007",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Secunderabad Court",
      "Nampally Criminal Court"
    ],
    "bio": "17 years of specialized legal practice in Civil Disputes across Hyderabad and Telangana High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-101",
    "name": "Adv. Uday Desai",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 24,
    "experienceLevel": "senior",
    "fee": 5500,
    "consultationFee": 5500,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 27,
    "totalReviews": 27,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/2101/2000",
    "barRegistrationNumber": "TN/2101/2000",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "George Town Court",
      "Egmore Magistrate Court"
    ],
    "bio": "24 years of specialized legal practice in Divorce across Chennai and Madras High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-102",
    "name": "Adv. Varun Gowda",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 31,
    "experienceLevel": "senior",
    "fee": 2000,
    "consultationFee": 2000,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 40,
    "totalReviews": 40,
    "languages": [
      "Bengali",
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "WB/2102/1993",
    "barRegistrationNumber": "WB/2102/1993",
    "barCouncilState": "West Bengal",
    "courts": [
      "Calcutta High Court",
      "City Civil Court Kolkata",
      "Alipore District Court",
      "Sealdah Court"
    ],
    "bio": "31 years of specialized legal practice in Taxation across Kolkata and Calcutta High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-103",
    "name": "Adv. Yash Jha",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 7,
    "experienceLevel": "junior",
    "fee": 600,
    "consultationFee": 600,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 53,
    "totalReviews": 53,
    "languages": [
      "Marathi",
      "English",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/2103/2017",
    "barRegistrationNumber": "MH/2103/2017",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Shivajinagar District Court",
      "Bombay High Court",
      "Pune Family Court"
    ],
    "bio": "7 years of specialized legal practice in Intellectual Property across Pune and Shivajinagar District Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-104",
    "name": "Adv. Abhinav Kashyap",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 14,
    "experienceLevel": "mid",
    "fee": 2400,
    "consultationFee": 2400,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 66,
    "totalReviews": 66,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/2104/2010",
    "barRegistrationNumber": "RJ/2104/2010",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court",
      "Jaipur Sessions Court",
      "Jaipur Metro Court"
    ],
    "bio": "14 years of specialized legal practice in Cyber Law across Jaipur and Rajasthan High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-105",
    "name": "Adv. Ananya Majumdar",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 21,
    "experienceLevel": "senior",
    "fee": 7500,
    "consultationFee": 7500,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 79,
    "totalReviews": 79,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/2105/2003",
    "barRegistrationNumber": "GJ/2105/2003",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "City Civil Court Ahmedabad",
      "Mirzapur Court"
    ],
    "bio": "21 years of specialized legal practice in Bail & FIR across Ahmedabad and Gujarat High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-106",
    "name": "Adv. Aparna Namboodiri",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 28,
    "experienceLevel": "senior",
    "fee": 2800,
    "consultationFee": 2800,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 92,
    "totalReviews": 92,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "UP/2106/1996",
    "barRegistrationNumber": "UP/2106/1996",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court (Lucknow Bench)",
      "District Court Lucknow",
      "Kaiserbagh Court"
    ],
    "bio": "28 years of specialized legal practice in Criminal Defence across Lucknow and Allahabad High Court (Lucknow Bench). Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-107",
    "name": "Adv. Chetan Pillai",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Patna",
    "state": "Bihar",
    "experience": 4,
    "experienceLevel": "junior",
    "fee": 8500,
    "consultationFee": 8500,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 105,
    "totalReviews": 105,
    "languages": [
      "Hindi",
      "English",
      "Bhojpuri"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "BR/2107/2020",
    "barRegistrationNumber": "BR/2107/2020",
    "barCouncilState": "Bihar",
    "courts": [
      "Patna High Court",
      "Patna Civil Court",
      "Danapur Sub-Divisional Court"
    ],
    "bio": "4 years of specialized legal practice in Family Law across Patna and Patna High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-108",
    "name": "Adv. Gautam Saxena",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Chandigarh",
    "state": "Punjab & Haryana",
    "experience": 11,
    "experienceLevel": "mid",
    "fee": 550,
    "consultationFee": 550,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 118,
    "totalReviews": 118,
    "languages": [
      "Punjabi",
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "PH/2108/2013",
    "barRegistrationNumber": "PH/2108/2013",
    "barCouncilState": "Punjab & Haryana",
    "courts": [
      "Punjab & Haryana High Court",
      "District Court Chandigarh"
    ],
    "bio": "11 years of specialized legal practice in Property Law across Chandigarh and Punjab & Haryana High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-109",
    "name": "Adv. Ishaan Shah",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Kochi",
    "state": "Kerala",
    "experience": 18,
    "experienceLevel": "senior",
    "fee": 9500,
    "consultationFee": 9500,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 131,
    "totalReviews": 131,
    "languages": [
      "Malayalam",
      "English",
      "Tamil"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KL/2109/2006",
    "barRegistrationNumber": "KL/2109/2006",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "Ernakulam District Court"
    ],
    "bio": "18 years of specialized legal practice in Corporate Law across Kochi and Kerala High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-110",
    "name": "Adv. Kunal Sood",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 25,
    "experienceLevel": "senior",
    "fee": 1600,
    "consultationFee": 1600,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 144,
    "totalReviews": 144,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "D/2110/1999",
    "barRegistrationNumber": "D/2110/1999",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari Courts",
      "Patiala House Courts",
      "Saket District Court"
    ],
    "bio": "25 years of specialized legal practice in Consumer Rights across Delhi and Delhi High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-111",
    "name": "Adv. Mohit Swami",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 32,
    "experienceLevel": "senior",
    "fee": 4000,
    "consultationFee": 4000,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 157,
    "totalReviews": 157,
    "languages": [
      "English",
      "Hindi",
      "Marathi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/2111/1992",
    "barRegistrationNumber": "MH/2111/1992",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil Court Mumbai",
      "Esplanade Metropolitan Court",
      "Bandra Family Court"
    ],
    "bio": "32 years of specialized legal practice in Labour Law across Mumbai and Bombay High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-112",
    "name": "Adv. Pallav Upadhyay",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 2000,
    "consultationFee": 2000,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 170,
    "totalReviews": 170,
    "languages": [
      "English",
      "Kannada"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/2112/2016",
    "barRegistrationNumber": "KA/2112/2016",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court",
      "Family Court Bengaluru"
    ],
    "bio": "8 years of specialized legal practice in Civil Disputes across Bengaluru and Karnataka High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-113",
    "name": "Adv. Prateek Yadav",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 183,
    "totalReviews": 183,
    "languages": [
      "Telugu",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TS/2113/2009",
    "barRegistrationNumber": "TS/2113/2009",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Secunderabad Court",
      "Nampally Criminal Court"
    ],
    "bio": "15 years of specialized legal practice in Divorce across Hyderabad and Telangana High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-114",
    "name": "Adv. Sameer Bansal",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 2400,
    "consultationFee": 2400,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 16,
    "totalReviews": 16,
    "languages": [
      "Tamil",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "TN/2114/2002",
    "barRegistrationNumber": "TN/2114/2002",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "George Town Court",
      "Egmore Magistrate Court"
    ],
    "bio": "22 years of specialized legal practice in Taxation across Chennai and Madras High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-115",
    "name": "Adv. Saurabh Choudhary",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 6000,
    "consultationFee": 6000,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 29,
    "totalReviews": 29,
    "languages": [
      "Bengali",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "WB/2115/1995",
    "barRegistrationNumber": "WB/2115/1995",
    "barCouncilState": "West Bengal",
    "courts": [
      "Calcutta High Court",
      "City Civil Court Kolkata",
      "Alipore District Court",
      "Sealdah Court"
    ],
    "bio": "29 years of specialized legal practice in Intellectual Property across Kolkata and Calcutta High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-116",
    "name": "Adv. Siddharth Garg",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 5,
    "experienceLevel": "junior",
    "fee": 2800,
    "consultationFee": 2800,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 42,
    "totalReviews": 42,
    "languages": [
      "Marathi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/2116/2019",
    "barRegistrationNumber": "MH/2116/2019",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Shivajinagar District Court",
      "Bombay High Court",
      "Pune Family Court"
    ],
    "bio": "5 years of specialized legal practice in Cyber Law across Pune and Shivajinagar District Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  },
  {
    "_id": "demo-117",
    "name": "Adv. Uday Iyer",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 12,
    "experienceLevel": "mid",
    "fee": 7000,
    "consultationFee": 7000,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 55,
    "totalReviews": 55,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/2117/2012",
    "barRegistrationNumber": "RJ/2117/2012",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court",
      "Jaipur Sessions Court",
      "Jaipur Metro Court"
    ],
    "bio": "12 years of specialized legal practice in Bail & FIR across Jaipur and Rajasthan High Court. Proven record in legal advisory, dispute settlement, and client advocacy."
  }
];

export default demoLawyers;
