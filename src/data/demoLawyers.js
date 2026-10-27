// Comprehensive Demo Lawyers Database — 210 Verified Advocates
// Fully covers:
// - All 12 Legal Practice Specializations
// - All Major Indian Cities, States & Union Territories (37 jurisdictions)
// - All Regional Languages (Hindi, English, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Punjabi, Urdu, Malayalam, Odia, Assamese, Bhojpuri, Marwari, Tulu, Konkani, Kashmiri)
// - All Budget Tiers (₹500 to ₹12,000)
// - All Rating Tiers (3.3 to 5.0 Stars)
// - All Experience Levels (Junior, Mid, Senior)
// - All Consultation Modes (Online, Offline, Both)
const demoLawyers = [
  {
    "_id": "demo-001",
    "name": "Adv. Aaditya Bafna",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 500,
    "consultationFee": 500,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 5,
    "totalReviews": 5,
    "languages": [
      "Hindi",
      "English",
      "Punjabi",
      "Urdu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "D/1001/2023",
    "barRegistrationNumber": "D/1001/2023",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari District Court",
      "Patiala House Court",
      "Saket Court"
    ],
    "bio": "1 years of specialized legal practice in Criminal Defence before Delhi High Court. Handled over 15+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-002",
    "name": "Adv. Aakash Bhat",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Chandigarh",
    "state": "Punjab & Haryana",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 750,
    "consultationFee": 750,
    "rating": 3.4,
    "averageRating": 3.4,
    "reviewCount": 16,
    "totalReviews": 16,
    "languages": [
      "Punjabi",
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "PH/1002/2016",
    "barRegistrationNumber": "PH/1002/2016",
    "barCouncilState": "Punjab & Haryana",
    "courts": [
      "Punjab & Haryana High Court",
      "District Court Chandigarh"
    ],
    "bio": "8 years of specialized legal practice in Family Law before District Court Chandigarh. Handled over 48+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-003",
    "name": "Adv. Abhinav Bhattacharya",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 900,
    "consultationFee": 900,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 27,
    "totalReviews": 27,
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1003/2009",
    "barRegistrationNumber": "UP/1003/2009",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court (Lucknow Bench)",
      "Lucknow District Court"
    ],
    "bio": "15 years of specialized legal practice in Property Law before Allahabad High Court (Lucknow Bench). Handled over 81+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-004",
    "name": "Adv. Aditi Chadha",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Noida",
    "state": "Uttar Pradesh",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 38,
    "totalReviews": 38,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1004/2002",
    "barRegistrationNumber": "UP/1004/2002",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "Surajpur District Court Gautam Buddha Nagar"
    ],
    "bio": "22 years of specialized legal practice in Corporate Law before Surajpur District Court Gautam Buddha Nagar. Handled over 114+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-005",
    "name": "Adv. Alok Chopra",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Kanpur",
    "state": "Uttar Pradesh",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1200,
    "consultationFee": 1200,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 49,
    "totalReviews": 49,
    "languages": [
      "Hindi",
      "English",
      "Urdu"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1005/1995",
    "barRegistrationNumber": "UP/1005/1995",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "Kanpur Nagar District Court"
    ],
    "bio": "29 years of specialized legal practice in Consumer Rights before Allahabad High Court. Handled over 147+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-006",
    "name": "Adv. Amit Deshmukh",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Prayagraj",
    "state": "Uttar Pradesh",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 60,
    "totalReviews": 60,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "UP/1006/2023",
    "barRegistrationNumber": "UP/1006/2023",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "District Court Allahabad"
    ],
    "bio": "1 years of specialized legal practice in Labour Law before District Court Allahabad. Handled over 180+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-007",
    "name": "Adv. Anand Dhillon",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Dehradun",
    "state": "Uttarakhand",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 3500,
    "consultationFee": 3500,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 71,
    "totalReviews": 71,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UK/1007/2016",
    "barRegistrationNumber": "UK/1007/2016",
    "barCouncilState": "Uttarakhand",
    "courts": [
      "Uttarakhand High Court",
      "Dehradun District Court"
    ],
    "bio": "8 years of specialized legal practice in Civil Disputes before Uttarakhand High Court. Handled over 213+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-008",
    "name": "Adv. Ananya Farooqui",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Shimla",
    "state": "Himachal Pradesh",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 4000,
    "consultationFee": 4000,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 82,
    "totalReviews": 82,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "HP/1008/2009",
    "barRegistrationNumber": "HP/1008/2009",
    "barCouncilState": "Himachal Pradesh",
    "courts": [
      "Himachal Pradesh High Court",
      "District Court Shimla"
    ],
    "bio": "15 years of specialized legal practice in Divorce before District Court Shimla. Handled over 246+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-009",
    "name": "Adv. Anil Gowda",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Srinagar",
    "state": "Jammu and Kashmir",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 4500,
    "consultationFee": 4500,
    "rating": 3.4,
    "averageRating": 3.4,
    "reviewCount": 93,
    "totalReviews": 93,
    "languages": [
      "Kashmiri",
      "Urdu",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "JK/1009/2002",
    "barRegistrationNumber": "JK/1009/2002",
    "barCouncilState": "Jammu and Kashmir",
    "courts": [
      "Jammu & Kashmir High Court",
      "District Court Srinagar"
    ],
    "bio": "22 years of specialized legal practice in Taxation before Jammu & Kashmir High Court. Handled over 279+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-010",
    "name": "Adv. Aniruddh Hegde",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Jammu",
    "state": "Jammu and Kashmir",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 6000,
    "consultationFee": 6000,
    "rating": 3.5,
    "averageRating": 3.5,
    "reviewCount": 104,
    "totalReviews": 104,
    "languages": [
      "Hindi",
      "Dogri",
      "Urdu",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "JK/1010/1995",
    "barRegistrationNumber": "JK/1010/1995",
    "barCouncilState": "Jammu and Kashmir",
    "courts": [
      "Jammu & Kashmir High Court",
      "District Court Jammu"
    ],
    "bio": "29 years of specialized legal practice in Intellectual Property before District Court Jammu. Handled over 312+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-011",
    "name": "Adv. Anita Joshi",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 115,
    "totalReviews": 115,
    "languages": [
      "English",
      "Marathi",
      "Hindi",
      "Gujarati"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "MH/1011/2023",
    "barRegistrationNumber": "MH/1011/2023",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil & Sessions Court Mumbai",
      "Bandra Family Court"
    ],
    "bio": "1 years of specialized legal practice in Cyber Law before City Civil & Sessions Court Mumbai. Handled over 345+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-012",
    "name": "Adv. Anjali Kashyap",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 900,
    "consultationFee": 900,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 126,
    "totalReviews": 126,
    "languages": [
      "Marathi",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1012/2016",
    "barRegistrationNumber": "MH/1012/2016",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Shivajinagar District Court Pune",
      "Pune Family Court"
    ],
    "bio": "8 years of specialized legal practice in Bail & FIR before Pune Family Court. Handled over 378+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-013",
    "name": "Adv. Ankita Krishnamurthy",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Nagpur",
    "state": "Maharashtra",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 137,
    "totalReviews": 137,
    "languages": [
      "Marathi",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1013/2009",
    "barRegistrationNumber": "MH/1013/2009",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court (Nagpur Bench)",
      "District Court Nagpur"
    ],
    "bio": "15 years of specialized legal practice in Criminal Defence before Bombay High Court (Nagpur Bench). Handled over 411+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-014",
    "name": "Adv. Aparna Kumar",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 148,
    "totalReviews": 148,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/1014/2002",
    "barRegistrationNumber": "GJ/1014/2002",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "City Civil Court Ahmedabad"
    ],
    "bio": "22 years of specialized legal practice in Family Law before City Civil Court Ahmedabad. Handled over 444+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-015",
    "name": "Adv. Arjun Majumdar",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Surat",
    "state": "Gujarat",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1800,
    "consultationFee": 1800,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 159,
    "totalReviews": 159,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/1015/1995",
    "barRegistrationNumber": "GJ/1015/1995",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "District Court Surat"
    ],
    "bio": "29 years of specialized legal practice in Property Law before Gujarat High Court. Handled over 477+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-016",
    "name": "Adv. Arun Mehrotra",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Vadodara",
    "state": "Gujarat",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 170,
    "totalReviews": 170,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "GJ/1016/2023",
    "barRegistrationNumber": "GJ/1016/2023",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "District Court Vadodara"
    ],
    "bio": "1 years of specialized legal practice in Corporate Law before District Court Vadodara. Handled over 510+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-017",
    "name": "Adv. Arvind Mukherjee",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 4000,
    "consultationFee": 4000,
    "rating": 3.5,
    "averageRating": 3.5,
    "reviewCount": 181,
    "totalReviews": 181,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/1017/2016",
    "barRegistrationNumber": "RJ/1017/2016",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court (Jaipur Bench)",
      "District & Sessions Court Jaipur"
    ],
    "bio": "8 years of specialized legal practice in Consumer Rights before Rajasthan High Court (Jaipur Bench). Handled over 543+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-018",
    "name": "Adv. Ashish Nambiar",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Jodhpur",
    "state": "Rajasthan",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 4500,
    "consultationFee": 4500,
    "rating": 3.6,
    "averageRating": 3.6,
    "reviewCount": 192,
    "totalReviews": 192,
    "languages": [
      "Hindi",
      "Marwari",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/1018/2009",
    "barRegistrationNumber": "RJ/1018/2009",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court Principal Seat Jodhpur"
    ],
    "bio": "15 years of specialized legal practice in Labour Law before Rajasthan High Court Principal Seat Jodhpur. Handled over 576+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-019",
    "name": "Adv. Bhavna Patel",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Panaji",
    "state": "Goa",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 2800,
    "consultationFee": 2800,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 8,
    "totalReviews": 8,
    "languages": [
      "Konkani",
      "English",
      "Marathi",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GA/1019/2002",
    "barRegistrationNumber": "GA/1019/2002",
    "barCouncilState": "Goa",
    "courts": [
      "Bombay High Court at Goa",
      "North Goa District Court"
    ],
    "bio": "22 years of specialized legal practice in Civil Disputes before Bombay High Court at Goa. Handled over 24+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-020",
    "name": "Adv. Biju Prabhu",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 7500,
    "consultationFee": 7500,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 19,
    "totalReviews": 19,
    "languages": [
      "Kannada",
      "English",
      "Hindi",
      "Tamil",
      "Telugu",
      "Tulu"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1020/1995",
    "barRegistrationNumber": "KA/1020/1995",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court"
    ],
    "bio": "29 years of specialized legal practice in Divorce before City Civil Court Bengaluru. Handled over 57+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-021",
    "name": "Adv. Chetan Qureshi",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Mangaluru",
    "state": "Karnataka",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 900,
    "consultationFee": 900,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 30,
    "totalReviews": 30,
    "languages": [
      "Tulu",
      "Kannada",
      "English",
      "Konkani",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "KA/1021/2023",
    "barRegistrationNumber": "KA/1021/2023",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "District Court Mangaluru"
    ],
    "bio": "1 years of specialized legal practice in Taxation before Karnataka High Court. Handled over 90+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-022",
    "name": "Adv. Deepa Rajan",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 41,
    "totalReviews": 41,
    "languages": [
      "Telugu",
      "English",
      "Hindi",
      "Urdu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TS/1022/2016",
    "barRegistrationNumber": "TS/1022/2016",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Nampally Criminal Court"
    ],
    "bio": "8 years of specialized legal practice in Intellectual Property before Telangana High Court. Handled over 123+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-023",
    "name": "Adv. Deepak Reddy",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 52,
    "totalReviews": 52,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1023/2009",
    "barRegistrationNumber": "TN/1023/2009",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "Egmore Magistrate Court"
    ],
    "bio": "15 years of specialized legal practice in Cyber Law before City Civil Court Chennai. Handled over 156+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-024",
    "name": "Adv. Deepika Sen",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 63,
    "totalReviews": 63,
    "languages": [
      "Tamil",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1024/2002",
    "barRegistrationNumber": "TN/1024/2002",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "District Court Coimbatore"
    ],
    "bio": "22 years of specialized legal practice in Bail & FIR before District Court Coimbatore. Handled over 189+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-025",
    "name": "Adv. Devendra Shah",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Madurai",
    "state": "Tamil Nadu",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1200,
    "consultationFee": 1200,
    "rating": 3.6,
    "averageRating": 3.6,
    "reviewCount": 74,
    "totalReviews": 74,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1025/1995",
    "barRegistrationNumber": "TN/1025/1995",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court (Madurai Bench)",
      "District Court Madurai"
    ],
    "bio": "29 years of specialized legal practice in Criminal Defence before Madras High Court (Madurai Bench). Handled over 222+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-026",
    "name": "Adv. Dilip Shukla",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Kochi",
    "state": "Kerala",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 3.7,
    "averageRating": 3.7,
    "reviewCount": 85,
    "totalReviews": 85,
    "languages": [
      "Malayalam",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "KL/1026/2023",
    "barRegistrationNumber": "KL/1026/2023",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "Ernakulam District Court"
    ],
    "bio": "1 years of specialized legal practice in Family Law before Ernakulam District Court. Handled over 255+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-027",
    "name": "Adv. Divya Somaiya",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Thiruvananthapuram",
    "state": "Kerala",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 4500,
    "consultationFee": 4500,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 96,
    "totalReviews": 96,
    "languages": [
      "Malayalam",
      "English",
      "Tamil",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KL/1027/2016",
    "barRegistrationNumber": "KL/1027/2016",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "District Court Vanchiyoor"
    ],
    "bio": "8 years of specialized legal practice in Property Law before Kerala High Court. Handled over 288+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-028",
    "name": "Adv. Farhan Sundaram",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 2800,
    "consultationFee": 2800,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 107,
    "totalReviews": 107,
    "languages": [
      "Bengali",
      "English",
      "Hindi",
      "Odia"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "WB/1028/2009",
    "barRegistrationNumber": "WB/1028/2009",
    "barCouncilState": "West Bengal",
    "courts": [
      "Calcutta High Court",
      "City Civil Court Kolkata",
      "Alipore Court"
    ],
    "bio": "15 years of specialized legal practice in Corporate Law before Calcutta High Court. Handled over 321+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-029",
    "name": "Adv. Farida Tiwari",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Bhubaneswar",
    "state": "Odisha",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 3200,
    "consultationFee": 3200,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 118,
    "totalReviews": 118,
    "languages": [
      "Odia",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "OD/1029/2002",
    "barRegistrationNumber": "OD/1029/2002",
    "barCouncilState": "Odisha",
    "courts": [
      "Orissa High Court",
      "District Court Bhubaneswar"
    ],
    "bio": "22 years of specialized legal practice in Consumer Rights before Orissa High Court. Handled over 354+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-030",
    "name": "Adv. Gautam Upadhyay",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Cuttack",
    "state": "Odisha",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 9000,
    "consultationFee": 9000,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 129,
    "totalReviews": 129,
    "languages": [
      "Odia",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "OD/1030/1995",
    "barRegistrationNumber": "OD/1030/1995",
    "barCouncilState": "Odisha",
    "courts": [
      "Orissa High Court Cuttack",
      "District Court Cuttack"
    ],
    "bio": "29 years of specialized legal practice in Labour Law before District Court Cuttack. Handled over 387+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-031",
    "name": "Adv. Geeta Verma",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Patna",
    "state": "Bihar",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 140,
    "totalReviews": 140,
    "languages": [
      "Hindi",
      "Bhojpuri",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "BR/1031/2023",
    "barRegistrationNumber": "BR/1031/2023",
    "barCouncilState": "Bihar",
    "courts": [
      "Patna High Court",
      "Patna Civil Court"
    ],
    "bio": "1 years of specialized legal practice in Civil Disputes before Patna High Court. Handled over 420+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-032",
    "name": "Adv. Gopal Acharya",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Ranchi",
    "state": "Jharkhand",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 151,
    "totalReviews": 151,
    "languages": [
      "Hindi",
      "English",
      "Bengali"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "JH/1032/2016",
    "barRegistrationNumber": "JH/1032/2016",
    "barCouncilState": "Jharkhand",
    "courts": [
      "Jharkhand High Court",
      "District Court Ranchi"
    ],
    "bio": "8 years of specialized legal practice in Divorce before District Court Ranchi. Handled over 453+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-033",
    "name": "Adv. Gurpreet Ahmed",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Guwahati",
    "state": "Assam",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 900,
    "consultationFee": 900,
    "rating": 3.7,
    "averageRating": 3.7,
    "reviewCount": 162,
    "totalReviews": 162,
    "languages": [
      "Assamese",
      "English",
      "Hindi",
      "Bengali"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "AS/1033/2009",
    "barRegistrationNumber": "AS/1033/2009",
    "barCouncilState": "Assam",
    "courts": [
      "Gauhati High Court",
      "District Court Kamrup Guwahati"
    ],
    "bio": "15 years of specialized legal practice in Taxation before Gauhati High Court. Handled over 486+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-034",
    "name": "Adv. Harish Ansari",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Indore",
    "state": "Madhya Pradesh",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 3.8,
    "averageRating": 3.8,
    "reviewCount": 173,
    "totalReviews": 173,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MP/1034/2002",
    "barRegistrationNumber": "MP/1034/2002",
    "barCouncilState": "Madhya Pradesh",
    "courts": [
      "Madhya Pradesh High Court (Indore Bench)",
      "District Court Indore"
    ],
    "bio": "22 years of specialized legal practice in Intellectual Property before District Court Indore. Handled over 519+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-035",
    "name": "Adv. Harishchandra Bansal",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Bhopal",
    "state": "Madhya Pradesh",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1800,
    "consultationFee": 1800,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 184,
    "totalReviews": 184,
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MP/1035/1995",
    "barRegistrationNumber": "MP/1035/1995",
    "barCouncilState": "Madhya Pradesh",
    "courts": [
      "Madhya Pradesh High Court",
      "District Court Bhopal"
    ],
    "bio": "29 years of specialized legal practice in Cyber Law before Madhya Pradesh High Court. Handled over 552+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-036",
    "name": "Adv. Himanshu Bhatt",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Raipur",
    "state": "Chhattisgarh",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 195,
    "totalReviews": 195,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "CG/1036/2023",
    "barRegistrationNumber": "CG/1036/2023",
    "barCouncilState": "Chhattisgarh",
    "courts": [
      "Chhattisgarh High Court",
      "District Court Raipur"
    ],
    "bio": "1 years of specialized legal practice in Bail & FIR before District Court Raipur. Handled over 585+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-037",
    "name": "Adv. Imran Bose",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 2800,
    "consultationFee": 2800,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 11,
    "totalReviews": 11,
    "languages": [
      "Hindi",
      "English",
      "Punjabi",
      "Urdu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "D/1037/2016",
    "barRegistrationNumber": "D/1037/2016",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari District Court",
      "Patiala House Court",
      "Saket Court"
    ],
    "bio": "8 years of specialized legal practice in Criminal Defence before Delhi High Court. Handled over 33+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-038",
    "name": "Adv. Ishaan Chaturvedi",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Chandigarh",
    "state": "Punjab & Haryana",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 3200,
    "consultationFee": 3200,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 22,
    "totalReviews": 22,
    "languages": [
      "Punjabi",
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "PH/1038/2009",
    "barRegistrationNumber": "PH/1038/2009",
    "barCouncilState": "Punjab & Haryana",
    "courts": [
      "Punjab & Haryana High Court",
      "District Court Chandigarh"
    ],
    "bio": "15 years of specialized legal practice in Family Law before District Court Chandigarh. Handled over 66+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-039",
    "name": "Adv. Jitendra Desai",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 3800,
    "consultationFee": 3800,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 33,
    "totalReviews": 33,
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1039/2002",
    "barRegistrationNumber": "UP/1039/2002",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court (Lucknow Bench)",
      "Lucknow District Court"
    ],
    "bio": "22 years of specialized legal practice in Property Law before Allahabad High Court (Lucknow Bench). Handled over 99+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-040",
    "name": "Adv. Jyoti Dewan",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Noida",
    "state": "Uttar Pradesh",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 12000,
    "consultationFee": 12000,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 44,
    "totalReviews": 44,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1040/1995",
    "barRegistrationNumber": "UP/1040/1995",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "Surajpur District Court Gautam Buddha Nagar"
    ],
    "bio": "29 years of specialized legal practice in Corporate Law before Surajpur District Court Gautam Buddha Nagar. Handled over 132+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-041",
    "name": "Adv. Kalpana Dubey",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Kanpur",
    "state": "Uttar Pradesh",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 750,
    "consultationFee": 750,
    "rating": 3.8,
    "averageRating": 3.8,
    "reviewCount": 55,
    "totalReviews": 55,
    "languages": [
      "Hindi",
      "English",
      "Urdu"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "UP/1041/2023",
    "barRegistrationNumber": "UP/1041/2023",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "Kanpur Nagar District Court"
    ],
    "bio": "1 years of specialized legal practice in Consumer Rights before Allahabad High Court. Handled over 165+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-042",
    "name": "Adv. Kamlesh Goswami",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Prayagraj",
    "state": "Uttar Pradesh",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 900,
    "consultationFee": 900,
    "rating": 3.9,
    "averageRating": 3.9,
    "reviewCount": 66,
    "totalReviews": 66,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1042/2016",
    "barRegistrationNumber": "UP/1042/2016",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "District Court Allahabad"
    ],
    "bio": "8 years of specialized legal practice in Labour Law before District Court Allahabad. Handled over 198+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-043",
    "name": "Adv. Karthik Gupta",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Dehradun",
    "state": "Uttarakhand",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 77,
    "totalReviews": 77,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UK/1043/2009",
    "barRegistrationNumber": "UK/1043/2009",
    "barCouncilState": "Uttarakhand",
    "courts": [
      "Uttarakhand High Court",
      "Dehradun District Court"
    ],
    "bio": "15 years of specialized legal practice in Civil Disputes before Uttarakhand High Court. Handled over 231+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-044",
    "name": "Adv. Kavita Jha",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Shimla",
    "state": "Himachal Pradesh",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 88,
    "totalReviews": 88,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "HP/1044/2002",
    "barRegistrationNumber": "HP/1044/2002",
    "barCouncilState": "Himachal Pradesh",
    "courts": [
      "Himachal Pradesh High Court",
      "District Court Shimla"
    ],
    "bio": "22 years of specialized legal practice in Divorce before District Court Shimla. Handled over 264+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-045",
    "name": "Adv. Kavya Kapoor",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Srinagar",
    "state": "Jammu and Kashmir",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1200,
    "consultationFee": 1200,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 99,
    "totalReviews": 99,
    "languages": [
      "Kashmiri",
      "Urdu",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "JK/1045/1995",
    "barRegistrationNumber": "JK/1045/1995",
    "barCouncilState": "Jammu and Kashmir",
    "courts": [
      "Jammu & Kashmir High Court",
      "District Court Srinagar"
    ],
    "bio": "29 years of specialized legal practice in Taxation before Jammu & Kashmir High Court. Handled over 297+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-046",
    "name": "Adv. Kunal Kothari",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Jammu",
    "state": "Jammu and Kashmir",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 110,
    "totalReviews": 110,
    "languages": [
      "Hindi",
      "Dogri",
      "Urdu",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "JK/1046/2023",
    "barRegistrationNumber": "JK/1046/2023",
    "barCouncilState": "Jammu and Kashmir",
    "courts": [
      "Jammu & Kashmir High Court",
      "District Court Jammu"
    ],
    "bio": "1 years of specialized legal practice in Intellectual Property before District Court Jammu. Handled over 330+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-047",
    "name": "Adv. Lakshmi Kulkarni",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 3200,
    "consultationFee": 3200,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 121,
    "totalReviews": 121,
    "languages": [
      "English",
      "Marathi",
      "Hindi",
      "Gujarati"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1047/2016",
    "barRegistrationNumber": "MH/1047/2016",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil & Sessions Court Mumbai",
      "Bandra Family Court"
    ],
    "bio": "8 years of specialized legal practice in Cyber Law before City Civil & Sessions Court Mumbai. Handled over 363+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-048",
    "name": "Adv. Madan Mahapatra",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 3800,
    "consultationFee": 3800,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 132,
    "totalReviews": 132,
    "languages": [
      "Marathi",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1048/2009",
    "barRegistrationNumber": "MH/1048/2009",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Shivajinagar District Court Pune",
      "Pune Family Court"
    ],
    "bio": "15 years of specialized legal practice in Bail & FIR before Pune Family Court. Handled over 396+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-049",
    "name": "Adv. Madhav Mathew",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Nagpur",
    "state": "Maharashtra",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 4200,
    "consultationFee": 4200,
    "rating": 3.9,
    "averageRating": 3.9,
    "reviewCount": 143,
    "totalReviews": 143,
    "languages": [
      "Marathi",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1049/2002",
    "barRegistrationNumber": "MH/1049/2002",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court (Nagpur Bench)",
      "District Court Nagpur"
    ],
    "bio": "22 years of specialized legal practice in Criminal Defence before Bombay High Court (Nagpur Bench). Handled over 429+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-050",
    "name": "Adv. Mala Mishra",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 6000,
    "consultationFee": 6000,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 154,
    "totalReviews": 154,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/1050/1995",
    "barRegistrationNumber": "GJ/1050/1995",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "City Civil Court Ahmedabad"
    ],
    "bio": "29 years of specialized legal practice in Family Law before City Civil Court Ahmedabad. Handled over 462+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-051",
    "name": "Adv. Manasvi Nair",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Surat",
    "state": "Gujarat",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 900,
    "consultationFee": 900,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 165,
    "totalReviews": 165,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "GJ/1051/2023",
    "barRegistrationNumber": "GJ/1051/2023",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "District Court Surat"
    ],
    "bio": "1 years of specialized legal practice in Property Law before Gujarat High Court. Handled over 495+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-052",
    "name": "Adv. Manish Panigrahi",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Vadodara",
    "state": "Gujarat",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 176,
    "totalReviews": 176,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/1052/2016",
    "barRegistrationNumber": "GJ/1052/2016",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "District Court Vadodara"
    ],
    "bio": "8 years of specialized legal practice in Corporate Law before District Court Vadodara. Handled over 528+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-053",
    "name": "Adv. Meenakshi Pillai",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 187,
    "totalReviews": 187,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/1053/2009",
    "barRegistrationNumber": "RJ/1053/2009",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court (Jaipur Bench)",
      "District & Sessions Court Jaipur"
    ],
    "bio": "15 years of specialized legal practice in Consumer Rights before Rajasthan High Court (Jaipur Bench). Handled over 561+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-054",
    "name": "Adv. Meera Puri",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Jodhpur",
    "state": "Rajasthan",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 198,
    "totalReviews": 198,
    "languages": [
      "Hindi",
      "Marwari",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/1054/2002",
    "barRegistrationNumber": "RJ/1054/2002",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court Principal Seat Jodhpur"
    ],
    "bio": "22 years of specialized legal practice in Labour Law before Rajasthan High Court Principal Seat Jodhpur. Handled over 594+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-055",
    "name": "Adv. Mohammed Raghavan",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Panaji",
    "state": "Goa",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1800,
    "consultationFee": 1800,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 14,
    "totalReviews": 14,
    "languages": [
      "Konkani",
      "English",
      "Marathi",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GA/1055/1995",
    "barRegistrationNumber": "GA/1055/1995",
    "barCouncilState": "Goa",
    "courts": [
      "Bombay High Court at Goa",
      "North Goa District Court"
    ],
    "bio": "29 years of specialized legal practice in Civil Disputes before Bombay High Court at Goa. Handled over 42+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-056",
    "name": "Adv. Mohit Rathore",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 25,
    "totalReviews": 25,
    "languages": [
      "Kannada",
      "English",
      "Hindi",
      "Tamil",
      "Telugu",
      "Tulu"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "KA/1056/2023",
    "barRegistrationNumber": "KA/1056/2023",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court"
    ],
    "bio": "1 years of specialized legal practice in Divorce before City Civil Court Bengaluru. Handled over 75+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-057",
    "name": "Adv. Narendra Saxena",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Mangaluru",
    "state": "Karnataka",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 3800,
    "consultationFee": 3800,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 36,
    "totalReviews": 36,
    "languages": [
      "Tulu",
      "Kannada",
      "English",
      "Konkani",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1057/2016",
    "barRegistrationNumber": "KA/1057/2016",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "District Court Mangaluru"
    ],
    "bio": "8 years of specialized legal practice in Taxation before Karnataka High Court. Handled over 108+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-058",
    "name": "Adv. Naseem Sethi",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 4200,
    "consultationFee": 4200,
    "rating": 3.4,
    "averageRating": 3.4,
    "reviewCount": 47,
    "totalReviews": 47,
    "languages": [
      "Telugu",
      "English",
      "Hindi",
      "Urdu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TS/1058/2009",
    "barRegistrationNumber": "TS/1058/2009",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Nampally Criminal Court"
    ],
    "bio": "15 years of specialized legal practice in Intellectual Property before Telangana High Court. Handled over 141+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-059",
    "name": "Adv. Natasha Shetty",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 5000,
    "consultationFee": 5000,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 58,
    "totalReviews": 58,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1059/2002",
    "barRegistrationNumber": "TN/1059/2002",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "Egmore Magistrate Court"
    ],
    "bio": "22 years of specialized legal practice in Cyber Law before City Civil Court Chennai. Handled over 174+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-060",
    "name": "Adv. Naveen Singhania",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 7500,
    "consultationFee": 7500,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 69,
    "totalReviews": 69,
    "languages": [
      "Tamil",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1060/1995",
    "barRegistrationNumber": "TN/1060/1995",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "District Court Coimbatore"
    ],
    "bio": "29 years of specialized legal practice in Bail & FIR before District Court Coimbatore. Handled over 207+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-061",
    "name": "Adv. Neha Srivastava",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Madurai",
    "state": "Tamil Nadu",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 80,
    "totalReviews": 80,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "TN/1061/2023",
    "barRegistrationNumber": "TN/1061/2023",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court (Madurai Bench)",
      "District Court Madurai"
    ],
    "bio": "1 years of specialized legal practice in Criminal Defence before Madras High Court (Madurai Bench). Handled over 240+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-062",
    "name": "Adv. Nidhi Thakor",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Kochi",
    "state": "Kerala",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 91,
    "totalReviews": 91,
    "languages": [
      "Malayalam",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KL/1062/2016",
    "barRegistrationNumber": "KL/1062/2016",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "Ernakulam District Court"
    ],
    "bio": "8 years of specialized legal practice in Family Law before Ernakulam District Court. Handled over 273+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-063",
    "name": "Adv. Nirmala Trivedi",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Thiruvananthapuram",
    "state": "Kerala",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 900,
    "consultationFee": 900,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 102,
    "totalReviews": 102,
    "languages": [
      "Malayalam",
      "English",
      "Tamil",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KL/1063/2009",
    "barRegistrationNumber": "KL/1063/2009",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "District Court Vanchiyoor"
    ],
    "bio": "15 years of specialized legal practice in Property Law before Kerala High Court. Handled over 306+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-064",
    "name": "Adv. Pallav Varma",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 113,
    "totalReviews": 113,
    "languages": [
      "Bengali",
      "English",
      "Hindi",
      "Odia"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "WB/1064/2002",
    "barRegistrationNumber": "WB/1064/2002",
    "barCouncilState": "West Bengal",
    "courts": [
      "Calcutta High Court",
      "City Civil Court Kolkata",
      "Alipore Court"
    ],
    "bio": "22 years of specialized legal practice in Corporate Law before Calcutta High Court. Handled over 339+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-065",
    "name": "Adv. Pallavi Yadav",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Bhubaneswar",
    "state": "Odisha",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1200,
    "consultationFee": 1200,
    "rating": 3.4,
    "averageRating": 3.4,
    "reviewCount": 124,
    "totalReviews": 124,
    "languages": [
      "Odia",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "OD/1065/1995",
    "barRegistrationNumber": "OD/1065/1995",
    "barCouncilState": "Odisha",
    "courts": [
      "Orissa High Court",
      "District Court Bhubaneswar"
    ],
    "bio": "29 years of specialized legal practice in Consumer Rights before Orissa High Court. Handled over 372+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-066",
    "name": "Adv. Pooja Aggarwal",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Cuttack",
    "state": "Odisha",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 3.5,
    "averageRating": 3.5,
    "reviewCount": 135,
    "totalReviews": 135,
    "languages": [
      "Odia",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "OD/1066/2023",
    "barRegistrationNumber": "OD/1066/2023",
    "barCouncilState": "Odisha",
    "courts": [
      "Orissa High Court Cuttack",
      "District Court Cuttack"
    ],
    "bio": "1 years of specialized legal practice in Labour Law before District Court Cuttack. Handled over 405+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-067",
    "name": "Adv. Pradeep Anand",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Patna",
    "state": "Bihar",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 4200,
    "consultationFee": 4200,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 146,
    "totalReviews": 146,
    "languages": [
      "Hindi",
      "Bhojpuri",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "BR/1067/2016",
    "barRegistrationNumber": "BR/1067/2016",
    "barCouncilState": "Bihar",
    "courts": [
      "Patna High Court",
      "Patna Civil Court"
    ],
    "bio": "8 years of specialized legal practice in Civil Disputes before Patna High Court. Handled over 438+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-068",
    "name": "Adv. Prakash Banerjee",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Ranchi",
    "state": "Jharkhand",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 5000,
    "consultationFee": 5000,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 157,
    "totalReviews": 157,
    "languages": [
      "Hindi",
      "English",
      "Bengali"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "JH/1068/2009",
    "barRegistrationNumber": "JH/1068/2009",
    "barCouncilState": "Jharkhand",
    "courts": [
      "Jharkhand High Court",
      "District Court Ranchi"
    ],
    "bio": "15 years of specialized legal practice in Divorce before District Court Ranchi. Handled over 471+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-069",
    "name": "Adv. Prashant Bhatia",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Guwahati",
    "state": "Assam",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 3000,
    "consultationFee": 3000,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 168,
    "totalReviews": 168,
    "languages": [
      "Assamese",
      "English",
      "Hindi",
      "Bengali"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "AS/1069/2002",
    "barRegistrationNumber": "AS/1069/2002",
    "barCouncilState": "Assam",
    "courts": [
      "Gauhati High Court",
      "District Court Kamrup Guwahati"
    ],
    "bio": "22 years of specialized legal practice in Taxation before Gauhati High Court. Handled over 504+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-070",
    "name": "Adv. Prateek Bhushan",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Indore",
    "state": "Madhya Pradesh",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 9000,
    "consultationFee": 9000,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 179,
    "totalReviews": 179,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MP/1070/1995",
    "barRegistrationNumber": "MP/1070/1995",
    "barCouncilState": "Madhya Pradesh",
    "courts": [
      "Madhya Pradesh High Court (Indore Bench)",
      "District Court Indore"
    ],
    "bio": "29 years of specialized legal practice in Intellectual Property before District Court Indore. Handled over 537+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-071",
    "name": "Adv. Praveen Chandrasekar",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Bhopal",
    "state": "Madhya Pradesh",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 190,
    "totalReviews": 190,
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "MP/1071/2023",
    "barRegistrationNumber": "MP/1071/2023",
    "barCouncilState": "Madhya Pradesh",
    "courts": [
      "Madhya Pradesh High Court",
      "District Court Bhopal"
    ],
    "bio": "1 years of specialized legal practice in Cyber Law before Madhya Pradesh High Court. Handled over 570+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-072",
    "name": "Adv. Preeti Choudhary",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Raipur",
    "state": "Chhattisgarh",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 900,
    "consultationFee": 900,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 6,
    "totalReviews": 6,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "CG/1072/2016",
    "barRegistrationNumber": "CG/1072/2016",
    "barCouncilState": "Chhattisgarh",
    "courts": [
      "Chhattisgarh High Court",
      "District Court Raipur"
    ],
    "bio": "8 years of specialized legal practice in Bail & FIR before District Court Raipur. Handled over 18+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-073",
    "name": "Adv. Priya Deshpande",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 500,
    "consultationFee": 500,
    "rating": 3.5,
    "averageRating": 3.5,
    "reviewCount": 17,
    "totalReviews": 17,
    "languages": [
      "Hindi",
      "English",
      "Punjabi",
      "Urdu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "D/1073/2009",
    "barRegistrationNumber": "D/1073/2009",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari District Court",
      "Patiala House Court",
      "Saket Court"
    ],
    "bio": "15 years of specialized legal practice in Criminal Defence before Delhi High Court. Handled over 51+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-074",
    "name": "Adv. Priyanka Dixit",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Chandigarh",
    "state": "Punjab & Haryana",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 3.6,
    "averageRating": 3.6,
    "reviewCount": 28,
    "totalReviews": 28,
    "languages": [
      "Punjabi",
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "PH/1074/2002",
    "barRegistrationNumber": "PH/1074/2002",
    "barCouncilState": "Punjab & Haryana",
    "courts": [
      "Punjab & Haryana High Court",
      "District Court Chandigarh"
    ],
    "bio": "22 years of specialized legal practice in Family Law before District Court Chandigarh. Handled over 84+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-075",
    "name": "Adv. Raghav Garg",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1800,
    "consultationFee": 1800,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 39,
    "totalReviews": 39,
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1075/1995",
    "barRegistrationNumber": "UP/1075/1995",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court (Lucknow Bench)",
      "Lucknow District Court"
    ],
    "bio": "29 years of specialized legal practice in Property Law before Allahabad High Court (Lucknow Bench). Handled over 117+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-076",
    "name": "Adv. Rahul Gujral",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Noida",
    "state": "Uttar Pradesh",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 50,
    "totalReviews": 50,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "UP/1076/2023",
    "barRegistrationNumber": "UP/1076/2023",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "Surajpur District Court Gautam Buddha Nagar"
    ],
    "bio": "1 years of specialized legal practice in Corporate Law before Surajpur District Court Gautam Buddha Nagar. Handled over 150+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-077",
    "name": "Adv. Rajesh Iyer",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Kanpur",
    "state": "Uttar Pradesh",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 5000,
    "consultationFee": 5000,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 61,
    "totalReviews": 61,
    "languages": [
      "Hindi",
      "English",
      "Urdu"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1077/2016",
    "barRegistrationNumber": "UP/1077/2016",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "Kanpur Nagar District Court"
    ],
    "bio": "8 years of specialized legal practice in Consumer Rights before Allahabad High Court. Handled over 183+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-078",
    "name": "Adv. Rajeshwar Kalam",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Prayagraj",
    "state": "Uttar Pradesh",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 3000,
    "consultationFee": 3000,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 72,
    "totalReviews": 72,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1078/2009",
    "barRegistrationNumber": "UP/1078/2009",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "District Court Allahabad"
    ],
    "bio": "15 years of specialized legal practice in Labour Law before District Court Allahabad. Handled over 216+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-079",
    "name": "Adv. Rakesh Khatri",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Dehradun",
    "state": "Uttarakhand",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 3500,
    "consultationFee": 3500,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 83,
    "totalReviews": 83,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UK/1079/2002",
    "barRegistrationNumber": "UK/1079/2002",
    "barCouncilState": "Uttarakhand",
    "courts": [
      "Uttarakhand High Court",
      "Dehradun District Court"
    ],
    "bio": "22 years of specialized legal practice in Civil Disputes before Uttarakhand High Court. Handled over 249+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-080",
    "name": "Adv. Ramesh Krishnaswamy",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Shimla",
    "state": "Himachal Pradesh",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 12000,
    "consultationFee": 12000,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 94,
    "totalReviews": 94,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "HP/1080/1995",
    "barRegistrationNumber": "HP/1080/1995",
    "barCouncilState": "Himachal Pradesh",
    "courts": [
      "Himachal Pradesh High Court",
      "District Court Shimla"
    ],
    "bio": "29 years of specialized legal practice in Divorce before District Court Shimla. Handled over 282+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-081",
    "name": "Adv. Rameshwar Kurian",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Srinagar",
    "state": "Jammu and Kashmir",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 900,
    "consultationFee": 900,
    "rating": 3.6,
    "averageRating": 3.6,
    "reviewCount": 105,
    "totalReviews": 105,
    "languages": [
      "Kashmiri",
      "Urdu",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "JK/1081/2023",
    "barRegistrationNumber": "JK/1081/2023",
    "barCouncilState": "Jammu and Kashmir",
    "courts": [
      "Jammu & Kashmir High Court",
      "District Court Srinagar"
    ],
    "bio": "1 years of specialized legal practice in Taxation before Jammu & Kashmir High Court. Handled over 315+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-082",
    "name": "Adv. Rekha Mathur",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Jammu",
    "state": "Jammu and Kashmir",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 500,
    "consultationFee": 500,
    "rating": 3.7,
    "averageRating": 3.7,
    "reviewCount": 116,
    "totalReviews": 116,
    "languages": [
      "Hindi",
      "Dogri",
      "Urdu",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "JK/1082/2016",
    "barRegistrationNumber": "JK/1082/2016",
    "barCouncilState": "Jammu and Kashmir",
    "courts": [
      "Jammu & Kashmir High Court",
      "District Court Jammu"
    ],
    "bio": "8 years of specialized legal practice in Intellectual Property before District Court Jammu. Handled over 348+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-083",
    "name": "Adv. Ritu Menon",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 127,
    "totalReviews": 127,
    "languages": [
      "English",
      "Marathi",
      "Hindi",
      "Gujarati"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1083/2009",
    "barRegistrationNumber": "MH/1083/2009",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil & Sessions Court Mumbai",
      "Bandra Family Court"
    ],
    "bio": "15 years of specialized legal practice in Cyber Law before City Civil & Sessions Court Mumbai. Handled over 381+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-084",
    "name": "Adv. Rohan Murugan",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 138,
    "totalReviews": 138,
    "languages": [
      "Marathi",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1084/2002",
    "barRegistrationNumber": "MH/1084/2002",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Shivajinagar District Court Pune",
      "Pune Family Court"
    ],
    "bio": "22 years of specialized legal practice in Bail & FIR before Pune Family Court. Handled over 414+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-085",
    "name": "Adv. Rohit Namboodiri",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Nagpur",
    "state": "Maharashtra",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1200,
    "consultationFee": 1200,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 149,
    "totalReviews": 149,
    "languages": [
      "Marathi",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1085/1995",
    "barRegistrationNumber": "MH/1085/1995",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court (Nagpur Bench)",
      "District Court Nagpur"
    ],
    "bio": "29 years of specialized legal practice in Criminal Defence before Bombay High Court (Nagpur Bench). Handled over 447+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-086",
    "name": "Adv. Sameer Patil",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 160,
    "totalReviews": 160,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "GJ/1086/2023",
    "barRegistrationNumber": "GJ/1086/2023",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "City Civil Court Ahmedabad"
    ],
    "bio": "1 years of specialized legal practice in Family Law before City Civil Court Ahmedabad. Handled over 480+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-087",
    "name": "Adv. Sanjay Prasad",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Surat",
    "state": "Gujarat",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 3000,
    "consultationFee": 3000,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 171,
    "totalReviews": 171,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/1087/2016",
    "barRegistrationNumber": "GJ/1087/2016",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "District Court Surat"
    ],
    "bio": "8 years of specialized legal practice in Property Law before Gujarat High Court. Handled over 513+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-088",
    "name": "Adv. Santosh Raghunathan",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Vadodara",
    "state": "Gujarat",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 3500,
    "consultationFee": 3500,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 182,
    "totalReviews": 182,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/1088/2009",
    "barRegistrationNumber": "GJ/1088/2009",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "District Court Vadodara"
    ],
    "bio": "15 years of specialized legal practice in Corporate Law before District Court Vadodara. Handled over 546+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-089",
    "name": "Adv. Sarita Rao",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 4000,
    "consultationFee": 4000,
    "rating": 3.7,
    "averageRating": 3.7,
    "reviewCount": 193,
    "totalReviews": 193,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/1089/2002",
    "barRegistrationNumber": "RJ/1089/2002",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court (Jaipur Bench)",
      "District & Sessions Court Jaipur"
    ],
    "bio": "22 years of specialized legal practice in Consumer Rights before Rajasthan High Court (Jaipur Bench). Handled over 579+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-090",
    "name": "Adv. Saurabh Sandhu",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Jodhpur",
    "state": "Rajasthan",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 6000,
    "consultationFee": 6000,
    "rating": 3.8,
    "averageRating": 3.8,
    "reviewCount": 9,
    "totalReviews": 9,
    "languages": [
      "Hindi",
      "Marwari",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/1090/1995",
    "barRegistrationNumber": "RJ/1090/1995",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court Principal Seat Jodhpur"
    ],
    "bio": "29 years of specialized legal practice in Labour Law before Rajasthan High Court Principal Seat Jodhpur. Handled over 27+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-091",
    "name": "Adv. Shalini Sengupta",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Panaji",
    "state": "Goa",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 20,
    "totalReviews": 20,
    "languages": [
      "Konkani",
      "English",
      "Marathi",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "GA/1091/2023",
    "barRegistrationNumber": "GA/1091/2023",
    "barCouncilState": "Goa",
    "courts": [
      "Bombay High Court at Goa",
      "North Goa District Court"
    ],
    "bio": "1 years of specialized legal practice in Civil Disputes before Bombay High Court at Goa. Handled over 60+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-092",
    "name": "Adv. Shashi Sharma",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 31,
    "totalReviews": 31,
    "languages": [
      "Kannada",
      "English",
      "Hindi",
      "Tamil",
      "Telugu",
      "Tulu"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1092/2016",
    "barRegistrationNumber": "KA/1092/2016",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court"
    ],
    "bio": "8 years of specialized legal practice in Divorce before City Civil Court Bengaluru. Handled over 93+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-093",
    "name": "Adv. Shilpa Singh",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Mangaluru",
    "state": "Karnataka",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 900,
    "consultationFee": 900,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 42,
    "totalReviews": 42,
    "languages": [
      "Tulu",
      "Kannada",
      "English",
      "Konkani",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1093/2009",
    "barRegistrationNumber": "KA/1093/2009",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "District Court Mangaluru"
    ],
    "bio": "15 years of specialized legal practice in Taxation before Karnataka High Court. Handled over 126+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-094",
    "name": "Adv. Shweta Sood",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 53,
    "totalReviews": 53,
    "languages": [
      "Telugu",
      "English",
      "Hindi",
      "Urdu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TS/1094/2002",
    "barRegistrationNumber": "TS/1094/2002",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Nampally Criminal Court"
    ],
    "bio": "22 years of specialized legal practice in Intellectual Property before Telangana High Court. Handled over 159+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-095",
    "name": "Adv. Siddharth Talwar",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1800,
    "consultationFee": 1800,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 64,
    "totalReviews": 64,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1095/1995",
    "barRegistrationNumber": "TN/1095/1995",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "Egmore Magistrate Court"
    ],
    "bio": "29 years of specialized legal practice in Cyber Law before City Civil Court Chennai. Handled over 192+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-096",
    "name": "Adv. Smita Tripathi",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 75,
    "totalReviews": 75,
    "languages": [
      "Tamil",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "TN/1096/2023",
    "barRegistrationNumber": "TN/1096/2023",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "District Court Coimbatore"
    ],
    "bio": "1 years of specialized legal practice in Bail & FIR before District Court Coimbatore. Handled over 225+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-097",
    "name": "Adv. Sneha Varghese",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Madurai",
    "state": "Tamil Nadu",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 3500,
    "consultationFee": 3500,
    "rating": 3.8,
    "averageRating": 3.8,
    "reviewCount": 86,
    "totalReviews": 86,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1097/2016",
    "barRegistrationNumber": "TN/1097/2016",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court (Madurai Bench)",
      "District Court Madurai"
    ],
    "bio": "8 years of specialized legal practice in Criminal Defence before Madras High Court (Madurai Bench). Handled over 258+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-098",
    "name": "Adv. Subhash Vyas",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Kochi",
    "state": "Kerala",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 4000,
    "consultationFee": 4000,
    "rating": 3.9,
    "averageRating": 3.9,
    "reviewCount": 97,
    "totalReviews": 97,
    "languages": [
      "Malayalam",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KL/1098/2009",
    "barRegistrationNumber": "KL/1098/2009",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "Ernakulam District Court"
    ],
    "bio": "15 years of specialized legal practice in Family Law before Ernakulam District Court. Handled over 291+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-099",
    "name": "Adv. Suchitra Agarwal",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Thiruvananthapuram",
    "state": "Kerala",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 4500,
    "consultationFee": 4500,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 108,
    "totalReviews": 108,
    "languages": [
      "Malayalam",
      "English",
      "Tamil",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KL/1099/2002",
    "barRegistrationNumber": "KL/1099/2002",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "District Court Vanchiyoor"
    ],
    "bio": "22 years of specialized legal practice in Property Law before Kerala High Court. Handled over 324+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-100",
    "name": "Adv. Sudarshan Akhtar",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 7500,
    "consultationFee": 7500,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 119,
    "totalReviews": 119,
    "languages": [
      "Bengali",
      "English",
      "Hindi",
      "Odia"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "WB/1100/1995",
    "barRegistrationNumber": "WB/1100/1995",
    "barCouncilState": "West Bengal",
    "courts": [
      "Calcutta High Court",
      "City Civil Court Kolkata",
      "Alipore Court"
    ],
    "bio": "29 years of specialized legal practice in Corporate Law before Calcutta High Court. Handled over 357+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-101",
    "name": "Adv. Sunaina Bafna",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Bhubaneswar",
    "state": "Odisha",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 130,
    "totalReviews": 130,
    "languages": [
      "Odia",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "OD/1101/2023",
    "barRegistrationNumber": "OD/1101/2023",
    "barCouncilState": "Odisha",
    "courts": [
      "Orissa High Court",
      "District Court Bhubaneswar"
    ],
    "bio": "1 years of specialized legal practice in Consumer Rights before Orissa High Court. Handled over 390+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-102",
    "name": "Adv. Sunil Bhat",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Cuttack",
    "state": "Odisha",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 900,
    "consultationFee": 900,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 141,
    "totalReviews": 141,
    "languages": [
      "Odia",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "OD/1102/2016",
    "barRegistrationNumber": "OD/1102/2016",
    "barCouncilState": "Odisha",
    "courts": [
      "Orissa High Court Cuttack",
      "District Court Cuttack"
    ],
    "bio": "8 years of specialized legal practice in Labour Law before District Court Cuttack. Handled over 423+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-103",
    "name": "Adv. Sunita Bhattacharya",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Patna",
    "state": "Bihar",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 152,
    "totalReviews": 152,
    "languages": [
      "Hindi",
      "Bhojpuri",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "BR/1103/2009",
    "barRegistrationNumber": "BR/1103/2009",
    "barCouncilState": "Bihar",
    "courts": [
      "Patna High Court",
      "Patna Civil Court"
    ],
    "bio": "15 years of specialized legal practice in Civil Disputes before Patna High Court. Handled over 456+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-104",
    "name": "Adv. Suresh Chadha",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Ranchi",
    "state": "Jharkhand",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 163,
    "totalReviews": 163,
    "languages": [
      "Hindi",
      "English",
      "Bengali"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "JH/1104/2002",
    "barRegistrationNumber": "JH/1104/2002",
    "barCouncilState": "Jharkhand",
    "courts": [
      "Jharkhand High Court",
      "District Court Ranchi"
    ],
    "bio": "22 years of specialized legal practice in Divorce before District Court Ranchi. Handled over 489+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-105",
    "name": "Adv. Tanya Chopra",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Guwahati",
    "state": "Assam",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1200,
    "consultationFee": 1200,
    "rating": 3.9,
    "averageRating": 3.9,
    "reviewCount": 174,
    "totalReviews": 174,
    "languages": [
      "Assamese",
      "English",
      "Hindi",
      "Bengali"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "AS/1105/1995",
    "barRegistrationNumber": "AS/1105/1995",
    "barCouncilState": "Assam",
    "courts": [
      "Gauhati High Court",
      "District Court Kamrup Guwahati"
    ],
    "bio": "29 years of specialized legal practice in Taxation before Gauhati High Court. Handled over 522+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-106",
    "name": "Adv. Tarun Deshmukh",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Indore",
    "state": "Madhya Pradesh",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 185,
    "totalReviews": 185,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "MP/1106/2023",
    "barRegistrationNumber": "MP/1106/2023",
    "barCouncilState": "Madhya Pradesh",
    "courts": [
      "Madhya Pradesh High Court (Indore Bench)",
      "District Court Indore"
    ],
    "bio": "1 years of specialized legal practice in Intellectual Property before District Court Indore. Handled over 555+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-107",
    "name": "Adv. Trilok Dhillon",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Bhopal",
    "state": "Madhya Pradesh",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 4000,
    "consultationFee": 4000,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 196,
    "totalReviews": 196,
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MP/1107/2016",
    "barRegistrationNumber": "MP/1107/2016",
    "barCouncilState": "Madhya Pradesh",
    "courts": [
      "Madhya Pradesh High Court",
      "District Court Bhopal"
    ],
    "bio": "8 years of specialized legal practice in Cyber Law before Madhya Pradesh High Court. Handled over 588+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-108",
    "name": "Adv. Uday Farooqui",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Raipur",
    "state": "Chhattisgarh",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 4500,
    "consultationFee": 4500,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 12,
    "totalReviews": 12,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "CG/1108/2009",
    "barRegistrationNumber": "CG/1108/2009",
    "barCouncilState": "Chhattisgarh",
    "courts": [
      "Chhattisgarh High Court",
      "District Court Raipur"
    ],
    "bio": "15 years of specialized legal practice in Bail & FIR before District Court Raipur. Handled over 36+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-109",
    "name": "Adv. Uma Gowda",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 2800,
    "consultationFee": 2800,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 23,
    "totalReviews": 23,
    "languages": [
      "Hindi",
      "English",
      "Punjabi",
      "Urdu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "D/1109/2002",
    "barRegistrationNumber": "D/1109/2002",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari District Court",
      "Patiala House Court",
      "Saket Court"
    ],
    "bio": "22 years of specialized legal practice in Criminal Defence before Delhi High Court. Handled over 69+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-110",
    "name": "Adv. Vaibhav Hegde",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Chandigarh",
    "state": "Punjab & Haryana",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 9000,
    "consultationFee": 9000,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 34,
    "totalReviews": 34,
    "languages": [
      "Punjabi",
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "PH/1110/1995",
    "barRegistrationNumber": "PH/1110/1995",
    "barCouncilState": "Punjab & Haryana",
    "courts": [
      "Punjab & Haryana High Court",
      "District Court Chandigarh"
    ],
    "bio": "29 years of specialized legal practice in Family Law before District Court Chandigarh. Handled over 102+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-111",
    "name": "Adv. Vandana Joshi",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 900,
    "consultationFee": 900,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 45,
    "totalReviews": 45,
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "UP/1111/2023",
    "barRegistrationNumber": "UP/1111/2023",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court (Lucknow Bench)",
      "Lucknow District Court"
    ],
    "bio": "1 years of specialized legal practice in Property Law before Allahabad High Court (Lucknow Bench). Handled over 135+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-112",
    "name": "Adv. Varsha Kashyap",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Noida",
    "state": "Uttar Pradesh",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 56,
    "totalReviews": 56,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1112/2016",
    "barRegistrationNumber": "UP/1112/2016",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "Surajpur District Court Gautam Buddha Nagar"
    ],
    "bio": "8 years of specialized legal practice in Corporate Law before Surajpur District Court Gautam Buddha Nagar. Handled over 168+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-113",
    "name": "Adv. Varun Krishnamurthy",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Kanpur",
    "state": "Uttar Pradesh",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 750,
    "consultationFee": 750,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 67,
    "totalReviews": 67,
    "languages": [
      "Hindi",
      "English",
      "Urdu"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1113/2009",
    "barRegistrationNumber": "UP/1113/2009",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "Kanpur Nagar District Court"
    ],
    "bio": "15 years of specialized legal practice in Consumer Rights before Allahabad High Court. Handled over 201+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-114",
    "name": "Adv. Vidya Kumar",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Prayagraj",
    "state": "Uttar Pradesh",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 3.4,
    "averageRating": 3.4,
    "reviewCount": 78,
    "totalReviews": 78,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1114/2002",
    "barRegistrationNumber": "UP/1114/2002",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "District Court Allahabad"
    ],
    "bio": "22 years of specialized legal practice in Labour Law before District Court Allahabad. Handled over 234+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-115",
    "name": "Adv. Vikas Majumdar",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Dehradun",
    "state": "Uttarakhand",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1800,
    "consultationFee": 1800,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 89,
    "totalReviews": 89,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UK/1115/1995",
    "barRegistrationNumber": "UK/1115/1995",
    "barCouncilState": "Uttarakhand",
    "courts": [
      "Uttarakhand High Court",
      "Dehradun District Court"
    ],
    "bio": "29 years of specialized legal practice in Civil Disputes before Uttarakhand High Court. Handled over 267+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-116",
    "name": "Adv. Vikram Mehrotra",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Shimla",
    "state": "Himachal Pradesh",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 100,
    "totalReviews": 100,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "HP/1116/2023",
    "barRegistrationNumber": "HP/1116/2023",
    "barCouncilState": "Himachal Pradesh",
    "courts": [
      "Himachal Pradesh High Court",
      "District Court Shimla"
    ],
    "bio": "1 years of specialized legal practice in Divorce before District Court Shimla. Handled over 300+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-117",
    "name": "Adv. Vinay Mukherjee",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Srinagar",
    "state": "Jammu and Kashmir",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 4500,
    "consultationFee": 4500,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 111,
    "totalReviews": 111,
    "languages": [
      "Kashmiri",
      "Urdu",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "JK/1117/2016",
    "barRegistrationNumber": "JK/1117/2016",
    "barCouncilState": "Jammu and Kashmir",
    "courts": [
      "Jammu & Kashmir High Court",
      "District Court Srinagar"
    ],
    "bio": "8 years of specialized legal practice in Taxation before Jammu & Kashmir High Court. Handled over 333+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-118",
    "name": "Adv. Yash Nambiar",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Jammu",
    "state": "Jammu and Kashmir",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 2800,
    "consultationFee": 2800,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 122,
    "totalReviews": 122,
    "languages": [
      "Hindi",
      "Dogri",
      "Urdu",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "JK/1118/2009",
    "barRegistrationNumber": "JK/1118/2009",
    "barCouncilState": "Jammu and Kashmir",
    "courts": [
      "Jammu & Kashmir High Court",
      "District Court Jammu"
    ],
    "bio": "15 years of specialized legal practice in Intellectual Property before District Court Jammu. Handled over 366+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-119",
    "name": "Adv. Zoya Patel",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 3200,
    "consultationFee": 3200,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 133,
    "totalReviews": 133,
    "languages": [
      "English",
      "Marathi",
      "Hindi",
      "Gujarati"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1119/2002",
    "barRegistrationNumber": "MH/1119/2002",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil & Sessions Court Mumbai",
      "Bandra Family Court"
    ],
    "bio": "22 years of specialized legal practice in Cyber Law before City Civil & Sessions Court Mumbai. Handled over 399+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-120",
    "name": "Adv. Aaditya Prabhu",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 12000,
    "consultationFee": 12000,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 144,
    "totalReviews": 144,
    "languages": [
      "Marathi",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1120/1995",
    "barRegistrationNumber": "MH/1120/1995",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Shivajinagar District Court Pune",
      "Pune Family Court"
    ],
    "bio": "29 years of specialized legal practice in Bail & FIR before Pune Family Court. Handled over 432+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-121",
    "name": "Adv. Aakash Qureshi",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Nagpur",
    "state": "Maharashtra",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 500,
    "consultationFee": 500,
    "rating": 3.4,
    "averageRating": 3.4,
    "reviewCount": 155,
    "totalReviews": 155,
    "languages": [
      "Marathi",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "MH/1121/2023",
    "barRegistrationNumber": "MH/1121/2023",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court (Nagpur Bench)",
      "District Court Nagpur"
    ],
    "bio": "1 years of specialized legal practice in Criminal Defence before Bombay High Court (Nagpur Bench). Handled over 465+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-122",
    "name": "Adv. Abhinav Rajan",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 750,
    "consultationFee": 750,
    "rating": 3.5,
    "averageRating": 3.5,
    "reviewCount": 166,
    "totalReviews": 166,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/1122/2016",
    "barRegistrationNumber": "GJ/1122/2016",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "City Civil Court Ahmedabad"
    ],
    "bio": "8 years of specialized legal practice in Family Law before City Civil Court Ahmedabad. Handled over 498+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-123",
    "name": "Adv. Aditi Reddy",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Surat",
    "state": "Gujarat",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 900,
    "consultationFee": 900,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 177,
    "totalReviews": 177,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/1123/2009",
    "barRegistrationNumber": "GJ/1123/2009",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "District Court Surat"
    ],
    "bio": "15 years of specialized legal practice in Property Law before Gujarat High Court. Handled over 531+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-124",
    "name": "Adv. Alok Sen",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Vadodara",
    "state": "Gujarat",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 188,
    "totalReviews": 188,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/1124/2002",
    "barRegistrationNumber": "GJ/1124/2002",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "District Court Vadodara"
    ],
    "bio": "22 years of specialized legal practice in Corporate Law before District Court Vadodara. Handled over 564+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-125",
    "name": "Adv. Amit Shah",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1200,
    "consultationFee": 1200,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 199,
    "totalReviews": 199,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/1125/1995",
    "barRegistrationNumber": "RJ/1125/1995",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court (Jaipur Bench)",
      "District & Sessions Court Jaipur"
    ],
    "bio": "29 years of specialized legal practice in Consumer Rights before Rajasthan High Court (Jaipur Bench). Handled over 597+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-126",
    "name": "Adv. Anand Shukla",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Jodhpur",
    "state": "Rajasthan",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 15,
    "totalReviews": 15,
    "languages": [
      "Hindi",
      "Marwari",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "RJ/1126/2023",
    "barRegistrationNumber": "RJ/1126/2023",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court Principal Seat Jodhpur"
    ],
    "bio": "1 years of specialized legal practice in Labour Law before Rajasthan High Court Principal Seat Jodhpur. Handled over 45+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-127",
    "name": "Adv. Ananya Somaiya",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Panaji",
    "state": "Goa",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 2800,
    "consultationFee": 2800,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 26,
    "totalReviews": 26,
    "languages": [
      "Konkani",
      "English",
      "Marathi",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GA/1127/2016",
    "barRegistrationNumber": "GA/1127/2016",
    "barCouncilState": "Goa",
    "courts": [
      "Bombay High Court at Goa",
      "North Goa District Court"
    ],
    "bio": "8 years of specialized legal practice in Civil Disputes before Bombay High Court at Goa. Handled over 78+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-128",
    "name": "Adv. Anil Sundaram",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 3200,
    "consultationFee": 3200,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 37,
    "totalReviews": 37,
    "languages": [
      "Kannada",
      "English",
      "Hindi",
      "Tamil",
      "Telugu",
      "Tulu"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1128/2009",
    "barRegistrationNumber": "KA/1128/2009",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court"
    ],
    "bio": "15 years of specialized legal practice in Divorce before City Civil Court Bengaluru. Handled over 111+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-129",
    "name": "Adv. Aniruddh Tiwari",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Mangaluru",
    "state": "Karnataka",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 3800,
    "consultationFee": 3800,
    "rating": 3.5,
    "averageRating": 3.5,
    "reviewCount": 48,
    "totalReviews": 48,
    "languages": [
      "Tulu",
      "Kannada",
      "English",
      "Konkani",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1129/2002",
    "barRegistrationNumber": "KA/1129/2002",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "District Court Mangaluru"
    ],
    "bio": "22 years of specialized legal practice in Taxation before Karnataka High Court. Handled over 144+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-130",
    "name": "Adv. Anita Upadhyay",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 6000,
    "consultationFee": 6000,
    "rating": 3.6,
    "averageRating": 3.6,
    "reviewCount": 59,
    "totalReviews": 59,
    "languages": [
      "Telugu",
      "English",
      "Hindi",
      "Urdu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TS/1130/1995",
    "barRegistrationNumber": "TS/1130/1995",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Nampally Criminal Court"
    ],
    "bio": "29 years of specialized legal practice in Intellectual Property before Telangana High Court. Handled over 177+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-131",
    "name": "Adv. Anjali Verma",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 70,
    "totalReviews": 70,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "TN/1131/2023",
    "barRegistrationNumber": "TN/1131/2023",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "Egmore Magistrate Court"
    ],
    "bio": "1 years of specialized legal practice in Cyber Law before City Civil Court Chennai. Handled over 210+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-132",
    "name": "Adv. Ankita Acharya",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 900,
    "consultationFee": 900,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 81,
    "totalReviews": 81,
    "languages": [
      "Tamil",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1132/2016",
    "barRegistrationNumber": "TN/1132/2016",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "District Court Coimbatore"
    ],
    "bio": "8 years of specialized legal practice in Bail & FIR before District Court Coimbatore. Handled over 243+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-133",
    "name": "Adv. Aparna Ahmed",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Madurai",
    "state": "Tamil Nadu",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 92,
    "totalReviews": 92,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1133/2009",
    "barRegistrationNumber": "TN/1133/2009",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court (Madurai Bench)",
      "District Court Madurai"
    ],
    "bio": "15 years of specialized legal practice in Criminal Defence before Madras High Court (Madurai Bench). Handled over 276+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-134",
    "name": "Adv. Arjun Ansari",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Kochi",
    "state": "Kerala",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 103,
    "totalReviews": 103,
    "languages": [
      "Malayalam",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KL/1134/2002",
    "barRegistrationNumber": "KL/1134/2002",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "Ernakulam District Court"
    ],
    "bio": "22 years of specialized legal practice in Family Law before Ernakulam District Court. Handled over 309+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-135",
    "name": "Adv. Arun Bansal",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Thiruvananthapuram",
    "state": "Kerala",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1800,
    "consultationFee": 1800,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 114,
    "totalReviews": 114,
    "languages": [
      "Malayalam",
      "English",
      "Tamil",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KL/1135/1995",
    "barRegistrationNumber": "KL/1135/1995",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "District Court Vanchiyoor"
    ],
    "bio": "29 years of specialized legal practice in Property Law before Kerala High Court. Handled over 342+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-136",
    "name": "Adv. Arvind Bhatt",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 125,
    "totalReviews": 125,
    "languages": [
      "Bengali",
      "English",
      "Hindi",
      "Odia"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "WB/1136/2023",
    "barRegistrationNumber": "WB/1136/2023",
    "barCouncilState": "West Bengal",
    "courts": [
      "Calcutta High Court",
      "City Civil Court Kolkata",
      "Alipore Court"
    ],
    "bio": "1 years of specialized legal practice in Corporate Law before Calcutta High Court. Handled over 375+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-137",
    "name": "Adv. Ashish Bose",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Bhubaneswar",
    "state": "Odisha",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 3200,
    "consultationFee": 3200,
    "rating": 3.6,
    "averageRating": 3.6,
    "reviewCount": 136,
    "totalReviews": 136,
    "languages": [
      "Odia",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "OD/1137/2016",
    "barRegistrationNumber": "OD/1137/2016",
    "barCouncilState": "Odisha",
    "courts": [
      "Orissa High Court",
      "District Court Bhubaneswar"
    ],
    "bio": "8 years of specialized legal practice in Consumer Rights before Orissa High Court. Handled over 408+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-138",
    "name": "Adv. Bhavna Chaturvedi",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Cuttack",
    "state": "Odisha",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 3800,
    "consultationFee": 3800,
    "rating": 3.7,
    "averageRating": 3.7,
    "reviewCount": 147,
    "totalReviews": 147,
    "languages": [
      "Odia",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "OD/1138/2009",
    "barRegistrationNumber": "OD/1138/2009",
    "barCouncilState": "Odisha",
    "courts": [
      "Orissa High Court Cuttack",
      "District Court Cuttack"
    ],
    "bio": "15 years of specialized legal practice in Labour Law before District Court Cuttack. Handled over 441+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-139",
    "name": "Adv. Biju Desai",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Patna",
    "state": "Bihar",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 4200,
    "consultationFee": 4200,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 158,
    "totalReviews": 158,
    "languages": [
      "Hindi",
      "Bhojpuri",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "BR/1139/2002",
    "barRegistrationNumber": "BR/1139/2002",
    "barCouncilState": "Bihar",
    "courts": [
      "Patna High Court",
      "Patna Civil Court"
    ],
    "bio": "22 years of specialized legal practice in Civil Disputes before Patna High Court. Handled over 474+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-140",
    "name": "Adv. Chetan Dewan",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Ranchi",
    "state": "Jharkhand",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 7500,
    "consultationFee": 7500,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 169,
    "totalReviews": 169,
    "languages": [
      "Hindi",
      "English",
      "Bengali"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "JH/1140/1995",
    "barRegistrationNumber": "JH/1140/1995",
    "barCouncilState": "Jharkhand",
    "courts": [
      "Jharkhand High Court",
      "District Court Ranchi"
    ],
    "bio": "29 years of specialized legal practice in Divorce before District Court Ranchi. Handled over 507+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-141",
    "name": "Adv. Deepa Dubey",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Guwahati",
    "state": "Assam",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 900,
    "consultationFee": 900,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 180,
    "totalReviews": 180,
    "languages": [
      "Assamese",
      "English",
      "Hindi",
      "Bengali"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "AS/1141/2023",
    "barRegistrationNumber": "AS/1141/2023",
    "barCouncilState": "Assam",
    "courts": [
      "Gauhati High Court",
      "District Court Kamrup Guwahati"
    ],
    "bio": "1 years of specialized legal practice in Taxation before Gauhati High Court. Handled over 540+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-142",
    "name": "Adv. Deepak Goswami",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Indore",
    "state": "Madhya Pradesh",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 191,
    "totalReviews": 191,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MP/1142/2016",
    "barRegistrationNumber": "MP/1142/2016",
    "barCouncilState": "Madhya Pradesh",
    "courts": [
      "Madhya Pradesh High Court (Indore Bench)",
      "District Court Indore"
    ],
    "bio": "8 years of specialized legal practice in Intellectual Property before District Court Indore. Handled over 573+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-143",
    "name": "Adv. Deepika Gupta",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Bhopal",
    "state": "Madhya Pradesh",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 7,
    "totalReviews": 7,
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MP/1143/2009",
    "barRegistrationNumber": "MP/1143/2009",
    "barCouncilState": "Madhya Pradesh",
    "courts": [
      "Madhya Pradesh High Court",
      "District Court Bhopal"
    ],
    "bio": "15 years of specialized legal practice in Cyber Law before Madhya Pradesh High Court. Handled over 21+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-144",
    "name": "Adv. Devendra Jha",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Raipur",
    "state": "Chhattisgarh",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 18,
    "totalReviews": 18,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "CG/1144/2002",
    "barRegistrationNumber": "CG/1144/2002",
    "barCouncilState": "Chhattisgarh",
    "courts": [
      "Chhattisgarh High Court",
      "District Court Raipur"
    ],
    "bio": "22 years of specialized legal practice in Bail & FIR before District Court Raipur. Handled over 54+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-145",
    "name": "Adv. Dilip Kapoor",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1200,
    "consultationFee": 1200,
    "rating": 3.7,
    "averageRating": 3.7,
    "reviewCount": 29,
    "totalReviews": 29,
    "languages": [
      "Hindi",
      "English",
      "Punjabi",
      "Urdu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "D/1145/1995",
    "barRegistrationNumber": "D/1145/1995",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari District Court",
      "Patiala House Court",
      "Saket Court"
    ],
    "bio": "29 years of specialized legal practice in Criminal Defence before Delhi High Court. Handled over 87+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-146",
    "name": "Adv. Divya Kothari",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Chandigarh",
    "state": "Punjab & Haryana",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 3.8,
    "averageRating": 3.8,
    "reviewCount": 40,
    "totalReviews": 40,
    "languages": [
      "Punjabi",
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "PH/1146/2023",
    "barRegistrationNumber": "PH/1146/2023",
    "barCouncilState": "Punjab & Haryana",
    "courts": [
      "Punjab & Haryana High Court",
      "District Court Chandigarh"
    ],
    "bio": "1 years of specialized legal practice in Family Law before District Court Chandigarh. Handled over 120+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-147",
    "name": "Adv. Farhan Kulkarni",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 3800,
    "consultationFee": 3800,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 51,
    "totalReviews": 51,
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1147/2016",
    "barRegistrationNumber": "UP/1147/2016",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court (Lucknow Bench)",
      "Lucknow District Court"
    ],
    "bio": "8 years of specialized legal practice in Property Law before Allahabad High Court (Lucknow Bench). Handled over 153+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-148",
    "name": "Adv. Farida Mahapatra",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Noida",
    "state": "Uttar Pradesh",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 4200,
    "consultationFee": 4200,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 62,
    "totalReviews": 62,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1148/2009",
    "barRegistrationNumber": "UP/1148/2009",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "Surajpur District Court Gautam Buddha Nagar"
    ],
    "bio": "15 years of specialized legal practice in Corporate Law before Surajpur District Court Gautam Buddha Nagar. Handled over 186+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-149",
    "name": "Adv. Gautam Mathew",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Kanpur",
    "state": "Uttar Pradesh",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 5000,
    "consultationFee": 5000,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 73,
    "totalReviews": 73,
    "languages": [
      "Hindi",
      "English",
      "Urdu"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1149/2002",
    "barRegistrationNumber": "UP/1149/2002",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "Kanpur Nagar District Court"
    ],
    "bio": "22 years of specialized legal practice in Consumer Rights before Allahabad High Court. Handled over 219+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-150",
    "name": "Adv. Geeta Mishra",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Prayagraj",
    "state": "Uttar Pradesh",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 9000,
    "consultationFee": 9000,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 84,
    "totalReviews": 84,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1150/1995",
    "barRegistrationNumber": "UP/1150/1995",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "District Court Allahabad"
    ],
    "bio": "29 years of specialized legal practice in Labour Law before District Court Allahabad. Handled over 252+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-151",
    "name": "Adv. Gopal Nair",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Dehradun",
    "state": "Uttarakhand",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 95,
    "totalReviews": 95,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "UK/1151/2023",
    "barRegistrationNumber": "UK/1151/2023",
    "barCouncilState": "Uttarakhand",
    "courts": [
      "Uttarakhand High Court",
      "Dehradun District Court"
    ],
    "bio": "1 years of specialized legal practice in Civil Disputes before Uttarakhand High Court. Handled over 285+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-152",
    "name": "Adv. Gurpreet Panigrahi",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Shimla",
    "state": "Himachal Pradesh",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 106,
    "totalReviews": 106,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "HP/1152/2016",
    "barRegistrationNumber": "HP/1152/2016",
    "barCouncilState": "Himachal Pradesh",
    "courts": [
      "Himachal Pradesh High Court",
      "District Court Shimla"
    ],
    "bio": "8 years of specialized legal practice in Divorce before District Court Shimla. Handled over 318+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-153",
    "name": "Adv. Harish Pillai",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Srinagar",
    "state": "Jammu and Kashmir",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 900,
    "consultationFee": 900,
    "rating": 3.8,
    "averageRating": 3.8,
    "reviewCount": 117,
    "totalReviews": 117,
    "languages": [
      "Kashmiri",
      "Urdu",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "JK/1153/2009",
    "barRegistrationNumber": "JK/1153/2009",
    "barCouncilState": "Jammu and Kashmir",
    "courts": [
      "Jammu & Kashmir High Court",
      "District Court Srinagar"
    ],
    "bio": "15 years of specialized legal practice in Taxation before Jammu & Kashmir High Court. Handled over 351+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-154",
    "name": "Adv. Harishchandra Puri",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Jammu",
    "state": "Jammu and Kashmir",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 3.9,
    "averageRating": 3.9,
    "reviewCount": 128,
    "totalReviews": 128,
    "languages": [
      "Hindi",
      "Dogri",
      "Urdu",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "JK/1154/2002",
    "barRegistrationNumber": "JK/1154/2002",
    "barCouncilState": "Jammu and Kashmir",
    "courts": [
      "Jammu & Kashmir High Court",
      "District Court Jammu"
    ],
    "bio": "22 years of specialized legal practice in Intellectual Property before District Court Jammu. Handled over 384+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-155",
    "name": "Adv. Himanshu Raghavan",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1800,
    "consultationFee": 1800,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 139,
    "totalReviews": 139,
    "languages": [
      "English",
      "Marathi",
      "Hindi",
      "Gujarati"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1155/1995",
    "barRegistrationNumber": "MH/1155/1995",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil & Sessions Court Mumbai",
      "Bandra Family Court"
    ],
    "bio": "29 years of specialized legal practice in Cyber Law before City Civil & Sessions Court Mumbai. Handled over 417+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-156",
    "name": "Adv. Imran Rathore",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 150,
    "totalReviews": 150,
    "languages": [
      "Marathi",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "MH/1156/2023",
    "barRegistrationNumber": "MH/1156/2023",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Shivajinagar District Court Pune",
      "Pune Family Court"
    ],
    "bio": "1 years of specialized legal practice in Bail & FIR before Pune Family Court. Handled over 450+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-157",
    "name": "Adv. Ishaan Saxena",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Nagpur",
    "state": "Maharashtra",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 4200,
    "consultationFee": 4200,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 161,
    "totalReviews": 161,
    "languages": [
      "Marathi",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1157/2016",
    "barRegistrationNumber": "MH/1157/2016",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court (Nagpur Bench)",
      "District Court Nagpur"
    ],
    "bio": "8 years of specialized legal practice in Criminal Defence before Bombay High Court (Nagpur Bench). Handled over 483+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-158",
    "name": "Adv. Jitendra Sethi",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 5000,
    "consultationFee": 5000,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 172,
    "totalReviews": 172,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/1158/2009",
    "barRegistrationNumber": "GJ/1158/2009",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "City Civil Court Ahmedabad"
    ],
    "bio": "15 years of specialized legal practice in Family Law before City Civil Court Ahmedabad. Handled over 516+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-159",
    "name": "Adv. Jyoti Shetty",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Surat",
    "state": "Gujarat",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 3000,
    "consultationFee": 3000,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 183,
    "totalReviews": 183,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/1159/2002",
    "barRegistrationNumber": "GJ/1159/2002",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "District Court Surat"
    ],
    "bio": "22 years of specialized legal practice in Property Law before Gujarat High Court. Handled over 549+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-160",
    "name": "Adv. Kalpana Singhania",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Vadodara",
    "state": "Gujarat",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 12000,
    "consultationFee": 12000,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 194,
    "totalReviews": 194,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/1160/1995",
    "barRegistrationNumber": "GJ/1160/1995",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "District Court Vadodara"
    ],
    "bio": "29 years of specialized legal practice in Corporate Law before District Court Vadodara. Handled over 582+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-161",
    "name": "Adv. Kamlesh Srivastava",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 750,
    "consultationFee": 750,
    "rating": 3.9,
    "averageRating": 3.9,
    "reviewCount": 10,
    "totalReviews": 10,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "RJ/1161/2023",
    "barRegistrationNumber": "RJ/1161/2023",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court (Jaipur Bench)",
      "District & Sessions Court Jaipur"
    ],
    "bio": "1 years of specialized legal practice in Consumer Rights before Rajasthan High Court (Jaipur Bench). Handled over 30+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-162",
    "name": "Adv. Karthik Thakor",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Jodhpur",
    "state": "Rajasthan",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 900,
    "consultationFee": 900,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 21,
    "totalReviews": 21,
    "languages": [
      "Hindi",
      "Marwari",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/1162/2016",
    "barRegistrationNumber": "RJ/1162/2016",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court Principal Seat Jodhpur"
    ],
    "bio": "8 years of specialized legal practice in Labour Law before Rajasthan High Court Principal Seat Jodhpur. Handled over 63+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-163",
    "name": "Adv. Kavita Trivedi",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Panaji",
    "state": "Goa",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 32,
    "totalReviews": 32,
    "languages": [
      "Konkani",
      "English",
      "Marathi",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GA/1163/2009",
    "barRegistrationNumber": "GA/1163/2009",
    "barCouncilState": "Goa",
    "courts": [
      "Bombay High Court at Goa",
      "North Goa District Court"
    ],
    "bio": "15 years of specialized legal practice in Civil Disputes before Bombay High Court at Goa. Handled over 96+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-164",
    "name": "Adv. Kavya Varma",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 43,
    "totalReviews": 43,
    "languages": [
      "Kannada",
      "English",
      "Hindi",
      "Tamil",
      "Telugu",
      "Tulu"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1164/2002",
    "barRegistrationNumber": "KA/1164/2002",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court"
    ],
    "bio": "22 years of specialized legal practice in Divorce before City Civil Court Bengaluru. Handled over 129+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-165",
    "name": "Adv. Kunal Yadav",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Mangaluru",
    "state": "Karnataka",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1200,
    "consultationFee": 1200,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 54,
    "totalReviews": 54,
    "languages": [
      "Tulu",
      "Kannada",
      "English",
      "Konkani",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1165/1995",
    "barRegistrationNumber": "KA/1165/1995",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "District Court Mangaluru"
    ],
    "bio": "29 years of specialized legal practice in Taxation before Karnataka High Court. Handled over 162+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-166",
    "name": "Adv. Lakshmi Aggarwal",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 65,
    "totalReviews": 65,
    "languages": [
      "Telugu",
      "English",
      "Hindi",
      "Urdu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "TS/1166/2023",
    "barRegistrationNumber": "TS/1166/2023",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Nampally Criminal Court"
    ],
    "bio": "1 years of specialized legal practice in Intellectual Property before Telangana High Court. Handled over 195+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-167",
    "name": "Adv. Madan Anand",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 5000,
    "consultationFee": 5000,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 76,
    "totalReviews": 76,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1167/2016",
    "barRegistrationNumber": "TN/1167/2016",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "Egmore Magistrate Court"
    ],
    "bio": "8 years of specialized legal practice in Cyber Law before City Civil Court Chennai. Handled over 228+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-168",
    "name": "Adv. Madhav Banerjee",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 3000,
    "consultationFee": 3000,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 87,
    "totalReviews": 87,
    "languages": [
      "Tamil",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1168/2009",
    "barRegistrationNumber": "TN/1168/2009",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "District Court Coimbatore"
    ],
    "bio": "15 years of specialized legal practice in Bail & FIR before District Court Coimbatore. Handled over 261+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-169",
    "name": "Adv. Mala Bhatia",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Madurai",
    "state": "Tamil Nadu",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 3500,
    "consultationFee": 3500,
    "rating": 3.3,
    "averageRating": 3.3,
    "reviewCount": 98,
    "totalReviews": 98,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1169/2002",
    "barRegistrationNumber": "TN/1169/2002",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court (Madurai Bench)",
      "District Court Madurai"
    ],
    "bio": "22 years of specialized legal practice in Criminal Defence before Madras High Court (Madurai Bench). Handled over 294+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-170",
    "name": "Adv. Manasvi Bhushan",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Kochi",
    "state": "Kerala",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 6000,
    "consultationFee": 6000,
    "rating": 3.4,
    "averageRating": 3.4,
    "reviewCount": 109,
    "totalReviews": 109,
    "languages": [
      "Malayalam",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KL/1170/1995",
    "barRegistrationNumber": "KL/1170/1995",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "Ernakulam District Court"
    ],
    "bio": "29 years of specialized legal practice in Family Law before Ernakulam District Court. Handled over 327+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-171",
    "name": "Adv. Manish Chandrasekar",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Thiruvananthapuram",
    "state": "Kerala",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 900,
    "consultationFee": 900,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 120,
    "totalReviews": 120,
    "languages": [
      "Malayalam",
      "English",
      "Tamil",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "KL/1171/2023",
    "barRegistrationNumber": "KL/1171/2023",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "District Court Vanchiyoor"
    ],
    "bio": "1 years of specialized legal practice in Property Law before Kerala High Court. Handled over 360+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-172",
    "name": "Adv. Meenakshi Choudhary",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 131,
    "totalReviews": 131,
    "languages": [
      "Bengali",
      "English",
      "Hindi",
      "Odia"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "WB/1172/2016",
    "barRegistrationNumber": "WB/1172/2016",
    "barCouncilState": "West Bengal",
    "courts": [
      "Calcutta High Court",
      "City Civil Court Kolkata",
      "Alipore Court"
    ],
    "bio": "8 years of specialized legal practice in Corporate Law before Calcutta High Court. Handled over 393+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-173",
    "name": "Adv. Meera Deshpande",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Bhubaneswar",
    "state": "Odisha",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 142,
    "totalReviews": 142,
    "languages": [
      "Odia",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "OD/1173/2009",
    "barRegistrationNumber": "OD/1173/2009",
    "barCouncilState": "Odisha",
    "courts": [
      "Orissa High Court",
      "District Court Bhubaneswar"
    ],
    "bio": "15 years of specialized legal practice in Consumer Rights before Orissa High Court. Handled over 426+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-174",
    "name": "Adv. Mohammed Dixit",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Cuttack",
    "state": "Odisha",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 153,
    "totalReviews": 153,
    "languages": [
      "Odia",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "OD/1174/2002",
    "barRegistrationNumber": "OD/1174/2002",
    "barCouncilState": "Odisha",
    "courts": [
      "Orissa High Court Cuttack",
      "District Court Cuttack"
    ],
    "bio": "22 years of specialized legal practice in Labour Law before District Court Cuttack. Handled over 459+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-175",
    "name": "Adv. Mohit Garg",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Patna",
    "state": "Bihar",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1800,
    "consultationFee": 1800,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 164,
    "totalReviews": 164,
    "languages": [
      "Hindi",
      "Bhojpuri",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "BR/1175/1995",
    "barRegistrationNumber": "BR/1175/1995",
    "barCouncilState": "Bihar",
    "courts": [
      "Patna High Court",
      "Patna Civil Court"
    ],
    "bio": "29 years of specialized legal practice in Civil Disputes before Patna High Court. Handled over 492+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-176",
    "name": "Adv. Narendra Gujral",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Ranchi",
    "state": "Jharkhand",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 175,
    "totalReviews": 175,
    "languages": [
      "Hindi",
      "English",
      "Bengali"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "JH/1176/2023",
    "barRegistrationNumber": "JH/1176/2023",
    "barCouncilState": "Jharkhand",
    "courts": [
      "Jharkhand High Court",
      "District Court Ranchi"
    ],
    "bio": "1 years of specialized legal practice in Divorce before District Court Ranchi. Handled over 525+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-177",
    "name": "Adv. Naseem Iyer",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Guwahati",
    "state": "Assam",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 3000,
    "consultationFee": 3000,
    "rating": 3.4,
    "averageRating": 3.4,
    "reviewCount": 186,
    "totalReviews": 186,
    "languages": [
      "Assamese",
      "English",
      "Hindi",
      "Bengali"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "AS/1177/2016",
    "barRegistrationNumber": "AS/1177/2016",
    "barCouncilState": "Assam",
    "courts": [
      "Gauhati High Court",
      "District Court Kamrup Guwahati"
    ],
    "bio": "8 years of specialized legal practice in Taxation before Gauhati High Court. Handled over 558+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-178",
    "name": "Adv. Natasha Kalam",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Indore",
    "state": "Madhya Pradesh",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 3500,
    "consultationFee": 3500,
    "rating": 3.5,
    "averageRating": 3.5,
    "reviewCount": 197,
    "totalReviews": 197,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MP/1178/2009",
    "barRegistrationNumber": "MP/1178/2009",
    "barCouncilState": "Madhya Pradesh",
    "courts": [
      "Madhya Pradesh High Court (Indore Bench)",
      "District Court Indore"
    ],
    "bio": "15 years of specialized legal practice in Intellectual Property before District Court Indore. Handled over 591+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-179",
    "name": "Adv. Naveen Khatri",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Bhopal",
    "state": "Madhya Pradesh",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 4000,
    "consultationFee": 4000,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 13,
    "totalReviews": 13,
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MP/1179/2002",
    "barRegistrationNumber": "MP/1179/2002",
    "barCouncilState": "Madhya Pradesh",
    "courts": [
      "Madhya Pradesh High Court",
      "District Court Bhopal"
    ],
    "bio": "22 years of specialized legal practice in Cyber Law before Madhya Pradesh High Court. Handled over 39+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-180",
    "name": "Adv. Neha Krishnaswamy",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Raipur",
    "state": "Chhattisgarh",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 7500,
    "consultationFee": 7500,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 24,
    "totalReviews": 24,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "CG/1180/1995",
    "barRegistrationNumber": "CG/1180/1995",
    "barCouncilState": "Chhattisgarh",
    "courts": [
      "Chhattisgarh High Court",
      "District Court Raipur"
    ],
    "bio": "29 years of specialized legal practice in Bail & FIR before District Court Raipur. Handled over 72+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-181",
    "name": "Adv. Nidhi Kurian",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Delhi",
    "state": "Delhi",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 500,
    "consultationFee": 500,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 35,
    "totalReviews": 35,
    "languages": [
      "Hindi",
      "English",
      "Punjabi",
      "Urdu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "D/1181/2023",
    "barRegistrationNumber": "D/1181/2023",
    "barCouncilState": "Delhi",
    "courts": [
      "Delhi High Court",
      "Tis Hazari District Court",
      "Patiala House Court",
      "Saket Court"
    ],
    "bio": "1 years of specialized legal practice in Criminal Defence before Delhi High Court. Handled over 105+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-182",
    "name": "Adv. Nirmala Mathur",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Chandigarh",
    "state": "Punjab & Haryana",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 46,
    "totalReviews": 46,
    "languages": [
      "Punjabi",
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "PH/1182/2016",
    "barRegistrationNumber": "PH/1182/2016",
    "barCouncilState": "Punjab & Haryana",
    "courts": [
      "Punjab & Haryana High Court",
      "District Court Chandigarh"
    ],
    "bio": "8 years of specialized legal practice in Family Law before District Court Chandigarh. Handled over 138+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-183",
    "name": "Adv. Pallav Menon",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Lucknow",
    "state": "Uttar Pradesh",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 900,
    "consultationFee": 900,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 57,
    "totalReviews": 57,
    "languages": [
      "Hindi",
      "Urdu",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1183/2009",
    "barRegistrationNumber": "UP/1183/2009",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court (Lucknow Bench)",
      "Lucknow District Court"
    ],
    "bio": "15 years of specialized legal practice in Property Law before Allahabad High Court (Lucknow Bench). Handled over 171+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-184",
    "name": "Adv. Pallavi Murugan",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Noida",
    "state": "Uttar Pradesh",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 68,
    "totalReviews": 68,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1184/2002",
    "barRegistrationNumber": "UP/1184/2002",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "Surajpur District Court Gautam Buddha Nagar"
    ],
    "bio": "22 years of specialized legal practice in Corporate Law before Surajpur District Court Gautam Buddha Nagar. Handled over 204+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-185",
    "name": "Adv. Pooja Namboodiri",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Kanpur",
    "state": "Uttar Pradesh",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1200,
    "consultationFee": 1200,
    "rating": 3.5,
    "averageRating": 3.5,
    "reviewCount": 79,
    "totalReviews": 79,
    "languages": [
      "Hindi",
      "English",
      "Urdu"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UP/1185/1995",
    "barRegistrationNumber": "UP/1185/1995",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "Kanpur Nagar District Court"
    ],
    "bio": "29 years of specialized legal practice in Consumer Rights before Allahabad High Court. Handled over 237+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-186",
    "name": "Adv. Pradeep Patil",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Prayagraj",
    "state": "Uttar Pradesh",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 3.6,
    "averageRating": 3.6,
    "reviewCount": 90,
    "totalReviews": 90,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "UP/1186/2023",
    "barRegistrationNumber": "UP/1186/2023",
    "barCouncilState": "Uttar Pradesh",
    "courts": [
      "Allahabad High Court",
      "District Court Allahabad"
    ],
    "bio": "1 years of specialized legal practice in Labour Law before District Court Allahabad. Handled over 270+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-187",
    "name": "Adv. Prakash Prasad",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Dehradun",
    "state": "Uttarakhand",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 3500,
    "consultationFee": 3500,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 101,
    "totalReviews": 101,
    "languages": [
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "UK/1187/2016",
    "barRegistrationNumber": "UK/1187/2016",
    "barCouncilState": "Uttarakhand",
    "courts": [
      "Uttarakhand High Court",
      "Dehradun District Court"
    ],
    "bio": "8 years of specialized legal practice in Civil Disputes before Uttarakhand High Court. Handled over 303+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-188",
    "name": "Adv. Prashant Raghunathan",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Shimla",
    "state": "Himachal Pradesh",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 4000,
    "consultationFee": 4000,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 112,
    "totalReviews": 112,
    "languages": [
      "Hindi",
      "English",
      "Punjabi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "HP/1188/2009",
    "barRegistrationNumber": "HP/1188/2009",
    "barCouncilState": "Himachal Pradesh",
    "courts": [
      "Himachal Pradesh High Court",
      "District Court Shimla"
    ],
    "bio": "15 years of specialized legal practice in Divorce before District Court Shimla. Handled over 336+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-189",
    "name": "Adv. Prateek Rao",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Srinagar",
    "state": "Jammu and Kashmir",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 4500,
    "consultationFee": 4500,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 123,
    "totalReviews": 123,
    "languages": [
      "Kashmiri",
      "Urdu",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "JK/1189/2002",
    "barRegistrationNumber": "JK/1189/2002",
    "barCouncilState": "Jammu and Kashmir",
    "courts": [
      "Jammu & Kashmir High Court",
      "District Court Srinagar"
    ],
    "bio": "22 years of specialized legal practice in Taxation before Jammu & Kashmir High Court. Handled over 369+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-190",
    "name": "Adv. Praveen Sandhu",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Jammu",
    "state": "Jammu and Kashmir",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 9000,
    "consultationFee": 9000,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 134,
    "totalReviews": 134,
    "languages": [
      "Hindi",
      "Dogri",
      "Urdu",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "JK/1190/1995",
    "barRegistrationNumber": "JK/1190/1995",
    "barCouncilState": "Jammu and Kashmir",
    "courts": [
      "Jammu & Kashmir High Court",
      "District Court Jammu"
    ],
    "bio": "29 years of specialized legal practice in Intellectual Property before District Court Jammu. Handled over 402+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-191",
    "name": "Adv. Preeti Sengupta",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Mumbai",
    "state": "Maharashtra",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4.9,
    "averageRating": 4.9,
    "reviewCount": 145,
    "totalReviews": 145,
    "languages": [
      "English",
      "Marathi",
      "Hindi",
      "Gujarati"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "MH/1191/2023",
    "barRegistrationNumber": "MH/1191/2023",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court",
      "City Civil & Sessions Court Mumbai",
      "Bandra Family Court"
    ],
    "bio": "1 years of specialized legal practice in Cyber Law before City Civil & Sessions Court Mumbai. Handled over 435+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-192",
    "name": "Adv. Priya Sharma",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Pune",
    "state": "Maharashtra",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 900,
    "consultationFee": 900,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 156,
    "totalReviews": 156,
    "languages": [
      "Marathi",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1192/2016",
    "barRegistrationNumber": "MH/1192/2016",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Shivajinagar District Court Pune",
      "Pune Family Court"
    ],
    "bio": "8 years of specialized legal practice in Bail & FIR before Pune Family Court. Handled over 468+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-193",
    "name": "Adv. Priyanka Singh",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Nagpur",
    "state": "Maharashtra",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 500,
    "consultationFee": 500,
    "rating": 3.6,
    "averageRating": 3.6,
    "reviewCount": 167,
    "totalReviews": 167,
    "languages": [
      "Marathi",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "MH/1193/2009",
    "barRegistrationNumber": "MH/1193/2009",
    "barCouncilState": "Maharashtra",
    "courts": [
      "Bombay High Court (Nagpur Bench)",
      "District Court Nagpur"
    ],
    "bio": "15 years of specialized legal practice in Criminal Defence before Bombay High Court (Nagpur Bench). Handled over 501+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-194",
    "name": "Adv. Raghav Sood",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Ahmedabad",
    "state": "Gujarat",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 3.7,
    "averageRating": 3.7,
    "reviewCount": 178,
    "totalReviews": 178,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/1194/2002",
    "barRegistrationNumber": "GJ/1194/2002",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "City Civil Court Ahmedabad"
    ],
    "bio": "22 years of specialized legal practice in Family Law before City Civil Court Ahmedabad. Handled over 534+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-195",
    "name": "Adv. Rahul Talwar",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Surat",
    "state": "Gujarat",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1800,
    "consultationFee": 1800,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 189,
    "totalReviews": 189,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GJ/1195/1995",
    "barRegistrationNumber": "GJ/1195/1995",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "District Court Surat"
    ],
    "bio": "29 years of specialized legal practice in Property Law before Gujarat High Court. Handled over 567+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-196",
    "name": "Adv. Rajesh Tripathi",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Vadodara",
    "state": "Gujarat",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4,
    "averageRating": 4,
    "reviewCount": 5,
    "totalReviews": 5,
    "languages": [
      "Gujarati",
      "Hindi",
      "English"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "GJ/1196/2023",
    "barRegistrationNumber": "GJ/1196/2023",
    "barCouncilState": "Gujarat",
    "courts": [
      "Gujarat High Court",
      "District Court Vadodara"
    ],
    "bio": "1 years of specialized legal practice in Corporate Law before District Court Vadodara. Handled over 15+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-197",
    "name": "Adv. Rajeshwar Varghese",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Jaipur",
    "state": "Rajasthan",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 4000,
    "consultationFee": 4000,
    "rating": 4.1,
    "averageRating": 4.1,
    "reviewCount": 16,
    "totalReviews": 16,
    "languages": [
      "Hindi",
      "English",
      "Marwari"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/1197/2016",
    "barRegistrationNumber": "RJ/1197/2016",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court (Jaipur Bench)",
      "District & Sessions Court Jaipur"
    ],
    "bio": "8 years of specialized legal practice in Consumer Rights before Rajasthan High Court (Jaipur Bench). Handled over 48+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-198",
    "name": "Adv. Rakesh Vyas",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Jodhpur",
    "state": "Rajasthan",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 4500,
    "consultationFee": 4500,
    "rating": 5,
    "averageRating": 5,
    "reviewCount": 27,
    "totalReviews": 27,
    "languages": [
      "Hindi",
      "Marwari",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "RJ/1198/2009",
    "barRegistrationNumber": "RJ/1198/2009",
    "barCouncilState": "Rajasthan",
    "courts": [
      "Rajasthan High Court Principal Seat Jodhpur"
    ],
    "bio": "15 years of specialized legal practice in Labour Law before Rajasthan High Court Principal Seat Jodhpur. Handled over 81+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-199",
    "name": "Adv. Ramesh Agarwal",
    "specialization": "Civil Disputes",
    "specializations": [
      "Civil Disputes"
    ],
    "city": "Panaji",
    "state": "Goa",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 2800,
    "consultationFee": 2800,
    "rating": 4.5,
    "averageRating": 4.5,
    "reviewCount": 38,
    "totalReviews": 38,
    "languages": [
      "Konkani",
      "English",
      "Marathi",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "GA/1199/2002",
    "barRegistrationNumber": "GA/1199/2002",
    "barCouncilState": "Goa",
    "courts": [
      "Bombay High Court at Goa",
      "North Goa District Court"
    ],
    "bio": "22 years of specialized legal practice in Civil Disputes before Bombay High Court at Goa. Handled over 114+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-200",
    "name": "Adv. Rameshwar Akhtar",
    "specialization": "Divorce",
    "specializations": [
      "Divorce"
    ],
    "city": "Bengaluru",
    "state": "Karnataka",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 12000,
    "consultationFee": 12000,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 49,
    "totalReviews": 49,
    "languages": [
      "Kannada",
      "English",
      "Hindi",
      "Tamil",
      "Telugu",
      "Tulu"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KA/1200/1995",
    "barRegistrationNumber": "KA/1200/1995",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "City Civil Court Bengaluru",
      "Mayo Hall Court"
    ],
    "bio": "29 years of specialized legal practice in Divorce before City Civil Court Bengaluru. Handled over 147+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-201",
    "name": "Adv. Rekha Bafna",
    "specialization": "Taxation",
    "specializations": [
      "Taxation"
    ],
    "city": "Mangaluru",
    "state": "Karnataka",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 900,
    "consultationFee": 900,
    "rating": 3.7,
    "averageRating": 3.7,
    "reviewCount": 60,
    "totalReviews": 60,
    "languages": [
      "Tulu",
      "Kannada",
      "English",
      "Konkani",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "KA/1201/2023",
    "barRegistrationNumber": "KA/1201/2023",
    "barCouncilState": "Karnataka",
    "courts": [
      "Karnataka High Court",
      "District Court Mangaluru"
    ],
    "bio": "1 years of specialized legal practice in Taxation before Karnataka High Court. Handled over 180+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-202",
    "name": "Adv. Ritu Bhat",
    "specialization": "Intellectual Property",
    "specializations": [
      "Intellectual Property"
    ],
    "city": "Hyderabad",
    "state": "Telangana",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 500,
    "consultationFee": 500,
    "rating": 3.8,
    "averageRating": 3.8,
    "reviewCount": 71,
    "totalReviews": 71,
    "languages": [
      "Telugu",
      "English",
      "Hindi",
      "Urdu"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TS/1202/2016",
    "barRegistrationNumber": "TS/1202/2016",
    "barCouncilState": "Telangana",
    "courts": [
      "Telangana High Court",
      "City Civil Court Hyderabad",
      "Nampally Criminal Court"
    ],
    "bio": "8 years of specialized legal practice in Intellectual Property before Telangana High Court. Handled over 213+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-203",
    "name": "Adv. Rohan Bhattacharya",
    "specialization": "Cyber Law",
    "specializations": [
      "Cyber Law"
    ],
    "city": "Chennai",
    "state": "Tamil Nadu",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 750,
    "consultationFee": 750,
    "rating": 4.2,
    "averageRating": 4.2,
    "reviewCount": 82,
    "totalReviews": 82,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1203/2009",
    "barRegistrationNumber": "TN/1203/2009",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "City Civil Court Chennai",
      "Egmore Magistrate Court"
    ],
    "bio": "15 years of specialized legal practice in Cyber Law before City Civil Court Chennai. Handled over 246+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-204",
    "name": "Adv. Rohit Chadha",
    "specialization": "Bail & FIR",
    "specializations": [
      "Bail & FIR"
    ],
    "city": "Coimbatore",
    "state": "Tamil Nadu",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 2200,
    "consultationFee": 2200,
    "rating": 4.3,
    "averageRating": 4.3,
    "reviewCount": 93,
    "totalReviews": 93,
    "languages": [
      "Tamil",
      "English"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1204/2002",
    "barRegistrationNumber": "TN/1204/2002",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court",
      "District Court Coimbatore"
    ],
    "bio": "22 years of specialized legal practice in Bail & FIR before District Court Coimbatore. Handled over 279+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-205",
    "name": "Adv. Sameer Chopra",
    "specialization": "Criminal Defence",
    "specializations": [
      "Criminal Defence"
    ],
    "city": "Madurai",
    "state": "Tamil Nadu",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 1200,
    "consultationFee": 1200,
    "rating": 4.4,
    "averageRating": 4.4,
    "reviewCount": 104,
    "totalReviews": 104,
    "languages": [
      "Tamil",
      "English",
      "Hindi"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "TN/1205/1995",
    "barRegistrationNumber": "TN/1205/1995",
    "barCouncilState": "Tamil Nadu",
    "courts": [
      "Madras High Court (Madurai Bench)",
      "District Court Madurai"
    ],
    "bio": "29 years of specialized legal practice in Criminal Defence before Madras High Court (Madurai Bench). Handled over 312+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-206",
    "name": "Adv. Sanjay Deshmukh",
    "specialization": "Family Law",
    "specializations": [
      "Family Law"
    ],
    "city": "Kochi",
    "state": "Kerala",
    "experience": 1,
    "experienceLevel": "junior",
    "fee": 1500,
    "consultationFee": 1500,
    "rating": 4.6,
    "averageRating": 4.6,
    "reviewCount": 115,
    "totalReviews": 115,
    "languages": [
      "Malayalam",
      "English"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": false,
    "barCouncil": "KL/1206/2023",
    "barRegistrationNumber": "KL/1206/2023",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "Ernakulam District Court"
    ],
    "bio": "1 years of specialized legal practice in Family Law before Ernakulam District Court. Handled over 345+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-207",
    "name": "Adv. Santosh Dhillon",
    "specialization": "Property Law",
    "specializations": [
      "Property Law"
    ],
    "city": "Thiruvananthapuram",
    "state": "Kerala",
    "experience": 8,
    "experienceLevel": "mid",
    "fee": 4500,
    "consultationFee": 4500,
    "rating": 4.7,
    "averageRating": 4.7,
    "reviewCount": 126,
    "totalReviews": 126,
    "languages": [
      "Malayalam",
      "English",
      "Tamil",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "KL/1207/2016",
    "barRegistrationNumber": "KL/1207/2016",
    "barCouncilState": "Kerala",
    "courts": [
      "Kerala High Court",
      "District Court Vanchiyoor"
    ],
    "bio": "8 years of specialized legal practice in Property Law before Kerala High Court. Handled over 378+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-208",
    "name": "Adv. Sarita Farooqui",
    "specialization": "Corporate Law",
    "specializations": [
      "Corporate Law"
    ],
    "city": "Kolkata",
    "state": "West Bengal",
    "experience": 15,
    "experienceLevel": "mid",
    "fee": 2800,
    "consultationFee": 2800,
    "rating": 4.8,
    "averageRating": 4.8,
    "reviewCount": 137,
    "totalReviews": 137,
    "languages": [
      "Bengali",
      "English",
      "Hindi",
      "Odia"
    ],
    "availability": "Online",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "WB/1208/2009",
    "barRegistrationNumber": "WB/1208/2009",
    "barCouncilState": "West Bengal",
    "courts": [
      "Calcutta High Court",
      "City Civil Court Kolkata",
      "Alipore Court"
    ],
    "bio": "15 years of specialized legal practice in Corporate Law before Calcutta High Court. Handled over 411+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-209",
    "name": "Adv. Saurabh Gowda",
    "specialization": "Consumer Rights",
    "specializations": [
      "Consumer Rights"
    ],
    "city": "Bhubaneswar",
    "state": "Odisha",
    "experience": 22,
    "experienceLevel": "senior",
    "fee": 3200,
    "consultationFee": 3200,
    "rating": 3.8,
    "averageRating": 3.8,
    "reviewCount": 148,
    "totalReviews": 148,
    "languages": [
      "Odia",
      "English",
      "Hindi"
    ],
    "availability": "Offline",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "OD/1209/2002",
    "barRegistrationNumber": "OD/1209/2002",
    "barCouncilState": "Odisha",
    "courts": [
      "Orissa High Court",
      "District Court Bhubaneswar"
    ],
    "bio": "22 years of specialized legal practice in Consumer Rights before Orissa High Court. Handled over 444+ matters with dedicated client representation and high resolution standards."
  },
  {
    "_id": "demo-210",
    "name": "Adv. Shalini Hegde",
    "specialization": "Labour Law",
    "specializations": [
      "Labour Law"
    ],
    "city": "Cuttack",
    "state": "Odisha",
    "experience": 29,
    "experienceLevel": "senior",
    "fee": 6000,
    "consultationFee": 6000,
    "rating": 3.9,
    "averageRating": 3.9,
    "reviewCount": 159,
    "totalReviews": 159,
    "languages": [
      "Odia",
      "English",
      "Hindi"
    ],
    "availability": "Both",
    "verified": true,
    "isDemo": true,
    "isAvailable": true,
    "barCouncil": "OD/1210/1995",
    "barRegistrationNumber": "OD/1210/1995",
    "barCouncilState": "Odisha",
    "courts": [
      "Orissa High Court Cuttack",
      "District Court Cuttack"
    ],
    "bio": "29 years of specialized legal practice in Labour Law before District Court Cuttack. Handled over 477+ matters with dedicated client representation and high resolution standards."
  }
];

export default demoLawyers;
