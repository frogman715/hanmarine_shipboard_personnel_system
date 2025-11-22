import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const appraisals = await prisma.performanceAppraisal.findMany({
      orderBy: { appraisalDate: 'desc' }
    });
    return NextResponse.json(appraisals);
  } catch (error) {
    console.error('Error fetching appraisals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch appraisals' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const appraisal = await prisma.performanceAppraisal.create({
      data: {
        employeeId: body.employeeId,
        appraisalPeriod: body.appraisalPeriod,
        appraisalDate: new Date(body.appraisalDate),
        qualityOfWork: body.qualityOfWork,
        productivity: body.productivity,
        jobKnowledge: body.jobKnowledge,
        reliability: body.reliability,
        initiative: body.initiative,
        teamwork: body.teamwork,
        overallScore: body.overallScore,
        overallRating: body.overallRating,
        strengths: body.strengths || null,
        areasForImprovement: body.areasForImprovement || null,
        goals: body.goals || null,
        evaluatedBy: body.evaluatorName || body.evaluatedBy || 'System',
        reviewedBy: body.evaluatorPosition || body.reviewedBy || null
      }
    });

    return NextResponse.json(appraisal, { status: 201 });
  } catch (error) {
    console.error('Error creating appraisal:', error);
    return NextResponse.json(
      { error: 'Failed to create appraisal' },
      { status: 500 }
    );
  }
}
