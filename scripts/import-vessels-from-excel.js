/*
  Import vessels from docs/CREW LIST .xlsx (sheet: VESSEL LIST + per-vessel sheets for specs)
  Usage: node scripts/import-vessels-from-excel.js
*/
const path = require('path')
const { PrismaClient } = require('@prisma/client')
const XLSX = require('xlsx')

const prisma = new PrismaClient()

// Extract specs from vessel sheet headers (row 0-2)
function extractVesselSpecs(sheet, vesselName) {
  const specs = {}
  const range = XLSX.utils.decode_range(sheet['!ref'])
  
  // Get vessel name from A1
  const nameCell = sheet['A1']
  if (nameCell && nameCell.v) {
    const match = nameCell.v.toString().match(/NAME OF VESSEL\s*:\s*(.+)/i)
    if (match) specs.displayName = match[1].trim()
  }
  
  // Row 1 (index 1) contains: Flag, IMO, Call Sign, H.P., INMARSAT
  // A2 = "Flag           : BAHAMAS"
  const flagCell = sheet['A2']
  if (flagCell && flagCell.v) {
    const match = flagCell.v.toString().match(/Flag\s*:\s*(.+)/i)
    if (match) specs.flag = match[1].trim()
  }
  
  // H2 = H.P. value (e.g., "10830 KW")
  const hpCell = sheet['H2']
  if (hpCell && hpCell.v) {
    const val = hpCell.v.toString().replace(/\s*KW/i, '').replace(/,/g, '')
    const parsed = parseFloat(val)
    if (!isNaN(parsed)) specs.hp = parsed
  }
  
  // I2 = INMARSAT NO (might be in J2 or K2 depending on layout)
  const inmarsatCell = sheet['J2'] || sheet['K2']
  if (inmarsatCell && inmarsatCell.v) {
    specs.inmarsatNo = inmarsatCell.v.toString().trim()
  }
  
  // Try to find IMO (usually near flag or call sign)
  // Could be in row 1 columns D-F
  for (let C = 3; C <= 6; C++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 1, c: C })
    const cell = sheet[cellAddress]
    if (cell && cell.v) {
      const text = cell.v.toString().toUpperCase()
      if (text.includes('IMO')) {
        const nextCell = sheet[XLSX.utils.encode_cell({ r: 1, c: C + 1 })]
        if (nextCell) specs.imo = nextCell.v.toString().trim()
      }
      if (text.includes('CALL SIGN')) {
        const nextCell = sheet[XLSX.utils.encode_cell({ r: 1, c: C + 1 })]
        if (nextCell) specs.callSign = nextCell.v.toString().trim()
      }
    }
  }
  
  // Parse vessel type from name (CRUDE OIL, CONTAINER, etc.)
  if (vesselName.toUpperCase().includes('ALFA') || vesselName.toUpperCase().includes('LANCING')) {
    specs.vesselType = 'CRUDE OIL'
  } else if (vesselName.toUpperCase().includes('DK ')) {
    specs.vesselType = 'CONTAINER'
  }
  
  return specs
}

async function main() {
  const filePath = path.resolve(__dirname, '..', 'docs', 'CREW LIST .xlsx')
  console.log('📄 Reading:', filePath)
  const wb = XLSX.readFile(filePath)
  const sheet = wb.Sheets['VESSEL LIST']
  if (!sheet) {
    console.error('Sheet "VESSEL LIST" not found')
    process.exit(1)
  }

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 })
  // Find header row (contains VESSEL NAME and OWNER)
  const headerIndex = rows.findIndex((r) => Array.isArray(r) && r.includes('VESSEL NAME'))
  if (headerIndex === -1) {
    console.error('Header row with "VESSEL NAME" not found')
    process.exit(1)
  }

  let count = 0
  for (let i = headerIndex + 1; i < rows.length; i++) {
    const r = rows[i]
    if (!r || r.length === 0) continue
    const name = (r[2] || '').toString().trim()
    const ownerStr = (r[3] || '').toString().trim()
    const numberOfCrew = r[4]
    if (!name || name.toUpperCase() === 'TOTAL CREW') continue

    // Find or create owner
    let ownerId = null
    if (ownerStr) {
      let owner = await prisma.owner.findFirst({
        where: { name: { equals: ownerStr, mode: 'insensitive' } },
      })
      if (!owner) {
        owner = await prisma.owner.create({ data: { name: ownerStr } })
        console.log(`   🏢 Created owner: ${ownerStr}`)
      }
      ownerId = owner.id
    }

    // Try to find per-vessel sheet for detailed specs
    const vesselSheetName = name.replace(/^MT\.?\s*/i, '').trim()
    let specs = {}
    let flag = 'UNKNOWN'
    
    if (wb.Sheets[vesselSheetName]) {
      specs = extractVesselSpecs(wb.Sheets[vesselSheetName], name)
      if (specs.flag) flag = specs.flag
      console.log(`   📊 Extracted specs from "${vesselSheetName}":`, specs)
    }

    await prisma.vessel.upsert({
      where: { name },
      update: { 
        flag: flag,
        owner: ownerStr, 
        ownerId,
        grt: specs.grt,
        dwt: specs.dwt,
        hp: specs.hp,
        imo: specs.imo,
        callSign: specs.callSign,
        inmarsatNo: specs.inmarsatNo,
        vesselType: specs.vesselType,
      },
      create: { 
        name, 
        flag: flag, 
        owner: ownerStr, 
        ownerId,
        grt: specs.grt,
        dwt: specs.dwt,
        hp: specs.hp,
        imo: specs.imo,
        callSign: specs.callSign,
        inmarsatNo: specs.inmarsatNo,
        vesselType: specs.vesselType,
      },
    })
    count++
    console.log(`✅ Upserted vessel: ${name} (${ownerStr || 'Owner N/A'})`)
  }

  console.log(`\n✔ Imported ${count} vessels.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
