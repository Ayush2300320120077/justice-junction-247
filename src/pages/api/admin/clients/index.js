import connectDB from '../../../../../middleware/db';
import { withAdminAuth } from '../../../../../middleware/adminAuth';
import User from '../../../../../models/User';
import Booking from '../../../../../models/Booking';

async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    
    // Fetch all clients (users who are not admins)
    const clients = await User.find({ role: 'client' })
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    // Attach total bookings to each client (in production, use aggregation for speed)
    const clientsWithStats = await Promise.all(clients.map(async (client) => {
      const totalBookings = await Booking.countDocuments({ client: client._id });
      return { ...client, totalBookings };
    }));

    res.status(200).json(clientsWithStats);
  } catch (error) {
    console.error('Get Clients Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withAdminAuth(handler);
