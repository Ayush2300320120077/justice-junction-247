import jwt from 'jsonwebtoken';
import connectDB from '../../../../middleware/db';
import User from '../../../../models/User';
import Lawyer from '../../../../models/Lawyer';
import Booking from '../../../../models/Booking';

export const config = {
  api: {
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  const { slug } = req.query;
  const path = Array.isArray(slug) ? slug.join('/') : slug;

  try {
    await connectDB();

    // 1. Auth & Admin Check
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    let user;
    try {
      user = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied: Admins only' });
    }

    // 2. Routing
    // GET /api/admin/stats
    if (req.method === 'GET' && path === 'stats') {
      const [totalUsers, totalLawyers, pendingVerifications, totalBookings] = await Promise.all([
        User.countDocuments(),
        Lawyer.countDocuments(),
        Lawyer.countDocuments({ isVerified: false }),
        Booking.countDocuments()
      ]);
      return res.json({ totalUsers, totalLawyers, pendingVerifications, totalBookings });
    }

    // GET /api/admin/lawyers
    if (req.method === 'GET' && path === 'lawyers') {
      const lawyers = await Lawyer.find().populate('user', 'email').sort({ createdAt: -1 });
      return res.json(lawyers);
    }

    // GET /api/admin/users
    if (req.method === 'GET' && path === 'users') {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.json(users);
    }

    // GET /api/admin/bookings
    if (req.method === 'GET' && path === 'bookings') {
      const bookings = await Booking.find()
        .populate('client', 'name email')
        .populate('lawyer', 'name email')
        .sort({ createdAt: -1 });
      return res.json(bookings);
    }

    // PUT /api/admin/lawyers/:id/verify
    if (req.method === 'PUT' && path.startsWith('lawyers/') && path.endsWith('/verify')) {
      const id = path.split('/')[1];
      const { isVerified } = req.body;
      const lawyer = await Lawyer.findByIdAndUpdate(id, { isVerified }, { new: true });
      if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
      return res.json(lawyer);
    }

    // PUT /api/admin/lawyers/:id/block
    if (req.method === 'PUT' && path.startsWith('lawyers/') && path.endsWith('/block')) {
      const id = path.split('/')[1];
      const { isBlocked } = req.body;
      const lawyer = await Lawyer.findByIdAndUpdate(id, { isBlocked }, { new: true });
      if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
      await User.findByIdAndUpdate(lawyer.user, { isBlocked });
      return res.json(lawyer);
    }

    // PUT /api/admin/lawyers/:id (Update Profile)
    if (req.method === 'PUT' && path.startsWith('lawyers/') && path.split('/').length === 2) {
      const id = path.split('/')[1];
      const allowedUpdates = ['name', 'consultationFee', 'experience', 'bio', 'specializations'];
      const updateData = {};
      Object.keys(req.body).forEach(key => {
        if (allowedUpdates.includes(key)) updateData[key] = req.body[key];
      });
      if (updateData.specializations && typeof updateData.specializations === 'string') {
        updateData.specializations = updateData.specializations.split(',').map(s => s.trim()).filter(Boolean);
      }
      const lawyer = await Lawyer.findByIdAndUpdate(id, updateData, { new: true });
      if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
      return res.json({ message: "Profile updated successfully", lawyer });
    }

    // PUT /api/admin/lawyers/:id/subscription
    if (req.method === 'PUT' && path.startsWith('lawyers/') && path.endsWith('/subscription')) {
      const id = path.split('/')[1];
      const { subscription } = req.body;
      if (!['free', 'basic', 'pro', 'elite'].includes(subscription)) return res.status(400).json({ error: 'Invalid subscription tier' });
      const lawyer = await Lawyer.findByIdAndUpdate(id, { subscription }, { new: true });
      if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
      return res.json({ message: "Subscription updated successfully", lawyer });
    }

    // PUT /api/admin/users/:id/block
    if (req.method === 'PUT' && path.startsWith('users/') && path.endsWith('/block')) {
      const id = path.split('/')[1];
      const { isBlocked } = req.body;
      if (user.id === id) return res.status(400).json({ error: "Cannot block yourself" });
      const targetUser = await User.findByIdAndUpdate(id, { isBlocked }, { new: true });
      if (!targetUser) return res.status(404).json({ error: 'User not found' });
      return res.json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`, user: targetUser });
    }

    // DELETE /api/admin/users/:id
    if (req.method === 'DELETE' && path.startsWith('users/')) {
      const id = path.split('/')[1];
      if (user.id === id) return res.status(400).json({ error: "Cannot delete your own account" });
      await Lawyer.findOneAndDelete({ user: id });
      await Booking.deleteMany({ $or: [{ client: id }, { lawyer: id }] });
      await User.findByIdAndDelete(id);
      return res.json({ message: "User deleted successfully" });
    }

    // DELETE /api/admin/lawyers/:id
    if (req.method === 'DELETE' && path.startsWith('lawyers/')) {
      const id = path.split('/')[1];
      const lawyer = await Lawyer.findByIdAndDelete(id);
      if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
      await User.findByIdAndUpdate(lawyer.user, { role: 'client' });
      return res.json({ message: "Lawyer profile deleted successfully" });
    }

    // DELETE /api/admin/bookings/:id
    if (req.method === 'DELETE' && path.startsWith('bookings/')) {
      const id = path.split('/')[1];
      const booking = await Booking.findByIdAndDelete(id);
      if (!booking) return res.status(404).json({ error: 'Booking not found' });
      return res.json({ message: "Booking deleted successfully" });
    }

    // PUT /api/admin/bookings/:id/cancel
    if (req.method === 'PUT' && path.startsWith('bookings/') && path.endsWith('/cancel')) {
      const id = path.split('/')[1];
      const booking = await Booking.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
      if (!booking) return res.status(404).json({ error: 'Booking not found' });
      return res.json({ message: "Booking cancelled successfully", booking });
    }

    // PUT /api/admin/promote
    if (req.method === 'PUT' && path === 'promote') {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: "Email is required" });
      const targetUser = await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { role: 'admin' },
        { new: true }
      );
      if (!targetUser) return res.status(404).json({ error: "User not found with that email" });
      return res.json({ message: `Successfully promoted ${targetUser.email} to Admin!`, user: targetUser });
    }

    // PUT /api/admin/demote/:id
    if (req.method === 'PUT' && path.startsWith('demote/')) {
      const id = path.split('/')[1];
      if (user.id === id) return res.status(400).json({ error: "You cannot revoke your own admin access" });
      const targetUser = await User.findByIdAndUpdate(id, { role: 'client' }, { new: true });
      if (!targetUser) return res.status(404).json({ error: "User not found" });
      return res.json({ message: "Admin access revoked successfully", user: targetUser });
    }

    return res.status(404).json({ error: 'Not Found' });

  } catch (error) {
    console.error('Admin API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
