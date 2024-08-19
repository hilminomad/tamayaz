import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

export async function PUT(
  req: Request,
  { params }: { params: {chapterId: string} }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { list } = await req.json();

    console.log(list)

    const chapterOwner = await db.chapter.findFirst({
      where: {
        id: params.chapterId,
        course: {
          userId: userId,
        },
      },
    });

    if (!chapterOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    for (let item of list) {
      await db.question.update({
        where: { id: item.id },
        data: { position: item.position },
      });
    }

    return new NextResponse('Success', { status: 200 });
  } catch (error) {
    console.log('[COURSES_COURSE-ID_QUESTIONS_REORDER]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}


