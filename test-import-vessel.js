const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const http = require('http');

const excelPath = 'e:\\REAL PROJEK KANTOR\\vessel and flag.xlsx';

if (!fs.existsSync(excelPath)) {
  console.error('❌ File not found:', excelPath);
  process.exit(1);
}

const form = new FormData();
form.append('file', fs.createReadStream(excelPath));

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/import/vessel-excel',
  method: 'POST',
  headers: form.getHeaders(),
};

const req = http.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('📥 Response Status:', res.statusCode);
    console.log('📊 Response Data:');
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
    } catch (err) {
      console.log(data);
    }
  });
});

req.on('error', (err) => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});

form.pipe(req);
