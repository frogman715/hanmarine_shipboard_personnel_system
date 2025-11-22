import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = parseInt(params.id);
    const body = await request.json();
    const { distributedTo, distributionMethod, distributedBy } = body;

    if (!distributedTo || !distributionMethod || !distributedBy) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify document exists and is approved
    const document = await prisma.managedDocument.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      );
    }

    if (document.status !== 'APPROVED') {
      return NextResponse.json(
        { success: false, error: 'Only approved documents can be distributed' },
        { status: 400 }
      );
    }

    // Create distribution record
    const distribution = await prisma.documentDistribution.create({
      data: {
        documentId,
        distributedTo,
        distributionMethod,
        distributedBy,
        distributedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      distribution,
      message: 'Document distributed successfully',
    });

  } catch (error) {
    console.error('Distribution error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to distribute document' },
      { status: 500 }
    );
  }
}

// Acknowledge distribution
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const documentId = parseInt(params.id);
    const body = await request.json();
    const { distributionId } = body;

    if (!distributionId) {
      return NextResponse.json(
        { success: false, error: 'Distribution ID required' },
        { status: 400 }
      );
    }

    // Update distribution with acknowledgment
    const distribution = await prisma.documentDistribution.update({
      where: { id: distributionId },
      data: {
        acknowledgedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      distribution,
      message: 'Distribution acknowledged',
    });

  } catch (error) {
    console.error('Acknowledgment error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to acknowledge distribution' },
      { status: 500 }
    );
  }
}
