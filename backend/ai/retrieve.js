require('dotenv').config();
const { generateEmbeddings } = require('./corpus/embed');
const vectorStore = require('./vectorStore');

/**
 * Retrieves top-K semantically relevant legal context chunks from the vector store.
 * @param {string} query Search query or user prompt
 * @param {number} topK Number of top chunks to return (default 5)
 * @param {object} [filter] Optional metadata filter (e.g. { type: 'bare_act' })
 * @returns {Promise<Array<{ sourceId: string, text: string, metadata: object, score: number }>>}
 */
async function retrieveContext(query, topK = 5, filter = null) {
  if (!query || typeof query !== 'string' || !query.trim()) {
    return [];
  }

  // 1. Embed query text
  const embeddings = await generateEmbeddings([query.trim()]);
  if (!embeddings || embeddings.length === 0) {
    return [];
  }

  const queryEmbedding = embeddings[0];

  // 2. Perform vector search in vector store
  const results = await vectorStore.search(queryEmbedding, topK, filter);

  return results;
}

module.exports = {
  retrieveContext
};
