import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import * as XLSX from 'xlsx'
import path from 'path'
import fs from 'fs'

// Parse Excel date to JS Date
function parseExcelDate(value: any): Date | null {
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
function dateToExcelSerial(date: Date | null): number | string {
  if (!date) return ''
  const excelEpoch = new Date(1899, 11, 30)
  const days = Math.floor((date.getTime() - excelEpoch.getTime()) / 86400000)
  return days
}

async function generateMonthlyStats(year: number): Promise<{ domestic: number, international: number }[]> {
  const stats: { domestic: number, international: number }[] = []
  
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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
    const semester = parseInt(searchParams.get('semester') || '1')
    
    if (semester !== 1 && semester !== 2) {
      return NextResponse.json({ error: 'Semester must be 1 or 2' }, { status: 400 })
    }
    
    // Determine date range
    const startMonth = semester === 1 ? 0 : 6  // Jan or Jul (0-indexed)
    const endMonth = semester === 1 ? 5 : 11   // Jun or Dec
    const startDate = new Date(year, startMonth, 1)
    const endDate = new Date(year, endMonth + 1, 0, 23, 59, 59)
    
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
    
    // Get monthly stats
    const monthlyStats = await generateMonthlyStats(year)
    
    return NextResponse.json({
      year,
      semester,
      period: {
        start: startDate,
        end: endDate
      },
      assignments: assignments.map(a => ({
        id: a.id,
        crewName: a.crew.fullName,
        crewCode: a.crew.crewCode,
        seamanBook: a.crew.certificates.find(c => c.type === 'SEAMAN BOOK')?.issuer || '',
        rank: a.rank,
        vesselName: a.vessel?.name || a.vesselName,
        flag: a.vessel?.flag || '',
        placement: (a.vessel?.flag === 'INDONESIA' || a.vessel?.flag === 'IDN') ? 'DN' : 'LN',
        signOn: a.signOn,
        signOff: a.signOff,
        status: a.signOff ? 'SIGN OFF' : 'ON BOARD'
      })),
      statistics: {
        totalAssignments: assignments.length,
        monthlyStats
      }
    })
    
  } catch (error) {
    console.error('Error generating semester report:', error)
    return NextResponse.json(
      { error: 'Failed to generate semester report' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { year, semester } = body
    
    if (!year || (semester !== 1 && semester !== 2)) {
      return NextResponse.json(
        { error: 'Year and semester (1 or 2) are required' },
        { status: 400 }
      )
    }
    
    // Determine date range
    const startMonth = semester === 1 ? 0 : 6
    const endMonth = semester === 1 ? 5 : 11
    const startDate = new Date(year, startMonth, 1)
    const endDate = new Date(year, endMonth + 1, 0, 23, 59, 59)
    
    // Get all assignments
    const assignments = await prisma.assignment.findMany({
      where: {
        OR: [
          {
            signOn: {
              gte: startDate,
              lte: endDate
            }
          },
          {
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
    
    // Create workbook
    const wb = XLSX.utils.book_new()
    
    // Prepare data rows
    const rows: any[] = []
    
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
      
      const seamanBook = crew.certificates.find(c => c.type === 'SEAMAN BOOK')
      const seamanBookNo = seamanBook ? (seamanBook.issuer || '') : ''
      
      const isDomestic = vessel?.flag === 'INDONESIA' || vessel?.flag === 'IDN'
      const placementDN = isDomestic ? 'V' : ''
      const placementLN = isDomestic ? '' : 'V'
      
      let status = 'ON BOARD'
      if (assignment.signOff) {
        if (assignment.signOff <= endDate) {
          status = 'SIGN OFF'
        }
      }
      
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
    
    XLSX.utils.book_append_sheet(wb, ws, `Semester ${semester}`)
    
    // Generate monthly statistics
    const monthlyStats = await generateMonthlyStats(year)
    const statsRows: any[] = []
    
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
    
    // Generate buffer
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="LAPORAN_SEMESTER_${semester}_${year}.xlsx"`
      }
    })
    
  } catch (error) {
    console.error('Error generating semester report:', error)
    return NextResponse.json(
      { error: 'Failed to generate semester report' },
      { status: 500 }
    )
  }
}
