import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

function badRequest(message: string){
  return NextResponse.json({ error: message }, { status: 400 });
}

export async function POST(request: Request, { params } : { params: { id: string } }){
  try{
    const crewId = parseInt(params.id,10);
    if (!crewId || Number.isNaN(crewId)) return badRequest('Invalid crew id');

    const body = await request.json().catch(()=>null);
    if (!body) return badRequest('Missing JSON body');

    // Validate fields
    let repatriationDate: Date | null = null;
    if (body.repatriationDate){
      const d = new Date(body.repatriationDate);
      if (Number.isNaN(d.getTime())) return badRequest('Invalid repatriationDate');
      repatriationDate = d;
    }

    const reason = body.reason ?? null;
    if (reason !== null && typeof reason !== 'string') return badRequest('reason must be a string');
    if (typeof reason === 'string' && reason.length > 1000) return badRequest('reason too long');

    let finalAccount: number | null = null;
    if (body.finalAccount !== undefined && body.finalAccount !== null){
      const n = Number(body.finalAccount);
      if (!Number.isFinite(n)) return badRequest('finalAccount must be a number');
      finalAccount = n;
    }

    const processedBy = body.processedBy ?? null;
    if (processedBy !== null && typeof processedBy !== 'string') return badRequest('processedBy must be a string');
    if (typeof processedBy === 'string' && processedBy.length > 255) return badRequest('processedBy too long');

    const remarks = body.remarks ?? null;
    if (remarks !== null && typeof remarks !== 'string') return badRequest('remarks must be a string');
    if (typeof remarks === 'string' && remarks.length > 2000) return badRequest('remarks too long');

    // Check crew exists
    const crew = await prisma.crew.findUnique({ where: { id: crewId } });
    if (!crew) return NextResponse.json({ error: 'Crew not found' }, { status: 404 });

    const rec = await prisma.repatriation.create({
      data: {
        crewId,
        repatriationDate,
        reason,
        finalAccount,
        processedBy,
        remarks,
      }
    });

    return NextResponse.json(rec, { status: 201 });
  }catch(err:any){
    return NextResponse.json({ error: err?.message ?? String(err) }, { status: 500 });
  }
}
