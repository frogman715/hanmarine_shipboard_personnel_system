import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const totalCrew = await prisma.crew.count();
    const totalVessels = await prisma.vessel.count();
    
    const recentCrew = await prisma.crew.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, fullName: true, rank: true, vessel: true, createdAt: true },
    });

    const recentVessels = await prisma.vessel.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, flag: true, owner: true, createdAt: true },
    });

    return NextResponse.json(
      {
        totalCrew,
        totalVessels,
        recentCrew,
        recentVessels,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch' },
      { status: 500 }
    );
  }
}
