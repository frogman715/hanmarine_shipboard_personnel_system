import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'PLANNED'
    const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
    
    // Get planned assignments for the year
    const startDate = new Date(year, 0, 1)
    const endDate = new Date(year, 11, 31, 23, 59, 59)
    
    const assignments = await prisma.assignment.findMany({
      where: {
        OR: [
          { status: 'PLANNED' },
          { status: 'PLANNED_OFFBOARD' }
        ],
        signOn: {
          gte: startDate,
          lte: endDate
        }
      },
      include: {
        crew: {
          include: {
            certificates: {
              where: {
                type: {
                  in: ['SEAMAN BOOK', 'PASSPORT']
                }
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
    
    // Group by month
    const byMonth = assignments.reduce((acc, assignment) => {
      const month = new Date(assignment.signOn!).getMonth()
      const monthName = new Date(year, month, 1).toLocaleString('default', { month: 'long' })
      
      if (!acc[monthName]) {
        acc[monthName] = []
      }
      
      acc[monthName].push({
        id: assignment.id,
        crewId: assignment.crewId,
        crewName: assignment.crew.fullName,
        rank: assignment.rank,
        vesselName: assignment.vesselName,
        flag: assignment.vessel?.flag || '',
        signOn: assignment.signOn,
        signOff: assignment.signOff,
        status: assignment.status,
        seamanBook: assignment.crew.certificates.find(c => c.type === 'SEAMAN BOOK')?.issuer || '',
        passport: assignment.crew.certificates.find(c => c.type === 'PASSPORT')?.issuer || ''
      })
      
      return acc
    }, {} as Record<string, any[]>)
    
    return NextResponse.json({
      year,
      totalAssignments: assignments.length,
      byMonth
    })
    
  } catch (error) {
    console.error('Error fetching crew replacement plan:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crew replacement plan' },
      { status: 500 }
    )
  }
}
