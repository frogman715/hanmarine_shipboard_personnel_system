import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const audits = await prisma.internalAudit.findMany({
      orderBy: { auditDate: 'desc' }
    });
    return NextResponse.json(audits);
  } catch (error) {
    console.error('Error fetching audits:', error);
    return NextResponse.json({ error: 'Failed to fetch audits' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { auditDate, auditType, auditScope, leadAuditor, auditors, auditee, createdBy } = body;

    if (!auditDate || !auditType || !auditScope || !leadAuditor || !createdBy) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate audit number
    const year = new Date(auditDate).getFullYear();
    const count = await prisma.internalAudit.count({
      where: {
        auditDate: {
          gte: new Date(`${year}-01-01`),
          lte: new Date(`${year}-12-31`)
        }
      }
    });
    const auditNumber = `IA-${year}-${String(count + 1).padStart(3, '0')}`;

    const audit = await prisma.internalAudit.create({
      data: {
        auditNumber,
        auditDate: new Date(auditDate),
        auditType,
        auditScope,
        leadAuditor,
        auditors: auditors || [],
        auditee: auditee || null,
        status: 'PLANNED',
        nonConformities: 0,
        createdBy
      }
    });

    return NextResponse.json(audit, { status: 201 });
  } catch (error) {
    console.error('Error creating audit:', error);
    return NextResponse.json({ error: 'Failed to create audit' }, { status: 500 });
  }
}
