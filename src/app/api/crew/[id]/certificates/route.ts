import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const certificateId = parseInt(params.id)
    
    const certificate = await prisma.certificate.findUnique({
      where: { id: certificateId },
      include: {
        crew: {
          select: {
            id: true,
            fullName: true,
            crewCode: true,
            rank: true
          }
        }
      }
    })

    if (!certificate) {
      return NextResponse.json(
        { error: 'Certificate not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error('Error fetching certificate:', error)
    return NextResponse.json(
      { error: 'Failed to fetch certificate' },
      { status: 500 }
    )
  }
}
