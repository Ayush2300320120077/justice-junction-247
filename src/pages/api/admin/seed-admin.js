import connectDB from '../../../../middleware/db';
import Admin from '../../../../models/Admin';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const seedKey = req.headers['x-seed-key'];
  if (seedKey !== 'jj_admin_seed_2024') {
    return res.status(401).json({ error: 'Unauthorized seed key' });
  }

  try {
    await connectDB();
    
    const existingAdmin = await Admin.findOne({ email: 'admin@justicejunction.in' });
    if (existingAdmin) {
      return res.status(409).json({ error: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@JJ2024!', salt);

    await Admin.create({
      name: 'Superadmin',
      email: 'admin@justicejunction.in',
      password: hashedPassword,
      role: 'superadmin'
    });

    res.status(200).json({ success: true, message: 'Admin seeded successfully' });
  } catch (error) {
    console.error('Seed Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
