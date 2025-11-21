import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const grievances = await prisma.seafarerGrievance.findMany({
      orderBy: { filedDate: 'desc' }
    });
    return NextResponse.json(grievances);
  } catch (error) {
    console.error('Error fetching grievances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch grievances' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const grievance = await prisma.seafarerGrievance.create({
      data: {
        grievanceNumber: body.grievanceNumber,
        contractId: parseInt(body.contractId),
        seafarerName: body.seafarerName,
        vesselName: body.vesselName,
        grievanceType: body.grievanceType,
        filedDate: new Date(body.filedDate),
        description: body.description,
        investigationNotes: body.investigationNotes || null,
        resolution: body.resolution || null,
        status: body.status || 'FILED'
      }
    });

    return NextResponse.json(grievance, { status: 201 });
  } catch (error) {
    console.error('Error creating grievance:', error);
    return NextResponse.json(
      { error: 'Failed to create grievance' },
      { status: 500 }
    );
  }
}
