import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cbas = await prisma.collectiveBargainingAgreement.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(cbas);
  } catch (error) {
    console.error('Error fetching CBAs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CBAs' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const cba = await prisma.collectiveBargainingAgreement.create({
      data: {
        cbaCode: body.cbaCode,
        cbaTitle: body.cbaTitle,
        shipOwner: body.shipOwner,
        union: body.union || null,
        flagState: body.flagState,
        effectiveDate: new Date(body.effectiveDate),
        expirationDate: new Date(body.expirationDate),
        minimumWage: body.minimumWage ? parseFloat(body.minimumWage) : null,
        overtimeRate: body.overtimeRate ? parseFloat(body.overtimeRate) : null,
        leaveEntitlement: body.leaveEntitlement ? parseInt(body.leaveEntitlement) : null,
        mlcCompliant: true,
        status: 'ACTIVE'
      }
    });

    return NextResponse.json(cba, { status: 201 });
  } catch (error) {
    console.error('Error creating CBA:', error);
    return NextResponse.json(
      { error: 'Failed to create CBA' },
      { status: 500 }
    );
  }
}
