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

    const question = await db.question.findUnique({
      where: {
        id: params.questionId,
        chapterId: params.chapterId,
      },
      include: {
        answers: true,
      },
    });

    if (!question) {
      return new NextResponse('Question not found', { status: 404 });
    }

    const correctAnswers = question.answers.filter((answer) => answer.isCorrect).length;
    const incorrectAnswers = question.answers.filter((answer) => !answer.isCorrect).length;

    if (correctAnswers < 1 || incorrectAnswers < 1) {
      return new NextResponse('A question must have at least one correct and one incorrect answer to be published', { status: 400 });
    }

    const publishedQuestion = await db.question.update({
      where: {
        id: params.questionId,
        chapterId: params.chapterId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedQuestion);
  } catch (error) {
    console.log('[COURSES_QUESTION-ID_PUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
