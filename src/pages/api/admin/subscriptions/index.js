import connectDB from '../../../../../middleware/db';
import { withAdminAuth } from '../../../../../middleware/adminAuth';
import Lawyer from '../../../../../models/Lawyer';

async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    
    // Fetch all lawyers to manage their subscriptions
    const lawyers = await Lawyer.find()
      .select('name email subscription razorpaySubscriptionId createdAt')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(lawyers);
  } catch (error) {
    console.error('Get Subscriptions Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withAdminAuth(handler);
