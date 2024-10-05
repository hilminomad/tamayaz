import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';

export async function POST(req: Request) {
  try {
    const { userId: teacherId } = auth(); // This is the teacher's userId
    const { categoryId, studentId } = await req.json(); // Extract studentId from the request body

    // Check if the current user is a teacher
    if (!teacherId || !isTeacher(teacherId)) {
      return new NextResponse('Unauthorized operation', { status: 401 });
    }


    const existingPurchase = await db.bundlePurchase.findFirst({
      where: {
        userId: studentId,
        categoryId: categoryId,
      },
    });

    if (existingPurchase) {
      return NextResponse.json({ error: "Ce semestre est déjà inscrit pour cet étudiant" }, { status: 400 });
    }

    // Create a bundle purchase entry for the student
    const bundlePurchase = await db.bundlePurchase.create({
      data: {
        userId: studentId, // Use studentId for the userId field
        categoryId,
      },
    });

    return NextResponse.json(bundlePurchase);
  } catch (error) {
    console.log('[BUNDLES]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
