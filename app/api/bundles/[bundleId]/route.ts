import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';

export async function DELETE(
  req: Request,
  { params }: { params: { bundleId: string } }
) {
  try {
    const { userId: teacherId } = auth();
    const { bundleId } = params;

    if (!teacherId || !isTeacher(teacherId)) {
      return new NextResponse('Unauthorized operation', { status: 401 });
    }

    // Start a transaction to ensure all operations succeed or fail together
    const result = await db.$transaction(async (tx) => {
      // Find the bundle purchase
      const bundlePurchase = await tx.bundlePurchase.findUnique({
        where: {
          id: bundleId,
        },
        include: {
          category: {
            include: {
              courses: true,
            },
          },
        },
      });

      if (!bundlePurchase) {
        throw new Error('Bundle purchase not found');
      }

      // Delete all associated course purchases
      await tx.purchase.deleteMany({
        where: {
          userId: bundlePurchase.userId,
          courseId: {
            in: bundlePurchase.category.courses.map(course => course.id),
          },
        },
      });

      // Delete the bundle purchase
      const deletedBundlePurchase = await tx.bundlePurchase.delete({
        where: {
          id: bundleId,
        },
      });

      return deletedBundlePurchase;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.log('[BUNDLE_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}