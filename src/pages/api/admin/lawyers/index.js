import connectDB from '../../../../../middleware/db';
import { withAdminAuth } from '../../../../../middleware/adminAuth';
import Lawyer from '../../../../../models/Lawyer';

async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    
    // In a real app we would paginate, but for the God-Mode dashboard, 
    // sending a lean array is fine, or we can just send everything up to a high limit.
    const lawyers = await Lawyer.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json(lawyers);
  } catch (error) {
    console.error('Get Lawyers Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withAdminAuth(handler);
