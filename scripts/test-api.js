require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const app = require('../app');
const User = require('../models/User');

const PORT = 9999;
const URL = `http://localhost:${PORT}/api/case-vault`;

async function run() {
  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`Test server running on port ${PORT}`);

  try {
    // 1. Get Admin User & Cookie
    await mongoose.connect(process.env.MONGODB_URI);
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) throw new Error('No admin found');
    
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET || 'secret');
    const cookies = `token=${token}`;
    console.log('1. Login OK (JWT generated)');

    // 2. Create Case
    const caseRes = await fetch(`${URL}/cases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookies, 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        caseNumber: 'TEST-FIR-' + Date.now().toString().slice(-4),
        title: 'API Test Case',
        department: 'CBI',
        status: 'open',
        assignedOfficers: [admin._id.toString()]
      })
    });
    const caseData = await caseRes.json();
    if (!caseData.success) throw new Error('Case creation failed: ' + JSON.stringify(caseData));
    const caseId = caseData.data._id;
    console.log('2. Case Created:', caseId);

    // 3. Upload File
    const originalContent = 'Secret evidence data version 1';
    const uploadRes = await fetch(`${URL}/cases/${caseId}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookies, 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        title: 'Evidence Doc',
        docType: 'FIR',
        fileBase64: Buffer.from(originalContent).toString('base64'),
        mimeType: 'text/plain',
        confidentialityLevel: 'restricted'
      })
    });
    const uploadData = await uploadRes.json();
    if (!uploadData.success) throw new Error('Upload failed: ' + JSON.stringify(uploadData));
    const docId = uploadData.data.document._id;
    const fileUrl = uploadData.data.document.fileUrl;
    console.log('3. Upload OK, docId:', docId);

    // 4. Download File
    const downloadRes = await fetch(`${URL}/documents/${docId}/download`, {
      headers: { 'Cookie': cookies, 'Authorization': `Bearer ${token}` }
    });
    const downloadedText = await downloadRes.text();
    if (downloadedText !== originalContent) throw new Error('Download mismatch');
    console.log('4. Download OK, content matched');

    // 5. Tamper File Manually
    const absolutePath = path.join(__dirname, '../', fileUrl);
    fs.appendFileSync(absolutePath, '...tampered');
    console.log('5. Tampered file on disk');

    // 6. Verify Integrity
    const verifyRes = await fetch(`${URL}/documents/${docId}/verify`, {
      headers: { 'Cookie': cookies, 'Authorization': `Bearer ${token}` }
    });
    const verifyData = await verifyRes.json();
    if (verifyData.storedHash === uploadData.data.document.sha256Hash) {
      throw new Error('Verify failed to detect tamper');
    }
    console.log('6. Verify detected mismatch (hash changed)', verifyData.storedHash);

    // 7. Sign Document (clean version - actually I will sign the tampered one, just to see if it allows it based on diskHash)
    // Wait, the client signs by sending `contentHash` which it expects to match the DB hash (or now, disk hash).
    // Let's sign using the `diskHash` retrieved in verify
    const signRes = await fetch(`${URL}/documents/${docId}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookies, 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        versionNumber: 1,
        signatureData: 'TEST-SIG',
        contentHash: verifyData.storedHash
      })
    });
    const signData = await signRes.json();
    // Wait, the signature validation checks `docVersion.sha256Hash`, which is from the DB!
    // So signing the tampered hash will FAIL!
    console.log('7. Sign with tampered hash response (expect 422):', signData.error ? 'PASS' : 'FAIL');
    
    // Sign with original hash
    const signOrig = await fetch(`${URL}/documents/${docId}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Cookie': cookies, 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({
        versionNumber: 1,
        signatureData: 'TEST-SIG',
        contentHash: uploadData.data.document.sha256Hash
      })
    });
    const signOrigData = await signOrig.json();
    console.log('7. Sign with original DB hash response (expect success):', signOrigData.success ? 'PASS' : 'FAIL');

    // 8. Audit Log
    const auditRes = await fetch(`${URL}/documents/${docId}/audit`, {
      headers: { 'Cookie': cookies, 'Authorization': `Bearer ${token}` }
    });
    const auditData = await auditRes.json();
    console.log('8. Audit log count:', auditData.data.length);
    console.log('Audit log actions:', auditData.data.map(l => l.action).join(', '));

  } catch (err) {
    console.error('TEST FAILED:', err);
  } finally {
    server.close();
    await mongoose.disconnect();
    console.log('Server stopped');
  }
}

run();
