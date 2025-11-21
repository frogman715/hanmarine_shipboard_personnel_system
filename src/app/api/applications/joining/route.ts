import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/applications/joining?applicationId=123
export async function GET(req: NextRequest) {
  try {
    const applicationId = req.nextUrl.searchParams.get('applicationId')
    if (!applicationId) return NextResponse.json({ error: 'applicationId is required' }, { status: 400 })

    const checklist = await prisma.documentChecklist.findFirst({
      where: { applicationId: Number(applicationId) },
    })
    return NextResponse.json(checklist || {})
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch checklist' }, { status: 500 })
  }
}

// PUT /api/applications/joining
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { applicationId, medicalOk, trainingCertsOk, remarks, procedure } = body || {}
    if (!applicationId) return NextResponse.json({ error: 'applicationId is required' }, { status: 400 })

    // Ensure checklist exists (prepare-joining normally creates it)
    let checklist = await prisma.documentChecklist.findFirst({ where: { applicationId: Number(applicationId) } })
    if (!checklist) {
      const app = await prisma.employmentApplication.findUnique({ where: { id: Number(applicationId) } })
      if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })
      checklist = await prisma.documentChecklist.create({ data: { applicationId: app.id, crewId: app.crewId } })
    }

    const updated = await prisma.documentChecklist.update({
      where: { id: checklist.id },
      data: {
        medicalOk: typeof medicalOk === 'boolean' ? medicalOk : undefined,
        trainingCertsOk: typeof trainingCertsOk === 'boolean' ? trainingCertsOk : undefined,
        remarks: typeof remarks === 'string' ? remarks : undefined,
        procedure: typeof procedure === 'object' && procedure !== null ? procedure : undefined,
      },
    })
    return NextResponse.json(updated)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update checklist' }, { status: 500 })
  }
}
