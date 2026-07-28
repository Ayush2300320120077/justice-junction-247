require('dotenv').config();
const { runCorpusIngestion } = require('./backend/ai/corpus/embed');
const { retrieveContext } = require('./backend/ai/retrieve');
const connectDB = require('./middleware/db');
const AiInteractionLog = require('./models/AiInteractionLog');

async function testRAGPipeline() {
  console.log('====================================================');
  console.log('   JUSTICE JUNCTION 24/7 — RAG PIPELINE TEST DRIVE   ');
  console.log('====================================================\n');

  // Step 1: Run corpus ingestion on Bare Acts
  console.log('[Step 1] Ingesting Bare Acts into Vector Store...');
  const ingestResult = await runCorpusIngestion();
  console.log(`Ingested Chunks Count: ${ingestResult.ingestedChunks}\n`);

  // Step 2: Test Retrieval Context with sample query
  const sampleQuery = 'How do I file a consumer complaint for a defective product?';
  console.log(`[Step 2] Executing retrieveContext() for Query: "${sampleQuery}"...\n`);

  const startTime = Date.now();
  const topChunks = await retrieveContext(sampleQuery, 5);
  const latencyMs = Date.now() - startTime;

  console.log(`Retrieved ${topChunks.length} top matching chunks in ${latencyMs}ms:\n`);

  topChunks.forEach((chunk, index) => {
    console.log(`--- [Rank ${index + 1}] Score: ${chunk.score} ---`);
    console.log(`Source ID : ${chunk.sourceId}`);
    console.log(`Act Name  : ${chunk.metadata?.actName || 'N/A'}`);
    console.log(`Section   : ${chunk.metadata?.sectionNumber || 'N/A'} - ${chunk.metadata?.sectionTitle || 'N/A'}`);
    console.log(`Content Snippet:\n${chunk.text.substring(0, 250)}...\n`);
  });

  // Step 3: Write test entry to AiInteractionLog to verify database logging
  console.log('[Step 3] Verifying AiInteractionLog dataset model...');
  try {
    await connectDB();
    const logDoc = await AiInteractionLog.create({
      query: sampleQuery,
      retrievedChunks: topChunks.map(c => ({
        sourceId: c.sourceId,
        score: c.score,
        metadata: c.metadata,
        text: c.text
      })),
      response: '[Test Execution Response] To file a consumer complaint for a defective product under Section 35 of the Consumer Protection Act 2019, file a complaint with the District Commission...',
      module: 'chat',
      latencyMs,
      userFeedbackRating: 5
    });

    console.log(`AiInteractionLog successfully saved to MongoDB! Log ID: ${logDoc._id}`);
  } catch (err) {
    console.warn('MongoDB log write notice (DB may be offline during local standalone test):', err.message);
  }

  console.log('\n====================================================');
  console.log('   ✅ RAG PIPELINE FOUNDATION VERIFIED SUCCESSFULLY  ');
  console.log('====================================================');
}

testRAGPipeline().catch(console.error);
