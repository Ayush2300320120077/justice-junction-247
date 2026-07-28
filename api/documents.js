require('dotenv').config();
const express = require('express');
const connectDB = require('../middleware/db');
const authMiddleware = require('../middleware/auth');
const DocumentTemplate = require('../models/DocumentTemplate');
const GeneratedDocument = require('../models/GeneratedDocument');

const app = express();
app.use(express.json());

const router = express.Router();

// GET /api/documents/templates
router.get('/templates', async (req, res) => {
  try {
    await connectDB();
    const templates = await DocumentTemplate.find({ isActive: true }).select('-templateBody').sort({ createdAt: -1 });
    res.json({ templates });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/documents/templates/:id
router.get('/templates/:id', async (req, res) => {
  try {
    await connectDB();
    const template = await DocumentTemplate.findById(req.params.id);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json({ template });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/documents/templates — admin only
router.post('/templates', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    await connectDB();
    const template = await DocumentTemplate.create({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ template });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT /api/documents/templates/:id — admin only
router.put('/templates/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    await connectDB();
    const template = await DocumentTemplate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ template });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE /api/documents/templates/:id — admin only
router.delete('/templates/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    await connectDB();
    await DocumentTemplate.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST /api/documents/generate — generate document from template + user data
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const { templateId, filledData } = req.body;
    const template = await DocumentTemplate.findById(templateId);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    
    // Fill template body with user data
    let content = template.templateBody || '';
    if (filledData) {
      Object.keys(filledData).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        content = content.replace(regex, filledData[key] || '');
      });
    }
    
    const doc = await GeneratedDocument.create({
      userId: req.user.id,
      templateId,
      filledData,
      title: template.title
    });
    
    res.json({ success: true, document: doc, content });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET /api/documents/my — user's generated documents
router.get('/my', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const docs = await GeneratedDocument.find({ userId: req.user.id }).populate('templateId', 'title category').sort({ createdAt: -1 });
    res.json({ documents: docs });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.use('/api/documents', router);
module.exports = app;
