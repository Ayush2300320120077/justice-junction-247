require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const emailToPromote = process.argv[2];

if (!emailToPromote) {
  console.log('Please provide an email. Usage: node make-admin.js <email>');
  process.exit(1);
}

async function makeAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOneAndUpdate(
      { email: emailToPromote },
      { role: 'admin' },
      { new: true }
    );
    
    if (user) {
      console.log(`Success! User ${user.email} is now an admin.`);
    } else {
      console.log('User not found in the database.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    mongoose.connection.close();
  }
}

makeAdmin();
