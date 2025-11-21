import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// PATCH /api/assignments/[id]/extend
// Extend contract expiry date for crew
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assignmentId = parseInt(params.id)
    if (isNaN(assignmentId)) {
      return NextResponse.json({ error: 'Invalid assignment ID' }, { status: 400 })
    }

    const body = await req.json()
    const { newSignOffDate } = body

    if (!newSignOffDate) {
      return NextResponse.json(
        { error: 'New sign off date is required' },
        { status: 400 }
      )
    }

    const parsedSignOff = new Date(newSignOffDate)
    if (isNaN(parsedSignOff.getTime())) {
      return NextResponse.json(
        { error: 'Invalid date format' },
        { status: 400 }
      )
    }

    // Get current assignment
    const assignment = await prisma.assignment.findUnique({
      where: { id: assignmentId },
      include: {
        crew: {
          select: { id: true, fullName: true, rank: true },
        },
      },
    })

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 })
    }

    // Calculate new sign off date (extend from current signOff or from signOn + extension)
    const currentSignOff = assignment.signOff ? new Date(assignment.signOff) : null
    const signOn = assignment.signOn ? new Date(assignment.signOn) : new Date()
    
    // Use the provided new sign off date
    const newSignOff = parsedSignOff

    // Validate that new sign off is after sign on
    if (newSignOff <= signOn) {
      return NextResponse.json(
        { error: 'New sign off date must be after sign on date' },
        { status: 400 }
      )
    }

    // Update assignment with new signOff date
    const updated = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        signOff: newSignOff,
      },
      include: {
        crew: {
          select: { id: true, fullName: true, rank: true },
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: `Contract extended to ${newSignOff.toLocaleDateString()}`,
      assignment: {
        id: updated.id,
        crewName: updated.crew.fullName,
        rank: updated.crew.rank || updated.rank,
        vesselName: updated.vesselName,
        signOn: updated.signOn,
        signOff: updated.signOff,
      },
    })
  } catch (error) {
    console.error('Error extending contract:', error)
    return NextResponse.json(
      { error: 'Failed to extend contract' },
      { status: 500 }
    )
  }
}
