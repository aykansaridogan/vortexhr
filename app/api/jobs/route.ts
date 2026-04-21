import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const jobs = await db.job.findMany();
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  try {
    const { title, department, description } = await request.json();
    const job = await db.job.create({
      data: { title, department, description, status: 'OPEN' }
    });
    return NextResponse.json(job);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
