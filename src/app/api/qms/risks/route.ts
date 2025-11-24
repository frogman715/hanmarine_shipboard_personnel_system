import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Fetch all risks and opportunities
export async function GET() {
  try {
    const risks = await prisma.riskOpportunity.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(risks);
  } catch (error) {
    console.error('Error fetching risks:', error);
    return NextResponse.json({ error: 'Failed to fetch risks' }, { status: 500 });
  }
}

// POST - Create new risk or opportunity
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      type,
      source,
      description,
      likelihood,
      impact,
      actions,
      responsiblePerson,
      targetDate,
      residualRisk,
      createdBy
    } = body;

    // Validate required fields
    if (!type || !source || !description || !actions || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate risk score for risks (not opportunities)
    let riskScore = null;
    if (type === 'RISK' && likelihood && impact) {
      const levelMap: Record<string, number> = {
        LOW: 1,
        MEDIUM: 2,
        HIGH: 3
      };
      riskScore = levelMap[likelihood] * levelMap[impact];
    }

    const risk = await prisma.riskOpportunity.create({
      data: {
        type,
        source,
        description,
        likelihood: type === 'RISK' ? likelihood : null,
        impact: type === 'RISK' ? impact : null,
        riskScore,
        actions,
        responsiblePerson: responsiblePerson || null,
        targetDate: targetDate ? new Date(targetDate) : null,
        residualRisk: residualRisk || null,
        status: 'IDENTIFIED',
        createdBy
      }
    });

    return NextResponse.json(risk, { status: 201 });
  } catch (error) {
    console.error('Error creating risk:', error);
    return NextResponse.json(
      { error: 'Failed to create risk/opportunity' },
      { status: 500 }
    );
  }
}
