import connectDB from '../../../../../middleware/db';
import { withAdminAuth } from '../../../../../middleware/adminAuth';
import PlatformSettings from '../../../../../models/PlatformSettings';

async function handler(req, res) {
  try {
    await connectDB();

    if (req.method === 'GET') {
      let settings = await PlatformSettings.findOne();
      if (!settings) {
        settings = await PlatformSettings.create({});
      }
      return res.status(200).json(settings);
    } 
    
    if (req.method === 'PUT') {
      let settings = await PlatformSettings.findOne();
      if (!settings) {
        settings = new PlatformSettings(req.body);
      } else {
        Object.assign(settings, req.body);
        settings.updatedAt = Date.now();
      }
      await settings.save();
      return res.status(200).json({ success: true, settings });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Settings API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withAdminAuth(handler);
