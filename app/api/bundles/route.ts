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

    // Check if the bundle purchase already exists
    const existingBundlePurchase = await db.bundlePurchase.findFirst({
      where: {
        userId: studentId,
        categoryId: categoryId,
      },
    });

    if (existingBundlePurchase) {
      return NextResponse.json({ error: "Ce semestre est déjà inscrit pour cet étudiant" }, { status: 400 });
    }

    // Start a transaction to ensure all operations succeed or fail together
    const result = await db.$transaction(async (tx) => {
      // Create a bundle purchase entry for the student
      const bundlePurchase = await tx.bundlePurchase.create({
        data: {
          userId: studentId,
          categoryId,
        },
      });

      // Get all courses for the category
      const courses = await tx.course.findMany({
        where: {
          categoryId: categoryId,
        },
      });

      // Create purchase entries for each course
      const coursePurchases = await Promise.all(
        courses.map(async (course) => {
          // Check if the purchase already exists
          const existingPurchase = await tx.purchase.findFirst({
            where: {
              userId: studentId,
              courseId: course.id,
            },
          });

          if (!existingPurchase) {
            return tx.purchase.create({
              data: {
                userId: studentId,
                courseId: course.id,
              },
            });
          }
          return existingPurchase;
        })
      );

      return { bundlePurchase, coursePurchases };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.log('[BUNDLES]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}