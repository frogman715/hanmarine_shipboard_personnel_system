const xlsx = require('xlsx');
const path = require('path');

const excelPath = path.join(__dirname, 'docs', 'CREW LIST .xlsx');
const workbook = xlsx.readFile(excelPath);

console.log('📋 Sheet Names:', workbook.SheetNames);
console.log('\n' + '='.repeat(80));

// Inspect first vessel sheet untuk lihat struktur header
const vesselSheets = ['ALFA BALTICA', 'ALFA ALANDIA', 'LANCING'];

vesselSheets.forEach((sheetName) => {
  if (!workbook.Sheets[sheetName]) {
    console.log(`⚠️  Sheet "${sheetName}" not found`);
    return;
  }
  
  console.log(`\n📄 Sheet: ${sheetName}`);
  console.log('-'.repeat(80));
  
  const sheet = workbook.Sheets[sheetName];
  const range = xlsx.utils.decode_range(sheet['!ref']);
  
  // Read raw cells from first 5 rows
  console.log('First 5 rows (raw cells):');
  for (let R = 0; R <= Math.min(4, range.e.r); R++) {
    console.log(`\nRow ${R}:`);
    for (let C = 0; C <= Math.min(10, range.e.c); C++) {
      const cellAddress = xlsx.utils.encode_cell({ r: R, c: C });
      const cell = sheet[cellAddress];
      if (cell && cell.v) {
        console.log(`  [${cellAddress}] = "${cell.v}"`);
      }
    }
  }
  
  console.log('\n' + '='.repeat(80));
});
