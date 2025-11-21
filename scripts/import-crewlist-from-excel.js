/*
  Import crew list from docs/CREW LIST .xlsx (per-vessel sheets)
  - Parse each vessel sheet (ALFA BALTICA, ALFA ALANDIA, etc.)
  - Extract crew name, rank, onboard date
  - Create/update Assignment with status ONBOARD
  - Update crew.crewStatus to ONBOARD
  - Update crew.vessel to vessel name
  
  Usage: node scripts/import-crewlist-from-excel.js
*/
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const XLSX = require('xlsx')

const prisma = new PrismaClient()

// Vessel sheets to process (exclude VESSEL LIST)
const VESSEL_SHEETS = [
  'ALFA BALTICA',
  'ALFA ALANDIA',
  'LANCING',
  'DK ITONIA',
  'DK IMAN',
  'DK ILIOS',
  'DK IWAY',
  'SUN FORTUNE',
]

function parseDate(val) {
  if (!val) return null
  if (val instanceof Date) return val
  if (typeof val === 'number') {
    // Excel date serial
    const date = XLSX.SSF.parse_date_code(val)
    if (date) return new Date(date.y, date.m - 1, date.d)
  }
  if (typeof val === 'string') {
    const parsed = new Date(val)
    if (!isNaN(parsed.getTime())) return parsed
  }
  return null
}

async function main() {
  const filePath = path.resolve(__dirname, '..', 'docs', 'CREW LIST .xlsx')
  console.log('📄 Reading:', filePath)
  const wb = XLSX.readFile(filePath)

  let totalProcessed = 0

  for (const sheetName of VESSEL_SHEETS) {
    if (!wb.Sheets[sheetName]) {
      console.log(`⚠️  Sheet "${sheetName}" not found, skipping...`)
      continue
    }

    console.log(`\n📋 Processing sheet: ${sheetName}`)
    const sheet = wb.Sheets[sheetName]
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })

    // Find header row (contains RANK, NAME(ENG), ONBOARD, etc.)
    const headerIndex = rows.findIndex((r) =>
      Array.isArray(r) && (r.includes('RANK') || r.includes('NAME(ENG)'))
    )
    if (headerIndex === -1) {
      console.log(`   ⚠️  Header row not found, skipping...`)
      continue
    }

    const header = rows[headerIndex]
    const rankIdx = header.findIndex((h) => h && h.toString().toUpperCase().includes('RANK'))
    const nameIdx = header.findIndex((h) => h && h.toString().toUpperCase().includes('NAME(ENG)'))
    const onboardIdx = header.findIndex((h) => h && h.toString().toUpperCase().includes('ONBOARD'))
    const natLicIdx = header.findIndex((h) => h && h.toString().toUpperCase().includes('NAT.LIC'))
    const gocIdx = header.findIndex((h) => h && h.toString().toUpperCase().includes('GOC') || h && h.toString().toUpperCase().includes('ROC'))
    const passportIdx = header.findIndex((h) => h && h.toString().toUpperCase().includes('PASSPORT'))

    if (rankIdx === -1 || nameIdx === -1) {
      console.log(`   ⚠️  RANK or NAME(ENG) column not found, skipping...`)
      continue
    }

    // Normalize vessel name (trim "MT" prefix if exists)
    let vesselName = sheetName.trim()
    // Try to match with existing vessels
    const vesselMatch = await prisma.vessel.findFirst({
      where: {
        OR: [
          { name: vesselName },
          { name: { contains: vesselName } },
          { name: { startsWith: 'MT ' + vesselName } },
          { name: { startsWith: 'MT. ' + vesselName } },
        ],
      },
    })
    if (vesselMatch) vesselName = vesselMatch.name

    let count = 0
    for (let i = headerIndex + 1; i < rows.length; i++) {
      const r = rows[i]
      if (!r || r.length === 0) continue

      const rank = (r[rankIdx] || '').toString().trim()
      const name = (r[nameIdx] || '').toString().trim()
      const onboardRaw = r[onboardIdx]
      const natLic = (r[natLicIdx] || '').toString().trim()
      const goc = (r[gocIdx] || '').toString().trim()
      const passport = (r[passportIdx] || '').toString().trim()

      if (!rank || !name || rank === 'RANK' || name === 'NAME(ENG)') continue

      // Extract crew code (10 digits) from NAT.LIC
      let crewCode = null
      if (natLic && natLic.length >= 10) {
        const match = natLic.match(/\d{10}/)
        if (match) crewCode = match[0]
      }

      // Find or create crew
      let crew = await prisma.crew.findFirst({
        where: { fullName: { equals: name, mode: 'insensitive' } },
      })

      if (!crew) {
        crew = await prisma.crew.create({
          data: {
            fullName: name,
            rank: rank,
            vessel: vesselName,
            crewStatus: 'ONBOARD',
            crewCode: crewCode,
          },
        })
        console.log(`   ✅ Created crew: ${name} (${rank}) - Code: ${crewCode || 'N/A'}`)
      } else {
        // Update crew status and vessel
        await prisma.crew.update({
          where: { id: crew.id },
          data: {
            rank: rank,
            vessel: vesselName,
            crewStatus: 'ONBOARD',
            crewCode: crewCode || crew.crewCode, // Keep existing if new one is null
          },
        })
      }

      // Create or update Assignment
      const signOn = parseDate(onboardRaw)
      const existing = await prisma.assignment.findFirst({
        where: {
          crewId: crew.id,
          vesselName: vesselName,
          status: { in: ['ACTIVE', 'ONBOARD'] },
        },
      })

      if (existing) {
        await prisma.assignment.update({
          where: { id: existing.id },
          data: {
            rank: rank,
            status: 'ONBOARD',
            signOn: signOn || existing.signOn,
          },
        })
      } else {
        await prisma.assignment.create({
          data: {
            crewId: crew.id,
            vesselName: vesselName,
            rank: rank,
            status: 'ONBOARD',
            signOn: signOn || new Date(),
          },
        })
      }

      // Import certificates (NAT.LIC, GOC, Passport)
      if (natLic && natLic.length > 5) {
        await prisma.certificate.upsert({
          where: {
            crewId_type: { crewId: crew.id, type: 'NAT.LIC/STCW' },
          },
          update: {
            issuer: natLic,
          },
          create: {
            crewId: crew.id,
            type: 'NAT.LIC/STCW',
            issuer: natLic,
          },
        })
      }

      if (goc && goc.length > 5) {
        await prisma.certificate.upsert({
          where: {
            crewId_type: { crewId: crew.id, type: 'GOC/ROC' },
          },
          update: {
            issuer: goc,
          },
          create: {
            crewId: crew.id,
            type: 'GOC/ROC',
            issuer: goc,
          },
        })
      }

      if (passport && passport.length > 5) {
        await prisma.certificate.upsert({
          where: {
            crewId_type: { crewId: crew.id, type: 'PASSPORT' },
          },
          update: {
            issuer: passport,
          },
          create: {
            crewId: crew.id,
            type: 'PASSPORT',
            issuer: passport,
          },
        })
      }

      count++
    }

    console.log(`   ✔ Processed ${count} crew members for ${vesselName}`)
    totalProcessed += count
  }

  console.log(`\n✅ Total crew processed: ${totalProcessed}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
