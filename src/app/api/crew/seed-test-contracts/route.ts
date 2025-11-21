import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

/**
 * POST /api/crew/seed-test-contracts
 * Create test data for contract monitoring
 * ONLY FOR DEVELOPMENT
 */
export async function POST(request: Request) {
  try {
    // Create test crew
    const crew1 = await prisma.crew.create({
      data: {
        fullName: 'John Doe - 7 Month Contract',
        rank: 'Captain',
        vessel: 'MT Tanker Pro',
        crewStatus: 'ONBOARD',
      },
    });

    const crew2 = await prisma.crew.create({
      data: {
        fullName: 'Jane Smith - 9 Month Contract',
        rank: 'Chief Officer',
        vessel: 'MT Tanker Alpha',
        crewStatus: 'ONBOARD',
      },
    });

    const crew3 = await prisma.crew.create({
      data: {
        fullName: 'Mike Johnson - New Crew',
        rank: 'Engineer',
        vessel: 'MT Tanker Beta',
        crewStatus: 'ONBOARD',
      },
    });

    // Create assignments with specific sign-on dates
    const now = new Date();

    // 7-month contract (approaching warning)
    const sevenMonthsAgo = new Date(now);
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);

    await prisma.assignment.create({
      data: {
        crewId: crew1.id,
        vesselName: 'MT Tanker Pro',
        rank: 'Captain',
        signOn: sevenMonthsAgo,
        status: 'ACTIVE',
      },
    });

    // 9-month contract (critical - over 8 months)
    const nineMonthsAgo = new Date(now);
    nineMonthsAgo.setMonth(nineMonthsAgo.getMonth() - 9);

    await prisma.assignment.create({
      data: {
        crewId: crew2.id,
        vesselName: 'MT Tanker Alpha',
        rank: 'Chief Officer',
        signOn: nineMonthsAgo,
        status: 'ACTIVE',
      },
    });

    // 2-month contract (no warning)
    const twoMonthsAgo = new Date(now);
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

    await prisma.assignment.create({
      data: {
        crewId: crew3.id,
        vesselName: 'MT Tanker Beta',
        rank: 'Engineer',
        signOn: twoMonthsAgo,
        status: 'ACTIVE',
      },
    });

    return NextResponse.json(
      {
        message: 'Test crew data created successfully',
        crew: [crew1, crew2, crew3],
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Error' }, { status: 500 });
  }
}
