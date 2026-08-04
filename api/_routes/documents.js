require('dotenv').config();
const express = require('express');
const connectDB = require('../../middleware/db');
const authMiddleware = require('../../middleware/auth');
const DocumentTemplate = require('../../models/DocumentTemplate');
const GeneratedDocument = require('../../models/GeneratedDocument');
const { body, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// ── No manual CORS headers — handled globally in server.js ──

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array()[0].msg, details: errors.array() });
  }
  next();
};

const app = express();
const router = express.Router();

// GET /api/documents/templates — public
router.get('/templates', async (req, res) => {
  try {
    await connectDB();
    const templates = await DocumentTemplate.find({ isActive: true }).select('-templateBody').sort({ createdAt: -1 });
    res.json({ templates });
  } catch (err) {
    console.error('Get templates error:', err.message);
    res.status(500).json({ error: 'Failed to fetch templates.' });
  }
});

// GET /api/documents/templates/:id — public
router.get('/templates/:id', async (req, res) => {
  try {
    await connectDB();
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }
    const template = await DocumentTemplate.findById(req.params.id);
    if (!template || !template.isActive) return res.status(404).json({ error: 'Template not found' });
    res.json({ template });
  } catch (err) {
    console.error('Get template error:', err.message);
    res.status(500).json({ error: 'Failed to fetch template.' });
  }
});

// POST /api/documents/templates — admin only
router.post('/templates', authMiddleware, [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 250 }),
  body('category').optional().isString().withMessage('Category must be a string'),
  validate
], async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    await connectDB();

    // BUG 18 FIX: Destructure only allowed fields — no mass-assignment
    const { title, category, description, fields, templateBody, isActive } = req.body;
    const templateData = { title, category, description, fields, templateBody, createdBy: req.user.id };
    if (isActive !== undefined) templateData.isActive = Boolean(isActive);

    const template = await DocumentTemplate.create(templateData);
    res.status(201).json({ template });
  } catch (err) {
    console.error('Create template error:', err.message);
    res.status(500).json({ error: 'Failed to create template.' });
  }
});

// PUT /api/documents/templates/:id — admin only (BUG 18 FIX)
router.put('/templates/:id', authMiddleware, [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty').isLength({ max: 250 }),
  body('category').optional().isString().withMessage('Category must be a string'),
  validate
], async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    // BUG 18 FIX: Only update specific allowed fields (no mass-assignment from req.body)
    const { title, category, description, fields, templateBody, isActive } = req.body;
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (category !== undefined) updateData.category = category;
    if (description !== undefined) updateData.description = description;
    if (fields !== undefined) updateData.fields = fields;
    if (templateBody !== undefined) updateData.templateBody = templateBody;
    if (isActive !== undefined) updateData.isActive = Boolean(isActive);

    const template = await DocumentTemplate.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json({ template });
  } catch (err) {
    console.error('Update template error:', err.message);
    res.status(500).json({ error: 'Failed to update template.' });
  }
});

// DELETE /api/documents/templates/:id — admin only (soft delete)
router.delete('/templates/:id', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid template ID' });
    }

    const template = await DocumentTemplate.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json({ success: true, message: 'Template deactivated' });
  } catch (err) {
    console.error('Delete template error:', err.message);
    res.status(500).json({ error: 'Failed to delete template.' });
  }
});

// POST /api/documents/generate — authenticated users generate a document
router.post('/generate', authMiddleware, [
  body('templateId').notEmpty().withMessage('templateId is required').isMongoId().withMessage('Invalid templateId format'),
  body('filledData').optional().isObject().withMessage('filledData must be an object'),
  validate
], async (req, res) => {
  try {
    await connectDB();
    const { templateId, filledData } = req.body;

    const template = await DocumentTemplate.findById(templateId);
    if (!template || !template.isActive) return res.status(404).json({ error: 'Template not found' });

    // Fill template placeholders with user-supplied data
    let content = template.templateBody || '';
    if (filledData && typeof filledData === 'object') {
      Object.keys(filledData).forEach(key => {
        // Sanitize key to prevent regex injection
        const safeKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`{{${safeKey}}}`, 'g');
        // Sanitize value — convert to string, strip HTML tags
        const value = String(filledData[key] || '').replace(/<[^>]*>/g, '');
        content = content.replace(regex, value);
      });
    }

    const doc = await GeneratedDocument.create({
      userId: req.user.id,
      templateId,
      filledData,
      title: template.title
    });

    res.json({ success: true, document: doc, content });
  } catch (err) {
    console.error('Generate document error:', err.message);
    res.status(500).json({ error: 'Failed to generate document.' });
  }
});

// GET /api/documents/my — user's generated documents
router.get('/my', authMiddleware, async (req, res) => {
  try {
    await connectDB();
    const docs = await GeneratedDocument.find({ userId: req.user.id })
      .populate('templateId', 'title category')
      .sort({ createdAt: -1 });
    res.json({ documents: docs });
  } catch (err) {
    console.error('Get my documents error:', err.message);
    res.status(500).json({ error: 'Failed to fetch documents.' });
  }
});

app.use('/api/documents', router);
module.exports = app;
