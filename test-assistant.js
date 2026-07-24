async function run() {
  try {
    const res = await fetch('http://localhost:3000/api/ai/assistant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'hello property dispute',
        sessionId: 'test-session-12345',
        conversationHistory: []
      })
    });
    console.log('STATUS:', res.status);
    const data = await res.json();
    console.log('RESPONSE:', data);
  } catch (err) {
    console.error('ERROR:', err);
  }
}

run();
