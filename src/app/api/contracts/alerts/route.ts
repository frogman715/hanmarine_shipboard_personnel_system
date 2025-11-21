import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

function monthsBetween(from: Date, to: Date) {
  const diffMs = to.getTime() - from.getTime()
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  return Math.floor(days / 30)
}

export async function GET() {
  try {
    const now = new Date()

    // Get assignments with vessel owner info
    const assignments = await prisma.assignment.findMany({
      where: {
        status: 'ONBOARD',
        signOn: { not: null },
        crew: {
          crewStatus: 'ONBOARD' // Only crew from latest Excel (77 crew)
        }
      },
      include: { 
        crew: true,
        vessel: {
          select: {
            owner: true
          }
        }
      },
      orderBy: { signOn: 'asc' },
    })

    const alerts = assignments
      .filter((a) => a.signOn)
      .map((a) => {
        const signOn = a.signOn as Date
        const months = monthsBetween(signOn, now)
        
        // Contract duration by owner
        const owner = a.vessel?.owner || ''
        let contractMonths = 7 // default
        
        if (owner.includes('LUNDQVIST REDERIERNA')) {
          contractMonths = 9 // ALFA BALTICA, ALFA ALANDIA, LANCING
        } else if (owner.includes('INTERGIS CO')) {
          contractMonths = 8 // DK ITONIA, DK IMAN, DK ILIOS, DK IWAY
        }
        
        // Show warning when approaching contract end
        // Critical: >= contract months
        // Warning: >= contract months - 1
        const severity = months >= contractMonths ? 'critical' : 'warning'
        
        return {
          assignmentId: a.id,
          crewId: a.crewId,
          fullName: a.crew.fullName,
          rank: a.rank,
          vesselName: a.vesselName,
          signOn: signOn.toISOString(),
          monthsOnboard: months,
          contractMonths,
          owner: owner || 'Unknown',
          severity,
        }
      })
      .filter((x) => x.monthsOnboard >= x.contractMonths - 1) // Show 1 month before contract end

    return NextResponse.json({ count: alerts.length, alerts })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to compute contract alerts' }, { status: 500 })
  }
}
