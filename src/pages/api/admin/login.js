import connectDB from '../../../../middleware/db';
import Admin from '../../../../models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In-memory rate limiting map (IP -> { count, expires })
// Note: In serverless, this is ephemeral but sufficient for basic brute-force protection
const rateLimits = new Map();

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const now = Date.now();

  if (rateLimits.has(ip)) {
    const limit = rateLimits.get(ip);
    if (now < limit.expires) {
      if (limit.count >= 5) {
        return res.status(429).json({ error: 'Too many failed attempts. Try again in 15 minutes.' });
      }
    } else {
      rateLimits.delete(ip);
    }
  }

  try {
    await connectDB();
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return recordFailedAttemptAndReturnError(ip, res);
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return recordFailedAttemptAndReturnError(ip, res);
    }

    // Success
    rateLimits.delete(ip);
    admin.lastLogin = new Date();
    await admin.save();

    const payload = {
      id: admin._id,
      email: admin.email,
      role: admin.role,
      type: 'admin'
    };

    const token = jwt.sign(payload, process.env.JWT_ADMIN_SECRET || 'jj_god_mode_secret', { expiresIn: '12h' });

    res.status(200).json({
      token,
      admin: {
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

function recordFailedAttemptAndReturnError(ip, res) {
  const now = Date.now();
  if (rateLimits.has(ip)) {
    const limit = rateLimits.get(ip);
    limit.count += 1;
    rateLimits.set(ip, limit);
  } else {
    rateLimits.set(ip, { count: 1, expires: now + 15 * 60 * 1000 }); // 15 mins block
  }
  return res.status(401).json({ error: 'Invalid admin credentials' });
}
