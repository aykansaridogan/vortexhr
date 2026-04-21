import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const employees = await db.employee.findMany({
    include: { job: true }
  });
  return NextResponse.json(employees);
}

export async function POST(request: Request) {
  try {
    const { candidateId } = await request.json();

    const candidate = await db.candidate.findUnique({
      where: { id: candidateId },
      include: { job: true }
    });

    if (!candidate) return NextResponse.json({ error: 'Aday bulunamadı' }, { status: 404 });

    const employee = await db.employee.create({
      data: {
        name: candidate.name,
        email: candidate.email || `${candidate.name.toLowerCase().replace(' ', '.')}@company.com`,
        role: candidate.job.title,
        department: candidate.job.department,
        jobId: candidate.jobId,
        startDate: new Date().toISOString()
      }
    });

    await db.candidate.update({
      where: { id: candidateId },
      data: { status: 'OFFER' }
    });

    return NextResponse.json(employee);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
