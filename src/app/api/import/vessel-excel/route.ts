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

    // Parse FLAG sheet (vessel data)
    const flagSheet = workbook.Sheets['FLAG'];
    if (!flagSheet) {
      return NextResponse.json({ error: 'FLAG sheet not found' }, { status: 400 });
    }

    const flagData = xlsx.utils.sheet_to_json(flagSheet) as Record<string, unknown>[];

    // Filter valid rows (skip headers)
    const validRows = flagData.filter(
      (row: Record<string, unknown>) => {
        const name = row['NAME OF VESSSEL'] as string | undefined;
        return name && name.trim().length > 0;
      }
    );

    let imported = 0;
    let skipped = 0;

    for (const row of validRows) {
      const vesselName = (row['NAME OF VESSSEL'] as string)?.trim();
      const flag = (row['FLAG'] as string)?.trim() || 'UNKNOWN';
      const vesselType = (row['DESKRIPSI'] as string)?.trim();
      const owner = (row['OWNER'] as string)?.trim();

      if (!vesselName) {
        skipped++;
        continue;
      }

      try {
        // Upsert vessel (update if exists, create if not)
        await prisma.vessel.upsert({
          where: { name: vesselName },
          update: {
            flag,
            vesselType: vesselType || undefined,
            owner: owner || undefined,
          },
          create: {
            name: vesselName,
            flag,
            vesselType: vesselType || undefined,
            owner: owner || undefined,
          },
        });
        imported++;
      } catch (err) {
        console.error(`Error importing vessel ${vesselName}:`, err);
        skipped++;
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: `Import completed: ${imported} vessels imported, ${skipped} skipped`,
        imported,
        skipped,
        total: validRows.length,
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
