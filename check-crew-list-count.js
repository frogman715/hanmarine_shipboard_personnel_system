const XLSX = require('xlsx')

const file = 'D:\\HANMARINE GLOBAL INDONESIA\\CREW LIST & CREW REPLACEMENT\\CREW LIST & CREW LIST CRP\\CREW LIST\\CREW LIST OKTOBER 2025.xls'

console.log('📋 Checking actual crew count from Excel...\n')

const workbook = XLSX.readFile(file)

let totalCrewCount = 0
const crewNames = new Set()

console.log('Sheets found:', workbook.SheetNames.length)
console.log()

for (const sheetName of workbook.SheetNames) {
  const sheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
  
  // Skip if sheet looks like summary/header
  if (data.length < 10) continue
  
  console.log(`\n📄 Sheet: ${sheetName}`)
  
  // Find vessel name (usually in row 1, col 1)
  const vesselName = String(data[0]?.[0] || '').trim()
  console.log(`   Vessel: ${vesselName}`)
  
  let crewCountInSheet = 0
  let startRow = 5 // Crew data usually starts at row 5
  
  // Count crew in this sheet
  for (let i = startRow; i < data.length; i++) {
    const row = data[i]
    
    // Skip empty rows
    if (!row || row.length === 0) continue
    
    const no = row[0]
    const rank = String(row[1] || '').trim()
    const name = String(row[2] || '').trim()
    
    // Skip if no name or looks like header
    if (!name || name.toUpperCase().includes('NAME') || name.toUpperCase().includes('RANK')) {
      continue
    }
    
    // Skip expiry date rows (no number in first column)
    if (!no || isNaN(no)) {
      continue
    }
    
    // Valid crew member
    if (name && rank) {
      crewCountInSheet++
      crewNames.add(name)
      
      // Show first 3 crew as sample
      if (crewCountInSheet <= 3) {
        console.log(`      ${no}. ${rank} - ${name}`)
      }
    }
  }
  
  console.log(`   Total crew: ${crewCountInSheet}`)
  totalCrewCount += crewCountInSheet
}

console.log('\n' + '='.repeat(80))
console.log('📊 SUMMARY')
console.log('='.repeat(80))
console.log(`Total crew in Excel: ${totalCrewCount}`)
console.log(`Unique crew names: ${crewNames.size}`)
console.log('\nNote: Same crew might appear on different vessels if they changed ships')
