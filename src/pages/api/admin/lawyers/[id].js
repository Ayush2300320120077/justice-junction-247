import connectDB from '../../../../../middleware/db';
import { withAdminAuth } from '../../../../../middleware/adminAuth';
import Lawyer from '../../../../../models/Lawyer';

async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) return res.status(400).json({ error: 'Lawyer ID required' });

  try {
    await connectDB();

    if (req.method === 'PUT') {
      const { action, payload } = req.body;
      
      let updateData = {};
      if (action === 'verify') updateData = { isVerified: true };
      else if (action === 'suspend') updateData = { isBlocked: true };
      else if (action === 'unsuspend') updateData = { isBlocked: false };
      else if (action === 'change_plan') updateData = { subscription: payload.plan };
      else if (action === 'update_profile') updateData = payload;

      const lawyer = await Lawyer.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
      if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
      
      return res.status(200).json({ success: true, lawyer });
    } 
    
    if (req.method === 'DELETE') {
      await Lawyer.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Lawyer deleted' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Update Lawyer Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withAdminAuth(handler);
