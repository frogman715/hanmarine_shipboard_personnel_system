import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const { action, approverRole, approverName, comments } = await request.json();

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

    // Determine new status based on action and current status
    let newStatus = document.status;
    
    if (action === 'REVIEWED' && approverRole === 'QMR') {
      newStatus = 'PENDING_APPROVAL';
    } else if (action === 'APPROVED' && approverRole === 'DIRECTOR') {
      newStatus = 'APPROVED';
    } else if (action === 'REJECTED') {
      newStatus = 'DRAFT';
    }

    // Create approval record
    await prisma.documentApproval.create({
      data: {
        documentId: id,
        revisionNumber: document.currentRevision,
        approverRole,
        approverName,
        action,
        comments,
      },
    });

    // Update document status
    const updateData: any = { status: newStatus };
    
    if (action === 'REVIEWED') {
      updateData.reviewedBy = approverName;
    } else if (action === 'APPROVED') {
      updateData.approvedBy = approverName;
      updateData.effectiveDate = new Date();
    }

    const updatedDocument = await prisma.managedDocument.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ 
      success: true, 
      document: updatedDocument,
      message: `Document ${action.toLowerCase()} successfully`
    });
  } catch (error) {
    console.error('Error processing approval:', error);
    return NextResponse.json(
      { error: 'Failed to process approval' },
      { status: 500 }
    );
  }
}
