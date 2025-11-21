import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cpars = await prisma.correctiveAction.findMany({
      orderBy: { detectedDate: 'desc' }
    });
    return NextResponse.json(cpars);
  } catch (error) {
    console.error('Error fetching CPARs:', error);
    return NextResponse.json({ error: 'Failed to fetch CPARs' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      source,
      problemDescription,
      detectedBy,
      rootCauseAnalysis,
      category,
      proposedAction,
      responsiblePerson,
      targetDate
    } = body;

    if (!source || !problemDescription || !detectedBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate CAR number
    const year = new Date().getFullYear();
    const count = await prisma.correctiveAction.count({
      where: {
        detectedDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`)
        }
      }
    });
    const carNumber = `CAR-${year}-${String(count + 1).padStart(3, '0')}`;

    const cpar = await prisma.correctiveAction.create({
      data: {
        carNumber,
        source,
        problemDescription,
        detectedDate: new Date(),
        detectedBy,
        rootCauseAnalysis: rootCauseAnalysis || null,
        category: category || null,
        proposedAction: proposedAction || null,
        responsiblePerson: responsiblePerson || null,
        targetDate: targetDate ? new Date(targetDate) : null,
        status: 'OPEN'
      }
    });

    return NextResponse.json(cpar, { status: 201 });
  } catch (error) {
    console.error('Error creating CPAR:', error);
    return NextResponse.json({ error: 'Failed to create CPAR' }, { status: 500 });
  }
}
