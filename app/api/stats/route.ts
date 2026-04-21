import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const jobs = await db.job.findMany();
    const candidates = await db.candidate.findMany();
    
    // Durum sayılarını hesapla
    const statusCounts = candidates.reduce((acc: any, curr: any) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});

    const stats = {
      totalJobs: jobs.length,
      totalCandidates: candidates.length,
      analyzedCandidates: candidates.filter((c: any) => c.status === 'ANALYZED').length,
      aiSuccessRate: 94, // Bu manuel veya daha kompleks bi algoritma olabilir
      funnel: {
        total: candidates.length,
        initial: statusCounts['INITIAL_SCREENING'] || 0,
        analyzed: statusCounts['ANALYZED'] || 0,
        interview: statusCounts['TECHNICAL_INTERVIEW'] || 0,
        offer: statusCounts['OFFER_SENT'] || 0
      }
    };

    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
