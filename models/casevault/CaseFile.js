/**
 * CaseFile.js — Case Vault Module
 *
 * Represents a top-level investigation/legal case managed by government officers.
 * Distinct from the existing client-facing `Case` model (src/models/Case.js).
 *
 * SIH26190 — Secure Digital Document Management System
 * Ministry of Home Affairs
 */

const mongoose = require('mongoose');

const CASE_STATUS = ['open', 'under-investigation', 'sub-judice', 'closed', 'archived'];

const DEPARTMENT_LIST = [
  'CBI',
  'State Police',
  'NIA',
  'ED',
  'CID',
  'Cybercrime Cell',
  'Anti-Corruption Bureau',
  'Narcotics Control Bureau',
  'Court Registry',
  'Other',
];

const caseFileSchema = new mongoose.Schema(
  {
    /** Unique identifier — e.g. "FIR-2024-DEL-00123" or court-assigned number */
    caseNumber: {
      type: String,
      required: [true, 'Case number is required'],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, 'Case title is required'],
      trim: true,
      maxlength: [300, 'Title cannot exceed 300 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: { values: DEPARTMENT_LIST, message: '{VALUE} is not a recognised department' },
    },

    status: {
      type: String,
      enum: { values: CASE_STATUS, message: '{VALUE} is not a valid case status' },
      default: 'open',
    },

    /** User who created/registered this case — must be officer/legal-officer/court-clerk */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator reference is required'],
    },

    /**
     * Officers assigned to work on this case.
     * Array of User ObjectIds — each must have role officer/legal-officer/court-clerk.
     */
    assignedOfficers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],

    /** Optional: link to a supervising court / jurisdiction tag */
    jurisdiction: {
      type: String,
      trim: true,
    },

    /** Soft-delete flag — records are never hard-deleted per audit requirements */
    isArchived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    collection: 'casevault_casefiles',
  }
);

/* ── Indexes ─────────────────────────────────────────────────────────────── */
caseFileSchema.index({ status: 1 });
caseFileSchema.index({ department: 1 });
caseFileSchema.index({ createdBy: 1 });
caseFileSchema.index({ assignedOfficers: 1 });
caseFileSchema.index({ createdAt: -1 });

/* ── Statics ─────────────────────────────────────────────────────────────── */

/**
 * Fetch all non-archived cases for a given officer.
 * @param {ObjectId} userId
 */
caseFileSchema.statics.findForOfficer = function (userId) {
  return this.find({
    assignedOfficers: userId,
    isArchived: false,
  }).sort({ createdAt: -1 });
};

module.exports =
  mongoose.models.CaseFile || mongoose.model('CaseFile', caseFileSchema);
