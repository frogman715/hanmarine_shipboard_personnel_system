const { PrismaClient } = require('@prisma/client')
const XLSX = require('xlsx')

const prisma = new PrismaClient()

// Parse Excel date to JS Date
function parseExcelDate(value) {
  if (!value) return null
  
  // Skip text values
  if (typeof value === 'string') {
    // Try parsing string dates
    const parsed = new Date(value)
    if (!isNaN(parsed.getTime())) {
      return parsed
    }
    return null
  }
  
  // Excel serial number (days since 1899-12-30)
  if (!isNaN(value) && Number(value) > 1000) {
    const excelEpoch = new Date(1899, 11, 30)
    const date = new Date(excelEpoch.getTime() + Number(value) * 86400000)
    if (!isNaN(date.getTime())) {
      return date
    }
  }
  
  return null
}

async function importCrewReplacementPlan() {
  console.log('\n📋 IMPORTING CREW REPLACEMENT PLAN (CRP)')
  console.log('='.repeat(80))
  
  const filePath = 'D:\\HANMARINE GLOBAL INDONESIA\\CREW LIST & CREW REPLACEMENT\\CREW LIST & CREW LIST CRP 2024\\CREW LIST CRP\\HC - Monthly Check List of Crew Replacement 2025.xls'
  
  console.log(`\n📄 Reading: ${filePath}`)
  
  const workbook = XLSX.readFile(filePath)
  
  // Focus on 2025 sheet
  const sheetName = '2025'
  if (!workbook.SheetNames.includes(sheetName)) {
    console.log(`❌ Sheet "${sheetName}" not found`)
    return
  }
  
  const sheet = workbook.Sheets[sheetName]
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
  
  console.log(`\n✅ Found sheet: ${sheetName}`)
  console.log(`   Total rows: ${data.length}`)
  
  let replacementsCreated = 0
  let replacementsUpdated = 0
  let currentMonth = ''
  
  // Parse rows
  for (let i = 0; i < data.length; i++) {
    const row = data[i]
    
    // Skip empty rows
    if (!row || row.length === 0) continue
    
    // Detect month headers
    const firstCol = String(row[0] || '').trim().toUpperCase()
    if (['JANUARY', 'FEBRUARY', 'FEBUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'].includes(firstCol)) {
      currentMonth = firstCol
      console.log(`\n📅 Processing: ${currentMonth}`)
      continue
    }
    
    // Skip header rows
    if (firstCol === 'NO.' || firstCol === '') continue
    
    // Parse data row
    const no = row[0]
    const vesselName = String(row[1] || '').trim()
    
    // ONSIGNER columns: 2=Rank, 3=Name, 4=Departure, 5=Embarkation
    const onSignerRank = String(row[2] || '').trim()
    const onSignerName = String(row[3] || '').trim()
    const onSignerDeparture = parseExcelDate(row[4])
    const onSignerEmbarkation = parseExcelDate(row[5])
    
    // OFFSIGNER columns: 6=Rank, 7=Name, 8=Disembarkation, 9=Arrival, 10=Reason
    const offSignerRank = String(row[6] || '').trim()
    const offSignerName = String(row[7] || '').trim()
    const offSignerDisembarkation = parseExcelDate(row[8])
    const offSignerArrival = parseExcelDate(row[9])
    const offSignerReason = String(row[10] || '').trim()
    
    // Port
    const port = String(row[11] || '').trim()
    
    // Skip if no vessel name or no crew data
    if (!vesselName || vesselName === 'N/A') continue
    if (!onSignerName && !offSignerName) continue
    
    console.log(`\n  ${no}. ${vesselName}`)
    
    // Process OFFSIGNER (crew leaving)
    if (offSignerName && offSignerName !== 'N/A') {
      console.log(`    📤 OFFSIGNER: ${offSignerRank} ${offSignerName} (${offSignerReason})`)
      
      // Find crew by name
      const crew = await prisma.crew.findFirst({
        where: {
          fullName: {
            contains: offSignerName,
            mode: 'insensitive'
          }
        }
      })
      
      if (crew) {
        // Find existing assignment
        const existingAssignment = await prisma.assignment.findFirst({
          where: {
            crewId: crew.id,
            vesselName: vesselName,
            signOff: null
          }
        })
        
        if (existingAssignment) {
          // Update with sign-off date
          await prisma.assignment.update({
            where: { id: existingAssignment.id },
            data: {
              signOff: offSignerDisembarkation || offSignerArrival,
              status: 'PLANNED_OFFBOARD'
            }
          })
          console.log(`       ✅ Updated assignment with sign-off date`)
          replacementsUpdated++
        } else {
          console.log(`       ⚠️  No active assignment found for ${offSignerName}`)
        }
      } else {
        console.log(`       ⚠️  Crew not found: ${offSignerName}`)
      }
    }
    
    // Process ONSIGNER (crew joining)
    if (onSignerName && onSignerName !== 'N/A') {
      console.log(`    📥 ONSIGNER: ${onSignerRank} ${onSignerName}`)
      
      // Find or create crew
      let crew = await prisma.crew.findFirst({
        where: {
          fullName: {
            contains: onSignerName,
            mode: 'insensitive'
          }
        }
      })
      
      if (!crew) {
        // Create new crew record
        crew = await prisma.crew.create({
          data: {
            fullName: onSignerName,
            rank: onSignerRank,
            crewStatus: 'ACTIVE'
          }
        })
        console.log(`       ✅ Created new crew: ${onSignerName}`)
      }
      
      // Find or create vessel
      let vessel = await prisma.vessel.findUnique({
        where: { name: vesselName }
      })
      
      if (!vessel) {
        vessel = await prisma.vessel.create({
          data: {
            name: vesselName,
            flag: 'UNKNOWN',
            ownerId: 1
          }
        })
        console.log(`       ✅ Created vessel: ${vesselName}`)
      }
      
      // Check if assignment already exists
      const existingAssignment = await prisma.assignment.findFirst({
        where: {
          crewId: crew.id,
          vesselName: vesselName,
          signOn: onSignerEmbarkation || onSignerDeparture
        }
      })
      
      if (!existingAssignment) {
        // Create planned assignment
        await prisma.assignment.create({
          data: {
            crewId: crew.id,
            vesselName: vesselName,
            rank: onSignerRank,
            signOn: onSignerEmbarkation || onSignerDeparture || new Date(),
            status: 'PLANNED'
          }
        })
        console.log(`       ✅ Created planned assignment`)
        replacementsCreated++
      } else {
        console.log(`       ℹ️  Assignment already exists`)
      }
    }
  }
  
  console.log('\n' + '='.repeat(80))
  console.log('📊 IMPORT SUMMARY')
  console.log('='.repeat(80))
  console.log(`✅ Planned assignments created: ${replacementsCreated}`)
  console.log(`♻️  Existing assignments updated: ${replacementsUpdated}`)
}

async function main() {
  try {
    await importCrewReplacementPlan()
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
