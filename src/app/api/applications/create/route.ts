import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Create crew member first
    const crew = await prisma.crew.create({
      data: {
        crewCode: `CREW${Date.now()}`,
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
        placeOfBirth: data.placeOfBirth,
        religion: data.religion,
        address: data.address,
        phoneMobile: data.phone,
        rank: data.rankApplied,
        status: 'AVAILABLE',
      },
    });

    // Create certificates from documents
    const certificatePromises = Object.entries(data.documents).map(([key, doc]: [string, any]) => {
      if (!doc.hasDoc) return null;
      
      return prisma.certificate.create({
        data: {
          crewId: crew.id,
          certificateName: key.replace(/([A-Z])/g, ' $1').trim().toUpperCase(),
          certificateNumber: doc.number,
          issueDate: new Date(),
          expiryDate: doc.expiry ? new Date(doc.expiry) : null,
          remarks: doc.number ? `Number: ${doc.number}` : undefined,
        },
      });
    });

    await Promise.all(certificatePromises.filter(p => p !== null));

    // Create application
    const application = await prisma.employmentApplication.create({
      data: {
        crewId: crew.id,
        appliedRank: data.rankApplied,
        notes: `Application for ${data.rankApplied} position`,
        status: 'APPLIED',
      },
    });

    // Store interview data and sea service in metadata (you can extend schema if needed)
    const applicationMetadata = {
      expectedSalary: data.expectedSalary,
      availableDate: data.availableDate,
      seaService: data.seaService,
      interview: {
        interviewDate: data.interviewDate,
        interviewer: data.interviewer,
        technicalScore: data.technicalScore,
        communicationScore: data.communicationScore,
        appearanceScore: data.appearanceScore,
        motivationScore: data.motivationScore,
        interviewNotes: data.interviewNotes,
      },
    };

    // Update application with metadata
    await prisma.employmentApplication.update({
      where: { id: application.id },
      data: {
        notes: JSON.stringify(applicationMetadata),
      },
    });

    return NextResponse.json({
      success: true,
      crewId: crew.id,
      applicationId: application.id,
    });

  } catch (error) {
    console.error('Error creating application:', error);
    return NextResponse.json(
      { error: 'Failed to create application' },
      { status: 500 }
    );
  }
}
