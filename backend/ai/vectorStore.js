const fs = require('fs');
const path = require('path');

const LOCAL_STORE_DIR = path.join(__dirname, 'corpus', 'data');
const LOCAL_STORE_FILE = path.join(LOCAL_STORE_DIR, 'vector_store.json');

/**
 * Calculates Cosine Similarity between two numerical vectors.
 */
function cosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

class VectorStore {
  constructor() {
    this.useChroma = false;
    this.localStore = [];
    this.initLocalStore();
  }

  initLocalStore() {
    try {
      if (!fs.existsSync(LOCAL_STORE_DIR)) {
        fs.mkdirSync(LOCAL_STORE_DIR, { recursive: true });
      }
      if (fs.existsSync(LOCAL_STORE_FILE)) {
        const raw = fs.readFileSync(LOCAL_STORE_FILE, 'utf8');
        this.localStore = JSON.parse(raw);
      } else {
        this.localStore = [];
        this.saveLocalStore();
      }
    } catch (err) {
      console.warn('VectorStore: Error initializing local store file:', err.message);
      this.localStore = [];
    }
  }

  saveLocalStore() {
    try {
      if (!fs.existsSync(LOCAL_STORE_DIR)) {
        fs.mkdirSync(LOCAL_STORE_DIR, { recursive: true });
      }
      fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(this.localStore, null, 2), 'utf8');
    } catch (err) {
      console.error('VectorStore: Failed to save local vector store:', err.message);
    }
  }



  /**
   * Upserts vectors into the vector store.
   * @param {Array<{ id: string, text: string, metadata: object, embedding: number[] }>} items 
   */
  async upsert(items) {
    if (!Array.isArray(items) || items.length === 0) return { success: true, count: 0 };

    // Local JSON Vector Store Fallback
    for (const item of items) {
      const existingIdx = this.localStore.findIndex(entry => entry.id === item.id);
      if (existingIdx >= 0) {
        this.localStore[existingIdx] = item;
      } else {
        this.localStore.push(item);
      }
    }

    this.saveLocalStore();
    return { success: true, count: items.length, backend: 'local_file' };
  }

  /**
   * Searches for top-K matching chunks given a query embedding.
   * @param {number[]} queryEmbedding Vector array of query
   * @param {number} topK Number of matches to return
   * @param {object} [filter] Metadata filter (e.g. { type: 'bare_act' })
   * @returns {Promise<Array<{ sourceId: string, text: string, metadata: object, score: number }>>}
   */
  async search(queryEmbedding, topK = 5, filter = null) {

    // Local File Vector Store Cosine Similarity Search
    let candidates = this.localStore;
    if (filter) {
      candidates = candidates.filter(item => {
        return Object.entries(filter).every(([key, val]) => item.metadata && item.metadata[key] === val);
      });
    }

    const scored = candidates.map(item => {
      const score = cosineSimilarity(queryEmbedding, item.embedding);
      return {
        sourceId: item.id,
        text: item.text,
        metadata: item.metadata,
        score: Number(score.toFixed(4))
      };
    });

    // Sort descending by similarity score
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK);
  }
}

module.exports = new VectorStore();
