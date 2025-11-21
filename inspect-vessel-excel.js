const xlsx = require('xlsx');
const path = require('path');

// Read the Excel file
const excelPath = 'e:\\REAL PROJEK KANTOR\\vessel and flag.xlsx';
const workbook = xlsx.readFile(excelPath);

console.log('📋 Sheet Names:', workbook.SheetNames);
console.log('\n' + '='.repeat(80));

workbook.SheetNames.forEach((sheetName) => {
  console.log(`\n📄 Sheet: ${sheetName}`);
  console.log('-'.repeat(80));
  
  const sheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(sheet);
  
  console.log(`Total rows: ${data.length}`);
  
  if (data.length > 0) {
    console.log('\nColumns:', Object.keys(data[0]));
    console.log('\nFirst 3 rows:');
    data.slice(0, 3).forEach((row, idx) => {
      console.log(`Row ${idx + 1}:`, JSON.stringify(row, null, 2));
    });
  }
});
