import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string; questionId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const unpublishedQuestion = await db.question.update({
      where: {
        id: params.questionId,
        chapterId: params.chapterId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unpublishedQuestion);
  } catch (error) {
    console.log('[COURSES_QUESTION-ID_UNPUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
