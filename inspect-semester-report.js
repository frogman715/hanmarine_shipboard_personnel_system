const XLSX = require('xlsx')

const file = 'D:\\HANMARINE GLOBAL INDONESIA\\CREW LIST & CREW REPLACEMENT\\LAPORAN SEMESTER_HGI 2025\\LAPORAN SEMESTER  - HANMARINE 2024.xlsx'

const workbook = XLSX.readFile(file)
console.log('📋 Sheets:', workbook.SheetNames)
console.log()

for (const sheetName of workbook.SheetNames) {
  console.log(`\n📄 Sheet: ${sheetName}`)
  console.log('='.repeat(80))
  
  const sheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
  
  console.log(`Total rows: ${data.length}`)
  console.log('\nFirst 20 rows:')
  
  for (let i = 0; i < Math.min(20, data.length); i++) {
    console.log(`Row ${i + 1}:`, JSON.stringify(data[i]))
  }
}
