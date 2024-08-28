import { Attachment, Chapter, Question } from '@prisma/client';

import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export const getChapter = async ({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) => {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: userId,
          courseId: courseId,
        },
      },
    });

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
      include:{
        questions: {
          where: {
            isPublished: true, // Fetch only published questions
          },
          include: {
            answers: true,  // Include answers for each question
          },
        },
      }
    });

    if (!chapter || !course) {
      throw new Error('Chapter (or) Course not found');
    }

    let attachments: Attachment[] = [];
    let questions : Question[] = []
    let nextChapter: Chapter | null = null;

    if (purchase) {
      attachments = await db.attachment.findMany({
        where: {
          courseId: courseId,
        },
      });
      questions = await db.question.findMany({
        where : {
          chapterId : chapterId,
          isPublished: true,
        },
      })
    }

    nextChapter = await db.chapter.findFirst({
      where: {
        courseId: courseId,
        isPublished: true,
        position: {
          gt: chapter?.position,
        },
      },
      orderBy: {
        position: 'asc',
      },
    });

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId: userId,
          chapterId: chapterId,
        },
      },
    });

    return {
      chapter,
      course,
      attachments,
      questions: chapter.questions,
      nextChapter,
      userProgress,
      purchase,
    };
  } catch (error) {
    console.log('[GET_CHAPTER]', error);
    return {
      chapter: null,
      course: null,
      attachments: [],
      questions: [],
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
};
