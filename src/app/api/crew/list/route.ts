import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const crew = await prisma.crew.findMany({
      select: {
        id: true,
        crewCode: true,
        fullName: true,
        rank: true,
        vessel: true,
        status: true,
        crewStatus: true,
        reportedToOffice: true,
        reportedToOfficeDate: true,
        inactiveReason: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    
    return NextResponse.json(crew)
  } catch (error) {
    console.error('Error fetching crew list:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crew list' },
      { status: 500 }
    )
  }
}
