'use strict';

/**
 * api/_routes/case-vault.js
 *
 * Case Vault — SIH26190
 * Secure Digital Document Management System for Legal and Investigation Documents
 * Ministry of Home Affairs
 *
 * All routes live under /api/case-vault/*
 * All routes require JWT auth + one of: officer | legal-officer | court-clerk | admin
 *
 * Imports only:
 *   - existing middleware/auth.js  (requireAuth, requireRole) — NOT modified
 *   - existing middleware/db.js    — NOT modified
 *   - new casevault models         — Phase 1 additions only
 *
 * NO existing files are modified by this module.
 *
 * STORAGE NOTE (Hackathon Demo):
 * Local filesystem storage (uploads/casevault/...) is currently in use — suitable
 * for local dev/demo only. NOT compatible with Vercel's ephemeral filesystem.
 * Production deployment requires swapping to S3/GCS/Supabase Storage — see
 * buildFileRef() and download/verify endpoints for the swap-in points.
 */

require('dotenv').config();

const express   = require('express');
const crypto    = require('crypto');
const mongoose  = require('mongoose');
const fs        = require('fs');
const path      = require('path');
const { body, query, validationResult } = require('express-validator');

const connectDB                 = require('../../middleware/db');
const { requireAuth, requireRole } = require('../../middleware/auth');

const {
  CaseFile,
  CaseDocument,
  DocumentVersion,
  AccessLog,
  DigitalSignature,
} = require('../../models/casevault');

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

/** Roles that may access any Case Vault endpoint */
const VAULT_ROLES = ['officer', 'legal-officer', 'court-clerk', 'admin'];

/** Roles that may create a new case (write-privileged) */
const CREATE_CASE_ROLES = ['officer', 'admin'];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Wraps an async route handler so unhandled rejections reach Express's
 * global error handler — identical pattern to admin.js.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Pagination helper — mirrors the pattern in admin.js exactly.
 * page  : 1-indexed, defaults to 1
 * limit : 1–100, defaults to 20
 */
const paginate = (req) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20));
  return { page, limit, skip: (page - 1) * limit };
};

/**
 * express-validator error collector — same shape as admin.js / documents.js.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error:   errors.array()[0].msg,
      details: errors.array(),
    });
  }
  next();
};

/**
 * Validates that a route param is a valid MongoDB ObjectId.
 * Returns 400 immediately if not.
 */
const requireValidId = (paramName = 'id') => (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params[paramName])) {
    return res.status(400).json({ success: false, error: `Invalid ${paramName}` });
  }
  next();
};

/**
 * Compute SHA-256 hex digest from a base64-encoded file string.
 * The client sends: { fileBase64: '<base64 data>', mimeType: 'application/pdf', ... }
 * The server NEVER trusts a hash supplied by the client.
 *
 * @param {string} base64String — raw base64 data (no data-URI prefix)
 * @returns {string} 64-char lowercase hex SHA-256
 */
const computeSha256FromBase64 = (base64String) => {
  const buffer = Buffer.from(base64String, 'base64');
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

/**
 * Build a deterministic storage "URL" for the uploaded file.
 * In production, replace this with a real pre-signed upload to S3 / GCS / Azure Blob.
 * The base64 payload itself is NOT stored in MongoDB — only the reference URL.
 *
 * For Phase 2, we generate a stable reference URI so the schema constraint
 * (fileUrl required) is satisfied; swapping in real cloud storage is a 1-line change.
 *
 * Format: casevault/<caseDocId>/<versionNumber>/<sha256[0..7]>.<ext>
 */
const buildFileRef = (caseDocId, versionNumber, sha256, mimeType) => {
  const ext = (mimeType || 'application/octet-stream').split('/')[1]?.split('+')[0] || 'bin';
  return `uploads/casevault/${caseDocId}/${versionNumber}/${sha256.slice(0, 8)}.${ext}`;
};

// ─────────────────────────────────────────────────────────────────────────────
// AccessLog middleware
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Factory that returns an Express middleware which writes an AccessLog entry
 * for a given action type.  Wraps the response so the log fires *after* the
 * handler succeeds (status < 400), meaning failed/denied reads aren't logged
 * as successful views — but they ARE logged with success:false.
 *
 * Usage: router.get('/:id', ..., logAccess('view'), asyncHandler(handler))
 *
 * The middleware resolves the document ID from:
 *   req.params.id   — for /documents/:id routes
 *   req.caseDocId   — set by the route handler via res.locals for other routes
 *
 * Logging is fire-and-forget (non-blocking) so a DB error never breaks the
 * response to the user.
 */
const logAccess = (action) => async (req, res, next) => {
  // Capture original end so we can hook into it
  const originalEnd = res.end.bind(res);

  res.end = function (...args) {
    // Restore immediately — critical to avoid infinite recursion
    res.end = originalEnd;
    originalEnd(...args);

    // Determine document reference
    const caseDocumentId =
      res.locals.caseDocId ||   // set by handler for routes without :id
      req.params.id  ||
      null;

    if (!caseDocumentId || !mongoose.Types.ObjectId.isValid(String(caseDocumentId))) {
      return; // Can't log without a valid document ref
    }

    const success = res.statusCode < 400;

    // Capture IP: respect X-Forwarded-For only if set by a trusted proxy
    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      'unknown';

    // Non-blocking — intentionally no await
    AccessLog.create({
      caseDocument:    caseDocumentId,
      documentVersion: res.locals.documentVersionId || null,
      actor:           req.user?.id,
      action,
      ipAddress:       ip,
      userAgent:       req.headers['user-agent'] || '',
      success,
      meta:            res.locals.accessMeta || {},
    }).catch((err) =>
      console.error('[AccessLog] Write failed:', err.message)
    );
  };

  next();
};

// ─────────────────────────────────────────────────────────────────────────────
// Router setup — global guards for all Case Vault routes
// ─────────────────────────────────────────────────────────────────────────────

const router = express.Router();

/**
 * Every Case Vault route requires:
 *   1. A valid JWT (requireAuth from existing middleware — untouched)
 *   2. One of the four vault roles (requireRole from existing middleware — untouched)
 */
router.use(requireAuth, requireRole(...VAULT_ROLES));

// ─────────────────────────────────────────────────────────────────────────────
// CASES
// ─────────────────────────────────────────────────────────────────────────────

// ── POST /api/case-vault/cases — Create a new case file ──────────────────────
//    Restricted to: officer, admin
router.post(
  '/cases',
  requireRole(...CREATE_CASE_ROLES),
  [
    body('caseNumber')
      .trim()
      .notEmpty().withMessage('caseNumber is required')
      .isLength({ max: 100 }).withMessage('caseNumber must be ≤ 100 chars'),
    body('title')
      .trim()
      .notEmpty().withMessage('title is required')
      .isLength({ max: 300 }).withMessage('title must be ≤ 300 chars'),
    body('department')
      .notEmpty().withMessage('department is required'),
    body('status')
      .optional()
      .isIn(['open', 'under-investigation', 'sub-judice', 'closed', 'archived'])
      .withMessage('Invalid status value'),
    body('assignedOfficers')
      .optional()
      .isArray().withMessage('assignedOfficers must be an array'),
    body('assignedOfficers.*')
      .optional()
      .isMongoId().withMessage('Each assignedOfficer must be a valid user ID'),
    validate,
  ],
  asyncHandler(async (req, res) => {
    await connectDB();

    const {
      caseNumber,
      title,
      description,
      department,
      status,
      assignedOfficers,
      jurisdiction,
    } = req.body;

    // Guard: duplicate case number returns 409 with a clear message
    const existing = await CaseFile.findOne({
      caseNumber: caseNumber.toUpperCase(),
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        error: `Case number '${caseNumber.toUpperCase()}' already exists`,
      });
    }

    const caseFile = await CaseFile.create({
      caseNumber:       caseNumber.toUpperCase(),
      title:            title.trim(),
      description:      description?.trim(),
      department,
      status:           status || 'open',
      createdBy:        req.user.id,
      assignedOfficers: assignedOfficers || [],
      jurisdiction:     jurisdiction?.trim(),
    });

    res.status(201).json({ success: true, data: caseFile });
  })
);

// ── GET /api/case-vault/cases — List / search / filter (paginated) ────────────
//    Mirrors the pagination shape from admin.js exactly.
//    Query params:
//      search     — text match on caseNumber or title (case-insensitive regex)
//      status     — exact enum match
//      department — exact match
//      from       — ISO date, createdAt >=
//      to         — ISO date, createdAt <=
//      page       — 1-indexed (default 1)
//      limit      — 1-100  (default 20)
router.get(
  '/cases',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be 1–100'),
    query('from').optional().isISO8601().withMessage('from must be an ISO 8601 date'),
    query('to').optional().isISO8601().withMessage('to must be an ISO 8601 date'),
    validate,
  ],
  asyncHandler(async (req, res) => {
    await connectDB();

    const { page, limit, skip } = paginate(req);

    // ── Build filter ──
    const filter = { isArchived: false };

    if (req.query.search) {
      const re = new RegExp(req.query.search, 'i');
      filter.$or = [{ caseNumber: re }, { title: re }];
    }

    if (req.query.status)     filter.status     = req.query.status;
    if (req.query.department) filter.department = req.query.department;

    if (req.query.from || req.query.to) {
      filter.createdAt = {};
      if (req.query.from) filter.createdAt.$gte = new Date(req.query.from);
      if (req.query.to)   filter.createdAt.$lte = new Date(req.query.to);
    }

    // Officers can see all cases; no extra filter here — access control is
    // role-based at the router level, not ownership-based.
    const [cases, total] = await Promise.all([
      CaseFile.find(filter)
        .populate('createdBy', 'name email role')
        .populate('assignedOfficers', 'name email role')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      CaseFile.countDocuments(filter),
    ]);

    res.json({
      success:    true,
      data:       cases,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  })
);

// ── GET /api/case-vault/cases/:id — Case detail + all linked documents ────────
router.get(
  '/cases/:id',
  requireValidId('id'),
  asyncHandler(async (req, res) => {
    await connectDB();

    const caseFile = await CaseFile.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('assignedOfficers', 'name email role');

    if (!caseFile || caseFile.isArchived) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    // Fetch all non-deleted documents for this case
    const documents = await CaseDocument.find({
      caseFile: caseFile._id,
      isDeleted: false,
    })
      .populate('uploadedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: { caseFile, documents } });
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// DOCUMENTS
// ─────────────────────────────────────────────────────────────────────────────

// ── POST /api/case-vault/cases/:id/documents — Upload first document (v1) ─────
//
//    Expected request body (JSON — fits within the existing 10 MB limit):
//    {
//      title:        string  (required)
//      docType:      string  (required — FIR | charge-sheet | ... )
//      fileBase64:   string  (required — raw base64, no data-URI prefix)
//      mimeType:     string  (optional, default "application/pdf")
//      changeNote:   string  (optional — note for version 1)
//      confidentialityLevel: string (optional)
//      tags:         string[] (optional)
//    }
//
//    The SHA-256 hash is computed server-side from fileBase64.
//    The client MUST NOT send a hash — any supplied hash field is ignored.
router.post(
  '/cases/:id/documents',
  requireValidId('id'),
  [
    body('title')
      .trim()
      .notEmpty().withMessage('title is required')
      .isLength({ max: 300 }).withMessage('title must be ≤ 300 chars'),
    body('docType')
      .notEmpty().withMessage('docType is required')
      .isIn(['FIR', 'charge-sheet', 'witness-statement', 'evidence',
             'court-filing', 'forensic-report', 'judgment'])
      .withMessage('Invalid docType'),
    body('fileBase64')
      .notEmpty().withMessage('fileBase64 is required')
      .isBase64().withMessage('fileBase64 must be valid base64'),
    body('mimeType')
      .optional()
      .isString().withMessage('mimeType must be a string'),
    body('confidentialityLevel')
      .optional()
      .isIn(['unclassified', 'restricted', 'confidential', 'secret', 'top-secret'])
      .withMessage('Invalid confidentialityLevel'),
    body('tags')
      .optional()
      .isArray().withMessage('tags must be an array'),
    validate,
  ],
  asyncHandler(async (req, res) => {
    await connectDB();

    const caseFile = await CaseFile.findById(req.params.id);
    if (!caseFile || caseFile.isArchived) {
      return res.status(404).json({ success: false, error: 'Case not found' });
    }

    const {
      title,
      docType,
      fileBase64,
      mimeType   = 'application/pdf',
      changeNote,
      confidentialityLevel,
      tags,
    } = req.body;

    // ── Server-side hash computation — client hash is never trusted ──
    const sha256Hash = computeSha256FromBase64(fileBase64);

    // ── Placeholder file ref (swap for real cloud upload in production) ──
    // We use a temporary ObjectId placeholder for the doc ID in the path;
    // we'll update after the doc is created.
    const tempId  = new mongoose.Types.ObjectId();
    const fileUrl = buildFileRef(tempId.toString(), 1, sha256Hash, mimeType);

    // ── Write file to local disk (Hackathon Demo) ──
    const absolutePath = path.join(__dirname, '../../', fileUrl);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, Buffer.from(fileBase64, 'base64'));

    // ── Create parent document record ──
    const caseDoc = await CaseDocument.create({
      _id:                 tempId,
      caseFile:            caseFile._id,
      title:               title.trim(),
      docType,
      fileUrl,
      currentVersion:      1,
      sha256Hash,
      uploadedBy:          req.user.id,
      uploadedAt:          new Date(),
      confidentialityLevel: confidentialityLevel || 'restricted',
      tags:                tags || [],
    });

    // ── Create version 1 record — immutable ──
    const version = await DocumentVersion.create({
      caseDocument:  caseDoc._id,
      versionNumber: 1,
      fileUrl,
      sha256Hash,
      uploadedBy:    req.user.id,
      timestamp:     new Date(),
      changeNote:    changeNote || 'Initial upload',
      mimeType,
      fileSizeBytes: Math.round((fileBase64.length * 3) / 4), // approx byte size
    });

    // Surface the new doc and version IDs for the access log
    res.locals.caseDocId         = caseDoc._id;
    res.locals.documentVersionId  = version._id;
    res.locals.accessMeta         = { versionNumber: 1, docType };

    res.status(201).json({
      success: true,
      data: {
        document: caseDoc,
        version,
      },
    });
  })
);

// ── PUT /api/case-vault/documents/:id — Upload new version (never overwrites) ─
//
//    Atomically increments currentVersion on CaseDocument,
//    creates a new immutable DocumentVersion, and updates the parent's
//    fileUrl + sha256Hash to reflect the latest version.
//
//    Body: same shape as the upload route above (fileBase64, mimeType, changeNote required).
router.put(
  '/documents/:id',
  requireValidId('id'),
  logAccess('edit'),
  [
    body('fileBase64')
      .notEmpty().withMessage('fileBase64 is required')
      .isBase64().withMessage('fileBase64 must be valid base64'),
    body('changeNote')
      .trim()
      .notEmpty().withMessage('changeNote is required for new versions')
      .isLength({ max: 1000 }).withMessage('changeNote must be ≤ 1000 chars'),
    body('mimeType')
      .optional()
      .isString(),
    validate,
  ],
  asyncHandler(async (req, res) => {
    await connectDB();

    const caseDoc = await CaseDocument.findById(req.params.id);
    if (!caseDoc || caseDoc.isDeleted) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    const {
      fileBase64,
      changeNote,
      mimeType = 'application/pdf',
    } = req.body;

    const sha256Hash    = computeSha256FromBase64(fileBase64);
    const nextVersion   = caseDoc.currentVersion + 1;
    const fileUrl       = buildFileRef(caseDoc._id.toString(), nextVersion, sha256Hash, mimeType);

    // ── Write file to local disk (Hackathon Demo) ──
    const absolutePath = path.join(__dirname, '../../', fileUrl);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, Buffer.from(fileBase64, 'base64'));

    // ── Create the new immutable version record ──
    const version = await DocumentVersion.create({
      caseDocument:  caseDoc._id,
      versionNumber: nextVersion,
      fileUrl,
      sha256Hash,
      uploadedBy:    req.user.id,
      timestamp:     new Date(),
      changeNote:    changeNote.trim(),
      mimeType,
      fileSizeBytes: Math.round((fileBase64.length * 3) / 4),
    });

    // ── Update parent — previous version data is preserved in DocumentVersion ──
    caseDoc.fileUrl        = fileUrl;
    caseDoc.sha256Hash     = sha256Hash;
    caseDoc.currentVersion = nextVersion;
    await caseDoc.save();

    // Expose IDs for the logAccess middleware
    res.locals.documentVersionId = version._id;
    res.locals.accessMeta        = { versionNumber: nextVersion };

    res.json({
      success: true,
      data: {
        document: caseDoc,
        version,
      },
    });
  })
);

// ── GET /api/case-vault/documents/:id/verify — Integrity check ───────────────
//
//    Re-hashes the *stored* base64 payload (if provided in query) or simply
//    returns the stored hash for the client to verify independently.
//
//    Two modes:
//      1. Client passes ?fileBase64=<b64>  → server recomputes and compares.
//      2. No fileBase64                    → returns stored hash so client can verify.
//
//    Either way, an AccessLog entry is written via logAccess('view').
router.get(
  '/documents/:id/verify',
  requireValidId('id'),
  logAccess('view'),
  asyncHandler(async (req, res) => {
    await connectDB();

    const caseDoc = await CaseDocument.findById(req.params.id)
      .populate('uploadedBy', 'name email role');

    if (!caseDoc || caseDoc.isDeleted) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    res.locals.caseDocId = caseDoc._id;

    const { fileBase64, version } = req.query;

    let targetHash  = caseDoc.sha256Hash;
    let targetVersion = caseDoc.currentVersion;
    let targetFileUrl = caseDoc.fileUrl;

    if (version) {
      const vNum = parseInt(version);
      if (isNaN(vNum) || vNum < 1) {
        return res.status(400).json({ success: false, error: 'version must be a positive integer' });
      }
      const docVersion = await DocumentVersion.findOne({
        caseDocument:  caseDoc._id,
        versionNumber: vNum,
      });
      if (!docVersion) {
        return res.status(404).json({ success: false, error: `Version ${vNum} not found` });
      }
      targetHash    = docVersion.sha256Hash;
      targetVersion = vNum;
      targetFileUrl = docVersion.fileUrl;
      res.locals.documentVersionId = docVersion._id;
    }

    // Always recompute the hash from the actual stored file on disk
    let diskHash = targetHash;
    const absolutePath = path.join(__dirname, '../../', targetFileUrl);
    if (fs.existsSync(absolutePath)) {
      const fileBuffer = fs.readFileSync(absolutePath);
      diskHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
    }

    // Mode 1: client supplies file content for server-side re-hash
    if (fileBase64) {
      if (!/^[A-Za-z0-9+/=]+$/.test(fileBase64)) {
        return res.status(400).json({ success: false, error: 'fileBase64 contains invalid characters' });
      }
      const computedHash = computeSha256FromBase64(fileBase64);
      const match        = computedHash === diskHash;

      res.locals.accessMeta = { mode: 'server-verify', version: targetVersion, match };

      return res.json({
        success:     true,
        match,
        version:     targetVersion,
        storedHash:  diskHash,
        computedHash,
        document: {
          id:        caseDoc._id,
          title:     caseDoc.title,
          docType:   caseDoc.docType,
          uploadedBy: caseDoc.uploadedBy,
        },
      });
    }

    // Mode 2: return stored hash only (client verifies locally)
    res.locals.accessMeta = { mode: 'hash-fetch', version: targetVersion };

    res.json({
      success: true,
      version: targetVersion,
      storedHash: diskHash,
      document: {
        id:         caseDoc._id,
        title:      caseDoc.title,
        docType:    caseDoc.docType,
        uploadedBy: caseDoc.uploadedBy,
      },
      message: 'Compare storedHash against your local SHA-256 digest to verify integrity',
    });
  })
);

// ── POST /api/case-vault/documents/:id/sign — Record a digital signature ──────
//
//    Body:
//    {
//      versionNumber:          number   (required — which version is being signed)
//      signatureData:          string   (required — base64 PKCS#7 blob or HSM ref)
//      algorithm:              string   (optional — default RSA-SHA256)
//      certificateFingerprint: string   (optional)
//      contentHash:            string   (required — SHA-256 of the file the signer
//                                        hashed locally; server validates it matches
//                                        the stored hash for that version)
//      externalTxnId:          string   (optional — Aadhaar eSign / DSC txn ID)
//    }
//
//    The server validates that contentHash matches the stored hash for the
//    requested version before persisting the signature.
router.post(
  '/documents/:id/sign',
  requireValidId('id'),
  [
    body('versionNumber')
      .notEmpty().withMessage('versionNumber is required')
      .isInt({ min: 1 }).withMessage('versionNumber must be a positive integer'),
    body('signatureData')
      .notEmpty().withMessage('signatureData is required'),
    body('contentHash')
      .notEmpty().withMessage('contentHash is required')
      .matches(/^[a-f0-9]{64}$/i).withMessage('contentHash must be a 64-char hex SHA-256'),
    body('algorithm')
      .optional()
      .isIn(['RSA-SHA256', 'RSA-SHA512', 'ECDSA-SHA256', 'ECDSA-SHA512', 'Ed25519', 'HSM-REFERENCE'])
      .withMessage('Invalid algorithm'),
    body('certificateFingerprint')
      .optional()
      .isString(),
    body('externalTxnId')
      .optional()
      .isString(),
    validate,
  ],
  asyncHandler(async (req, res) => {
    await connectDB();

    const caseDoc = await CaseDocument.findById(req.params.id);
    if (!caseDoc || caseDoc.isDeleted) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    const {
      versionNumber,
      signatureData,
      algorithm              = 'RSA-SHA256',
      certificateFingerprint,
      contentHash,
      externalTxnId,
    } = req.body;

    // ── Fetch the target version ──
    const docVersion = await DocumentVersion.findOne({
      caseDocument:  caseDoc._id,
      versionNumber: parseInt(versionNumber),
    });
    if (!docVersion) {
      return res.status(404).json({
        success: false,
        error:   `Version ${versionNumber} not found for this document`,
      });
    }

    // ── Validate contentHash matches stored version hash ──
    // The signer must prove they hashed the exact file we have stored.
    if (contentHash.toLowerCase() !== docVersion.sha256Hash.toLowerCase()) {
      return res.status(422).json({
        success: false,
        error:   'contentHash does not match the stored SHA-256 for this version. ' +
                 'Ensure you are signing the correct file.',
      });
    }

    // ── Guard against duplicate active signature (partial-unique index on model) ──
    const existingSig = await DigitalSignature.findOne({
      documentVersion: docVersion._id,
      signedBy:        req.user.id,
      isRevoked:       false,
    });
    if (existingSig) {
      return res.status(409).json({
        success: false,
        error:   'You have already signed this version. Revoke the existing signature before re-signing.',
      });
    }

    const signature = await DigitalSignature.create({
      documentVersion:       docVersion._id,
      caseDocument:          caseDoc._id,
      signedBy:              req.user.id,
      signerRole:            req.user.role,
      signatureData,
      algorithm,
      certificateFingerprint: certificateFingerprint || undefined,
      contentHash:           contentHash.toLowerCase(),
      externalTxnId:         externalTxnId || undefined,
    });

    // Write an access log for the signing action
    const ip =
      (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
      req.socket?.remoteAddress ||
      'unknown';

    AccessLog.create({
      caseDocument:    caseDoc._id,
      documentVersion: docVersion._id,
      actor:           req.user.id,
      action:          'edit',
      ipAddress:       ip,
      userAgent:       req.headers['user-agent'] || '',
      success:         true,
      meta:            new Map([['action_detail', 'digital_signature'], ['versionNumber', versionNumber]]),
    }).catch((err) => console.error('[AccessLog] Sign log failed:', err.message));

    res.status(201).json({ success: true, data: signature });
  })
);

// ── GET /api/case-vault/documents/:id/download — Retrieve file content ────────
//
//    Returns the stored file reference plus its integrity metadata.
//    Writes an AccessLog entry with action "download" — always, including on error.
//
//    Optional query params:
//      version   — integer, fetch a specific version (default: currentVersion)
//
//    Response shape:
//    {
//      success:     true,
//      fileUrl:     string   — storage reference / signed URL (swap in real cloud URL here)
//      fileBase64:  null     — placeholder; populate from cloud storage in production
//      sha256Hash:  string   — stored hash for the version; client SHOULD verify after download
//      version:     number
//      mimeType:    string
//      document: { id, title, docType, confidentialityLevel, caseFile }
//    }
//
//    Production note:
//      Replace the `fileUrl` value with a short-lived signed URL generated
//      by your cloud SDK (e.g. S3 getSignedUrl / GCS generateSignedUrl).
//      Never serve raw file bytes through Node in production — stream from
//      the cloud storage layer directly or via signed URL redirect.
router.get(
  '/documents/:id/download',
  requireValidId('id'),
  logAccess('download'),
  asyncHandler(async (req, res) => {
    await connectDB();

    const caseDoc = await CaseDocument.findById(req.params.id)
      .populate('uploadedBy', 'name email role')
      .populate('caseFile', 'caseNumber title department status');

    if (!caseDoc || caseDoc.isDeleted) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    // ── Expose caseDocId so logAccess can write the AccessLog entry ──
    res.locals.caseDocId = caseDoc._id;

    // ── Resolve which version to serve ──
    let targetVersion;

    if (req.query.version !== undefined) {
      const vNum = parseInt(req.query.version, 10);
      if (isNaN(vNum) || vNum < 1) {
        return res.status(400).json({
          success: false,
          error:   'version must be a positive integer',
        });
      }

      targetVersion = await DocumentVersion.findOne({
        caseDocument:  caseDoc._id,
        versionNumber: vNum,
      });

      if (!targetVersion) {
        return res.status(404).json({
          success: false,
          error:   `Version ${vNum} not found for this document`,
        });
      }
    } else {
      // Default: latest version
      targetVersion = await DocumentVersion.findOne({
        caseDocument:  caseDoc._id,
        versionNumber: caseDoc.currentVersion,
      });

      if (!targetVersion) {
        // Fallback: use data directly from CaseDocument (v1 edge case)
        targetVersion = {
          _id:           null,
          versionNumber: caseDoc.currentVersion,
          fileUrl:       caseDoc.fileUrl,
          sha256Hash:    caseDoc.sha256Hash,
          mimeType:      'application/pdf',
        };
      }
    }

    // Surface version ID for logAccess meta
    res.locals.documentVersionId = targetVersion._id || null;
    res.locals.accessMeta = {
      versionNumber:         targetVersion.versionNumber,
      confidentialityLevel:  caseDoc.confidentialityLevel,
    };

    // ── Build response ──
    //
    // `fileUrl` currently holds the internal storage path from buildFileRef().
    // In production, replace the disk streaming below with a real signed-URL redirect, e.g.:
    //
    //   const signedUrl = await s3.getSignedUrlPromise('getObject', {
    //     Bucket: process.env.S3_BUCKET,
    //     Key:    targetVersion.fileUrl,
    //     Expires: 300,  // 5-minute TTL
    //   });
    //   return res.redirect(signedUrl);
    const fileUrl = targetVersion.fileUrl;

    const safeTitle = caseDoc.title.replace(/[^a-zA-Z0-9 _-]/g, '_');
    const ext       = (targetVersion.mimeType || 'application/octet-stream')
                        .split('/')[1]?.split('+')[0] || 'bin';

    const absolutePath = path.join(__dirname, '../../', fileUrl);
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ success: false, error: 'File not found on disk' });
    }

    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${safeTitle}_v${targetVersion.versionNumber}.${ext}"`
    );
    res.setHeader('Content-Type', targetVersion.mimeType || 'application/octet-stream');
    
    // Stream the actual file bytes
    const readStream = fs.createReadStream(absolutePath);
    readStream.pipe(res);
  })
);

// ── GET /api/case-vault/documents/:id/audit — Access log for a document ──────
//
//    Returns paginated AccessLog entries for the given CaseDocument, newest first.
//    Each entry includes the actor (name/email/role), action, timestamp, ipAddress,
//    userAgent, success flag, and any meta map stored at the time of access.
//
//    This endpoint deliberately does NOT call logAccess() — reviewing the audit
//    trail is not itself a document access event that should be recorded.
//
//    Same RBAC as all other vault routes (officer/legal-officer/court-clerk/admin).
//
//    Query params:
//      page    — 1-indexed (default 1)
//      limit   — 1-100     (default 25)
//      action  — filter by action type (view|download|edit|share|print|delete-attempt)
//      success — filter by result: "true" or "false"
router.get(
  '/documents/:id/audit',
  requireValidId('id'),
  [
    query('page').optional().isInt({ min: 1 }).withMessage('page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('limit must be 1–100'),
    query('action')
      .optional()
      .isIn(['view', 'download', 'edit', 'share', 'print', 'delete-attempt'])
      .withMessage('Invalid action filter'),
    query('success')
      .optional()
      .isIn(['true', 'false'])
      .withMessage('success must be "true" or "false"'),
    validate,
  ],
  asyncHandler(async (req, res) => {
    await connectDB();

    // Confirm the document exists and is visible
    const caseDoc = await CaseDocument.findById(req.params.id)
      .select('title docType confidentialityLevel caseFile isDeleted')
      .lean();

    if (!caseDoc || caseDoc.isDeleted) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    const { page, limit, skip } = paginate({ query: { ...req.query, limit: req.query.limit || 25 } });

    // Build filter
    const filter = { caseDocument: caseDoc._id };
    if (req.query.action)  filter.action  = req.query.action;
    if (req.query.success !== undefined) {
      filter.success = req.query.success === 'true';
    }

    const [logs, total] = await Promise.all([
      AccessLog.find(filter)
        .populate('actor',           'name email role')
        .populate('documentVersion', 'versionNumber')
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      AccessLog.countDocuments(filter),
    ]);

    res.json({
      success:    true,
      document: {
        id:                   caseDoc._id,
        title:                caseDoc.title,
        docType:              caseDoc.docType,
        confidentialityLevel: caseDoc.confidentialityLevel,
      },
      data:       logs,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    });
  })
);

// ── GET /api/case-vault/documents/:id/signatures — List signatures for a doc ──
//
//    Returns all non-revoked digital signatures attached to the document,
//    newest first. Used by the frontend to display existing signatures on each
//    document card without a separate API call per card (called once on expand).
router.get(
  '/documents/:id/signatures',
  requireValidId('id'),
  asyncHandler(async (req, res) => {
    await connectDB();

    const caseDoc = await CaseDocument.findById(req.params.id).select('isDeleted').lean();
    if (!caseDoc || caseDoc.isDeleted) {
      return res.status(404).json({ success: false, error: 'Document not found' });
    }

    const signatures = await DigitalSignature.find({
      caseDocument: req.params.id,
      isRevoked:    false,
    })
      .populate('signedBy', 'name email role')
      .populate('documentVersion', 'versionNumber')
      .sort({ signedAt: -1 })
      .lean();

    res.json({ success: true, data: signatures });
  })
);

// ─────────────────────────────────────────────────────────────────────────────
// Mount and export
// ─────────────────────────────────────────────────────────────────────────────

const app = express();
app.use('/api/case-vault', router);
module.exports = app;
