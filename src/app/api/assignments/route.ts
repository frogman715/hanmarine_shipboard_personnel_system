import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/assignments?vesselName=DK%20IMAN&status=ONBOARD,ACTIVE
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams
    const vesselName = params.get('vesselName') || undefined
    const statusParam = params.get('status') || undefined
    const statuses = statusParam ? statusParam.split(',').map((s) => s.trim()).filter(Boolean) : undefined

    const where: any = {}
    if (vesselName) where.vesselName = vesselName
    if (statuses && statuses.length > 0) where.status = { in: statuses }

    const rows = await prisma.assignment.findMany({
      where,
      orderBy: [{ vesselName: 'asc' }, { rank: 'asc' }],
      include: {
        crew: { select: { id: true, fullName: true, crewStatus: true } },
      },
      take: 500,
    })

    return NextResponse.json(rows)
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 })
  }
}
