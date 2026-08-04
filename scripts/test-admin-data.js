require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const connectDB = require('../middleware/db');
const adminSubApp = require('../api/admin');

async function testAdminData() {
  await connectDB();
  const app = express();
  app.use(express.json());
  app.use(adminSubApp);

  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET env var is not set. Run with a .env file or set it in your environment before running this script.');
  const adminToken = jwt.sign({ id: 'test_admin_id', role: 'admin' }, process.env.JWT_SECRET);

  const server = app.listen(0, async () => {
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;

    console.log('[Test 1] GET /api/admin/lawyers...');
    const lawyersRes = await fetch(`${baseUrl}/api/admin/lawyers`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const lawyersData = await lawyersRes.json();
    console.log('Status:', lawyersRes.status, '| Total Lawyers Returned:', Array.isArray(lawyersData) ? lawyersData.length : 0);

    console.log('\n[Test 2] GET /api/admin/clients...');
    const clientsRes = await fetch(`${baseUrl}/api/admin/clients`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const clientsData = await clientsRes.json();
    console.log('Status:', clientsRes.status, '| Total Clients Returned:', Array.isArray(clientsData) ? clientsData.length : 0);

    console.log('\n[Test 3] GET /api/admin/pending-verifications...');
    const pendingRes = await fetch(`${baseUrl}/api/admin/pending-verifications`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const pendingData = await pendingRes.json();
    console.log('Status:', pendingRes.status, '| Pending Lawyers:', pendingData.lawyers?.length, '| Pending Clients:', pendingData.clients?.length);

    server.close();
    process.exit(0);
  });
}

testAdminData().catch(console.error);
