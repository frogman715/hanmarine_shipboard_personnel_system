const XLSX = require('xlsx')

const file = 'D:\\HANMARINE GLOBAL INDONESIA\\CREW LIST & CREW REPLACEMENT\\CREW LIST & CREW LIST CRP 2024\\CREW LIST CRP\\HC - Monthly Check List of Crew Replacement 2025.xls'

const workbook = XLSX.readFile(file)
const sheet2025 = workbook.Sheets['2025']
const data = XLSX.utils.sheet_to_json(sheet2025, { header: 1, defval: '' })

console.log('📄 Sheet: 2025')
console.log('Total rows:', data.length)
console.log()
console.log('First 50 rows:')
console.log()

for (let i = 0; i < Math.min(50, data.length); i++) {
  console.log(`Row ${i + 1}:`, JSON.stringify(data[i]))
}
