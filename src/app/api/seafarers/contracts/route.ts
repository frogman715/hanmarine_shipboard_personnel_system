import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const contracts = await prisma.seafarerContract.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contracts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Calculate contract duration in months
    const signOn = new Date(body.signOnDate);
    const signOff = new Date(body.signOffDate);
    const months = Math.floor((signOff.getTime() - signOn.getTime()) / (1000 * 3600 * 24 * 30));
    
    // Calculate accrued leave
    const leavePerMonth = parseFloat(body.leavePerMonth) || 2.5;
    const accruedLeave = months * leavePerMonth;
    
    const contract = await prisma.seafarerContract.create({
      data: {
        contractNumber: body.contractNumber,
        crewId: body.crewId,
        vesselName: body.vesselName,
        rank: body.rank,
        signOnDate: new Date(body.signOnDate),
        signOffDate: new Date(body.signOffDate),
        contractDuration: months,
        basicWage: body.basicWage ? parseFloat(body.basicWage) : null,
        fixedOvertime: body.fixedOvertime ? parseFloat(body.fixedOvertime) : null,
        totalWage: body.totalWage ? parseFloat(body.totalWage) : null,
        currency: body.currency || 'USD',
        leavePerMonth: leavePerMonth,
        accruedLeave: accruedLeave,
        mlcCompliant: true,
        status: 'ACTIVE',
        cbaId: body.cbaId || null,
        createdBy: 'System'
      }
    });

    return NextResponse.json(contract, { status: 201 });
  } catch (error) {
    console.error('Error creating contract:', error);
    return NextResponse.json(
      { error: 'Failed to create contract' },
      { status: 500 }
    );
  }
}
