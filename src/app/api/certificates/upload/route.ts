import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    
    const crewId = formData.get('crewId')
    const type = formData.get('type')
    const issueDate = formData.get('issueDate')
    const expiryDate = formData.get('expiryDate')
    const issuer = formData.get('issuer')
    const remarks = formData.get('remarks')
    const file = formData.get('file') as File

    if (!crewId || !type || !expiryDate || !file) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify crew exists
    const crew = await prisma.crew.findUnique({
      where: { id: Number(crewId) },
      select: { id: true, crewCode: true, fullName: true }
    })

    if (!crew) {
      return NextResponse.json(
        { error: 'Crew not found' },
        { status: 404 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'certificates')
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const sanitizedType = type.toString().replace(/[^a-zA-Z0-9]/g, '_')
    const fileExt = path.extname(file.name)
    const filename = `${crew.crewCode || crew.id}_${sanitizedType}_${timestamp}${fileExt}`
    const filepath = path.join(uploadDir, filename)

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Save to database
    const certificate = await prisma.certificate.create({
      data: {
        crewId: Number(crewId),
        type: type.toString(),
        issueDate: issueDate ? new Date(issueDate.toString()) : null,
        expiryDate: new Date(expiryDate.toString()),
        issuer: issuer?.toString() || null,
        remarks: remarks?.toString() || null,
        documentPath: `/uploads/certificates/${filename}`,
      },
    })

    return NextResponse.json({
      success: true,
      certificate,
      message: 'Certificate uploaded successfully'
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload certificate' },
      { status: 500 }
    )
  }
}
