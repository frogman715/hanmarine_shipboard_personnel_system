import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const includeCount = searchParams.get('includeCount') === 'true'

    const owners = await prisma.owner.findMany({
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        code: true,
        country: true,
        contact: true,
        email: true,
        notes: true,
        ...(includeCount && { _count: { select: { vessels: true } } }),
      },
    })
    return NextResponse.json(owners)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch owners' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, code, country, contact, email, notes } = body

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 })
    }

    const owner = await prisma.owner.create({
      data: { name, code, country, contact, email, notes },
    })

    return NextResponse.json(owner)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to create owner' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    const body = await req.json()
    const { name, code, country, contact, email, notes } = body

    const owner = await prisma.owner.update({
      where: { id: parseInt(id) },
      data: { name, code, country, contact, email, notes },
    })

    return NextResponse.json(owner)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to update owner' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 })
    }

    await prisma.owner.delete({
      where: { id: parseInt(id) },
    })
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error(e)
    return NextResponse.json(
      { error: 'Cannot delete owner with linked vessels' },
      { status: 400 }
    )
  }
}
