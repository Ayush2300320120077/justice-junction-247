import connectDB from '../../../../../middleware/db';
import { withAdminAuth } from '../../../../../middleware/adminAuth';
import User from '../../../../../models/User';

async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) return res.status(400).json({ error: 'Client ID required' });

  try {
    await connectDB();

    if (req.method === 'PUT') {
      const { action } = req.body;
      
      let updateData = {};
      if (action === 'suspend') updateData = { isBlocked: true };
      else if (action === 'unsuspend') updateData = { isBlocked: false };

      const client = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
      if (!client) return res.status(404).json({ error: 'Client not found' });
      
      return res.status(200).json({ success: true, client });
    } 
    
    if (req.method === 'DELETE') {
      await User.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Client deleted' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Update Client Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withAdminAuth(handler);
