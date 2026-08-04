require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Lawyer = require('../models/Lawyer');

const FIRST_NAMES = [
  'Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Siddharth', 'Rohan', 'Rahul', 'Amit', 'Vikram',
  'Raj', 'Sanjay', 'Priya', 'Ananya', 'Sneha', 'Kavya', 'Pooja', 'Neha', 'Aditi', 'Riya',
  'Isha', 'Ritu', 'Sunita', 'Anjali', 'Karan', 'Tarun', 'Manoj', 'Deepak', 'Nitin', 'Alok',
  'Mohit', 'Ashish', 'Rakesh', 'Suresh', 'Mukesh', 'Gaurav', 'Nikhil', 'Prakash', 'Rajiv', 'Rohit',
  'Saurabh', 'Sumit', 'Varun', 'Vikas', 'Yogesh', 'Meera', 'Divya', 'Aarti', 'Preeti', 'Swati',
  'Priyanka', 'Radhika', 'Sakshi', 'Shruti', 'Sweta', 'Monika', 'Kiran', 'Aakash', 'Abhinav', 'Alok',
  'Aman', 'Anand', 'Aniket', 'Ankur', 'Anup', 'Anurag', 'Avinash', 'Ayush', 'Bhaskar', 'Chetan',
  'Devendra', 'Dinesh', 'Ganesh', 'Gautam', 'Harish', 'Hemant', 'Jitin', 'Kunal', 'Manish', 'Mayank',
  'Naveen', 'Neeraj', 'Pankaj', 'Parag', 'Parveen', 'Pradeep', 'Prashant', 'Praveen', 'Puneet', 'Rajesh',
  'Raman', 'Ramesh', 'Ravi', 'Sachin', 'Sameer', 'Sandeep', 'Satish', 'Shailendra', 'Shashank', 'Shivam',
  'Shubham', 'Sudhir', 'Sunil', 'Tushar', 'Umang', 'Utkarsh', 'Vaibhav', 'Vijay', 'Vineet', 'Vishal'
];

const LAST_NAMES = [
  'Sharma', 'Singh', 'Kumar', 'Das', 'Kaur', 'Gupta', 'Patel', 'Jain', 'Verma', 'Mishra',
  'Pandey', 'Yadav', 'Jha', 'Tiwari', 'Reddy', 'Rao', 'Iyer', 'Nair', 'Pillai', 'Chauhan',
  'Rajput', 'Bhatt', 'Joshi', 'Mehta', 'Deshmukh', 'Kulkarni', 'Bose', 'Chatterjee', 'Banerjee', 'Ghosh',
  'Sen', 'Sinha', 'Chowdhury', 'Mukherjee', 'Dutta', 'Bansal', 'Agarwal', 'Garg', 'Goyal', 'Mittal',
  'Dalal', 'Malhotra', 'Kapoor', 'Ahuja', 'Bhatia', 'Chawla', 'Khatri', 'Thakur', 'Gowda', 'Shetty',
  'Pawar', 'Shinde', 'Patil', 'Jadhav', 'More', 'Hegde', 'Menon', 'Prabhu', 'Bhat', 'Kamath',
  'Choudhury', 'Dube', 'Saxena', 'Srivastava', 'Tripathi', 'Dixit', 'Shukla', 'Pande', 'Dwivedi', 'Upadhyay'
];

const CITY_STATE_MAP = [
  { city: 'Delhi', state: 'Delhi', code: 'DL' },
  { city: 'New Delhi', state: 'Delhi', code: 'DL' },
  { city: 'Mumbai', state: 'Maharashtra', code: 'MH' },
  { city: 'Pune', state: 'Maharashtra', code: 'MH' },
  { city: 'Nagpur', state: 'Maharashtra', code: 'MH' },
  { city: 'Thane', state: 'Maharashtra', code: 'MH' },
  { city: 'Bangalore', state: 'Karnataka', code: 'KA' },
  { city: 'Mysore', state: 'Karnataka', code: 'KA' },
  { city: 'Hyderabad', state: 'Telangana', code: 'TS' },
  { city: 'Chennai', state: 'Tamil Nadu', code: 'TN' },
  { city: 'Coimbatore', state: 'Tamil Nadu', code: 'TN' },
  { city: 'Kolkata', state: 'West Bengal', code: 'WB' },
  { city: 'Ahmedabad', state: 'Gujarat', code: 'GJ' },
  { city: 'Surat', state: 'Gujarat', code: 'GJ' },
  { city: 'Vadodara', state: 'Gujarat', code: 'GJ' },
  { city: 'Jaipur', state: 'Rajasthan', code: 'RJ' },
  { city: 'Jodhpur', state: 'Rajasthan', code: 'RJ' },
  { city: 'Udaipur', state: 'Rajasthan', code: 'RJ' },
  { city: 'Lucknow', state: 'Uttar Pradesh', code: 'UP' },
  { city: 'Noida', state: 'Uttar Pradesh', code: 'UP' },
  { city: 'Gurugram', state: 'Haryana', code: 'HR' },
  { city: 'Chandigarh', state: 'Punjab & Haryana', code: 'CH' },
  { city: 'Indore', state: 'Madhya Pradesh', code: 'MP' },
  { city: 'Bhopal', state: 'Madhya Pradesh', code: 'MP' },
  { city: 'Patna', state: 'Bihar', code: 'BR' },
  { city: 'Ranchi', state: 'Jharkhand', code: 'JH' },
  { city: 'Bhubaneswar', state: 'Odisha', code: 'OR' },
  { city: 'Guwahati', state: 'Assam', code: 'AS' },
  { city: 'Dehradun', state: 'Uttarakhand', code: 'UK' },
  { city: 'Kochi', state: 'Kerala', code: 'KL' },
  { city: 'Trivandrum', state: 'Kerala', code: 'KL' }
];

const SPECIALIZATIONS = [
  'Criminal Defence', 'Family Law', 'Property Law', 'Corporate Law', 'Consumer Rights',
  'Labour Law', 'Civil Disputes', 'Divorce', 'Taxation', 'Intellectual Property',
  'Cyber Law', 'Bail & FIR', 'RERA & Real Estate', 'Banking & Finance', 'Insurance Claims',
  'Arbitration & Dispute Resolution', 'Constitutional Law', 'Environmental Law',
  'Immigration Law', 'Medical Negligence', 'Human Rights', 'Negotiable Instruments Act (Cheque Bounce)'
];

const COURTS = [
  'Supreme Court of India', 'High Court of Delhi', 'Bombay High Court', 'Karnataka High Court',
  'Madras High Court', 'Calcutta High Court', 'Telangana High Court', 'Gujarat High Court',
  'Allahabad High Court', 'District & Sessions Court', 'City Civil Court', 'Family Court',
  'NCLT (National Company Law Tribunal)', 'RERA Tribunal', 'National Consumer Disputes Redressal Commission (NCDRC)',
  'Debt Recovery Tribunal (DRT)', 'Central Administrative Tribunal (CAT)'
];

const LANGUAGES = [
  'English', 'Hindi', 'Tamil', 'Telugu', 'Bengali', 'Marathi', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia', 'Urdu'
];

const AVATARS = [
  'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556157382-97eda2d62296?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80'
];

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, arr.length));
};
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function seed1000Lawyers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const targetCount = 1000;
    console.log(`Starting bulk generation of ${targetCount} lawyers across all case types...`);

    const timestamp = Date.now();
    const batchSize = 100;
    let createdCount = 0;

    for (let batchIndex = 0; batchIndex < targetCount / batchSize; batchIndex++) {
      const usersToInsert = [];
      const lawyersToInsert = [];

      for (let i = 0; i < batchSize; i++) {
        const globalIdx = batchIndex * batchSize + i + 1;
        const firstName = randomItem(FIRST_NAMES);
        const lastName = randomItem(LAST_NAMES);
        const name = `Adv. ${firstName} ${lastName}`;
        const email = `lawyer_bulk_${timestamp}_${globalIdx}@justicejunction.in`;
        const location = randomItem(CITY_STATE_MAP);
        const experience = randomInt(2, 35);
        const expLevel = experience >= 15 ? 'senior' : experience >= 6 ? 'mid' : 'junior';

        const userId = new mongoose.Types.ObjectId();
        const lawyerId = new mongoose.Types.ObjectId();

        usersToInsert.push({
          _id: userId,
          name,
          email,
          password: '$2a$12$eC7c05H3t72yN5tq9B7r5e04K1t.0vWpU1XmJ0p7A5m3h8Z2e7Kq2', // hashed 'password123'
          role: 'lawyer',
          city: location.city,
          state: location.state,
          isVerified: true,
          verificationStatus: 'verified',
          isBlocked: false,
          createdAt: new Date()
        });

        const barNumber = `BAR/${location.code}/${2000 + randomInt(0, 24)}/${randomInt(10000, 99999)}`;
        // Ensure primary specialization guarantees complete case type coverage
        const primarySpec = SPECIALIZATIONS[globalIdx % SPECIALIZATIONS.length];
        const additionalSpecs = randomItems(SPECIALIZATIONS.filter(s => s !== primarySpec), randomInt(1, 3));
        const specs = [primarySpec, ...additionalSpecs];

        const fee = randomInt(5, 50) * 100; // ₹500 to ₹5000
        const rating = (Math.random() * 0.9 + 4.1).toFixed(1); // 4.1 to 5.0
        const reviewsCount = randomInt(12, 280);
        const totalCases = randomInt(30, 600);

        lawyersToInsert.push({
          _id: lawyerId,
          user: userId,
          name,
          email,
          phone: `+91 ${randomInt(70000, 99999)} ${randomInt(10000, 99999)}`,
          photo: randomItem(AVATARS),
          barRegistrationNumber: barNumber,
          specializations: specs,
          experience,
          experienceLevel: expLevel,
          city: location.city,
          state: location.state,
          pincode: `${randomInt(110000, 700000)}`,
          courts: randomItems(COURTS, randomInt(1, 3)),
          consultationFee: fee,
          bio: `Advocate ${firstName} ${lastName} is a highly accomplished legal practitioner in ${location.city}, ${location.state} with ${experience} years of experience specializing in ${specs.join(', ')}. Committed to providing top-tier legal advice, strategic litigation management, and protecting client interests in courts across India.`,
          languages: randomItems(LANGUAGES, randomInt(2, 4)),
          isVerified: true,
          verificationStatus: 'verified',
          isBlocked: false,
          isAvailable: true,
          averageRating: parseFloat(rating),
          totalReviews: reviewsCount,
          totalCases: totalCases,
          totalEarnings: fee * totalCases,
          subscription: randomItem(['free', 'basic', 'pro', 'elite']),
          subscriptionFeatures: {
            name: 'Elite Practice Package',
            featured: Math.random() > 0.6,
            priority: Math.random() > 0.5,
            maxBookings: 25
          },
          consultationModes: ['Online Video Call', 'Audio Consultation', 'In-Person Chamber Visit'],
          availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          availableTimeFrom: '09:00 AM',
          availableTimeTo: '07:00 PM',
          createdAt: new Date()
        });
      }

      await User.insertMany(usersToInsert);
      await Lawyer.insertMany(lawyersToInsert);

      createdCount += batchSize;
      console.log(`Progress: ${createdCount} / ${targetCount} lawyers seeded successfully.`);
    }

    const totalLawyers = await Lawyer.countDocuments();
    const verifiedLawyers = await Lawyer.countDocuments({ verificationStatus: 'verified' });

    console.log('\n=== BULK SEEDING COMPLETE ===');
    console.log(`Total lawyers now in database: ${totalLawyers}`);
    console.log(`Verified lawyers: ${verifiedLawyers}`);

    process.exit(0);
  } catch (err) {
    console.error('Error seeding 1000 lawyers:', err);
    process.exit(1);
  }
}

seed1000Lawyers();
