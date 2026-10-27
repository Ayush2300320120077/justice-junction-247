/**
 * DigitalSignature.js — Case Vault Module
 *
 * Records a digital signature applied to a specific DocumentVersion by an
 * authorised officer.
 *
 * Design notes:
 * - `signatureData` holds the base64-encoded DER/PEM signature blob OR a
 *   reference string (e.g. HSM key handle) if using a Hardware Security Module.
 * - `certificateFingerprint` stores the SHA-1 / SHA-256 fingerprint of the
 *   signer's X.509 certificate — useful for quick validation without storing
 *   the full cert.
 * - Records are immutable after creation; a revocation is represented by a
 *   separate `isRevoked` flag rather than deletion.
 *
 * SIH26190 — Secure Digital Document Management System
 * Ministry of Home Affairs
 */

const mongoose = require('mongoose');

/** Roles recognised within the Case Vault signing workflow */
const SIGNER_ROLES = [
  'officer',
  'legal-officer',
  'court-clerk',
  'judge',            // may sign judgments directly in the system
  'forensic-expert',  // for forensic reports
  'public-prosecutor',
];

/** Signature algorithm identifiers (informational — actual verification is server-side) */
const SIGNATURE_ALGORITHMS = [
  'RSA-SHA256',
  'RSA-SHA512',
  'ECDSA-SHA256',
  'ECDSA-SHA512',
  'Ed25519',
  'HSM-REFERENCE',   // when the actual key lives in an HSM / KMS
];

const digitalSignatureSchema = new mongoose.Schema(
  {
    /**
     * The specific document version this signature was applied to.
     * A signature always targets a version, not just the document —
     * this ensures signatures remain valid even after newer versions are uploaded.
     */
    documentVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentVersion',
      required: [true, 'DocumentVersion reference is required'],
      index: true,
    },

    /**
     * Parent document — denormalised for efficient query-by-document without
     * always joining through DocumentVersion.
     */
    caseDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CaseDocument',
      required: [true, 'CaseDocument reference is required'],
      index: true,
    },

    /** User who applied the signature */
    signedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Signer (user) reference is required'],
      index: true,
    },

    /**
     * Role of the signer AT THE TIME of signing.
     * Stored explicitly so the record remains meaningful even if the
     * user's role changes later.
     */
    signerRole: {
      type: String,
      required: [true, 'Signer role is required'],
      enum: {
        values: SIGNER_ROLES,
        message: '{VALUE} is not a recognised signer role',
      },
    },

    /**
     * The actual signature payload.
     * - For software-based signing: base64-encoded DER/PEM PKCS#7 or raw signature.
     * - For HSM/KMS: an opaque reference string (e.g. "hsm:slot=1:handle=0xABCD").
     *
     * This field is intentionally left as a free-form string to accommodate
     * both local crypto and external HSM/eSign integrations (e.g. Aadhaar eSign,
     * DSC-based signing via NIC CA).
     */
    signatureData: {
      type: String,
      required: [true, 'Signature data or reference is required'],
    },

    /**
     * Algorithm used to produce the signature.
     * Must be set by the server; never trusted from the client.
     */
    algorithm: {
      type: String,
      enum: {
        values: SIGNATURE_ALGORITHMS,
        message: '{VALUE} is not a supported signature algorithm',
      },
      default: 'RSA-SHA256',
    },

    /**
     * SHA-256 fingerprint of the signer's X.509 certificate (if applicable).
     * Format: "AB:CD:EF:..." (colon-separated hex pairs).
     */
    certificateFingerprint: {
      type: String,
      trim: true,
    },

    /**
     * The exact SHA-256 hash of the file content that was signed.
     * Should match `DocumentVersion.sha256Hash` at the time of signing —
     * any mismatch indicates tampering.
     */
    contentHash: {
      type: String,
      required: [true, 'Content hash (SHA-256 of signed file) is required'],
      match: [/^[a-f0-9]{64}$/i, 'contentHash must be a 64-character hex string'],
    },

    /**
     * Server-set timestamp of when the signature was recorded.
     * Immutable after creation.
     */
    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
      index: true,
    },

    /**
     * Whether this signature has been revoked (e.g. signer key compromised).
     * Revocation does NOT delete the record — it just flags it as invalid.
     */
    isRevoked: {
      type: Boolean,
      default: false,
    },

    /** Reason for revocation, if revoked */
    revocationReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Revocation reason cannot exceed 500 characters'],
    },

    /** When the signature was revoked */
    revokedAt: {
      type: Date,
      default: null,
    },

    /** Optional: external signing service transaction ID (e.g. Aadhaar eSign txn) */
    externalTxnId: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: false, // all time tracking via `timestamp` / `revokedAt`
    collection: 'casevault_digital_signatures',
  }
);

/* ── Compound uniqueness: one active (non-revoked) signature per (version, signer) ─ */
digitalSignatureSchema.index(
  { documentVersion: 1, signedBy: 1 },
  {
    unique: true,
    partialFilterExpression: { isRevoked: false },
    name: 'idx_version_signer_active_unique',
  }
);

/* ── Additional indexes ──────────────────────────────────────────────────── */
digitalSignatureSchema.index({ caseDocument: 1, timestamp: -1 });
digitalSignatureSchema.index({ signedBy: 1, timestamp: -1 });
digitalSignatureSchema.index({ isRevoked: 1 });
digitalSignatureSchema.index({ contentHash: 1 }); // content integrity checks

/* ── Virtual ─────────────────────────────────────────────────────────────── */
digitalSignatureSchema.virtual('isValid').get(function () {
  return !this.isRevoked;
});

module.exports =
  mongoose.models.DigitalSignature ||
  mongoose.model('DigitalSignature', digitalSignatureSchema);
