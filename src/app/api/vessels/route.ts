import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const includeCount = req.nextUrl.searchParams.get('includeCount') === 'true';
    const includeOwner = req.nextUrl.searchParams.get('includeOwner') === 'true';

    const vessels = await prisma.vessel.findMany({
      orderBy: { name: 'asc' },
      take: 100,
      ...(includeCount && {
        include: {
          _count: {
            select: { assignments: true },
          },
          ...(includeOwner && { ownerRel: true }),
        },
      }),
      ...(!includeCount && includeOwner && {
        include: { ownerRel: true },
      }),
    });

    return NextResponse.json(vessels, { status: 200 });
  } catch (error) {
    console.error('Error fetching vessels:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch vessels' },
      { status: 500 }
    );
  }
}
