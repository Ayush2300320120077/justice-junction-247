require('dotenv').config();
const express = require('express');
const connectDB = require('../../middleware/db');
const authMiddleware = require('../../middleware/auth');
const Article = require('../../models/Article');

const app = express();
app.use(express.json());

const router = express.Router();

// GET /api/articles — list published articles (public)
router.get('/', async (req, res) => {
  try {
    await connectDB();
    const { category, limit = 20, page = 1 } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [articles, total] = await Promise.all([
      Article.find(query).select('-content').sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)),
      Article.countDocuments(query)
    ]);
    res.json({ articles, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/articles/all — admin: all articles including unpublished
router.get('/all', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    await connectDB();
    const articles = await Article.find().sort({ createdAt: -1 });
    res.json({ articles });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/articles/:slug — single article by slug
router.get('/:slug', async (req, res) => {
  try {
    await connectDB();
    const article = await Article.findOne({ slug: req.params.slug, isPublished: true });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    article.views = (article.views || 0) + 1;
    await article.save();
    res.json({ article });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/articles — admin create
router.post('/', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    await connectDB();
    const { title, content, category, coverImageUrl, isPublished, description } = req.body;
    // Generate slug from title
    const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    let slug = baseSlug;
    let count = 0;
    while (await Article.findOne({ slug })) { slug = `${baseSlug}-${++count}`; }
    const article = await Article.create({ title, slug, content, category, coverImageUrl, isPublished, description, authorId: req.user.id });
    res.status(201).json({ article });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/articles/:id — admin update
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    await connectDB();
    const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json({ article });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/articles/:id — admin delete
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    await connectDB();
    await Article.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.use('/api/articles', router);
module.exports = app;
