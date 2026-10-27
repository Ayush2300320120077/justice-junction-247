/**
 * CaseDocument.js — Case Vault Module
 *
 * Represents a single document attached to a CaseFile.
 * Each document tracks its current version, SHA-256 hash for integrity,
 * and links to its full version history via DocumentVersion.
 *
 * SIH26190 — Secure Digital Document Management System
 * Ministry of Home Affairs
 */

const mongoose = require('mongoose');

const DOC_TYPES = [
  'FIR',
  'charge-sheet',
  'witness-statement',
  'evidence',
  'court-filing',
  'forensic-report',
  'judgment',
];

const caseDocumentSchema = new mongoose.Schema(
  {
    /** Parent case */
    caseFile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CaseFile',
      required: [true, 'CaseFile reference is required'],
      index: true,
    },

    /** Human-readable document title */
    title: {
      type: String,
      required: [true, 'Document title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },

    docType: {
      type: String,
      required: [true, 'Document type is required'],
      enum: { values: DOC_TYPES, message: '{VALUE} is not a recognised document type' },
    },

    /**
     * URL of the *current* (latest) version of the file.
     * Stored in cloud storage (S3/GCS/Azure Blob); never exposed raw to the client —
     * always behind a signed-URL middleware.
     */
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },

    /**
     * Current version number — mirrors the latest DocumentVersion.versionNumber.
     * Incremented atomically when a new version is uploaded.
     */
    currentVersion: {
      type: Number,
      required: true,
      default: 1,
      min: [1, 'Version must be ≥ 1'],
    },

    /**
     * SHA-256 hex digest of the *current* file content.
     * Used for tamper-evidence; recomputed and compared on every download.
     */
    sha256Hash: {
      type: String,
      required: [true, 'SHA-256 hash is required'],
      match: [/^[a-f0-9]{64}$/i, 'sha256Hash must be a 64-character hex string'],
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader reference is required'],
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    /** Soft-delete — documents are never hard-deleted */
    isDeleted: {
      type: Boolean,
      default: false,
    },

    /** Optional: classification / sensitivity tag */
    confidentialityLevel: {
      type: String,
      enum: ['unclassified', 'restricted', 'confidential', 'secret', 'top-secret'],
      default: 'restricted',
    },

    /** Optional free-text tags for search */
    tags: [{ type: String, trim: true }],
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    collection: 'casevault_documents',
  }
);

/* ── Indexes ─────────────────────────────────────────────────────────────── */
caseDocumentSchema.index({ caseFile: 1, docType: 1 });
caseDocumentSchema.index({ uploadedBy: 1 });
caseDocumentSchema.index({ sha256Hash: 1 }); // fast duplicate-detection
caseDocumentSchema.index({ createdAt: -1 });
caseDocumentSchema.index({ tags: 1 });

module.exports =
  mongoose.models.CaseDocument ||
  mongoose.model('CaseDocument', caseDocumentSchema);
