require('dotenv').config();
const mongoose = require('mongoose');
const Lawyer = require('../models/Lawyer');

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected.');

    // Find all lawyers where verificationStatus is missing/undefined or not set to pending/rejected
    const filter = {
      $or: [
        { verificationStatus: { $exists: false } },
        { verificationStatus: null }
      ],
      isVerified: true
    };

    const countBefore = await Lawyer.countDocuments(filter);
    console.log(`Found ${countBefore} existing lawyers missing 'verificationStatus'.`);

    if (countBefore > 0) {
      const result = await Lawyer.updateMany(filter, {
        $set: {
          verificationStatus: 'verified',
          isVerified: true
        }
      });
      console.log(`Migration complete! Successfully updated ${result.modifiedCount} lawyer records to verificationStatus: 'verified'.`);
    } else {
      console.log('No lawyers needed migration.');
    }

    // Verify stats after migration
    const totalVerified = await Lawyer.countDocuments({ verificationStatus: 'verified' });
    const total = await Lawyer.countDocuments({});
    console.log(`Current DB Stats: ${totalVerified} / ${total} lawyers are set to verificationStatus: 'verified'.`);

    process.exit(0);
  } catch (err) {
    console.error('Migration error:', err);
    process.exit(1);
  }
}

migrate();
