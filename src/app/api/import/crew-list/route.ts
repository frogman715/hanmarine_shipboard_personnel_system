import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import * as xlsx from 'xlsx';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Read file buffer
    const buffer = await file.arrayBuffer();
    const workbook = xlsx.read(new Uint8Array(buffer), { type: 'array' });

    // Get first sheet (crew list is usually on first sheet)
    const sheetName = workbook.SheetNames[0];
    if (!sheetName) {
      return NextResponse.json({ error: 'No sheets found in file' }, { status: 400 });
    }

    const sheet = workbook.Sheets[sheetName];
    const rawData = xlsx.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

    if (rawData.length < 3) {
      return NextResponse.json({ error: 'File too short, expected header rows' }, { status: 400 });
    }

    // Parse crew list - look for NAME column
    let crewData: Record<string, unknown>[] = [];
    let headerRow = -1;

    // Find header row (usually contains NAME, RANK, etc.)
    for (let i = 0; i < Math.min(10, rawData.length); i++) {
      const row = rawData[i];
      const rowStr = JSON.stringify(row).toLowerCase();
      if (rowStr.includes('name') || rowStr.includes('seaman')) {
        headerRow = i;
        const headers = row;
        // Convert subsequent rows using these headers
        for (let j = i + 1; j < rawData.length; j++) {
          const dataRow = rawData[j];
          const obj: Record<string, unknown> = {};
          headers.forEach((h, idx) => {
            if (h && h.toString().trim() !== '') {
              obj[h.toString().trim()] = dataRow[idx] || null;
            }
          });
          if (Object.keys(obj).length > 0 && (obj['name'] || obj['NAME'] || obj['SEAMAN NAME'])) {
            crewData.push(obj);
          }
        }
        break;
      }
    }

    if (crewData.length === 0) {
      // Fallback: use default JSON parsing
      crewData = xlsx.utils.sheet_to_json(sheet) as Record<string, unknown>[];
    }

    // Filter valid crew (must have name)
    const validCrew = crewData.filter((row) => {
      const name = 
        (row['name'] || row['NAME'] || row['SEAMAN NAME'] || row['Seaman name'] || 
         row['SEAMAN'] || row['Crew Name']) as string | undefined;
      return name && name.trim().length > 0 && name !== 'NAME' && name !== 'SEAMAN NAME';
    });

    let imported = 0;
    let skipped = 0;

    for (const row of validCrew) {
      try {
        const name = (
          row['name'] || row['NAME'] || row['SEAMAN NAME'] || row['Seaman name'] || 
          row['SEAMAN'] || row['Crew Name']
        ) as string;
        
        const rank = (
          row['rank'] || row['RANK'] || row['Position'] || 
          row['position'] || row['POSITION']
        ) as string | undefined;

        const vessel = (
          row['vessel'] || row['VESSEL'] || row['Vessel Name'] ||
          row['Ship'] || row['SHIP']
        ) as string | undefined;

        if (!name.trim()) {
          skipped++;
          continue;
        }

        // Create crew (don't upsert, just create new records)
        // This allows multiple crew with same name from different batches
        await prisma.crew.create({
          data: {
            fullName: name.trim(),
            rank: rank?.trim() || undefined,
            vessel: vessel?.trim() || undefined,
          },
        });
        imported++;
      } catch (err) {
        console.error('Error importing crew:', err);
        skipped++;
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Import completed: ${imported} crew members imported, ${skipped} skipped`,
        imported,
        skipped,
        total: validCrew.length,
        sheetName,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Import failed' },
      { status: 500 }
    );
  }
}
