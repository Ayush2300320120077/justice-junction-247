require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Lawyer = require('./models/Lawyer');

const MONGODB_URI = process.env.MONGODB_URI;

const SPECS = [
  'Criminal Defence', 'Family Law', 'Property Law', 'Corporate Law', 
  'Consumer Rights', 'Labour Law', 'Civil Disputes', 'Divorce', 
  'Taxation', 'Intellectual Property', 'Cyber Law', 'Real Estate', 
  'Banking & Finance', 'Immigration', 'Medical Negligence'
];

const CITIES = [
  { name: 'Delhi', state: 'Delhi', pincode: '110001' },
  { name: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  { name: 'Bangalore', state: 'Karnataka', pincode: '560001' },
  { name: 'Chennai', state: 'Tamil Nadu', pincode: '600001' },
  { name: 'Kolkata', state: 'West Bengal', pincode: '700001' },
  { name: 'Hyderabad', state: 'Telangana', pincode: '500001' },
  { name: 'Pune', state: 'Maharashtra', pincode: '411001' },
  { name: 'Ahmedabad', state: 'Gujarat', pincode: '380001' },
  { name: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
  { name: 'Lucknow', state: 'Uttar Pradesh', pincode: '226001' },
  { name: 'Chandigarh', state: 'Chandigarh', pincode: '160001' },
  { name: 'Indore', state: 'Madhya Pradesh', pincode: '452001' },
  { name: 'Patna', state: 'Bihar', pincode: '800001' },
  { name: 'Kochi', state: 'Kerala', pincode: '682001' },
  { name: 'Bhopal', state: 'Madhya Pradesh', pincode: '462001' },
  { name: 'Surat', state: 'Gujarat', pincode: '395001' },
  { name: 'Nagpur', state: 'Maharashtra', pincode: '440001' },
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', pincode: '530001' },
  { name: 'Kanpur', state: 'Uttar Pradesh', pincode: '208001' },
  { name: 'Ludhiana', state: 'Punjab', pincode: '141001' },
  { name: 'Gurugram', state: 'Haryana', pincode: '122001' },
  { name: 'Noida', state: 'Uttar Pradesh', pincode: '201301' },
  { name: 'Thane', state: 'Maharashtra', pincode: '400601' },
  { name: 'Guwahati', state: 'Assam', pincode: '781001' },
  { name: 'Bhubaneswar', state: 'Odisha', pincode: '751001' },
  { name: 'Ranchi', state: 'Jharkhand', pincode: '834001' },
  { name: 'Thiruvananthapuram', state: 'Kerala', pincode: '695001' },
  { name: 'Dehradun', state: 'Uttarakhand', pincode: '248001' },
  { name: 'Jammu', state: 'Jammu & Kashmir', pincode: '180001' },
  { name: 'Srinagar', state: 'Jammu & Kashmir', pincode: '190001' },
  { name: 'Goa', state: 'Goa', pincode: '403001' },
  { name: 'Shimla', state: 'Himachal Pradesh', pincode: '171001' },
  { name: 'Agra', state: 'Uttar Pradesh', pincode: '282001' },
  { name: 'Varanasi', state: 'Uttar Pradesh', pincode: '221001' },
  { name: 'Madurai', state: 'Tamil Nadu', pincode: '625001' },
  { name: 'Mysore', state: 'Karnataka', pincode: '570001' },
  { name: 'Coimbatore', state: 'Tamil Nadu', pincode: '641001' },
  { name: 'Amritsar', state: 'Punjab', pincode: '143001' },
  { name: 'Jodhpur', state: 'Rajasthan', pincode: '342001' },
  { name: 'Raipur', state: 'Chhattisgarh', pincode: '492001' }
];

const NAMES = [
  'Rajesh Sharma', 'Amit Patel', 'Sneha Reddy', 'Priya Iyer', 'Vikram Singh',
  'Anjali Gupta', 'Sanjay Verma', 'Meera Kapoor', 'Arjun Malhotra', 'Deepika Das',
  'Rahul Nair', 'Sunita Rao', 'Karan Johar', 'Neha Bhasin', 'Abhishek Bachchan',
  'Shweta Tiwari', 'Manish Pandey', 'Ritu Maheshwari', 'Vivek Oberoi', 'Pooja Hegde',
  'Nitin Gadkari', 'Smriti Irani', 'Piyush Goyal', 'Nirmala Sitharaman', 'Rajat Sharma',
  'Barkha Dutt', 'Arnab Goswami', 'Sushma Swaraj', 'Arun Jaitley', 'Kapil Sibal',
  'Harish Salve', 'Ram Jethmalani', 'Mukul Rohatgi', 'Prashant Bhushan', 'Indira Jaising',
  'Abhishek Manu Singhvi', 'Soltan Sorabjee', 'Fali S. Nariman', 'K.K. Venugopal', 'Tushar Mehta'
];

const COURTS = ['Supreme Court', 'High Court', 'District Court', 'Consumer Forum', 'Tribunals'];
const LANGS = ['English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Punjabi', 'Urdu'];

async function seed() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected.');

    const COUNT = 300; 
    console.log(`Seeding ${COUNT} lawyers...`);

    for (let i = 0; i < COUNT; i++) {
      const cityObj = CITIES[i % CITIES.length];
      const name = NAMES[i % NAMES.length] + ' ' + (i >= NAMES.length ? Math.floor(i / NAMES.length) + 1 : '');
      const email = `lawyer.pro${i + 500}@jj247.com`;
      const password = 'password123';
      
      // 1. Create User
      const user = new User({
        name,
        email,
        password,
        role: 'lawyer',
        city: cityObj.name,
        state: cityObj.state,
        phone: '98' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
      });
      await user.save();

      // Generate a realistic pincode based on city prefix
      const prefix = cityObj.pincode.substring(0, 3);
      const randomSuffix = Math.floor(Math.random() * 900) + 100;
      const pincode = prefix + randomSuffix;

      // 2. Create Lawyer
      const lawyer = new Lawyer({
        user: user._id,
        name,
        email,
        phone: user.phone,
        barRegistrationNumber: `BCI/${new Date().getFullYear()}/${20000 + i}`,
        specializations: [SPECS[Math.floor(Math.random() * SPECS.length)], SPECS[Math.floor(Math.random() * SPECS.length)]],
        experience: Math.floor(Math.random() * 30) + 2,
        experienceLevel: i % 4 === 0 ? 'senior' : (i % 2 === 0 ? 'mid' : 'junior'),
        city: cityObj.name,
        state: cityObj.state,
        pincode: pincode,
        courts: [COURTS[Math.floor(Math.random() * COURTS.length)]],
        consultationFee: (Math.floor(Math.random() * 30) + 5) * 100, 
        bio: `Professional advocate specializing in ${SPECS[i % SPECS.length]}. Committed to justice.`,
        languages: ['English', LANGS[Math.floor(Math.random() * LANGS.length)]],
        isVerified: true,
        averageRating: (Math.random() * 1.2) + 3.8,
        totalReviews: Math.floor(Math.random() * 150) + 20,
        subscription: i % 10 === 0 ? 'elite' : 'free'
      });
      await lawyer.save();
      
      if (i % 25 === 0) console.log(`Seeded ${i}...`);
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
