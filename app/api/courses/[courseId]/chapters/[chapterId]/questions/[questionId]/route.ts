import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

export async function DELETE(
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

    const question = await db.question.findUnique({
      where: {
        id: params.questionId,
        chapterId: params.chapterId,
      },
    });

    if (!question) {
      return new NextResponse('Not found', { status: 404 });
    }

    const deletedQuestion = await db.question.delete({
      where: {
        id: params.questionId,
      },
    });

    return NextResponse.json(deletedQuestion);
  } catch (error) {
    console.log('[COURSES_COURSE-ID_CHAPTERS_CHAPTER-ID_QUESTIONS_QUESTION-ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string; questionId: string } }
) {
  try {
    const { userId } = auth();
    const { ...values } = await req.json();

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

    const question = await db.question.update({
      where: {
        id: params.questionId,
        chapterId: params.chapterId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.log('[COURSES_COURSE-ID_CHAPTERS_CHAPTER-ID_QUESTIONS_QUESTION-ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}