import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')

    if (!query || query.trim() === '') {
      return NextResponse.json([])
    }

    const crew = await prisma.crew.findMany({
      where: {
        OR: [
          { fullName: { contains: query, mode: 'insensitive' } },
          { crewCode: { contains: query, mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        crewCode: true,
        fullName: true,
        rank: true,
        vessel: true,
        status: true,
      },
      take: 10,
    })

    return NextResponse.json(crew)
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json({ error: 'Search failed' }, { status: 500 })
  }
}
