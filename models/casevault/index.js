/**
 * models/casevault/index.js
 *
 * Barrel file — import all Case Vault models from one place:
 *
 *   const { CaseFile, CaseDocument, DocumentVersion, AccessLog, DigitalSignature }
 *     = require('./models/casevault');
 *
 * SIH26190 — Secure Digital Document Management System
 * Ministry of Home Affairs
 */

module.exports = {
  CaseFile: require('./CaseFile'),
  CaseDocument: require('./CaseDocument'),
  DocumentVersion: require('./DocumentVersion'),
  AccessLog: require('./AccessLog'),
  DigitalSignature: require('./DigitalSignature'),
};
