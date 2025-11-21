import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// GET certificates with expiry alerts
export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const crewId = searchParams.get('crewId')
    const alertOnly = searchParams.get('alertOnly') === 'true'
    const daysAhead = parseInt(searchParams.get('daysAhead') || '60')

    const where: any = {}
    
    if (crewId) {
      where.crewId = parseInt(crewId)
    }

    if (alertOnly) {
      // Get certificates expiring within daysAhead
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + daysAhead)
      
      where.expiryDate = {
        lte: futureDate,
        gte: new Date() // Not expired yet
      }
    }

    const certificates = await prisma.certificate.findMany({
      where,
      include: {
        crew: {
          select: {
            id: true,
            fullName: true,
            crewCode: true,
            rank: true,
            crewStatus: true
          }
        }
      },
      orderBy: { expiryDate: 'asc' }
    })

    // Calculate days until expiry and status for each cert
    const now = new Date()
    const enriched = certificates.map(cert => {
      if (!cert.expiryDate) {
        return { ...cert, daysUntilExpiry: null, status: 'NO_DATE' }
      }

      const daysUntil = Math.floor(
        (cert.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )

      let status = 'VALID'
      if (daysUntil < 0) status = 'EXPIRED'
      else if (daysUntil <= 30) status = 'CRITICAL'
      else if (daysUntil <= 60) status = 'WARNING'

      return {
        ...cert,
        daysUntilExpiry: daysUntil,
        status
      }
    })

    // Get summary stats
    const stats = {
      total: enriched.length,
      expired: enriched.filter(c => c.status === 'EXPIRED').length,
      critical: enriched.filter(c => c.status === 'CRITICAL').length,
      warning: enriched.filter(c => c.status === 'WARNING').length,
      valid: enriched.filter(c => c.status === 'VALID').length,
      noDate: enriched.filter(c => c.status === 'NO_DATE').length
    }

    return NextResponse.json({
      certificates: enriched,
      stats
    })
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    )
  }
}

// POST update certificate verification
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only Documentation Officer, Training Officer, or higher can verify
    const allowedRoles = [
      'DIRECTOR',
      'CREWING_MANAGER',
      'DOCUMENTATION_OFFICER',
      'TRAINING_OFFICER'
    ]

    if (!allowedRoles.includes(user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { certificateId, verified, verificationNotes } = body

    if (!certificateId) {
      return NextResponse.json(
        { error: 'Certificate ID required' },
        { status: 400 }
      )
    }

    // Update certificate remarks with verification info
    const cert = await prisma.certificate.findUnique({
      where: { id: parseInt(certificateId) }
    })

    if (!cert) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      )
    }

    const verificationRecord = {
      verified: verified || false,
      verifiedBy: user.fullName,
      verifiedRole: user.role,
      verifiedAt: new Date().toISOString(),
      notes: verificationNotes || null
    }

    const updated = await prisma.certificate.update({
      where: { id: parseInt(certificateId) },
      data: {
        remarks: JSON.stringify({
          ...(cert.remarks ? JSON.parse(cert.remarks) : {}),
          verification: verificationRecord
        })
      }
    })

    return NextResponse.json({
      success: true,
      certificate: updated,
      verification: verificationRecord
    })
  } catch (error: any) {
    console.error('Error verifying certificate:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify certificate' },
      { status: 500 }
    )
  }
}
