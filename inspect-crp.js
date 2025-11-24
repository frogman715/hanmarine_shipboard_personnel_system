const XLSX = require('xlsx')

const file = 'D:\\HANMARINE GLOBAL INDONESIA\\CREW LIST & CREW REPLACEMENT\\CREW LIST & CREW LIST CRP 2024\\CREW LIST CRP\\HC - Monthly Check List of Crew Replacement 2025.xls'

console.log('📋 Reading CRP file:', file)
console.log()

const workbook = XLSX.readFile(file)
console.log('📄 Sheets:', workbook.SheetNames)
console.log()

// Inspect first few sheets
for (let i = 0; i < Math.min(3, workbook.SheetNames.length); i++) {
  const sheetName = workbook.SheetNames[i]
  console.log(`\n${'='.repeat(80)}`)
  console.log(`📄 Sheet ${i + 1}: ${sheetName}`)
  console.log('='.repeat(80))
  
  const sheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
  
  console.log(`Total rows: ${data.length}`)
  console.log('\nFirst 25 rows:')
  
  for (let j = 0; j < Math.min(25, data.length); j++) {
    console.log(`Row ${j + 1}:`, JSON.stringify(data[j]))
  }
}
