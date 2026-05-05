import connectDB from '../../../../../../middleware/db';
import { withAdminAuth } from '../../../../../../middleware/adminAuth';
import FAQ from '../../../../../../models/FAQ';
import Announcement from '../../../../../../models/Announcement';
import PracticeArea from '../../../../../../models/PracticeArea';

async function handler(req, res) {
  const { type, id } = req.query;
  
  if (!id || !type) return res.status(400).json({ error: 'Type and ID required' });

  try {
    await connectDB();

    let Model;
    if (type === 'faq') Model = FAQ;
    else if (type === 'announcement') Model = Announcement;
    else if (type === 'practiceArea') Model = PracticeArea;
    else return res.status(400).json({ error: 'Invalid type' });

    if (req.method === 'PUT') {
      const doc = await Model.findByIdAndUpdate(id, req.body, { new: true });
      if (!doc) return res.status(404).json({ error: 'Not found' });
      return res.status(200).json({ success: true, doc });
    } 
    
    if (req.method === 'DELETE') {
      await Model.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Deleted' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Content Update Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withAdminAuth(handler);
