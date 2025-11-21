import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const suppliers = await prisma.supplier.findMany({
      include: {
        evaluations: {
          orderBy: { evaluationDate: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Add lastEvaluationDate and lastEvaluationScore to each supplier
    const suppliersWithEvaluation = suppliers.map(supplier => ({
      ...supplier,
      lastEvaluationDate: supplier.evaluations[0]?.evaluationDate || null,
      lastEvaluationScore: supplier.evaluations[0]?.score || null
    }));

    return NextResponse.json(suppliersWithEvaluation);
  } catch (error) {
    console.error('Error fetching suppliers:', error);
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      contactPerson,
      email,
      phone,
      address,
      services,
      registrationNumber,
      taxId
    } = body;

    if (!name || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supplier = await prisma.supplier.create({
      data: {
        name,
        type,
        contactPerson: contactPerson || null,
        email: email || null,
        phone: phone || null,
        address: address || null,
        services: services || null,
        registrationNumber: registrationNumber || null,
        taxId: taxId || null,
        status: 'APPROVED'
      }
    });

    return NextResponse.json(supplier, { status: 201 });
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 });
  }
}
