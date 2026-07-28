require('dotenv').config();
const express = require('express');
const connectDB = require('./middleware/db');
const aiSubApp = require('./api/ai');

async function testLiveEndpoint() {
  await connectDB();
  const app = express();
  app.use(express.json());
  app.use(aiSubApp);

  const server = app.listen(0, async () => {
    const port = server.address().port;
    const baseUrl = `http://localhost:${port}`;
    console.log(`Test Express server listening on port ${port}\n`);

    const testQueries = [
      'How do I file a consumer complaint for a defective product?',
      'What is the fine for breaking a traffic signal light?',
      'I need a lawyer for a property dispute'
    ];

    for (let i = 0; i < testQueries.length; i++) {
      const q = testQueries[i];
      console.log(`====================================================`);
      console.log(`QUERY ${i + 1}: "${q}"`);
      console.log(`====================================================`);

      const res = await fetch(`${baseUrl}/api/ai/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: q, history: [] })
      });

      const status = res.status;
      const data = await res.json();
      console.log(`HTTP STATUS: ${status}`);
      console.log(`RESPONSE JSON:\n${JSON.stringify(data, null, 2)}\n`);
    }

    server.close();
    process.exit(0);
  });
}

testLiveEndpoint().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
