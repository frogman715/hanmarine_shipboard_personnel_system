import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
  const url = new URL(req.url)
  const crewId = url.searchParams.get('crewId')
  
  // If crewId provided, get certificates for specific crew
  if (crewId) {
    const certs = await prisma.certificate.findMany({
      where: { crewId: Number(crewId) },
      orderBy: { expiryDate: 'asc' },
    })
    return NextResponse.json(certs)
  }
  
  // Otherwise, get all certificates with crew info
  const allCerts = await prisma.certificate.findMany({
    include: {
      crew: {
        select: {
          id: true,
          crewCode: true,
          fullName: true,
          rank: true,
        },
      },
    },
    orderBy: [
      { crew: { fullName: 'asc' } },
      { expiryDate: 'asc' },
    ],
  })
  
  return NextResponse.json(allCerts)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { crewId, type, issueDate, expiryDate, issuer, remarks } = body

    if (!crewId || !type) {
      return NextResponse.json({ error: 'crewId and type required' }, { status: 400 })
    }

    const cert = await prisma.certificate.create({
      data: {
        crew: { connect: { id: Number(crewId) } },
        type,
        issueDate: issueDate ? new Date(issueDate) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        issuer: issuer || null,
        remarks: remarks || null,
      },
    })

    return NextResponse.json(cert, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create certificate' }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, type, issueDate, expiryDate, issuer, remarks } = body

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const cert = await prisma.certificate.update({
      where: { id: Number(id) },
      data: {
        type: type || undefined,
        issueDate: issueDate ? new Date(issueDate) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        issuer: issuer || undefined,
        remarks: remarks || undefined,
      },
    })

    return NextResponse.json(cert)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to update certificate' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url)
    const id = url.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    await prisma.certificate.delete({ where: { id: Number(id) } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to delete certificate' }, { status: 500 })
  }
}
