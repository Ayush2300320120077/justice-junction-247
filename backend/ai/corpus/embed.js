require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { chunkLegalText } = require('./chunker');
const vectorStore = require('../vectorStore');

const RAW_DIR = path.join(__dirname, 'raw');

/**
 * Generates embeddings for an array of text strings.
 * Priority: Voyage AI (voyage-law-2) -> OpenAI -> Deterministic Local Vector Fallback
 * @param {string[]} texts 
 * @returns {Promise<number[][]>}
 */
async function generateEmbeddings(texts) {
  if (!Array.isArray(texts) || texts.length === 0) return [];

  const voyageKey = process.env.VOYAGE_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  // 1. Try Voyage AI (voyage-law-2)
  if (voyageKey && !voyageKey.includes('your_') && !voyageKey.includes('placeholder')) {
    try {
      console.log(`[Embedder] Using Voyage AI (voyage-law-2) for ${texts.length} inputs...`);
      const response = await fetch('https://api.voyageai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${voyageKey}`
        },
        body: JSON.stringify({
          model: 'voyage-law-2',
          input: texts
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          return data.data.map(item => item.embedding);
        }
      } else {
        console.warn('Voyage AI embedding request failed, status:', response.status);
      }
    } catch (err) {
      console.warn('Voyage AI fetch error:', err.message);
    }
  }

  // 2. Try OpenAI Embeddings API (text-embedding-3-large)
  if (openaiKey && !openaiKey.includes('your_') && !openaiKey.includes('placeholder')) {
    try {
      console.log(`[Embedder] Using OpenAI (text-embedding-3-large) for ${texts.length} inputs...`);
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: 'text-embedding-3-large',
          input: texts
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.data) {
          return data.data.map(item => item.embedding);
        }
      } else {
        console.warn('OpenAI embedding request failed, status:', response.status);
      }
    } catch (err) {
      console.warn('OpenAI fetch error:', err.message);
    }
  }

  // 3. Fallback: Local TF-IDF / Term Frequency Vector Generator (Deterministic 128-dim vector)
  // Ensures offline development and tests work out-of-the-box without live external API keys
  console.log(`[Embedder] Using Local TF-IDF Fallback Vector Engine (no live API key set) for ${texts.length} inputs...`);
  return texts.map(text => createLocalDeterministicVector(text, 128));
}


/**
 * Creates a normalized 128-dimensional term frequency vector for local fallback embeddings.
 */
function createLocalDeterministicVector(text, dim = 128) {
  const vec = new Array(dim).fill(0);
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean);

  for (const word of words) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0;
    }
    const index = Math.abs(hash) % dim;
    vec[index] += 1;
  }

  // Normalize
  const magnitude = Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  if (magnitude > 0) {
    for (let i = 0; i < dim; i++) {
      vec[i] = Number((vec[i] / magnitude).toFixed(6));
    }
  }
  return vec;
}

/**
 * Runs the corpus ingestion script for all text files in backend/ai/corpus/raw/
 */
async function runCorpusIngestion() {
  console.log('--- Starting Bare Acts Corpus Ingestion Pipeline ---');
  if (!fs.existsSync(RAW_DIR)) {
    fs.mkdirSync(RAW_DIR, { recursive: true });
  }

  const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.txt'));
  if (files.length === 0) {
    console.log('No .txt files found in backend/ai/corpus/raw/. Drop Bare Act files there to ingest.');
    return { ingestedChunks: 0 };
  }

  let totalChunksIngested = 0;

  for (const file of files) {
    const filePath = path.join(RAW_DIR, file);
    console.log(`Processing Bare Act file: ${file}`);
    const content = fs.readFileSync(filePath, 'utf8');

    const chunks = chunkLegalText(content, file);
    console.log(`Extracted ${chunks.length} legal section chunks from ${file}`);

    const batchSize = 10;
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize);
      const texts = batch.map(c => c.text);

      let embeddings = [];
      let retries = 3;
      while (retries > 0) {
        try {
          embeddings = await generateEmbeddings(texts);
          if (embeddings.length === batch.length) break;
        } catch (e) {
          retries--;
          console.warn(`Retry embedding batch (${retries} attempts left)...`);
          await new Promise(r => setTimeout(r, 1000));
        }
      }

      const itemsToUpsert = batch.map((chunk, idx) => {
        const chunkId = `bare_act_${file}_sec_${chunk.metadata.sectionNumber}_${i + idx}`.replace(/[^a-zA-Z0-9_-]/g, '_');
        return {
          id: chunkId,
          text: chunk.text,
          metadata: {
            ...chunk.metadata,
            type: 'bare_act',
            ingestedAt: new Date().toISOString()
          },
          embedding: embeddings[idx] || createLocalDeterministicVector(chunk.text, 128)
        };
      });

      const res = await vectorStore.upsert(itemsToUpsert);
      totalChunksIngested += itemsToUpsert.length;
      console.log(`Batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(chunks.length / batchSize)}: Upserted ${itemsToUpsert.length} chunks via [${res.backend}]`);
    }
  }

  console.log(`--- Bare Acts Corpus Ingestion Complete! Total Chunks: ${totalChunksIngested} ---`);
  return { ingestedChunks: totalChunksIngested };
}

if (require.main === module) {
  runCorpusIngestion().catch(console.error);
}

module.exports = {
  generateEmbeddings,
  runCorpusIngestion
};
