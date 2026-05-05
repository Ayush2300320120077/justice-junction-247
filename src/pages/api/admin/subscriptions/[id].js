import connectDB from '../../../../../middleware/db';
import { withAdminAuth } from '../../../../../middleware/adminAuth';
import Lawyer from '../../../../../models/Lawyer';

async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) return res.status(400).json({ error: 'Lawyer ID required' });

  try {
    await connectDB();

    if (req.method === 'PUT') {
      const { action, plan } = req.body;
      
      let updateData = {};
      if (action === 'change_plan' || action === 'grant_free') {
        updateData = { subscription: plan };
      } else if (action === 'cancel') {
        updateData = { subscription: 'free', razorpaySubscriptionId: null };
        // In a real app, you would also call Razorpay API here to cancel the actual subscription
      }

      const lawyer = await Lawyer.findByIdAndUpdate(id, updateData, { new: true }).select('name email subscription razorpaySubscriptionId createdAt');
      if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
      
      return res.status(200).json({ success: true, lawyer });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Update Subscription Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withAdminAuth(handler);
