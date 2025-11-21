const { PrismaClient } = require('@prisma/client')
const XLSX = require('xlsx')

const prisma = new PrismaClient()

// Parse Excel date to JS Date
function parseExcelDate(value) {
  if (!value) return null
  if (!isNaN(value) && Number(value) > 1000) {
    const excelEpoch = new Date(1899, 11, 30)
    const date = new Date(excelEpoch.getTime() + Number(value) * 86400000)
    if (!isNaN(date.getTime())) {
      return date
    }
  }
  const parsed = new Date(value)
  if (!isNaN(parsed.getTime())) {
    return parsed
  }
  return null
}

async function syncCrewFromExcel() {
  console.log('\n🔄 SYNCING CREW STATUS FROM EXCEL')
  console.log('='.repeat(80))
  
  const filePath = 'D:\\HANMARINE GLOBAL INDONESIA\\CREW LIST & CREW REPLACEMENT\\CREW LIST & CREW LIST CRP\\CREW LIST\\CREW LIST OKTOBER 2025.xls'
  
  console.log(`\n📄 Reading: CREW LIST OKTOBER 2025.xls`)
  
  const workbook = XLSX.readFile(filePath)
  
  // Collect all crew names from Excel
  const excelCrewNames = new Set()
  
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName]
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
    
    // Skip small sheets
    if (data.length < 10) continue
    
    // Parse vessel name from row 1
    const vesselName = String(data[0]?.[0] || '')
      .replace('NAME OF VESSEL :', '')
      .replace('NAME OF VESSEL:', '')
      .trim()
    
    if (!vesselName || vesselName === '') continue
    
    console.log(`\n🚢 Processing: ${vesselName}`)
    
    let crewCount = 0
    
    // Parse crew data (starts around row 5)
    for (let i = 5; i < data.length; i++) {
      const row = data[i]
      if (!row || row.length === 0) continue
      
      const no = row[0]
      const rank = String(row[1] || '').trim()
      const name = String(row[2] || '').trim()
      
      // Skip if no name or looks like header
      if (!name || name.toUpperCase().includes('NAME') || name.toUpperCase().includes('RANK')) {
        continue
      }
      
      // Skip expiry rows (no number)
      if (!no || isNaN(no)) {
        continue
      }
      
      if (name && rank) {
        excelCrewNames.add(name.toUpperCase())
        crewCount++
      }
    }
    
    console.log(`   ✅ ${crewCount} crew found`)
  }
  
  console.log(`\n📊 Total unique crew in Excel: ${excelCrewNames.size}`)
  
  // Get all crew from database
  const allCrew = await prisma.crew.findMany({
    where: {
      crewStatus: {
        not: 'INACTIVE' // Don't touch ex-crew
      }
    }
  })
  
  console.log(`\n🔄 Updating crew status...`)
  
  let movedToOnboard = 0
  let movedToStandby = 0
  let unchanged = 0
  
  for (const crew of allCrew) {
    const nameUpper = crew.fullName.toUpperCase()
    const isInExcel = excelCrewNames.has(nameUpper)
    
    if (isInExcel) {
      // Crew in Excel → should be ONBOARD
      if (crew.crewStatus !== 'ONBOARD') {
        await prisma.crew.update({
          where: { id: crew.id },
          data: { crewStatus: 'ONBOARD' }
        })
        console.log(`   ✅ ${crew.fullName}: ${crew.crewStatus} → ONBOARD`)
        movedToOnboard++
      } else {
        unchanged++
      }
    } else {
      // Crew NOT in Excel → should be STANDBY
      if (crew.crewStatus !== 'STANDBY') {
        await prisma.crew.update({
          where: { id: crew.id },
          data: { crewStatus: 'STANDBY' }
        })
        console.log(`   📦 ${crew.fullName}: ${crew.crewStatus} → STANDBY`)
        movedToStandby++
      } else {
        unchanged++
      }
    }
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('📊 SYNC SUMMARY')
  console.log('='.repeat(80))
  console.log(`✅ Moved to ONBOARD: ${movedToOnboard}`)
  console.log(`📦 Moved to STANDBY: ${movedToStandby}`)
  console.log(`ℹ️  Unchanged: ${unchanged}`)
  
  // Final count
  const finalOnboard = await prisma.crew.count({ where: { crewStatus: 'ONBOARD' } })
  const finalStandby = await prisma.crew.count({ where: { crewStatus: 'STANDBY' } })
  const finalInactive = await prisma.crew.count({ where: { crewStatus: 'INACTIVE' } })
  
  console.log('\n📊 FINAL STATUS:')
  console.log(`   ONBOARD: ${finalOnboard} (should match Excel: ${excelCrewNames.size})`)
  console.log(`   STANDBY: ${finalStandby}`)
  console.log(`   INACTIVE: ${finalInactive} (ex-crew)`)
  console.log(`   TOTAL: ${finalOnboard + finalStandby + finalInactive}`)
}

async function main() {
  try {
    await syncCrewFromExcel()
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
