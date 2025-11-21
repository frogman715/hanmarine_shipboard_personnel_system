import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET: List all managed documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    const where: any = {};

    if (status) where.status = status;
    if (category) where.category = category;
    if (type) where.documentType = type;
    if (search) {
      where.OR = [
        { documentCode: { contains: search, mode: 'insensitive' } },
        { documentTitle: { contains: search, mode: 'insensitive' } },
      ];
    }

    const documents = await prisma.managedDocument.findMany({
      where,
      include: {
        revisions: {
          orderBy: { revisionNumber: 'desc' },
          take: 1,
        },
        approvals: {
          orderBy: { approvedAt: 'desc' },
          take: 3,
        },
        _count: {
          select: {
            revisions: true,
            approvals: true,
            distributions: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ success: true, documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST: Create new managed document
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const document = await prisma.managedDocument.create({
      data: {
        documentCode: data.documentCode,
        documentTitle: data.documentTitle,
        documentType: data.documentType,
        category: data.category,
        currentRevision: 0,
        status: 'DRAFT',
        preparedBy: data.preparedBy,
        filePath: data.filePath || '',
        fileType: data.fileType,
        description: data.description,
        retentionPeriod: data.retentionPeriod || 5,
      },
    });

    // Create initial revision
    await prisma.documentRevision.create({
      data: {
        documentId: document.id,
        revisionNumber: 0,
        changeSummary: 'Initial version',
        filePath: data.filePath || '',
        preparedBy: data.preparedBy,
        status: 'DRAFT',
      },
    });

    // Create approval record for submission
    await prisma.documentApproval.create({
      data: {
        documentId: document.id,
        revisionNumber: 0,
        approverRole: 'QMR',
        approverName: data.preparedBy,
        action: 'SUBMITTED',
        comments: 'Document submitted for review',
      },
    });

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
}
