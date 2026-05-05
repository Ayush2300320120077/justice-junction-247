import connectDB from '../../../../middleware/db';
import { withAdminAuth } from '../../../../middleware/adminAuth';
import Lawyer from '../../../../models/Lawyer';
import User from '../../../../models/User';
import Booking from '../../../../models/Booking';
import PlatformEvent from '../../../../models/PlatformEvent';

async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    await connectDB();
    
    // In a real app, you'd aggregate these properly, but using simple counts for speed.
    const [
      totalLawyers, verifiedLawyers, pendingVerification, suspendedLawyers,
      totalClients, activeSubscriptions, totalBookings, events
    ] = await Promise.all([
      Lawyer.countDocuments(),
      Lawyer.countDocuments({ isVerified: true }),
      Lawyer.countDocuments({ isVerified: false }),
      Lawyer.countDocuments({ isBlocked: true }),
      User.countDocuments({ role: 'client' }),
      Lawyer.countDocuments({ subscription: { $ne: 'free' } }),
      Booking.countDocuments(),
      PlatformEvent.find().sort({ createdAt: -1 }).limit(10).lean()
    ]);

    // Mocking some stats that don't have direct DB fields yet in the legacy schema
    res.status(200).json({
      totalLawyers,
      verifiedLawyers,
      pendingVerification,
      suspendedLawyers,
      totalClients,
      activeSubscriptions,
      totalRevenueINR: totalBookings * 1500, // mock calculation
      monthlyRevenueINR: totalBookings * 150, // mock calculation
      totalBookings,
      unreadContacts: 0, // Placeholder until ContactMessage is built
      openComplaints: 0, // Placeholder until Report is built
      newLawyersThisWeek: 12, // Mocked for UI
      newClientsThisWeek: 45, // Mocked for UI
      events: events.length > 0 ? events : [
        { title: 'New lawyer registered: Adv. XYZ (Delhi)', createdAt: new Date() },
        { title: 'Client booked consultation with Adv. ABC', createdAt: new Date(Date.now() - 3600000) }
      ]
    });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default withAdminAuth(handler);
