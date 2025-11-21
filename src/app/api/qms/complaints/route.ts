import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const complaints = await prisma.complaint.findMany({
      orderBy: { receivedDate: 'desc' }
    });
    return NextResponse.json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json({ error: 'Failed to fetch complaints' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      complainantType,
      complainantName,
      complainantContact,
      category,
      description,
      vesselInvolved,
      dateOfIncident,
      priority
    } = body;

    if (!complainantType || !complainantName || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate complaint number
    const year = new Date().getFullYear();
    const count = await prisma.complaint.count({
      where: {
        receivedDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`)
        }
      }
    });
    const complaintNumber = `COMP-${year}-${String(count + 1).padStart(3, '0')}`;

    const complaint = await prisma.complaint.create({
      data: {
        complaintNumber,
        complainantType,
        complainantName,
        complainantContact: complainantContact || null,
        category: category || null,
        description,
        vesselInvolved: vesselInvolved || null,
        dateOfIncident: dateOfIncident ? new Date(dateOfIncident) : null,
        receivedDate: new Date(),
        priority: priority || 'MEDIUM',
        status: 'RECEIVED'
      }
    });

    return NextResponse.json(complaint, { status: 201 });
  } catch (error) {
    console.error('Error creating complaint:', error);
    return NextResponse.json({ error: 'Failed to create complaint' }, { status: 500 });
  }
}
