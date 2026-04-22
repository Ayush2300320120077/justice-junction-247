require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  try {
    const allowedEmails = ['121ayushkumar121@gmail.com', '112211ayushkumar112211@gmail.com'];
    
    // Demote anyone who is not in the list but has admin role
    const demoted = await User.updateMany(
      { email: { $nin: allowedEmails }, role: 'admin' },
      { role: 'client' }
    );
    
    // Ensure the two specified emails ARE admins
    await User.updateMany(
      { email: { $in: allowedEmails } },
      { role: 'admin' }
    );

    const admins = await User.find({ role: 'admin' });
    console.log('Current Admins Confirmed:', admins.map(u => u.email));
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
});
