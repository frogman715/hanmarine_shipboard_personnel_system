import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const leaves = await prisma.leave.findMany({
      orderBy: { startDate: 'desc' }
    });
    return NextResponse.json(leaves);
  } catch (error) {
    console.error('Error fetching leaves:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leaves' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const leave = await prisma.leave.create({
      data: {
        employeeId: body.employeeId,
        leaveType: body.leaveType,
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        totalDays: body.totalDays,
        reason: body.reason,
        medicalCertPath: body.medicalCertPath || '',
        status: 'PENDING'
      }
    });

    return NextResponse.json(leave, { status: 201 });
  } catch (error) {
    console.error('Error creating leave:', error);
    return NextResponse.json(
      { error: 'Failed to create leave' },
      { status: 500 }
    );
  }
}
