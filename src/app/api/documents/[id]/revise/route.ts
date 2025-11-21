import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { changeSummary, reasonForChange, preparedBy, filePath } = await request.json();

    // Get current document
    const document = await prisma.managedDocument.findUnique({
      where: { id },
    });

    if (!document) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const newRevisionNumber = document.currentRevision + 1;

    // Create new revision
    const revision = await prisma.documentRevision.create({
      data: {
        documentId: id,
        revisionNumber: newRevisionNumber,
        changeSummary,
        reasonForChange,
        filePath: filePath || document.filePath,
        preparedBy,
        status: 'DRAFT',
      },
    });

    // Update document with new revision number and reset status
    await prisma.managedDocument.update({
      where: { id },
      data: {
        currentRevision: newRevisionNumber,
        revisionDate: new Date(),
        status: 'DRAFT',
        reviewedBy: null,
        approvedBy: null,
        effectiveDate: null,
      },
    });

    // Create approval record for new revision
    await prisma.documentApproval.create({
      data: {
        documentId: id,
        revisionNumber: newRevisionNumber,
        approverRole: 'QMR',
        approverName: preparedBy,
        action: 'SUBMITTED',
        comments: `Revision ${newRevisionNumber} submitted for review`,
      },
    });

    return NextResponse.json({ 
      success: true, 
      revision,
      message: `Revision ${newRevisionNumber} created successfully`
    });
  } catch (error) {
    console.error('Error creating revision:', error);
    return NextResponse.json(
      { error: 'Failed to create revision' },
      { status: 500 }
    );
  }
}
