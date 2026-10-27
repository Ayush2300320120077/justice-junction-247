require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { CaseFile, CaseDocument, DocumentVersion } = require('../models/casevault');
const User = require('../models/User');

const computeSha256FromBase64 = (base64String) => {
  const buffer = Buffer.from(base64String, 'base64');
  return crypto.createHash('sha256').update(buffer).digest('hex');
};

const buildFileRef = (caseDocId, versionNumber, sha256, mimeType) => {
  const ext = (mimeType || 'application/octet-stream').split('/')[1]?.split('+')[0] || 'bin';
  return `uploads/casevault/${caseDocId}/${versionNumber}/${sha256.slice(0, 8)}.${ext}`;
};

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  const admin = await User.findOne({ role: 'admin' });
  if (!admin) throw new Error('No admin user found');

  const caseFile = await CaseFile.create({
    caseNumber: 'FIR-2026-' + Date.now().toString().slice(-4),
    title: 'Demo Case - Financial Fraud',
    department: 'CBI',
    status: 'open',
    createdBy: admin._id,
    assignedOfficers: [admin._id]
  });
  console.log('Created CaseFile:', caseFile.caseNumber);

  const fileContent = 'This is a demo document for SIH26190.';
  const fileBase64 = Buffer.from(fileContent).toString('base64');
  const mimeType = 'text/plain';
  const sha256Hash = computeSha256FromBase64(fileBase64);

  const tempId = new mongoose.Types.ObjectId();
  const fileUrl = buildFileRef(tempId.toString(), 1, sha256Hash, mimeType);

  const absolutePath = path.join(__dirname, '../', fileUrl);
  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  fs.writeFileSync(absolutePath, Buffer.from(fileBase64, 'base64'));

  const caseDoc = await CaseDocument.create({
    _id: tempId,
    caseFile: caseFile._id,
    title: 'Initial FIR Report',
    docType: 'FIR',
    fileUrl,
    currentVersion: 1,
    sha256Hash,
    uploadedBy: admin._id,
    uploadedAt: new Date(),
    confidentialityLevel: 'restricted'
  });

  await DocumentVersion.create({
    caseDocument: caseDoc._id,
    versionNumber: 1,
    fileUrl,
    sha256Hash,
    uploadedBy: admin._id,
    timestamp: new Date(),
    changeNote: 'Initial upload',
    mimeType,
    fileSizeBytes: fileContent.length
  });

  console.log('Created CaseDocument and written to disk:', absolutePath);

  await mongoose.disconnect();
}

seed().catch(console.error);
