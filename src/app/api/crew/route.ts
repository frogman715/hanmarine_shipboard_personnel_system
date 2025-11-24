import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const crew = await prisma.crew.findMany({
      include: {
        certificates: {
          select: {
            id: true,
            type: true,
            expiryDate: true,
          },
        },
        assignments: {
          select: {
            id: true,
            status: true,
            signOn: true,
            signOff: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    
    // Map to match dashboard interface
    const mappedCrew = crew.map((c) => ({
      id: c.id.toString(),
      name: c.fullName,
      fullName: c.fullName, // Add fullName for applications page
      rank: c.rank || '',
      vessel: c.vessel || '',
      status: c.crewStatus, // Map crewStatus to status
      crewStatus: c.crewStatus, // Also include crewStatus for filtering
      certificates: c.certificates.map((cert) => ({
        id: cert.id.toString(),
        type: cert.type,
        expiryDate: cert.expiryDate?.toISOString() || '',
      })),
      assignments: c.assignments.map((a) => ({
        id: a.id.toString(),
        status: a.status,
        startDate: a.signOn?.toISOString() || '',
        endDate: a.signOff?.toISOString() || '',
      })),
    }))
    
    return NextResponse.json(mappedCrew)
  } catch (error) {
    console.error('Error fetching crew:', error)
    return NextResponse.json(
      { error: 'Failed to fetch crew data' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { fullName, rank, vessel, status } = body

    if (!fullName || !rank) {
      return NextResponse.json(
        { error: 'Full name and rank are required fields' },
        { status: 400 },
      )
    }

    const created = await prisma.crew.create({
      data: {
        fullName,
        rank,
        vessel: vessel || null,
        status: status || 'AVAILABLE',
      },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'An error occurred while saving crew data' },
      { status: 500 },
    )
  }
}
