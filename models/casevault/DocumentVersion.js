/**
 * DocumentVersion.js — Case Vault Module
 *
 * Immutable version history for a CaseDocument.
 * Every upload creates a new DocumentVersion; the parent CaseDocument's
 * `fileUrl`, `sha256Hash`, and `currentVersion` are then updated to match.
 *
 * Records in this collection MUST NOT be deleted or edited after creation
 * (enforce at the application + DB role level).
 *
 * SIH26190 — Secure Digital Document Management System
 * Ministry of Home Affairs
 */

const mongoose = require('mongoose');

const documentVersionSchema = new mongoose.Schema(
  {
    /** Parent document */
    caseDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CaseDocument',
      required: [true, 'CaseDocument reference is required'],
      index: true,
    },

    /**
     * Sequential integer starting at 1.
     * The combination (caseDocument + versionNumber) must be unique.
     */
    versionNumber: {
      type: Number,
      required: [true, 'Version number is required'],
      min: [1, 'Version number must be ≥ 1'],
    },

    /**
     * Storage URL for this specific version's file.
     * Must remain immutable after creation — old version files are retained
     * for audit / rollback purposes.
     */
    fileUrl: {
      type: String,
      required: [true, 'File URL is required'],
    },

    /**
     * SHA-256 hex digest of this version's file.
     * Recomputed server-side before storage; never trusted from the client.
     */
    sha256Hash: {
      type: String,
      required: [true, 'SHA-256 hash is required'],
      match: [/^[a-f0-9]{64}$/i, 'sha256Hash must be a 64-character hex string'],
    },

    /** Officer who uploaded this version */
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Uploader reference is required'],
    },

    /** When this version was created (server-set, not client-provided) */
    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true, // Mongoose 5.6+ — prevents accidental mutation
    },

    /**
     * Human-readable note describing what changed in this version.
     * Mandatory for versions > 1 to ensure a proper audit trail.
     */
    changeNote: {
      type: String,
      trim: true,
      maxlength: [1000, 'Change note cannot exceed 1000 characters'],
    },

    /** File size in bytes — useful for quota enforcement */
    fileSizeBytes: {
      type: Number,
      min: 0,
    },

    /** MIME type of the uploaded file (e.g. "application/pdf") */
    mimeType: {
      type: String,
      trim: true,
    },
  },
  {
    /*
     * We deliberately disable automatic `updatedAt` — versions are immutable.
     * `createdAt` is tracked via the `timestamp` field above for clarity.
     */
    timestamps: false,
    collection: 'casevault_document_versions',
  }
);

/* ── Compound uniqueness constraint ─────────────────────────────────────── */
documentVersionSchema.index(
  { caseDocument: 1, versionNumber: 1 },
  { unique: true, name: 'idx_doc_version_unique' }
);

/* ── Additional indexes ──────────────────────────────────────────────────── */
documentVersionSchema.index({ uploadedBy: 1 });
documentVersionSchema.index({ timestamp: -1 });
documentVersionSchema.index({ sha256Hash: 1 }); // duplicate-content detection

module.exports =
  mongoose.models.DocumentVersion ||
  mongoose.model('DocumentVersion', documentVersionSchema);
