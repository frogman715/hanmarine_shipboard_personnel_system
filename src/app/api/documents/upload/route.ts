import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const cookieStore = cookies();
    const user = cookieStore.get('user')?.value;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = JSON.parse(user);
    const allowedRoles = ['DIRECTOR', 'CREWING_MANAGER', 'DOCUMENTATION_OFFICER', 'TRAINING_OFFICER'];
    
    if (!allowedRoles.includes(userData.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const certificateId = formData.get('certificateId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!certificateId) {
      return NextResponse.json({ error: 'Certificate ID required' }, { status: 400 });
    }

    // Verify certificate exists
    const certificate = await prisma.certificate.findUnique({
      where: { id: parseInt(certificateId) },
      include: { crew: true }
    });

    if (!certificate) {
      return NextResponse.json({ error: 'Certificate not found' }, { status: 404 });
    }

    // Create upload directory structure: /uploads/certificates/[crewId]/
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'certificates', certificate.crewId.toString());
    
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating directory:', error);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${certificate.type}_${timestamp}_${originalName}`;
    const filepath = join(uploadDir, filename);

    // Write file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Update certificate with file path
    const relativePath = `/uploads/certificates/${certificate.crewId}/${filename}`;
    const updated = await prisma.certificate.update({
      where: { id: certificate.id },
      data: { documentPath: relativePath },
      include: { crew: true }
    });

    return NextResponse.json({
      success: true,
      certificate: updated,
      filePath: relativePath
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
