import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const jobId = searchParams.get('jobId');

  let candidates = await db.candidate.findMany({
    include: { job: true, analysis: true }
  });

  if (jobId) {
    candidates = candidates.filter((c: any) => c.jobId === jobId);
  }

  return NextResponse.json(candidates);
}
