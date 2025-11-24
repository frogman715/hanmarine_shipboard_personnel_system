const { PrismaClient } = require('@prisma/client')
const XLSX = require('xlsx')
const path = require('path')
const fs = require('fs')

const prisma = new PrismaClient()

// Parse Excel date to JS Date
function parseExcelDate(value) {
  if (!value) return null
  
  // Excel serial number (days since 1899-12-30)
  if (!isNaN(value) && Number(value) > 1000) {
    const excelEpoch = new Date(1899, 11, 30)
    const date = new Date(excelEpoch.getTime() + Number(value) * 86400000)
    if (!isNaN(date.getTime())) {
      return date
    }
  }
  
  // Try parsing as string
  const parsed = new Date(value)
  if (!isNaN(parsed.getTime())) {
    return parsed
  }
  
  return null
}

// Convert JS Date to Excel serial number
function dateToExcelSerial(date) {
  if (!date) return ''
  const excelEpoch = new Date(1899, 11, 30)
  const days = Math.floor((date.getTime() - excelEpoch.getTime()) / 86400000)
  return days
}

async function generateSemesterReport(year, semester) {
  console.log(`\n📋 GENERATING SEMESTER REPORT: ${year} - Semester ${semester}`)
  console.log('='.repeat(80))
  
  // Determine date range
  const startMonth = semester === 1 ? 0 : 6  // Jan or Jul (0-indexed)
  const endMonth = semester === 1 ? 5 : 11   // Jun or Dec
  const startDate = new Date(year, startMonth, 1)
  const endDate = new Date(year, endMonth + 1, 0, 23, 59, 59)
  
  console.log(`📅 Period: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`)
  
  // Get all assignments within this semester
  const assignments = await prisma.assignment.findMany({
    where: {
      OR: [
        {
          // Assignments that started during this semester
          signOn: {
            gte: startDate,
            lte: endDate
          }
        },
        {
          // Assignments that were active during this semester
          AND: [
            {
              signOn: {
                lte: endDate
              }
            },
            {
              OR: [
                { signOff: null },
                {
                  signOff: {
                    gte: startDate
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    include: {
      crew: {
        include: {
          certificates: {
            where: {
              type: 'SEAMAN BOOK'
            }
          }
        }
      },
      vessel: true
    },
    orderBy: [
      { signOn: 'asc' }
    ]
  })
  
  console.log(`\n✅ Found ${assignments.length} assignments in this period`)
  
  // Create workbook
  const wb = XLSX.utils.book_new()
  
  // Prepare data rows
  const rows = []
  
  // Header rows
  rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
  rows.push(['LAPORAN SEMESTERAN USAHA KEAGENAN AWAK KAPAL', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
  rows.push(['PT. HANMARINE GLOBAL INDONESIA', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
  rows.push(['281.40 TAHUN 2025', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
  rows.push(['', `SEMESTER : ${semester} (${semester === 1 ? 'JAN - JUN' : 'JUL - DEC'})`, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
  rows.push(['', `TAHUN       : ${year}`, '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
  rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
  rows.push(['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''])
  rows.push(['NO', 'NAMA PELAUT', 'KODE PELAUT', 'NOMOR BUKU PELAUT', 'JABATAN DIKAPAL', 'NAMA KAPAL', 'BENDERA KAPAL', 'PENEMPATAN', '', 'SIGN ON', 'SIGN OFF', 'KET', '', '', '', '', '', '', ''])
  rows.push(['', '', '', '', '', '', '', 'DN', 'LN', '', '', '', '', '', '', '', '', '', ''])
  
  // Data rows
  let rowNum = 1
  for (const assignment of assignments) {
    const crew = assignment.crew
    const vessel = assignment.vessel
    
    // Get seaman book number
    const seamanBook = crew.certificates.find(c => c.type === 'SEAMAN BOOK')
    const seamanBookNo = seamanBook ? (seamanBook.issuer || '') : ''
    
    // Determine placement (DN = Dalam Negeri, LN = Luar Negeri)
    const isDomestic = vessel?.flag === 'INDONESIA' || vessel?.flag === 'IDN'
    const placementDN = isDomestic ? 'V' : ''
    const placementLN = isDomestic ? '' : 'V'
    
    // Determine status
    let status = 'ON BOARD'
    if (assignment.signOff) {
      if (assignment.signOff <= endDate) {
        status = 'SIGN OFF'
      }
    }
    
    // Convert dates to Excel serial
    const signOnSerial = assignment.signOn ? dateToExcelSerial(assignment.signOn) : ''
    const signOffSerial = assignment.signOff ? dateToExcelSerial(assignment.signOff) : ''
    
    rows.push([
      rowNum,
      crew.fullName,
      crew.crewCode || '',
      seamanBookNo,
      assignment.rank,
      vessel?.name || assignment.vesselName,
      vessel?.flag || '',
      placementDN,
      placementLN,
      signOnSerial,
      signOffSerial,
      status,
      '', '', '', '', '', '', ''
    ])
    
    rowNum++
  }
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(rows)
  
  // Set column widths
  ws['!cols'] = [
    { wch: 5 },   // NO
    { wch: 30 },  // NAMA PELAUT
    { wch: 15 },  // KODE PELAUT
    { wch: 15 },  // NOMOR BUKU PELAUT
    { wch: 15 },  // JABATAN
    { wch: 20 },  // NAMA KAPAL
    { wch: 12 },  // BENDERA
    { wch: 5 },   // DN
    { wch: 5 },   // LN
    { wch: 12 },  // SIGN ON
    { wch: 12 },  // SIGN OFF
    { wch: 12 }   // KET
  ]
  
  // Add sheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, `Semester ${semester}`)
  
  // Generate monthly statistics
  const monthlyStats = await generateMonthlyStats(year)
  const statsRows = []
  
  statsRows.push(['LAPORAN SEMESTERAN USAHA KEAGENAN AWAK KAPAL', '', '', '', '', '', '', '', ''])
  statsRows.push(['PT. HANMARINE GLOBAL INDONESIA', '', '', '', '', '', '', '', ''])
  statsRows.push(['281.40 TAHUN 2025', '', '', '', '', '', '', '', ''])
  statsRows.push(['Jumlah Pelaut Yang Diberangkatkan', 'Dlm Negeri', 'Luar Negeri', '', '', '', '', '', ''])
  statsRows.push(['', '', '', '', '', '', '', '', ''])
  
  const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
  
  let totalDN = 0
  let totalLN = 0
  
  for (let month = 0; month < 12; month++) {
    const stats = monthlyStats[month] || { domestic: 0, international: 0 }
    statsRows.push([monthNames[month], stats.domestic, stats.international, '', '', '', '', '', ''])
    totalDN += stats.domestic
    totalLN += stats.international
  }
  
  statsRows.push(['Total', totalDN, totalLN, '', '', '', '', '', ''])
  
  const statsWs = XLSX.utils.aoa_to_sheet(statsRows)
  statsWs['!cols'] = [
    { wch: 15 },  // Month
    { wch: 12 },  // DN
    { wch: 12 }   // LN
  ]
  
  XLSX.utils.book_append_sheet(wb, statsWs, 'Laporan Semester')
  
  // Save file
  const outputDir = 'D:\\HANMARINE GLOBAL INDONESIA\\CREW LIST & CREW REPLACEMENT\\LAPORAN SEMESTER_HGI 2025'
  const fileName = `LAPORAN_SEMESTER_${semester}_${year}_GENERATED.xlsx`
  const filePath = path.join(outputDir, fileName)
  
  // Ensure directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }
  
  XLSX.writeFile(wb, filePath)
  
  console.log(`\n✅ Report saved: ${filePath}`)
  console.log(`\n📊 STATISTICS:`)
  console.log(`   Total assignments: ${assignments.length}`)
  console.log(`   Total deployments (${year}): ${totalDN + totalLN}`)
  console.log(`   - Domestic: ${totalDN}`)
  console.log(`   - International: ${totalLN}`)
  
  return { assignments, filePath }
}

async function generateMonthlyStats(year) {
  const stats = []
  
  for (let month = 0; month < 12; month++) {
    const startDate = new Date(year, month, 1)
    const endDate = new Date(year, month + 1, 0, 23, 59, 59)
    
    const assignments = await prisma.assignment.findMany({
      where: {
        signOn: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        vessel: true
      }
    })
    
    let domestic = 0
    let international = 0
    
    for (const assignment of assignments) {
      const isDomestic = assignment.vessel?.flag === 'INDONESIA' || assignment.vessel?.flag === 'IDN'
      if (isDomestic) {
        domestic++
      } else {
        international++
      }
    }
    
    stats[month] = { domestic, international }
  }
  
  return stats
}

// Main execution
async function main() {
  try {
    const year = 2024
    
    // Generate both semesters
    console.log('\n🚀 GENERATING SEMESTER REPORTS FOR ' + year)
    console.log('='.repeat(80))
    
    await generateSemesterReport(year, 1)
    await generateSemesterReport(year, 2)
    
    console.log('\n✅ ALL REPORTS GENERATED SUCCESSFULLY!')
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
