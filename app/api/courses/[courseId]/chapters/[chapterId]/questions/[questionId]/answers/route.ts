import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function POST(
  req: Request,
  { params }: { params: { questionId: string } }
) {
  try {
    const { userId } = auth();
    const { title, isCorrect } = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if the user owns the chapter that contains this question
    const questionOwner = await db.question.findFirst({
      where: {
        id: params.questionId,
        quiz: {
          course: {
            userId: userId,
          },
        },
      },
    });

    if (!questionOwner) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Create the new answer
    const answer = await db.answer.create({
      data: {
        title,
        isCorrect,
        questionId: params.questionId,
      },
    });

    return NextResponse.json(answer);
  } catch (error) {
    console.log('[QUESTIONS_QUESTION-ID_ANSWERS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
