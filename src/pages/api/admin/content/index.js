import connectDB from '../../../../../middleware/db';
import { withAdminAuth } from '../../../../../middleware/adminAuth';
import FAQ from '../../../../../models/FAQ';
import Announcement from '../../../../../models/Announcement';
import PracticeArea from '../../../../../models/PracticeArea';

async function handler(req, res) {
  try {
    await connectDB();
    
    if (req.method === 'GET') {
      const [faqs, announcements, practiceAreas] = await Promise.all([
        FAQ.find().sort({ order: 1, createdAt: -1 }),
        Announcement.find().sort({ createdAt: -1 }),
        PracticeArea.find().sort({ name: 1 })
      ]);
      return res.status(200).json({ faqs, announcements, practiceAreas });
    }

    if (req.method === 'POST') {
      const { type, payload } = req.body;
      let doc;
      if (type === 'faq') doc = await FAQ.create(payload);
      else if (type === 'announcement') doc = await Announcement.create(payload);
      else if (type === 'practiceArea') doc = await PracticeArea.create(payload);
      else return res.status(400).json({ error: 'Invalid type' });
      
      return res.status(201).json({ success: true, doc });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Content API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withAdminAuth(handler);
