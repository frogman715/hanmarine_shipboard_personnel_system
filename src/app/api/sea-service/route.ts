import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const crewId = req.nextUrl.searchParams.get('crewId')

    if (crewId) {
      const services = await prisma.seaServiceExperience.findMany({
        where: { crewId: Number(crewId) },
        orderBy: { signOn: 'desc' },
      })
      return NextResponse.json(services)
    }

    return NextResponse.json({ error: 'crewId is required' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching sea service:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { crewId, vesselName, rank, grt, dwt, engineType, bhp, companyName, flag, signOn, signOff, remarks } = body

    if (!crewId || !vesselName) {
      return NextResponse.json({ error: 'crewId and vesselName are required' }, { status: 400 })
    }

    const service = await prisma.seaServiceExperience.create({
      data: {
        crewId: Number(crewId),
        vesselName,
        rank,
        grt: grt ? Number(grt) : null,
        dwt: dwt ? Number(dwt) : null,
        engineType,
        bhp: bhp ? Number(bhp) : null,
        companyName,
        flag,
        signOn: signOn ? new Date(signOn) : null,
        signOff: signOff ? new Date(signOff) : null,
        remarks,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error('Error creating sea service:', error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, vesselName, rank, grt, dwt, engineType, bhp, companyName, flag, signOn, signOff, remarks } = body

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    const service = await prisma.seaServiceExperience.update({
      where: { id: Number(id) },
      data: {
        vesselName,
        rank,
        grt: grt ? Number(grt) : null,
        dwt: dwt ? Number(dwt) : null,
        engineType,
        bhp: bhp ? Number(bhp) : null,
        companyName,
        flag,
        signOn: signOn ? new Date(signOn) : null,
        signOff: signOff ? new Date(signOff) : null,
        remarks,
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error updating sea service:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id is required' }, { status: 400 })
    }

    await prisma.seaServiceExperience.delete({
      where: { id: Number(id) },
    })

    return NextResponse.json({ message: 'Deleted successfully' })
  } catch (error) {
    console.error('Error deleting sea service:', error)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
