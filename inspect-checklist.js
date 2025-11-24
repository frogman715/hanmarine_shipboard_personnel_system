const XLSX = require('xlsx')

const file = 'D:\\HANMARINE GLOBAL INDONESIA\\SCANNING CREW\\@VACATION CREW\\9. AB\\AB-EVIANDI\\AB-EVIANDI - DOCUMENT CHECKLIST.xls'

const workbook = XLSX.readFile(file)
const sheet = workbook.Sheets[workbook.SheetNames[0]]
const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })

console.log('📋 Checklist File:', file.split('\\').pop())
console.log('📄 Sheet Name:', workbook.SheetNames[0])
console.log('📊 Total Rows:', data.length)
console.log('\n🔍 First 30 rows (ALL COLUMNS):')
console.log('='.repeat(80))

for (let i = 0; i < Math.min(30, data.length); i++) {
  const row = data[i]
  if (row.length > 0) {
    console.log(`Row ${i + 1}:`, JSON.stringify(row))
  }
}
