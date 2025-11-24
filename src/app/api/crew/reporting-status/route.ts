import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const { crewId, reportedToOffice, inactiveReason } = body

    if (!crewId) {
      return NextResponse.json(
        { error: 'Crew ID is required' },
        { status: 400 }
      )
    }

    // Get current crew status
    const crew = await prisma.crew.findUnique({
      where: { id: parseInt(crewId) }
    })

    if (!crew) {
      return NextResponse.json(
        { error: 'Crew not found' },
        { status: 404 }
      )
    }

    // Logic:
    // - reportedToOffice = true → STANDBY (available)
    // - reportedToOffice = false → INACTIVE (tidak lapor)
    // - inactiveReason provided → INACTIVE (pindah kantor, resign, dll)
    
    let newStatus = crew.crewStatus
    let newReportedToOffice = crew.reportedToOffice
    let newReportedDate = crew.reportedToOfficeDate
    let newInactiveReason = crew.inactiveReason
    let newNotes = crew.offboardNotes

    if (inactiveReason) {
      // Mark as INACTIVE with specific reason
      newStatus = 'INACTIVE'
      newReportedToOffice = false
      newReportedDate = null
      newInactiveReason = inactiveReason
      newNotes = `${inactiveReason} - ${new Date().toLocaleDateString()}`
    } else if (reportedToOffice === true) {
      // Crew reported to office → STANDBY
      newStatus = 'STANDBY'
      newReportedToOffice = true
      newReportedDate = new Date()
      newInactiveReason = null
      newNotes = null
    } else if (reportedToOffice === false) {
      // Crew did NOT report → INACTIVE
      newStatus = 'INACTIVE'
      newReportedToOffice = false
      newReportedDate = null
      newInactiveReason = 'Tidak Lapor'
      newNotes = 'Tidak lapor ke kantor setelah sign off'
    }

    const updated = await prisma.crew.update({
      where: { id: parseInt(crewId) },
      data: {
        reportedToOffice: newReportedToOffice,
        reportedToOfficeDate: newReportedDate,
        crewStatus: newStatus,
        inactiveReason: newInactiveReason,
        offboardNotes: newNotes
      }
    })

    return NextResponse.json({
      success: true,
      crew: {
        id: updated.id,
        fullName: updated.fullName,
        reportedToOffice: updated.reportedToOffice,
        reportedToOfficeDate: updated.reportedToOfficeDate,
        crewStatus: updated.crewStatus,
        inactiveReason: updated.inactiveReason
      }
    })
  } catch (error) {
    console.error('Error updating crew reporting status:', error)
    return NextResponse.json(
      { error: 'Failed to update reporting status' },
      { status: 500 }
    )
  }
}
