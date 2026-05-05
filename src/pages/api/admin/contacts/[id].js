import connectDB from '../../../../../middleware/db';
import { withAdminAuth } from '../../../../../middleware/adminAuth';
import ContactMessage from '../../../../../models/ContactMessage';

async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) return res.status(400).json({ error: 'Message ID required' });

  try {
    await connectDB();

    if (req.method === 'PUT') {
      const { action, payload } = req.body;
      
      let updateData = {};
      if (action === 'mark_read') updateData = { status: 'read' };
      else if (action === 'mark_replied') updateData = { status: 'replied' };
      else if (action === 'archive') updateData = { status: 'archived' };
      else if (action === 'add_note') updateData = { adminNote: payload };

      const message = await ContactMessage.findByIdAndUpdate(id, updateData, { new: true });
      if (!message) return res.status(404).json({ error: 'Message not found' });
      
      return res.status(200).json({ success: true, message });
    } 
    
    if (req.method === 'DELETE') {
      await ContactMessage.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Message deleted' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Update Contact Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withAdminAuth(handler);
