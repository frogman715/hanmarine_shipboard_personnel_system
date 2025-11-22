import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

// GET all submissions (with filters)
export async function GET(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const crewId = searchParams.get('crewId')
    const applicationId = searchParams.get('applicationId')
    const templateCode = searchParams.get('templateCode')
    const status = searchParams.get('status')

    const where: any = {}
    if (crewId) where.crewId = parseInt(crewId)
    if (applicationId) where.applicationId = parseInt(applicationId)
    if (status) where.status = status
    if (templateCode) {
      where.template = { code: templateCode }
    }

    const submissions = await prisma.formSubmission.findMany({
      where,
      include: {
        template: true,
        crew: {
          select: { id: true, fullName: true, crewCode: true }
        },
        application: {
          select: { id: true, appliedRank: true }
        }
      },
      orderBy: { submittedAt: 'desc' }
    })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

// POST create new submission
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { templateCode, crewId, applicationId, data, status = 'DRAFT' } = body

    if (!templateCode) {
      return NextResponse.json(
        { error: 'Template code is required' },
        { status: 400 }
      )
    }

    // Get template
    const template = await prisma.formTemplate.findUnique({
      where: { code: templateCode }
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Form template not found' },
        { status: 404 }
      )
    }

    // Create submission
    const submission = await prisma.formSubmission.create({
      data: {
        templateId: template.id,
        crewId: crewId || null,
        applicationId: applicationId || null,
        status,
        formData: data || {}
      },
      include: {
        template: true
      }
    })

    return NextResponse.json({
      success: true,
      submission
    })
  } catch (error: any) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create submission' },
      { status: 500 }
    )
  }
}
