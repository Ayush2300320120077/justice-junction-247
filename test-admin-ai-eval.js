require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const connectDB = require('./middleware/db');
const adminSubApp = require('./api/admin');

async function testAdminAiEval() {
  await connectDB();
  const app = express();
  app.use(express.json());
  app.use(adminSubApp);

  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET env var is not set. Run with a .env file or set it in your environment before running this script.');
  const adminToken = jwt.sign({ id: 'test_admin_id', role: 'admin' }, process.env.JWT_SECRET);

  const server = app.listen(0, async () => {
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;
    console.log(`Test Express server listening on port ${port}\n`);

    // 1. Test GET /api/admin/ai-stats
    console.log('[Test 1] Testing GET /api/admin/ai-stats...');
    const statsRes = await fetch(`${baseUrl}/api/admin/ai-stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('Status:', statsRes.status);
    const statsData = await statsRes.json();
    console.log('Stats Output:\n', JSON.stringify(statsData, null, 2));

    // 2. Test GET /api/admin/ai-logs
    console.log('\n[Test 2] Testing GET /api/admin/ai-logs...');
    const logsRes = await fetch(`${baseUrl}/api/admin/ai-logs?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    console.log('Status:', logsRes.status);
    const logsData = await logsRes.json();
    console.log(`Fetched ${logsData.logs?.length || 0} logs (Total: ${logsData.total})`);

    if (logsData.logs && logsData.logs.length > 0) {
      const sampleId = logsData.logs[0]._id;
      // 3. Test PATCH /api/admin/ai-logs/:id/annotate
      console.log(`\n[Test 3] Testing PATCH /api/admin/ai-logs/${sampleId}/annotate...`);
      const annotateRes = await fetch(`${baseUrl}/api/admin/ai-logs/${sampleId}/annotate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ reviewerRating: 5, reviewerNotes: 'Verified RAG citations - highly accurate!' })
      });
      console.log('Status:', annotateRes.status);
      const annoData = await annotateRes.json();
      console.log('Annotation Result:\n', JSON.stringify(annoData, null, 2));
    }

    server.close();
    process.exit(0);
  });
}

testAdminAiEval().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
