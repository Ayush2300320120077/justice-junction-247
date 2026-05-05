import connectDB from '../../../../../middleware/db';
import { withAdminAuth } from '../../../../../middleware/adminAuth';
import Report from '../../../../../models/Report';

async function handler(req, res) {
  const { id } = req.query;
  
  if (!id) return res.status(400).json({ error: 'Report ID required' });

  try {
    await connectDB();

    if (req.method === 'PUT') {
      const { status, adminResolution } = req.body;
      
      let updateData = {};
      if (status) updateData.status = status;
      if (adminResolution !== undefined) updateData.adminResolution = adminResolution;

      const report = await Report.findByIdAndUpdate(id, updateData, { new: true });
      if (!report) return res.status(404).json({ error: 'Report not found' });
      
      return res.status(200).json({ success: true, report });
    } 
    
    if (req.method === 'DELETE') {
      await Report.findByIdAndDelete(id);
      return res.status(200).json({ success: true, message: 'Report deleted' });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Update Report Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withAdminAuth(handler);
