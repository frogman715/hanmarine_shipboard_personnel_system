import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const formCode = searchParams.get('code');
    const category = searchParams.get('category'); // crewing, admin, accounting
    const filename = searchParams.get('file');

    if (!formCode || !category || !filename) {
      return NextResponse.json(
        { success: false, error: 'Missing required parameters: code, category, file' },
        { status: 400 }
      );
    }

    // Map category to folder name
    const categoryFolders: Record<string, string> = {
      crewing: 'CR FORMS',
      admin: 'AD FORMS',
      accounting: 'AC FORMS'
    };

    const folderName = categoryFolders[category];
    if (!folderName) {
      return NextResponse.json(
        { success: false, error: 'Invalid category' },
        { status: 400 }
      );
    }

    // Construct file path
    const filePath = path.join(process.cwd(), 'public', 'templates', 'HGQS', folderName, filename);

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { success: false, error: 'Form template not found' },
        { status: 404 }
      );
    }

    // Read file
    const fileBuffer = fs.readFileSync(filePath);
    const fileExtension = path.extname(filename).toLowerCase();

    // Determine content type
    let contentType = 'application/octet-stream';
    if (fileExtension === '.doc' || fileExtension === '.docx') {
      contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    } else if (fileExtension === '.xls' || fileExtension === '.xlsx') {
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    }

    // Return file
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error: any) {
    console.error('Error downloading form:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
