const http = require('http');

function makeRequest(path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`Status: ${res.statusCode}`);
        console.log(`Response: ${data}`);
        console.log('---');
        resolve();
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function runTests() {
  console.log('====== API SMOKE TESTS ======\n');
  
  console.log('Test 1: Invalid crew ID (expect 400)');
  await makeRequest('/api/crew/invalid/repatriation', JSON.stringify({ reason: 'Test' }));

  console.log('Test 2: Crew not found (expect 404)');
  await makeRequest('/api/crew/9999/repatriation', JSON.stringify({ reason: 'Test' }));

  console.log('Test 3: Invalid finalAccount (expect 400)');
  await makeRequest('/api/crew/1/repatriation', JSON.stringify({ finalAccount: 'abc' }));

  console.log('Test 4: Invalid date (expect 400)');
  await makeRequest('/api/crew/1/repatriation', JSON.stringify({ repatriationDate: 'invalid' }));

  console.log('\n====== TESTS COMPLETE ======');
}

runTests().catch(console.error);
