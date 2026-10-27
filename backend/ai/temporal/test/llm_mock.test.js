'use strict';
// Exercises the Claude-API code path against a local mock server (no real API call, no key needed).
const test = require('node:test'), assert = require('node:assert'), http = require('node:http');
test('claude generator path: C0 returns raw LLM text; C4 verifies and repairs it', async () => {
  const srv = http.createServer((req, res) => { let b = ''; req.on('data', d => b += d); req.on('end', () => {
    const body = JSON.parse(b); res.setHeader('content-type', 'application/json');
    assert.equal(req.headers['x-api-key'], 'test-key');
    res.end(JSON.stringify({ content: [{ type: 'text', text: 'Murder is punishable with death or imprisonment for life (Indian Penal Code, Sec. 302). This is general information, not legal advice.' }] }));
  }); });
  await new Promise(r => srv.listen(0, r));
  process.env.ANTHROPIC_API_KEY = 'test-key'; process.env.ANTHROPIC_BASE_URL = `http://127.0.0.1:${srv.address().port}`;
  const P = require('../src/pipeline');
  const q = 'What is the punishment for murder committed on 15 August 2024?';
  const c0 = await P.run('C0', q, { generator: 'claude' });
  assert.deepEqual(c0.citations, ['IPC_302']);                      // an LLM with no date handling cites the repealed code
  const c4 = await P.run('C4', q, { generator: 'claude' });
  assert.deepEqual(c4.citations, ['BNS_103']);
  srv.close();
});
