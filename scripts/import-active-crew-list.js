const { PrismaClient } = require('@prisma/client')
const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')

const prisma = new PrismaClient()

const CREW_LIST_FOLDER = 'D:\\HANMARINE GLOBAL INDONESIA\\CREW LIST & CREW REPLACEMENT\\CREW LIST & CREW LIST CRP 2024\\CREW LIST'

// Parse Excel date (serial or string)
function parseExcelDate(value) {
  if (!value) return null
  
  // Excel serial number
  if (!isNaN(value) && Number(value) > 1000) {
    const excelEpoch = new Date(1899, 11, 30)
    const date = new Date(excelEpoch.getTime() + Number(value) * 86400000)
    if (!isNaN(date.getTime())) return date
  }
  
  // String date
  const dateStr = String(value)
  const formats = [
    /(\d{4})-(\d{2})-(\d{2})/, // YYYY-MM-DD
    /(\d{2})\/(\d{2})\/(\d{4})/, // DD/MM/YYYY
    /(\d{2})-(\d{2})-(\d{4})/, // DD-MM-YYYY
  ]
  
  for (const format of formats) {
    const match = dateStr.match(format)
    if (match) {
      if (match[1].length === 4) {
        const date = new Date(`${match[1]}-${match[2]}-${match[3]}`)
        if (!isNaN(date.getTime())) return date
      } else {
        const date = new Date(`${match[3]}-${match[2]}-${match[1]}`)
        if (!isNaN(date.getTime())) return date
      }
    }
  }
  
  return null
}

async function importActiveCrewList() {
  try {
    // Get latest crew list file
    const files = fs.readdirSync(CREW_LIST_FOLDER)
      .filter(f => !f.startsWith('~') && f.toLowerCase().includes('crew list') && (f.endsWith('.xls') || f.endsWith('.xlsx')))
      .sort()
      .reverse()
    
    if (files.length === 0) {
      console.log('❌ No crew list files found')
      return
    }
    
    const latestFile = path.join(CREW_LIST_FOLDER, files[0])
    console.log('📋 Reading Active Crew List:', files[0])
    
    const workbook = XLSX.readFile(latestFile)
    
    let totalImported = 0
    let totalUpdated = 0
    let totalAssignments = 0
    
    // Process each sheet (each sheet = 1 vessel)
    for (const sheetName of workbook.SheetNames) {
      console.log(`\n🚢 Processing vessel: ${sheetName}`)
      
      const sheet = workbook.Sheets[sheetName]
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })
      
      if (data.length < 5) {
        console.log('  ⏭️  Skip: Not enough data')
        continue
      }
      
      // Extract vessel info from header
      const vesselName = String(data[0][2] || sheetName).replace('MT ', '').replace('MV ', '').trim()
      const flag = String(data[1][3] || '').trim()
      const grt = parseFloat(String(data[1][5] || '0'))
      const inmarsatNo = String(data[1][9] || '').trim()
      
      console.log(`  Vessel: ${vesselName}, Flag: ${flag}, GRT: ${grt}`)
      
      // Find or create vessel
      let vessel = await prisma.vessel.findFirst({
        where: {
          name: {
            equals: vesselName,
            mode: 'insensitive'
          }
        }
      })
      
      if (!vessel) {
        vessel = await prisma.vessel.create({
          data: {
            name: vesselName,
            flag: flag || 'UNKNOWN',
            grt: grt > 0 ? grt : null,
            inmarsatNo: inmarsatNo || null,
            ownerId: 1 // Default owner
          }
        })
        console.log(`  ✅ Created vessel: ${vesselName}`)
      }
      
      // Parse crew data (starting from row 5, every 2 rows = 1 crew)
      for (let i = 4; i < data.length; i += 2) {
        const mainRow = data[i]
        const expiryRow = data[i + 1] || []
        
        const no = String(mainRow[0] || '').trim()
        if (!no || isNaN(parseInt(no))) continue // Skip if not a number
        
        const rank = String(mainRow[1] || '').trim()
        const fullName = String(mainRow[2] || '').trim()
        const dob = parseExcelDate(mainRow[5])
        const sbookNo = String(mainRow[6] || '').trim()
        const onboardDate = parseExcelDate(mainRow[7])
        const natLic = String(mainRow[8] || '').trim()
        const gocRoc = String(mainRow[9] || '').trim()
        
        if (!fullName) continue
        
        console.log(`    ${no}. ${rank} - ${fullName}`)
        
        // Extract crew code from NAT.LIC
        let crewCode = null
        if (natLic && natLic.length >= 10) {
          const match = natLic.match(/\d{10}/)
          if (match) crewCode = match[0]
        }
        
        // Find or create crew
        let crew = await prisma.crew.findFirst({
          where: {
            fullName: {
              equals: fullName,
              mode: 'insensitive'
            }
          }
        })
        
        if (crew) {
          // Update crew - only update crewCode if not already set and not duplicate
          const updateData = {
            rank: rank || crew.rank,
            dateOfBirth: dob || crew.dateOfBirth,
            crewStatus: 'ONBOARD', // Active crew = onboard
            vessel: vesselName
          }
          
          // Only update crewCode if crew doesn't have one yet and code is not used by others
          if (!crew.crewCode && crewCode) {
            const codeExists = await prisma.crew.findUnique({
              where: { crewCode: crewCode }
            })
            if (!codeExists) {
              updateData.crewCode = crewCode
            }
          }
          
          await prisma.crew.update({
            where: { id: crew.id },
            data: updateData
          })
          totalUpdated++
        } else {
          // Create new crew
          crew = await prisma.crew.create({
            data: {
              fullName,
              rank,
              crewCode,
              dateOfBirth: dob,
              crewStatus: 'ONBOARD'
            }
          })
          totalImported++
        }
        
        // Create or update assignment
        const existingAssignment = await prisma.assignment.findFirst({
          where: {
            crewId: crew.id,
            vesselName: vesselName,
            status: 'ONBOARD'
          }
        })
        
        if (!existingAssignment) {
          await prisma.assignment.create({
            data: {
              crewId: crew.id,
              vesselName: vesselName,
              rank: rank,
              signOn: onboardDate || new Date(),
              status: 'ONBOARD'
            }
          })
          totalAssignments++
          console.log(`      ✅ Assigned to ${vesselName}`)
        }
        
        // Create certificates if available
        if (natLic) {
          const natLicExpiry = parseExcelDate(expiryRow[8])
          await prisma.certificate.upsert({
            where: {
              crewId_type: {
                crewId: crew.id,
                type: 'NAT.LIC/STCW'
              }
            },
            update: {
              expiryDate: natLicExpiry
            },
            create: {
              crewId: crew.id,
              type: 'NAT.LIC/STCW',
              expiryDate: natLicExpiry
            }
          })
        }
        
        if (gocRoc) {
          const gocRocExpiry = parseExcelDate(expiryRow[9])
          await prisma.certificate.upsert({
            where: {
              crewId_type: {
                crewId: crew.id,
                type: 'GOC/ROC'
              }
            },
            update: {
              expiryDate: gocRocExpiry
            },
            create: {
              crewId: crew.id,
              type: 'GOC/ROC',
              expiryDate: gocRocExpiry
            }
          })
        }
        
        if (sbookNo) {
          const sbookExpiry = parseExcelDate(expiryRow[6])
          await prisma.certificate.upsert({
            where: {
              crewId_type: {
                crewId: crew.id,
                type: 'SEAMAN_BOOK'
              }
            },
            update: {
              expiryDate: sbookExpiry
            },
            create: {
              crewId: crew.id,
              type: 'SEAMAN_BOOK',
              expiryDate: sbookExpiry,
              remarks: sbookNo
            }
          })
        }
      }
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('📊 IMPORT SUMMARY')
    console.log('='.repeat(60))
    console.log(`✅ New crew imported: ${totalImported}`)
    console.log(`♻️  Crew updated: ${totalUpdated}`)
    console.log(`🚢 Assignments created: ${totalAssignments}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

importActiveCrewList()
