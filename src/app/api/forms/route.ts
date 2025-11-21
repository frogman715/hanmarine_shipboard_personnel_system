import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

// GET form template by code (e.g., HGF-CR-01)
export async function GET(req: NextRequest) {
  try {
    const code = req.nextUrl.searchParams.get('code')
    const submissionId = req.nextUrl.searchParams.get('submissionId')

    if (submissionId) {
      // Get existing submission
      const submission = await prisma.formSubmission.findUnique({
        where: { id: Number(submissionId) },
        include: {
          template: true,
        },
      })
      return NextResponse.json(submission || {})
    }

    if (code) {
      // Get form template (fields is JSON, not a relation)
      const template = await prisma.formTemplate.findUnique({
        where: { code },
      })
      return NextResponse.json(template || {})
    }

    // Get all templates
    const templates = await prisma.formTemplate.findMany()
    return NextResponse.json(templates)
  } catch (error) {
    console.error('Error fetching form:', error)
    return NextResponse.json({ error: 'Failed to fetch form' }, { status: 500 })
  }
}

// POST - Create or update form submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { templateCode, crewId, applicationId, formData } = body

    if (!templateCode) {
      return NextResponse.json({ error: 'templateCode is required' }, { status: 400 })
    }

    // Get template
    const template = await prisma.formTemplate.findUnique({
      where: { code: templateCode },
    })

    if (!template) {
      return NextResponse.json({ error: 'Form template not found' }, { status: 404 })
    }

    // Create submission (store formData as JSON)
    const submission = await prisma.formSubmission.create({
      data: {
        templateId: template.id,
        crewId: crewId ? Number(crewId) : undefined,
        applicationId: applicationId ? Number(applicationId) : undefined,
        status: 'DRAFT',
        formData: formData || {}, // Store as JSON
      },
      include: {
        template: true,
      },
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json({ error: 'Failed to create submission' }, { status: 500 })
  }
}

// PUT - Update form submission
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { submissionId, formData, status } = body

    if (!submissionId) {
      return NextResponse.json({ error: 'submissionId is required' }, { status: 400 })
    }

    // Update submission with new formData (JSON)
    const submission = await prisma.formSubmission.update({
      where: { id: Number(submissionId) },
      data: {
        formData: formData || {},
        status: status || undefined,
        updatedAt: new Date(),
      },
      include: {
        template: true,
      },
    })

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json({ error: 'Failed to update submission' }, { status: 500 })
  }
}
