import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
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

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      include: {
        questions: {
          where: {
            isPublished: true,
          },
        },
      },
    });

    // Remove the muxData query and related logic
    // ...

    if (!chapter || !chapter.title || !chapter.description || !chapter.videoUrl || !chapter.questions.length) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const publishedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedChapter);
  } catch (error) {
    console.log('[COURSES_COURSE-ID_CHAPTERS_CHPATER-ID_PUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
