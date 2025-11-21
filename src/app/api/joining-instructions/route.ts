import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/joining-instructions?crewId=123
export async function GET(req: NextRequest) {
  try {
    const crewId = req.nextUrl.searchParams.get('crewId')
    if (crewId) {
      const ji = await prisma.joiningInstruction.findFirst({
        where: { crewId: Number(crewId) },
        orderBy: { issuedAt: 'desc' },
      })
      return NextResponse.json(ji || {})
    }

    const list = await prisma.joiningInstruction.findMany({ orderBy: { issuedAt: 'desc' } })
    return NextResponse.json(list)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch joining instruction' }, { status: 500 })
  }
}

// POST /api/joining-instructions
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { crewId, applicationId, instructionText, travelDetails, issuedBy } = body || {}
    if (!crewId && !applicationId) {
      return NextResponse.json({ error: 'crewId or applicationId is required' }, { status: 400 })
    }

    const ji = await prisma.joiningInstruction.create({
      data: {
        crewId: crewId ? Number(crewId) : null,
        applicationId: applicationId ? Number(applicationId) : null,
        instructionText: instructionText || 'Prepare joining as instructed.',
        travelDetails: travelDetails || null,
        issuedBy: issuedBy || 'System',
      },
    })
    return NextResponse.json(ji, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create joining instruction' }, { status: 500 })
  }
}

// PUT /api/joining-instructions
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, instructionText, travelDetails, issuedBy } = body || {}
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

    const ji = await prisma.joiningInstruction.update({
      where: { id: Number(id) },
      data: {
        instructionText: instructionText ?? undefined,
        travelDetails: travelDetails ?? undefined,
        issuedBy: issuedBy ?? undefined,
      },
    })
    return NextResponse.json(ji)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update joining instruction' }, { status: 500 })
  }
}
