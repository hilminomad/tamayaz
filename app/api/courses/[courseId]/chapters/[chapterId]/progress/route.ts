import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { isCompleted, isFirstTime } = await req.json(); // Accept both isCompleted and isFirstTime

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId: userId,
          chapterId: params.chapterId,
        },
      },
      update: {
        isCompleted: isCompleted,
        isFirstTime: isFirstTime, // Update isFirstTime
      },
      create: {
        userId: userId,
        chapterId: params.chapterId,
        isCompleted: isCompleted,
        isFirstTime: isFirstTime, // Create with isFirstTime
      },
    });

    return NextResponse.json(userProgress);
  } catch (error) {
    console.log('[COURSES_COURSE-ID_CHAPTERS_CHAPTER-ID_PROGRESS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
