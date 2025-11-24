import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { badRequest, notFound, serverError, safeParseJson } from '@/lib/auth';

export async function POST(request: Request, { params } : { params: { id: string } }){
  try{
    const crewId = parseInt(params.id, 10);
    if (!crewId || Number.isNaN(crewId)) return badRequest('Invalid crew id');

    const body = await safeParseJson(request);
    if (!body) return badRequest('Missing or invalid JSON body');

    // Validate fields
    const evaluator = body.evaluator ?? null;
    if (evaluator !== null && typeof evaluator !== 'string') return badRequest('evaluator must be a string');
    if (typeof evaluator === 'string' && evaluator.length > 255) return badRequest('evaluator too long');

    const rank = body.rank ?? null;
    if (rank !== null && typeof rank !== 'string') return badRequest('rank must be a string');
    if (typeof rank === 'string' && rank.length > 255) return badRequest('rank too long');

    let score: number | null = null;
    if (body.score !== undefined && body.score !== null) {
      const s = Number(body.score);
      if (!Number.isFinite(s)) return badRequest('score must be a number');
      if (s < 0 || s > 100) return badRequest('score must be between 0 and 100');
      score = s;
    }

    const comments = body.comments ?? null;
    if (comments !== null && typeof comments !== 'string') return badRequest('comments must be a string');
    if (typeof comments === 'string' && comments.length > 2000) return badRequest('comments too long');

    // Check crew exists
    const crew = await prisma.crew.findUnique({ where: { id: crewId } });
    if (!crew) return notFound('Crew not found');

    const record = await prisma.crewEvaluation.create({
      data: { crewId, evaluator, rank, score, comments, date: new Date() }
    });

    return NextResponse.json(record, { status: 201 });
  }catch(err:any){
    return serverError(err?.message ?? 'Internal server error');
  }
}
