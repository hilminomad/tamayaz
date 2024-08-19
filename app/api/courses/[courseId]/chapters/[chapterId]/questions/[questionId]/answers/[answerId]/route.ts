import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string; questionId: string; answerId: string } }
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

    const answer = await db.answer.findUnique({
      where: {
        id: params.answerId,
        questionId: params.questionId,
      },
    });

    if (!answer) {
      return new NextResponse('Not found', { status: 404 });
    }

    const deletedAnswer = await db.answer.delete({
      where: {
        id: params.answerId,
      },
    });

    return NextResponse.json(deletedAnswer);
  } catch (error) {
    console.log('[COURSES_COURSE-ID_CHAPTERS_CHAPTER-ID_QUESTIONS_QUESTION-ID_ANSWERS_ANSWER-ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string; questionId: string; answerId: string } }
) {
  try {
    const { userId } = auth();
    const { isCorrect, ...values } = await req.json();

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

    const updatedAnswer = await db.answer.update({
      where: {
        id: params.answerId,
        questionId: params.questionId,
      },
      data: {
        ...values,
        isCorrect: isCorrect ?? undefined,
      },
    });

    return NextResponse.json(updatedAnswer);
  } catch (error) {
    console.log('[COURSES_COURSE-ID_CHAPTERS_CHAPTER-ID_QUESTIONS_QUESTION-ID_ANSWERS_ANSWER-ID]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
