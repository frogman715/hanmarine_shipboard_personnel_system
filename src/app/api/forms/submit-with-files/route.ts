import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    const crewId = formData.get('crewId')
    const templateCode = formData.get('templateCode')

    if (!crewId || !templateCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get template
    const template = await prisma.formTemplate.findUnique({
      where: { code: templateCode.toString() },
    })

    if (!template) {
      return NextResponse.json(
        { error: 'Form template not found' },
        { status: 404 }
      )
    }

    // Parse metadata fields
    const metadata: Record<string, any> = {}
    const documents: any[] = []

    for (const [key, value] of formData.entries()) {
      if (key.startsWith('documents[')) {
        // Parse document fields
        const match = key.match(/documents\[(\d+)\]\[(.+)\]/)
        if (match) {
          const index = parseInt(match[1])
          const fieldName = match[2]
          
          if (!documents[index]) {
            documents[index] = {}
          }

          if (fieldName === 'file' && value instanceof File) {
            // Handle file upload
            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents')
            await mkdir(uploadDir, { recursive: true })

            const timestamp = Date.now()
            const filename = `${crewId}_doc${index}_${timestamp}_${value.name}`
            const filepath = path.join(uploadDir, filename)

            const bytes = await value.arrayBuffer()
            const buffer = Buffer.from(bytes)
            await writeFile(filepath, buffer)

            documents[index].filePath = `/uploads/documents/${filename}`
            documents[index].fileName = value.name
          } else {
            documents[index][fieldName] = value.toString()
          }
        }
      } else if (key !== 'crewId' && key !== 'templateCode') {
        metadata[key] = value.toString()
      }
    }

    // Save to database
    const submission = await prisma.formSubmission.create({
      data: {
        templateId: template.id,
        crewId: Number(crewId),
        status: 'SUBMITTED',
        formData: {
          metadata,
          documents: documents.filter(d => d && Object.keys(d).length > 0)
        },
      },
      include: {
        template: true,
      },
    })

    return NextResponse.json({
      success: true,
      submission,
      message: 'Form submitted successfully with documents'
    })
  } catch (error) {
    console.error('Submit error:', error)
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    )
  }
}
