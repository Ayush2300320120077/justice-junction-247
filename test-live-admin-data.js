require('dotenv').config();
const jwt = require('jsonwebtoken');

const LIVE_URL = 'https://jj-fixed.vercel.app';

async function testLiveAdminData() {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET env var is not set. Run with a .env file or set it in your environment before running this script.');
  const adminToken = jwt.sign({ id: 'admin_test_id', role: 'admin' }, process.env.JWT_SECRET);

  console.log('Testing live Admin data endpoints on:', LIVE_URL);

  // 1. Lawyers
  const lawyersRes = await fetch(`${LIVE_URL}/api/admin/lawyers`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('GET /api/admin/lawyers Status:', lawyersRes.status);
  const lawyersData = await lawyersRes.json();
  console.log('Lawyers Count:', Array.isArray(lawyersData) ? lawyersData.length : 'Not an array');

  // 2. Clients
  const clientsRes = await fetch(`${LIVE_URL}/api/admin/clients`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('GET /api/admin/clients Status:', clientsRes.status);
  const clientsData = await clientsRes.json();
  console.log('Clients Count:', Array.isArray(clientsData) ? clientsData.length : 'Not an array');

  // 3. Pending Verifications
  const pendingRes = await fetch(`${LIVE_URL}/api/admin/pending-verifications`, {
    headers: { Authorization: `Bearer ${adminToken}` }
  });
  console.log('GET /api/admin/pending-verifications Status:', pendingRes.status);
  const pendingData = await pendingRes.json();
  console.log('Pending Lawyers Count:', pendingData.lawyers?.length, '| Pending Clients Count:', pendingData.clients?.length);
}

testLiveAdminData().catch(console.error);
