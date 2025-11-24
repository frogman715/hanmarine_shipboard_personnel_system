import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// Valid status transitions based on role and current status
const STATUS_TRANSITIONS: Record<string, { allowedRoles: string[], nextStatuses: string[] }> = {
  APPLICANT: {
    allowedRoles: ['DIRECTOR', 'CREWING_MANAGER'],
    nextStatuses: ['APPROVED', 'EX_CREW'], // Can reject applicant
  },
  APPROVED: {
    allowedRoles: ['DIRECTOR', 'CREWING_MANAGER', 'DOCUMENTATION_OFFICER'],
    nextStatuses: ['STANDBY', 'EX_CREW'], // After docs complete or rejected
  },
  STANDBY: {
    allowedRoles: ['DIRECTOR', 'CREWING_MANAGER', 'OPERATIONAL_STAFF'],
    nextStatuses: ['ONBOARD', 'VACATION', 'EX_CREW'],
  },
  ONBOARD: {
    allowedRoles: ['DIRECTOR', 'CREWING_MANAGER', 'OPERATIONAL_STAFF'],
    nextStatuses: ['SIGN_OFF', 'EX_CREW'],
  },
  SIGN_OFF: {
    allowedRoles: ['DIRECTOR', 'CREWING_MANAGER', 'OPERATIONAL_STAFF'],
    nextStatuses: ['VACATION', 'EX_CREW'], // After sign off, either vacation or terminated
  },
  VACATION: {
    allowedRoles: ['DIRECTOR', 'CREWING_MANAGER', 'OPERATIONAL_STAFF'],
    nextStatuses: ['STANDBY', 'ONBOARD', 'EX_CREW'], // Can go back to standby or direct onboard
  },
  EX_CREW: {
    allowedRoles: ['DIRECTOR', 'CREWING_MANAGER'],
    nextStatuses: ['BLACKLISTED', 'STANDBY'], // Can rehire or blacklist
  },
  BLACKLISTED: {
    allowedRoles: ['DIRECTOR'],
    nextStatuses: ['EX_CREW'], // Only director can remove from blacklist
  },
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const crewId = parseInt(params.id)
    if (isNaN(crewId)) {
      return NextResponse.json({ error: 'Invalid crew ID' }, { status: 400 })
    }

    const body = await req.json()
    const { newStatus, reason, notes } = body

    if (!newStatus) {
      return NextResponse.json({ error: 'New status is required' }, { status: 400 })
    }

    // Get current crew
    const crew = await prisma.crew.findUnique({
      where: { id: crewId },
      select: {
        id: true,
        fullName: true,
        crewStatus: true,
        rank: true,
      },
    })

    if (!crew) {
      return NextResponse.json({ error: 'Crew not found' }, { status: 404 })
    }

    const currentStatus = crew.crewStatus
    const transition = STATUS_TRANSITIONS[currentStatus]

    // Check if transition is allowed for current status
    if (!transition) {
      return NextResponse.json(
        { error: `No transitions defined for status: ${currentStatus}` },
        { status: 400 }
      )
    }

    // Check if user has permission for this transition
    if (!transition.allowedRoles.includes(user.role) && user.role !== 'DIRECTOR') {
      return NextResponse.json(
        { error: `Role ${user.role} cannot change status from ${currentStatus}` },
        { status: 403 }
      )
    }

    // Check if new status is a valid transition
    if (!transition.nextStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: `Cannot transition from ${currentStatus} to ${newStatus}` },
        { status: 400 }
      )
    }

    // Prepare update data
    const updateData: any = {
      crewStatus: newStatus,
    }

    // Handle specific status changes
    if (newStatus === 'VACATION' || newStatus === 'SIGN_OFF') {
      updateData.lastOffboardDate = new Date()
      if (newStatus === 'VACATION') {
        updateData.reportedToOffice = true
        updateData.reportedToOfficeDate = new Date()
      }
    }

    if (newStatus === 'EX_CREW' || newStatus === 'BLACKLISTED') {
      updateData.inactiveReason = reason || notes || 'Terminated'
    }

    if (newStatus === 'STANDBY' && (currentStatus === 'VACATION' || currentStatus === 'EX_CREW')) {
      // Rehiring or back from vacation
      updateData.reportedToOffice = true
      updateData.reportedToOfficeDate = new Date()
      updateData.inactiveReason = null
    }

    if (notes) {
      updateData.offboardNotes = notes
    }

    // Update crew status
    const updated = await prisma.crew.update({
      where: { id: crewId },
      data: updateData,
    })

    // If moving to ONBOARD, might need to create/update assignment
    // This will be handled separately in assignment management

    return NextResponse.json({
      success: true,
      message: `Status changed from ${currentStatus} to ${newStatus}`,
      crew: {
        id: updated.id,
        fullName: updated.fullName,
        rank: updated.rank,
        previousStatus: currentStatus,
        newStatus: updated.crewStatus,
      },
    })
  } catch (error) {
    console.error('Status transition error:', error)
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    )
  }
}

// GET endpoint to get available transitions for a crew
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const crewId = parseInt(params.id)
    if (isNaN(crewId)) {
      return NextResponse.json({ error: 'Invalid crew ID' }, { status: 400 })
    }

    const crew = await prisma.crew.findUnique({
      where: { id: crewId },
      select: { crewStatus: true },
    })

    if (!crew) {
      return NextResponse.json({ error: 'Crew not found' }, { status: 404 })
    }

    const currentStatus = crew.crewStatus
    const transition = STATUS_TRANSITIONS[currentStatus]

    if (!transition) {
      return NextResponse.json({
        currentStatus,
        availableTransitions: [],
        canTransition: false,
      })
    }

    // Check if user can perform any transition
    const canTransition = transition.allowedRoles.includes(user.role) || user.role === 'DIRECTOR'

    return NextResponse.json({
      currentStatus,
      availableTransitions: canTransition ? transition.nextStatuses : [],
      canTransition,
      userRole: user.role,
    })
  } catch (error) {
    console.error('Get transitions error:', error)
    return NextResponse.json(
      { error: 'Failed to get available transitions' },
      { status: 500 }
    )
  }
}
