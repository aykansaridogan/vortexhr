import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Önce ilişkili yoklama kayıtlarını sil
    await db.attendance.deleteMany({
      where: { employeeId: id }
    });

    // Sonra personeli sil
    await db.employee.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Silme işlemi başarısız oldu' },
      { status: 500 }
    );
  }
}
