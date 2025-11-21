import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(employees);
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      employeeCode,
      fullName,
      email,
      phone,
      position,
      department,
      hireDate,
      employmentType,
      basicSalary,
      createdBy
    } = body;

    if (!employeeCode || !fullName || !position || !department || !hireDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const employee = await prisma.employee.create({
      data: {
        employeeCode,
        fullName,
        email: email || null,
        phone: phone || null,
        position,
        department,
        hireDate: new Date(hireDate),
        employmentType: employmentType || 'REGULAR',
        status: 'ACTIVE',
        createdBy: createdBy || 'System'
      }
    });

    return NextResponse.json(employee, { status: 201 });
  } catch (error) {
    console.error('Error creating employee:', error);
    return NextResponse.json({ error: 'Failed to create employee' }, { status: 500 });
  }
}
