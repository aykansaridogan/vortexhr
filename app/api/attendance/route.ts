import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendances = await db.attendance.findMany({
    where: {
      checkIn: {
        gte: today.toISOString()
      }
    },
    include: { employee: true }
  });
  return NextResponse.json(attendances);
}

export async function POST(request: Request) {
  try {
    const { employeeId, type } = await request.json();
    
    if (type === 'CHECK_IN') {
      const attendance = await db.attendance.create({
        data: {
          employeeId,
          checkIn: new Date().toISOString(),
          status: 'PRESENT'
        }
      });
      return NextResponse.json(attendance);
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const lastAttendance = await db.attendance.findFirst({
        where: {
          employeeId,
          checkIn: { gte: today.toISOString() },
          checkOut: null
        }
      });

      if (!lastAttendance) return NextResponse.json({ error: 'Aktif giriş bulunamadı' }, { status: 400 });

      const updated = await db.attendance.update({
        where: { id: lastAttendance.id },
        data: { checkOut: new Date() } // Internal logic handles ISO conversion
      });
      return NextResponse.json(updated);
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
