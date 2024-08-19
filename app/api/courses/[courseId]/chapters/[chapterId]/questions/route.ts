import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { chapterId: string } }
) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

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

    const lastQuestion = await db.question.findFirst({
      where: {
        chapterId: params.chapterId,
      },
      orderBy: {
        position: 'desc',
      },
    });

    const newPosition = lastQuestion ? lastQuestion.position + 1 : 1;

    const question = await db.question.create({
      data: {
        title,
        chapterId: params.chapterId,
        position: newPosition,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.log('[CHAPTERS_CHAPTER-ID_QUESTIONS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}