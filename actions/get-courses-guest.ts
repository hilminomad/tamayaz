import { Category, Course } from '@prisma/client';

import { db } from '@/lib/db';

type CourseWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
};

export const getCourses = async (): Promise<CourseWithCategory[]> => {
  try {
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const coursesWithCategory: CourseWithCategory[] = courses.map(
      (course) => ({
        ...course,
        progress: null, // Set progress to null for all courses
        category: course.category,
        chapters: course.chapters,
      })
    );

    return coursesWithCategory;
  } catch (error) {
    console.log('[GET_COURSES]', error);
    return [];
  }
};