import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';

export async function POST(req: Request) {
  try {
    const { userId: teacherId } = auth(); // This is the teacher's userId
    const { courseId, studentId } = await req.json(); // Extract studentId from the request body

    // Check if the current user is a teacher
    if (!teacherId || !isTeacher(teacherId)) {
      return new NextResponse('Unauthorized operation', { status: 401 });
    }

    const existingPurchase = await db.purchase.findFirst({
      where: {
        userId: studentId,
        courseId: courseId,
      },
    });

    if (existingPurchase) {
      return NextResponse.json({ error: "Cette formation est déjà inscrite pour cet étudiant" }, { status: 400 });
    }

    // Create a bundle purchase entry for the student
    const purchase = await db.purchase.create({
      data: {
        userId: studentId, // Use studentId for the userId field
        courseId,
      },
    });

    return NextResponse.json(purchase);
  } catch (error) {
    console.log('[PURCHASE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
