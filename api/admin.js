require('dotenv').config();
const express = require('express');
const connectDB = require('../middleware/db');
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');
const Lawyer = require('../models/Lawyer');
const Booking = require('../models/Booking');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const router = express.Router();

const requireAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied: Admins only' });
  }
};

router.use(authMiddleware, requireAdmin);

router.get('/stats', async (req, res) => {
  try {
    await connectDB();
    const totalUsers = await User.countDocuments();
    const totalLawyers = await Lawyer.countDocuments();
    const pendingVerifications = await Lawyer.countDocuments({ isVerified: false });
    const totalBookings = await Booking.countDocuments();
    
    res.json({
      totalUsers,
      totalLawyers,
      pendingVerifications,
      totalBookings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/lawyers', async (req, res) => {
  try {
    await connectDB();
    const lawyers = await Lawyer.find()
      .populate('user', 'email')
      .sort({ createdAt: -1 });
    res.json(lawyers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/lawyers/:id/verify', async (req, res) => {
  try {
    await connectDB();
    const { isVerified } = req.body;
    const lawyer = await Lawyer.findByIdAndUpdate(
      req.params.id,
      { isVerified },
      { new: true }
    );
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    res.json(lawyer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/lawyers/:id/block', async (req, res) => {
  try {
    await connectDB();
    const { isBlocked } = req.body;
    const lawyer = await Lawyer.findByIdAndUpdate(
      req.params.id,
      { isBlocked },
      { new: true }
    );
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    
    // Also block/unblock the associated user account to prevent login if blocked
    await User.findByIdAndUpdate(lawyer.user, { isBlocked });
    
    res.json(lawyer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    await connectDB();
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete User (and associated lawyer/bookings)
router.delete('/users/:id', async (req, res) => {
  try {
    await connectDB();
    const userId = req.params.id;
    // Don't allow admins to delete themselves
    if (req.user.id === userId) return res.status(400).json({ error: "Cannot delete your own account" });
    
    // Find if user is a lawyer and delete their profile
    await Lawyer.findOneAndDelete({ user: userId });
    // Delete their bookings (as client or lawyer)
    await Booking.deleteMany({ $or: [{ client: userId }, { lawyer: userId }] });
    // Delete the user
    await User.findByIdAndDelete(userId);
    
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Lawyer profile
router.delete('/lawyers/:id', async (req, res) => {
  try {
    await connectDB();
    const lawyerId = req.params.id;
    const lawyer = await Lawyer.findByIdAndDelete(lawyerId);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    
    // Also revert their user role back to 'client'
    await User.findByIdAndUpdate(lawyer.user, { role: 'client' });
    
    res.json({ message: "Lawyer profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all bookings
router.get('/bookings', async (req, res) => {
  try {
    await connectDB();
    const bookings = await Booking.find()
      .populate('client', 'name email')
      .populate('lawyer', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Booking
router.delete('/bookings/:id', async (req, res) => {
  try {
    await connectDB();
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel Booking
router.put('/bookings/:id/cancel', async (req, res) => {
  try {
    await connectDB();
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
    if (!booking) return res.status(404).json({ error: 'Booking not found' });
    res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Lawyer Profile
router.put('/lawyers/:id', async (req, res) => {
  try {
    await connectDB();
    const allowedUpdates = ['name', 'consultationFee', 'experience', 'bio', 'specializations'];
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) updateData[key] = req.body[key];
    });
    
    if (updateData.specializations && typeof updateData.specializations === 'string') {
      updateData.specializations = updateData.specializations.split(',').map(s => s.trim()).filter(Boolean);
    }
    
    const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    res.json({ message: "Profile updated successfully", lawyer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Lawyer Subscription
router.put('/lawyers/:id/subscription', async (req, res) => {
  try {
    await connectDB();
    const { subscription } = req.body;
    if (!['free', 'basic', 'pro', 'elite'].includes(subscription)) return res.status(400).json({ error: 'Invalid subscription tier' });
    
    const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, { subscription }, { new: true });
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });
    res.json({ message: "Subscription updated successfully", lawyer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Block/Unblock User
router.put('/users/:id/block', async (req, res) => {
  try {
    await connectDB();
    const { isBlocked } = req.body;
    if (req.user.id === req.params.id) return res.status(400).json({ error: "Cannot block yourself" });
    
    const user = await User.findByIdAndUpdate(req.params.id, { isBlocked }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: `User ${isBlocked ? 'blocked' : 'unblocked'} successfully`, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Promote a user to admin by email
router.put('/promote', async (req, res) => {
  try {
    await connectDB();
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { role: 'admin' },
      { new: true }
    );
    
    if (!user) return res.status(404).json({ error: "User not found with that email" });
    res.json({ message: `Successfully promoted ${user.email} to Admin!`, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Demote an admin back to client
router.put('/demote/:id', async (req, res) => {
  try {
    await connectDB();
    const userId = req.params.id;
    if (req.user.id === userId) return res.status(400).json({ error: "You cannot revoke your own admin access" });

    const user = await User.findByIdAndUpdate(userId, { role: 'client' }, { new: true });
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json({ message: "Admin access revoked successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.use('/api/admin', router);
module.exports = app;
