
import { NextResponse, NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const crewId = req.nextUrl.searchParams.get('crewId')

    if (crewId) {
      const apps = await prisma.employmentApplication.findMany({
        where: { crewId: Number(crewId) },
        include: { crew: true, checklists: true },
        orderBy: { applicationDate: 'desc' },
      });
      return NextResponse.json(apps);
    }

    const apps = await prisma.employmentApplication.findMany({
      include: { crew: true, checklists: true },
      orderBy: { applicationDate: 'desc' },
    });
    return NextResponse.json(apps);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { crewId, appliedRank, notes } = body

    if (!crewId) {
      return NextResponse.json({ error: 'crewId is required' }, { status: 400 })
    }

    const created = await prisma.employmentApplication.create({
      data: {
        crew: { connect: { id: Number(crewId) } },
        appliedRank: appliedRank || null,
        notes: notes || null,
        status: 'APPLIED',
      },
      include: { crew: true },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Terjadi kesalahan saat membuat application' }, { status: 500 })
  }
}

// Update application status
export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, status, interviewDate, interviewNotes, offeredDate, acceptedDate, rejectionReason } = body

    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 })
    }

    // Validate status is one of the allowed enum values
    const validStatuses = ['APPLIED', 'SHORTLISTED', 'INTERVIEW', 'APPROVED', 'OFFERED', 'ACCEPTED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, { status: 400 })
    }

    // Check if application exists
    const existingApp = await prisma.employmentApplication.findUnique({ where: { id: Number(id) } });
    if (!existingApp) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 })
    }

    // Validate dates if provided
    let parsedInterviewDate = undefined;
    let parsedOfferedDate = undefined;
    let parsedAcceptedDate = undefined;

    if (interviewDate) {
      const d = new Date(interviewDate);
      if (Number.isNaN(d.getTime())) return NextResponse.json({ error: 'Invalid interviewDate' }, { status: 400 })
      parsedInterviewDate = d;
    }

    if (offeredDate) {
      const d = new Date(offeredDate);
      if (Number.isNaN(d.getTime())) return NextResponse.json({ error: 'Invalid offeredDate' }, { status: 400 })
      parsedOfferedDate = d;
    }

    if (acceptedDate) {
      const d = new Date(acceptedDate);
      if (Number.isNaN(d.getTime())) return NextResponse.json({ error: 'Invalid acceptedDate' }, { status: 400 })
      parsedAcceptedDate = d;
    }

    // Validate string lengths
    if (interviewNotes && interviewNotes.length > 2000) {
      return NextResponse.json({ error: 'interviewNotes too long (max 2000 chars)' }, { status: 400 })
    }
    if (rejectionReason && rejectionReason.length > 1000) {
      return NextResponse.json({ error: 'rejectionReason too long (max 1000 chars)' }, { status: 400 })
    }

    const updated = await prisma.employmentApplication.update({
      where: { id: Number(id) },
      data: {
        status,
        interviewDate: parsedInterviewDate,
        interviewNotes: interviewNotes || undefined,
        offeredDate: parsedOfferedDate,
        acceptedDate: parsedAcceptedDate,
        rejectionReason: rejectionReason || undefined,
      },
      include: { crew: true },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 })
  }
}

