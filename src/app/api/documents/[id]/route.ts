import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    const document = await prisma.managedDocument.findUnique({
      where: { id },
      include: {
        revisions: {
          orderBy: { revisionNumber: 'desc' },
        },
        approvals: {
          orderBy: { approvedAt: 'desc' },
        },
        distributions: {
          orderBy: { distributedAt: 'desc' },
        },
      },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const data = await request.json();

    const document = await prisma.managedDocument.update({
      where: { id },
      data: {
        documentTitle: data.documentTitle,
        description: data.description,
        category: data.category,
        documentType: data.documentType,
        retentionPeriod: data.retentionPeriod,
        remarks: data.remarks,
      },
    });

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    await prisma.managedDocument.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
