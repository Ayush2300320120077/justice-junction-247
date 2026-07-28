require('dotenv').config();
const connectDB = require('../../middleware/db');
const Article = require('../../models/Article');
const { generateEmbeddings } = require('./embed');
const vectorStore = require('../vectorStore');

/**
 * Chunks a Knowledge Hub article into paragraphs / headings.
 * @param {object} article Mongoose Article document
 * @returns {Array<{ text: string, metadata: object }>}
 */
function chunkArticle(article) {
  if (!article || !article.content) return [];

  const rawText = article.content;
  // Split content by markdown section headers (## or ###) or double line breaks
  const sections = rawText.split(/(?=\n#{2,3}\s)/g).filter(s => s.trim().length > 0);

  const chunks = [];
  sections.forEach((sec, idx) => {
    const cleanText = sec.trim();
    if (cleanText.length < 20) return;

    const formattedContent = `[Knowledge Hub Article: ${article.title} | Category: ${article.category || 'General'}]\n${cleanText}`;

    chunks.push({
      text: formattedContent,
      metadata: {
        type: 'knowledge_hub',
        articleId: article._id.toString(),
        slug: article.slug,
        title: article.title,
        category: article.category || 'General',
        sectionIndex: idx + 1,
        source: `Article:${article.slug}`
      }
    });
  });

  return chunks;
}

/**
 * Ingests published Knowledge Hub articles from MongoDB into the vector store.
 */
async function ingestKnowledgeHub() {
  console.log('--- Starting Knowledge Hub Ingestion ---');
  await connectDB();

  // Find all published articles in Knowledge Hub
  const articles = await Article.find({ isPublished: true }).lean();
  console.log(`Found ${articles.length} published Knowledge Hub articles in MongoDB.`);

  if (articles.length === 0) {
    console.log('No published articles found in MongoDB to ingest.');
    return { count: 0 };
  }

  let totalChunksIngested = 0;

  for (const article of articles) {
    const articleChunks = chunkArticle(article);
    if (articleChunks.length === 0) continue;

    console.log(`Ingesting Article "${article.title}" (${articleChunks.length} chunks)...`);

    const texts = articleChunks.map(c => c.text);
    const embeddings = await generateEmbeddings(texts);

    const itemsToUpsert = articleChunks.map((chunk, idx) => {
      return {
        id: `kh_article_${article._id}_chunk_${idx + 1}`,
        text: chunk.text,
        metadata: chunk.metadata,
        embedding: embeddings[idx]
      };
    });

    const res = await vectorStore.upsert(itemsToUpsert);
    totalChunksIngested += itemsToUpsert.length;
    console.log(`Upserted ${itemsToUpsert.length} article chunks via [${res.backend}]`);
  }

  console.log(`--- Knowledge Hub Ingestion Complete! Total Chunks: ${totalChunksIngested} ---`);
  return { count: totalChunksIngested };
}

if (require.main === module) {
  ingestKnowledgeHub()
    .then(() => process.exit(0))
    .catch(err => {
      console.error('Knowledge Hub Ingestion error:', err);
      process.exit(1);
    });
}

module.exports = {
  ingestKnowledgeHub
};
