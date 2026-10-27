'use strict';
// Disable Mongoose query buffering and external API keys so tests execute in milliseconds
process.env.MONGODB_URI = 'invalid-dummy-uri';
process.env.VOYAGE_API_KEY = 'placeholder';
process.env.OPENAI_API_KEY = 'placeholder';

const mongoose = require('mongoose');
mongoose.set('bufferCommands', false);

const test = require('node:test');
const assert = require('node:assert');
const http = require('node:http');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'aab588417e5cad3d307ae28d3158c9ac745ef296eb0f252be582ac05139f0fc0';

test('chat integration tests with mocked Anthropic API', async (t) => {
  // 1. Create Mock Anthropic Server
  // Returns appropriate LLM text depending on the prompt
  const anthropicServer = http.createServer((req, res) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      res.setHeader('content-type', 'application/json');
      assert.equal(req.headers['x-api-key'], 'test-key');
      const b = JSON.parse(body);
      const userMsg = (b.messages && b.messages[0] && b.messages[0].content) || '';
      let replyText = 'Murder is punishable with death or imprisonment for life (Indian Penal Code, Sec. 302). This is general legal information, not legal advice.';
      if (userMsg.toLowerCase().includes('theft')) {
        replyText = 'Theft is punishable with imprisonment up to three years (Indian Penal Code, Sec. 379). This is general legal information, not legal advice.';
      } else if (userMsg.toLowerCase().includes('fir')) {
        replyText = 'Information to the police and power to investigate (Code of Criminal Procedure, Sec. 154). This is general legal information, not legal advice.';
      }
      res.end(JSON.stringify({
        content: [{
          type: 'text',
          text: replyText
        }]
      }));
    });
  });

  await new Promise(r => anthropicServer.listen(0, r));
  const anthropicPort = anthropicServer.address().port;
  process.env.ANTHROPIC_API_KEY = 'test-key';
  process.env.ANTHROPIC_BASE_URL = `http://127.0.0.1:${anthropicPort}`;

  // 2. Start Express app server
  const aiApp = require('../../../../api/_routes/ai');
  const appServer = http.createServer(aiApp);
  await new Promise(r => appServer.listen(0, r));
  const appPort = appServer.address().port;

  async function postChat(message) {
    const token = jwt.sign({ id: 'test_user_' + Math.random().toString(36).slice(2) }, JWT_SECRET);
    const res = await fetch(`http://127.0.0.1:${appPort}/api/ai/chat`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message })
    });
    return { status: res.status, data: await res.json() };
  }

  // Phase 2 baseline tests:
  // (1) "murder on 15 August 2024" -> final citations include BNS_103 and not IPC_302
  await t.test('Phase 2: murder on 15 August 2024 -> final citations include BNS_103 and not IPC_302', async () => {
    const { status, data } = await postChat('What is the punishment for murder on 15 August 2024?');
    assert.equal(status, 200);
    assert.equal(data.verification?.status, 'answered');
    assert.equal(data.verification?.regime?.PENAL, 'BNS');
    const sectionNumbers = (data.sources || []).map(s => String(s.sectionNumber));
    assert.ok(sectionNumbers.includes('103'), 'sources must include section 103: ' + JSON.stringify(data.sources));
    assert.ok(!sectionNumbers.includes('302'), 'sources must NOT include section 302: ' + JSON.stringify(data.sources));
  });

  // (2) "murder on 15 March 2023" -> IPC_302
  await t.test('Phase 2: murder on 15 March 2023 -> IPC_302', async () => {
    const { status, data } = await postChat('What is the punishment for murder on 15 March 2023?');
    assert.equal(status, 200);
    assert.equal(data.verification?.status, 'answered');
    assert.equal(data.verification?.regime?.PENAL, 'IPC');
    const sectionNumbers = (data.sources || []).map(s => String(s.sectionNumber));
    assert.ok(sectionNumbers.includes('302'), 'sources must include section 302: ' + JSON.stringify(data.sources));
  });

  // (3) a family-law question is not gated in
  await t.test('Phase 2: a family-law question is not gated in', async () => {
    const { status, data } = await postChat('What are the grounds for divorce under Hindu Marriage Act?');
    assert.equal(status, 200);
    assert.equal(data.verification?.status, 'not_applicable');
  });

  // (4) temporal layer throwing -> chat still returns the old answer
  await t.test('Phase 2: temporal layer throwing -> chat still returns the old answer', async () => {
    const jj = require('../src');
    const originalAnswerWithVerification = jj.answerWithVerification;
    jj.answerWithVerification = async () => {
      throw new Error('Simulated temporal crash');
    };
    try {
      const { status, data } = await postChat('What is the punishment for murder on 15 August 2024?');
      assert.equal(status, 200);
      assert.ok(data.reply, 'should return fallback reply');
      assert.equal(data.verification?.status, 'unverified');
      assert.equal(data.verification?.error, true);
    } finally {
      jj.answerWithVerification = originalAnswerWithVerification;
    }
  });

  // (5) POST /api/ai/verify-citations endpoint test
  await t.test('Phase 2: POST /api/ai/verify-citations endpoint', async () => {
    const res = await fetch(`http://127.0.0.1:${appPort}/api/ai/verify-citations`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        question: 'What is the punishment for murder on 15 August 2024?',
        answerText: 'Whoever commits murder shall be punished (Bharatiya Nyaya Sanhita, Sec. 103).'
      })
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.citations && data.citations.length > 0);
    assert.equal(data.citations[0].id, 'BNS_103');
    assert.equal(data.citations[0].verdict, 'pass');
  });

  // ── Phase 2b Specific Tests ────────────────────────────────────────────────
  // (a) "my landlord evicted me on 5 March 2024, what can I do?" -> not gated in, normal flow
  await t.test('Phase 2b (a): my landlord evicted me on 5 March 2024, what can I do? -> not gated in, normal flow', async () => {
    const { status, data } = await postChat('my landlord evicted me on 5 March 2024, what can I do?');
    assert.equal(status, 200);
    assert.ok(data.reply, 'should return standard reply from normal flow');
    assert.equal(data.verification?.status, 'not_applicable');
  });

  // (b) "what is the punishment for theft on 3 August 2024?" -> gated in, BNS citation
  await t.test('Phase 2b (b): what is the punishment for theft on 3 August 2024? -> gated in, BNS citation', async () => {
    const { status, data } = await postChat('what is the punishment for theft on 3 August 2024?');
    assert.equal(status, 200);
    assert.equal(data.verification?.status, 'answered');
    assert.equal(data.verification?.regime?.PENAL, 'BNS');
    const sectionNumbers = (data.sources || []).map(s => String(s.sectionNumber));
    assert.ok(sectionNumbers.includes('303'), 'sources must include BNS section 303: ' + JSON.stringify(data.sources));
    assert.ok(!sectionNumbers.includes('379'), 'sources must NOT include IPC section 379: ' + JSON.stringify(data.sources));
  });

  // (c) "someone filed an FIR on 10 July 2024 for an offence on 2 June 2024" -> gated in, two regimes resolved
  await t.test('Phase 2b (c): someone filed an FIR on 10 July 2024 for an offence on 2 June 2024 -> gated in, two regimes resolved', async () => {
    const { status, data } = await postChat('someone filed an FIR on 10 July 2024 for an offence on 2 June 2024');
    assert.equal(status, 200);
    assert.equal(data.verification?.status, 'answered');
    assert.equal(data.verification?.regime?.PENAL, 'IPC');
    assert.equal(data.verification?.regime?.PROCEDURE, 'BNSS');
  });

  // (d) Fix 2 test: abstained without explicit statute returns normal answer with not_applicable
  await t.test('Phase 2b (Fix 2): temporal abstained without explicit statute returns normal answer with not_applicable', async () => {
    const jj = require('../src');
    const originalAnswerWithVerification = jj.answerWithVerification;
    // Simulate temporal layer abstaining on a gated question that lacks explicit statute mention
    jj.answerWithVerification = async () => ({
      config: 'C4',
      query: 'some question',
      status: 'abstained',
      answer: 'I could not verify a provision that applies on the relevant date.',
      citations: [],
      trace: { regime: { PENAL: 'BNS', PROCEDURE: null, EVIDENCE: null } }
    });
    try {
      const { status, data } = await postChat('what is the bail procedure for an offence on 10 August 2024?');
      assert.equal(status, 200);
      assert.ok(data.reply, 'should return reply from non-temporal flow');
      assert.equal(data.verification?.status, 'not_applicable');
    } finally {
      jj.answerWithVerification = originalAnswerWithVerification;
    }
  });

  // Cleanup
  anthropicServer.close();
  appServer.close();
});
