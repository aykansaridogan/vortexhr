import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const candidate = await db.candidate.findUnique({
      where: { id },
      include: { job: true, analysis: true }
    });

    if (!candidate) return NextResponse.json({ error: 'Aday bulunamadı' }, { status: 404 });

    return NextResponse.json(candidate);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
