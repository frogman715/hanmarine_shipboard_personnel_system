import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const id = parseInt(params.id);
    
    const grievance = await prisma.seafarerGrievance.update({
      where: { id },
      data: body
    });

    return NextResponse.json(grievance);
  } catch (error) {
    console.error('Error updating grievance:', error);
    return NextResponse.json(
      { error: 'Failed to update grievance' },
      { status: 500 }
    );
  }
}
