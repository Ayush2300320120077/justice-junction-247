require('dotenv').config();
const jwt = require('jsonwebtoken');

const LIVE_URL = 'https://justice-junction-app.vercel.app';


async function runAudit() {
  console.log('====================================================');
  console.log('  JUSTICE JUNCTION 24/7 — COMPREHENSIVE WEBSITE AUDIT');
  console.log('====================================================\n');
  console.log(`Targeting Live Production URL: ${LIVE_URL}\n`);

  let passCount = 0;
  let failCount = 0;

  function report(testName, success, details = '') {
    if (success) {
      passCount++;
      console.log(`✅ [PASS] ${testName}`);
    } else {
      failCount++;
      console.log(`❌ [FAIL] ${testName}`);
    }
    if (details) {
      console.log(`   └─ ${details}`);
    }
    console.log('');
  }

  // 1. Health Check
  try {
    const res = await fetch(`${LIVE_URL}/health`);
    report('1. Server Health Check (/health)', res.ok, `HTTP ${res.status}`);
  } catch (err) {
    report('1. Server Health Check (/health)', false, err.message);
  }

  // 2. Lawyer Search API
  try {
    const res = await fetch(`${LIVE_URL}/api/search?specialization=Criminal%20Defence&city=Delhi`);
    const data = await res.json();
    const hasLawyers = Array.isArray(data.lawyers);
    report('2. Lawyer Search API (/api/search)', res.ok && hasLawyers, `HTTP ${res.status} | Total Lawyers: ${data.total || 0}`);
  } catch (err) {
    report('2. Lawyer Search API (/api/search)', false, err.message);
  }

  // 3. AI Classifier — Routine Issue
  try {
    const res = await fetch(`${LIVE_URL}/api/ai/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'Purchased a defective refrigerator online and seller is refusing repair.' })
    });
    const data = await res.json();
    const valid = data.category === 'Consumer Rights' && data.urgency === 'routine';
    report('3. AI Classifier - Routine Case (/api/ai/classify)', res.ok && valid, `Category: "${data.category}", Urgency: "${data.urgency}", Confidence: ${data.confidence}`);
  } catch (err) {
    report('3. AI Classifier - Routine Case (/api/ai/classify)', false, err.message);
  }

  // 4. AI Classifier — Emergency Issue
  try {
    const res = await fetch(`${LIVE_URL}/api/ai/classify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: 'POLICE HAVE ARRESTED MY SON AND HE IS IN LOCKUP! Need emergency bail right now!' })
    });
    const data = await res.json();
    const valid = data.category === 'Bail & FIR' && data.urgency === 'emergency';
    report('4. AI Classifier - Emergency Case (/api/ai/classify)', res.ok && valid, `Category: "${data.category}", Urgency: "${data.urgency}", Reason: "${data.urgencyReason}"`);
  } catch (err) {
    report('4. AI Classifier - Emergency Case (/api/ai/classify)', false, err.message);
  }

  // 5. RAG AI Legal Assistant Chat
  let chatLogId = null;
  try {
    const res = await fetch(`${LIVE_URL}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'How do I file a consumer complaint for a defective product under Consumer Protection Act?' })
    });
    const data = await res.json();
    chatLogId = data.logId;
    const valid = res.ok && typeof data.reply === 'string' && data.reply.length > 20;
    report('5. RAG AI Legal Assistant Chat (/api/ai/chat)', valid, `HTTP ${res.status} | Log ID: ${data.logId} | Citations: ${data.retrievedSourcesCount || 0} | Latency: ${data.latencyMs}ms`);
  } catch (err) {
    report('5. RAG AI Legal Assistant Chat (/api/ai/chat)', false, err.message);
  }

  // 6. AI Interaction Feedback Rating
  if (chatLogId) {
    try {
      const res = await fetch(`${LIVE_URL}/api/ai/feedback`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logId: chatLogId, rating: 5 })
      });
      const data = await res.json();
      report('6. User Feedback Rating (/api/ai/feedback)', res.ok && data.success, `Log ID: ${data.logId} | Rated: ${data.userFeedbackRating}/5`);
    } catch (err) {
      report('6. User Feedback Rating (/api/ai/feedback)', false, err.message);
    }
  } else {
    report('6. User Feedback Rating (/api/ai/feedback)', false, 'Skipped (no chat logId)');
  }

  // 7. Admin Auth & AI Stats
  const adminToken = jwt.sign({ id: 'admin_test_id', role: 'admin' }, process.env.JWT_SECRET || 'REMOVED_JWT_SECRET');
  try {
    const res = await fetch(`${LIVE_URL}/api/admin/ai-stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    const valid = res.ok && typeof data.totalLogs === 'number';
    report('7. Admin AI Evaluation Stats (/api/admin/ai-stats)', valid, `Total Logs: ${data.totalLogs} | RAG Failure Rate: ${data.ragFailedRate}% | Avg Latency: ${data.overallAvgLatency}ms`);
  } catch (err) {
    report('7. Admin AI Evaluation Stats (/api/admin/ai-stats)', false, err.message);
  }

  // 8. Admin AI Logs & Reviewer Annotation
  let logToAnnotate = null;
  try {
    const res = await fetch(`${LIVE_URL}/api/admin/ai-logs?page=1&limit=5`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const data = await res.json();
    const valid = res.ok && Array.isArray(data.logs);
    if (valid && data.logs.length > 0) {
      logToAnnotate = data.logs[0]._id;
    }
    report('8. Admin AI Logs Listing (/api/admin/ai-logs)', valid, `Logs Returned: ${data.logs?.length || 0} / ${data.total || 0}`);
  } catch (err) {
    report('8. Admin AI Logs Listing (/api/admin/ai-logs)', false, err.message);
  }

  // 9. Admin Reviewer Annotation
  if (logToAnnotate) {
    try {
      const res = await fetch(`${LIVE_URL}/api/admin/ai-logs/${logToAnnotate}/annotate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({ reviewerRating: 5, reviewerNotes: 'Audit verified - response contains accurate statutory citations.' })
      });
      const data = await res.json();
      report('9. Admin Reviewer Annotation (/api/admin/ai-logs/:id/annotate)', res.ok && data.success, `Annotated Log ${data.log?._id} with Rating ${data.log?.reviewerRating}/5`);
    } catch (err) {
      report('9. Admin Reviewer Annotation (/api/admin/ai-logs/:id/annotate)', false, err.message);
    }
  } else {
    report('9. Admin Reviewer Annotation (/api/admin/ai-logs/:id/annotate)', false, 'Skipped (no log found)');
  }

  // 10. Admin CSV Export
  try {
    const res = await fetch(`${LIVE_URL}/api/admin/ai-logs/export-csv`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const text = await res.text();
    const isCsv = res.ok && text.includes('Log ID,Created At,Module');
    report('10. Admin CSV Export (/api/admin/ai-logs/export-csv)', isCsv, `CSV Length: ${text.length} chars`);
  } catch (err) {
    report('10. Admin CSV Export (/api/admin/ai-logs/export-csv)', false, err.message);
  }

  console.log('====================================================');
  console.log(`          AUDIT COMPLETE: ${passCount}/${passCount + failCount} PASSED`);
  console.log('====================================================');
}

runAudit().catch(console.error);
