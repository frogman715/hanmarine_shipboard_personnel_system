import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// Approval levels: 1=Crewing Manager, 2=Expert Staff, 3=Director, 4=Principal
const APPROVAL_LEVELS = {
  CREWING_MANAGER: 1,
  EXPERT_STAFF: 2,
  DIRECTOR: 3,
  PRINCIPAL: 4,
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const applicationId = parseInt(params.id)
    if (isNaN(applicationId)) {
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 })
    }

    const body = await req.json()
    const { action, comments } = body // action: "APPROVED" or "REJECTED"

    if (!action || !['APPROVED', 'REJECTED'].includes(action)) {
      return NextResponse.json(
        { error: 'Action must be APPROVED or REJECTED' },
        { status: 400 }
      )
    }

    // Get application
    const application = await prisma.employmentApplication.findUnique({
      where: { id: applicationId },
      include: {
        crew: {
          select: { id: true, fullName: true, rank: true, crewStatus: true },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Determine which approval level user can perform
    let canApprove = false
    let approvalLevel = 0
    const updateData: any = {}

    if (user.role === 'CREWING_MANAGER' && application.currentApprovalLevel === 1) {
      canApprove = true
      approvalLevel = 1
      updateData.crewingManagerApproval = action
      updateData.crewingManagerApprovalDate = new Date()
      updateData.crewingManagerComments = comments
      updateData.crewingManagerId = user.id
      
      if (action === 'APPROVED') {
        updateData.currentApprovalLevel = 2 // Move to Expert Staff
        updateData.status = 'SHORTLISTED'
      } else {
        updateData.status = 'REJECTED'
      }
    } else if (user.role === 'EXPERT_STAFF' && application.currentApprovalLevel === 2) {
      canApprove = true
      approvalLevel = 2
      updateData.expertStaffApproval = action
      updateData.expertStaffApprovalDate = new Date()
      updateData.expertStaffComments = comments
      updateData.expertStaffId = user.id
      
      if (action === 'APPROVED') {
        updateData.currentApprovalLevel = 3 // Move to Director
        updateData.status = 'INTERVIEW'
      } else {
        updateData.status = 'REJECTED'
      }
    } else if (user.role === 'DIRECTOR' && application.currentApprovalLevel === 3) {
      canApprove = true
      approvalLevel = 3
      updateData.directorApproval = action
      updateData.directorApprovalDate = new Date()
      updateData.directorComments = comments
      updateData.directorId = user.id
      
      if (action === 'APPROVED') {
        updateData.currentApprovalLevel = 4 // Move to Principal (final)
        updateData.status = 'APPROVED'
        updateData.offeredDate = new Date()
      } else {
        updateData.status = 'REJECTED'
      }
    } else if (user.role === 'DIRECTOR' && application.currentApprovalLevel === 4) {
      // Director can also approve as Principal
      canApprove = true
      approvalLevel = 4
      updateData.principalApproval = action
      updateData.principalApprovalDate = new Date()
      updateData.principalComments = comments
      
      if (action === 'APPROVED') {
        updateData.status = 'ACCEPTED'
        updateData.acceptedDate = new Date()
      } else {
        updateData.status = 'REJECTED'
      }
    }

    if (!canApprove) {
      return NextResponse.json(
        { 
          error: `You cannot approve this application at level ${application.currentApprovalLevel}`,
          detail: `Your role: ${user.role}, Current level: ${application.currentApprovalLevel}`
        },
        { status: 403 }
      )
    }

    // If rejected, add rejection reason
    if (action === 'REJECTED') {
      updateData.rejectionReason = comments || 'Rejected by ' + user.role
    }

    // Update application
    const updated = await prisma.employmentApplication.update({
      where: { id: applicationId },
      data: updateData,
      include: {
        crew: {
          select: { id: true, fullName: true, rank: true },
        },
      },
    })

    // Create approval history
    await prisma.approvalHistory.create({
      data: {
        applicationId: applicationId,
        userId: user.id,
        userRole: user.role as any,
        action,
        comments: comments || null,
        createdBy: user.fullName || String(user.id) || 'System',
      },
    })

    // Update crew status based on application status
    if (action === 'APPROVED' && updated.status === 'ACCEPTED') {
      // Move crew to APPROVED status (ready for documents)
      await prisma.crew.update({
        where: { id: updated.crewId },
        data: { crewStatus: 'APPROVED' },
      })
    }

    return NextResponse.json({
      success: true,
      message: `Application ${action.toLowerCase()} by ${user.role}`,
      application: {
        id: updated.id,
        crewName: updated.crew.fullName,
        status: updated.status,
        currentApprovalLevel: updated.currentApprovalLevel,
        nextApprover: getNextApproverRole(updated.currentApprovalLevel),
      },
    })
  } catch (error) {
    console.error('Approval error:', error)
    return NextResponse.json(
      { error: 'Failed to process approval' },
      { status: 500 }
    )
  }
}

function getNextApproverRole(level: number): string {
  const roles = ['', 'Crewing Manager', 'Expert Staff', 'Director', 'Principal (Director)']
  return roles[level] || 'Complete'
}

// GET endpoint to get approval status
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const applicationId = parseInt(params.id)
    if (isNaN(applicationId)) {
      return NextResponse.json({ error: 'Invalid application ID' }, { status: 400 })
    }

    const application = await prisma.employmentApplication.findUnique({
      where: { id: applicationId },
      include: {
        crew: {
          select: { fullName: true, rank: true },
        },
        approvalHistory: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    const approvalChain = [
      {
        level: 1,
        role: 'Crewing Manager',
        status: application.crewingManagerApproval || 'PENDING',
        date: application.crewingManagerApprovalDate,
        comments: application.crewingManagerComments,
      },
      {
        level: 2,
        role: 'Expert Staff',
        status: application.expertStaffApproval || 'PENDING',
        date: application.expertStaffApprovalDate,
        comments: application.expertStaffComments,
      },
      {
        level: 3,
        role: 'Director',
        status: application.directorApproval || 'PENDING',
        date: application.directorApprovalDate,
        comments: application.directorComments,
      },
      {
        level: 4,
        role: 'Principal',
        status: application.principalApproval || 'PENDING',
        date: application.principalApprovalDate,
        comments: application.principalComments,
      },
    ]

    const canApprove = 
      (user.role === 'CREWING_MANAGER' && application.currentApprovalLevel === 1) ||
      (user.role === 'EXPERT_STAFF' && application.currentApprovalLevel === 2) ||
      (user.role === 'DIRECTOR' && (application.currentApprovalLevel === 3 || application.currentApprovalLevel === 4))

    return NextResponse.json({
      application: {
        id: application.id,
        crewName: application.crew.fullName,
        rank: application.crew.rank,
        status: application.status,
        currentApprovalLevel: application.currentApprovalLevel,
      },
      approvalChain,
      canApprove,
      userRole: user.role,
    })
  } catch (error) {
    console.error('Get approval error:', error)
    return NextResponse.json(
      { error: 'Failed to get approval status' },
      { status: 500 }
    )
  }
}
