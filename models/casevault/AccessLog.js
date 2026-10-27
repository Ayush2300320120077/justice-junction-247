/**
 * AccessLog.js — Case Vault Module
 *
 * Append-only audit trail for every interaction with a CaseDocument.
 * Records MUST NOT be deleted or modified after creation — enforce at the
 * application layer and, where possible, via MongoDB role-based DB privileges
 * (e.g. insert-only role on this collection).
 *
 * SIH26190 — Secure Digital Document Management System
 * Ministry of Home Affairs
 */

const mongoose = require('mongoose');

/**
 * Recognised action types.
 * "share" covers internal forwarding to another officer / external sharing via link.
 */
const ACTIONS = ['view', 'download', 'edit', 'share', 'print', 'delete-attempt'];

const accessLogSchema = new mongoose.Schema(
  {
    /** The document that was accessed */
    caseDocument: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CaseDocument',
      required: [true, 'CaseDocument reference is required'],
      index: true,
    },

    /**
     * The specific document version that was accessed, if applicable.
     * Null/undefined for actions that target the document as a whole (e.g. edit metadata).
     */
    documentVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DocumentVersion',
      default: null,
    },

    /** User who performed the action */
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Actor (user) reference is required'],
      index: true,
    },

    action: {
      type: String,
      required: [true, 'Action is required'],
      enum: { values: ACTIONS, message: '{VALUE} is not a recognised action type' },
    },

    /**
     * Originating IP address.
     * Store as String to support both IPv4 and IPv6.
     * Populated server-side from req.ip — never trusted from the client payload.
     */
    ipAddress: {
      type: String,
      required: [true, 'IP address is required'],
      trim: true,
    },

    /**
     * User-Agent string from the HTTP request header.
     * Useful for forensic analysis (browser/OS fingerprinting).
     */
    userAgent: {
      type: String,
      trim: true,
    },

    /**
     * Server-set timestamp — immutable after creation.
     * Do NOT allow the client to provide this value.
     */
    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
      index: true,
    },

    /**
     * Whether the action was authorised and completed successfully.
     * Storing failed/denied attempts is important for intrusion detection.
     */
    success: {
      type: Boolean,
      default: true,
    },

    /**
     * Optional extra context — e.g. share recipient ID, reason for access,
     * download format, etc. Stored as a flexible map.
     */
    meta: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    /*
     * No `updatedAt` — logs are append-only. `createdAt` is captured via `timestamp`.
     */
    timestamps: false,
    collection: 'casevault_access_logs',
  }
);

/* ── Compound indexes for common query patterns ──────────────────────────── */
accessLogSchema.index({ caseDocument: 1, timestamp: -1 });
accessLogSchema.index({ actor: 1, timestamp: -1 });
accessLogSchema.index({ action: 1, timestamp: -1 });
accessLogSchema.index({ caseDocument: 1, actor: 1, action: 1 }); // audit reports
accessLogSchema.index({ success: 1, timestamp: -1 }); // failed-access dashboards

/* ── TTL index (optional — comment out if indefinite retention is required) ─
 * accessLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 * 7 }); // 7 years
 */

module.exports =
  mongoose.models.AccessLog || mongoose.model('AccessLog', accessLogSchema);
