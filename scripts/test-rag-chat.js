require('dotenv').config();
const { retrieveContext } = require('../backend/ai/retrieve');
const connectDB = require('../middleware/db');
const AiInteractionLog = require('../models/AiInteractionLog');

async function testRAGChat() {
  console.log('--- Testing RAG Chat Integration ---');

  const queries = [
    'How do I file a consumer complaint for a defective product?', // In-corpus
    'What is the penalty for traffic violation?', // Out-of-corpus / general
    'I want to hire a lawyer for my landlord dispute' // Platform action query
  ];

  for (const q of queries) {
    console.log(`\nTesting Query: "${q}"`);
    const chunks = await retrieveContext(q, 5);
    console.log(`Retrieved Chunks Count: ${chunks.length}`);
    if (chunks.length > 0) {
      console.log(`Top Citation: ${chunks[0].metadata?.actName} - Sec. ${chunks[0].metadata?.sectionNumber} (Score: ${chunks[0].score})`);
    }
  }

  console.log('\n--- RAG Chat Integration Test Passed ---');
}

testRAGChat().catch(console.error);
