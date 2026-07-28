const fs = require('fs');
const path = require('path');
const { ChromaClient } = require('chromadb');

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
    this.chromaUrl = process.env.VECTOR_DB_URL || 'http://localhost:8000';
    this.chromaClient = null;
    this.collectionName = 'justice_junction_legal_rag';
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

  async connectChroma() {
    if (this.chromaClient) return true;
    try {
      const client = new ChromaClient({ path: this.chromaUrl });
      await client.heartbeat();
      this.chromaClient = client;
      this.useChroma = true;
      return true;
    } catch (err) {
      // Chroma DB server not running locally; fallback to local JSON vector store silently
      this.useChroma = false;
      return false;
    }
  }

  /**
   * Upserts vectors into the vector store.
   * @param {Array<{ id: string, text: string, metadata: object, embedding: number[] }>} items 
   */
  async upsert(items) {
    if (!Array.isArray(items) || items.length === 0) return { success: true, count: 0 };

    const isChromaAvailable = await this.connectChroma();

    if (isChromaAvailable && this.chromaClient) {
      try {
        const collection = await this.chromaClient.getOrCreateCollection({
          name: this.collectionName
        });

        const ids = items.map(it => it.id);
        const embeddings = items.map(it => it.embedding);
        const metadatas = items.map(it => it.metadata);
        const documents = items.map(it => it.text);

        await collection.upsert({
          ids,
          embeddings,
          metadatas,
          documents
        });

        return { success: true, count: items.length, backend: 'chromadb' };
      } catch (err) {
        console.warn('VectorStore: ChromaDB upsert failed, falling back to local file store:', err.message);
      }
    }

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
    const isChromaAvailable = await this.connectChroma();

    if (isChromaAvailable && this.chromaClient) {
      try {
        const collection = await this.chromaClient.getOrCreateCollection({
          name: this.collectionName
        });

        const queryResult = await collection.query({
          queryEmbeddings: [queryEmbedding],
          nResults: topK,
          where: filter || undefined
        });

        const results = [];
        if (queryResult && queryResult.ids?.[0]) {
          for (let i = 0; i < queryResult.ids[0].length; i++) {
            results.push({
              sourceId: queryResult.ids[0][i],
              text: queryResult.documents[0][i],
              metadata: queryResult.metadatas[0][i],
              // Convert Chroma distance to similarity score
              score: queryResult.distances?.[0]?.[i] !== undefined 
                ? Number((1 - queryResult.distances[0][i]).toFixed(4)) 
                : 1.0
            });
          }
        }
        return results;
      } catch (err) {
        console.warn('VectorStore: ChromaDB query failed, falling back to local store:', err.message);
      }
    }

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
