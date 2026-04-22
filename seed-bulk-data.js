require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')
const Lawyer = require('./models/Lawyer')

const MONGODB_URI = process.env.MONGODB_URI

const FIRST_NAMES = ['Aarav', 'Vihaan', 'Aditya', 'Sai', 'Arjun', 'Siddharth', 'Rohan', 'Rahul', 'Amit', 'Vikram', 'Raj', 'Sanjay', 'Priya', 'Ananya', 'Sneha', 'Kavya', 'Pooja', 'Neha', 'Aditi', 'Riya', 'Isha', 'Ritu', 'Sunita', 'Anjali', 'Karan', 'Tarun', 'Manoj', 'Deepak', 'Nitin', 'Alok', 'Mohit', 'Ashish', 'Rakesh', 'Suresh', 'Mukesh', 'Gaurav', 'Nikhil', 'Prakash', 'Rajiv', 'Rohit', 'Saurabh', 'Sumit', 'Varun', 'Vikas', 'Yogesh', 'Meera', 'Divya', 'Aarti', 'Preeti', 'Swati', 'Priyanka', 'Radhika', 'Sakshi', 'Shruti', 'Sweta', 'Monika', 'Kiran']
const LAST_NAMES = ['Sharma', 'Singh', 'Kumar', 'Das', 'Kaur', 'Gupta', 'Patel', 'Jain', 'Verma', 'Mishra', 'Pandey', 'Yadav', 'Jha', 'Tiwari', 'Reddy', 'Rao', 'Iyer', 'Nair', 'Pillai', 'Chauhan', 'Rajput', 'Bhatt', 'Joshi', 'Mehta', 'Deshmukh', 'Kulkarni', 'Bose', 'Chatterjee', 'Banerjee', 'Ghosh', 'Sen', 'Sinha', 'Chowdhury', 'Mukherjee', 'Dutta', 'Bansal', 'Agarwal', 'Garg', 'Goyal', 'Mittal', 'Dalal', 'Malhotra', 'Kapoor', 'Ahuja', 'Bhatia', 'Chawla', 'Khatri', 'Thakur', 'Gowda', 'Shetty']
const CITIES = ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Indore', 'Bhopal', 'Patna', 'Gurugram', 'Noida']
const SPECIALIZATIONS = ['Criminal Defence', 'Family Law', 'Property Law', 'Corporate Law', 'Consumer Rights', 'Labour Law', 'Civil Disputes', 'Divorce']

const randomItem = (arr) => arr[Math.floor(Math.random() * arr.length)]
const randomItems = (arr, count) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

async function seed() {
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected.')

    let clientsCreated = 0
    let lawyersCreated = 0

    // Create 100 Clients
    console.log('Generating 100 clients...')
    for (let i = 0; i < 100; i++) {
      const name = `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`
      const email = `client_${Date.now()}_${i}@example.com`
      const city = randomItem(CITIES)

      await User.create({
        name,
        email,
        password: 'password123',
        role: 'client',
        city,
        state: city // simplification
      })
      clientsCreated++
    }
    console.log(`Successfully created ${clientsCreated} clients.`)

    // Create 250 Lawyers
    console.log('Generating 250 lawyers...')
    for (let i = 0; i < 250; i++) {
      const name = `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`
      const email = `advocate_${Date.now()}_${i}@example.com`
      const city = randomItem(CITIES)
      const experience = randomInt(2, 30)
      const expLevel = experience > 15 ? 'senior' : experience > 5 ? 'mid' : 'junior'
      // 200 - 600 fee as requested
      const consultationFee = randomInt(2, 6) * 100

      const user = await User.create({
        name,
        email,
        password: 'password123',
        role: 'lawyer',
        city,
        state: city
      })

      const barNumber = `BAR/${city.substring(0,2).toUpperCase()}/${2000 + randomInt(0,24)}/${randomInt(1000,9999)}`
      
      await Lawyer.create({
        user: user._id,
        name,
        email,
        barRegistrationNumber: barNumber,
        specializations: randomItems(SPECIALIZATIONS, randomInt(1, 4)),
        experience,
        experienceLevel: expLevel,
        city,
        state: city,
        consultationFee,
        isVerified: Math.random() > 0.1, // 90% verified
        averageRating: (Math.random() * 2 + 3).toFixed(1), // 3.0 to 5.0
        totalReviews: randomInt(0, 150),
        bio: `Experienced advocate practicing in ${city}. Dedicated to providing the best legal counsel and fighting for your rights.`,
        subscription: randomItem(['free', 'basic', 'pro', 'elite']),
        subscriptionFeatures: {
            featured: Math.random() > 0.8
        }
      })
      lawyersCreated++
      
      if ((i+1) % 50 === 0) console.log(`...created ${i+1} lawyers`)
    }
    
    console.log(`Successfully created ${lawyersCreated} lawyers.`)
    console.log('Seeding complete.')
    process.exit(0)
  } catch (err) {
    console.error('Error seeding data:', err)
    process.exit(1)
  }
}

seed()
