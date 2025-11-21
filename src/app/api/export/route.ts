import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import XLSX from 'xlsx'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || 'vessels' // vessels | crew

  try {
    if (type === 'vessels') {
      // Export vessel list
      // @ts-expect-error Prisma include types issue
      const vessels = await prisma.vessel.findMany({
        include: {
          ownerRel: { select: { name: true } },
          _count: { select: { assignments: true } },
        },
        orderBy: { name: 'asc' },
      })

      const data = vessels.map((v: any) => ({
        'Vessel Name': v.name,
        'Flag': v.flag,
        'Type': v.vesselType || '-',
        'Owner': v.ownerRel?.name || v.owner || '-',
        'GRT': v.grt || '-',
        'DWT': v.dwt || '-',
        'HP': v.hp || '-',
        'IMO': v.imo || '-',
        'Call Sign': v.callSign || '-',
        'INMARSAT': v.inmarsatNo || '-',
        'Crew Onboard': v._count.assignments || 0,
      }))

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(wb, ws, 'Vessel List')

      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="vessel-list-${new Date().toISOString().split('T')[0]}.xlsx"`,
        },
      })
    } else if (type === 'crew') {
      // Export crew list
      const crew = await prisma.crew.findMany({
        include: {
          assignments: {
            where: { status: { in: ['ONBOARD', 'ACTIVE'] } },
            orderBy: { signOn: 'desc' },
            take: 1,
          },
          certificates: {
            orderBy: { type: 'asc' },
          },
        },
        orderBy: { fullName: 'asc' },
      })

      const data = crew.map((c: any) => {
        const currentAssignment = c.assignments[0]
        const passport = c.certificates.find((cert: any) => cert.type === 'PASSPORT')
        const natLic = c.certificates.find((cert: any) => cert.type === 'NAT.LIC/STCW')
        const goc = c.certificates.find((cert: any) => cert.type === 'GOC/ROC')

        return {
          'Crew Code': c.crewCode || '-',
          'Full Name': c.fullName,
          'Rank': c.rank || '-',
          'Status': c.crewStatus,
          'Vessel': currentAssignment?.vesselName || c.vessel || '-',
          'Sign On': currentAssignment?.signOn ? new Date(currentAssignment.signOn).toISOString().split('T')[0] : '-',
          'Passport': passport?.issuer || '-',
          'NAT.LIC': natLic?.issuer || '-',
          'GOC/ROC': goc?.issuer || '-',
          'Phone': c.phoneMobile || c.phoneHome || '-',
        }
      })

      const wb = XLSX.utils.book_new()
      const ws = XLSX.utils.json_to_sheet(data)
      XLSX.utils.book_append_sheet(wb, ws, 'Crew List')

      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="crew-list-${new Date().toISOString().split('T')[0]}.xlsx"`,
        },
      })
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Export failed' }, { status: 500 })
  }
}
