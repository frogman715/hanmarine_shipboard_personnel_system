import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { applicationId } = body || {}
    if (!applicationId) {
      return NextResponse.json({ error: 'applicationId is required' }, { status: 400 })
    }

    const app = await prisma.employmentApplication.findUnique({
      where: { id: Number(applicationId) },
      include: { crew: true },
    })
    if (!app) return NextResponse.json({ error: 'Application not found' }, { status: 404 })

    // Ensure a checklist exists for this application
    let checklist = await prisma.documentChecklist.findFirst({
      where: { applicationId: app.id, crewId: app.crewId },
    })
    if (!checklist) {
      checklist = await prisma.documentChecklist.create({
        data: {
          applicationId: app.id,
          crewId: app.crewId,
          medicalOk: false,
          trainingCertsOk: false,
          remarks: 'Auto-created for joining preparation',
        },
      })
    }

    // Create a joining instruction (idempotent by latest existing)
    const instructionText = `Prepare medical check-up and required trainings for joining. Candidate: ${app.crew?.fullName ?? ''}.`
    const ji = await prisma.joiningInstruction.create({
      data: {
        applicationId: app.id,
        crewId: app.crewId,
        instructionText,
        travelDetails: null,
        issuedBy: 'System',
      },
    })

    return NextResponse.json({ checklist, joiningInstruction: ji })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to prepare joining' }, { status: 500 })
  }
}
