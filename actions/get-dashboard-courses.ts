import { Category, Chapter, Course } from '@prisma/client';

import { db } from '@/lib/db';
import { getProgress } from '@/actions/get-progress';

type CourseWithProgressWithCategory = Course & {
  category: Category | null; // Make this nullable
  chapters: Chapter[];
  progress: number | null;
};

type DashboardCourses = {
  completedCourses: CourseWithProgressWithCategory[];
  coursesInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (
  userId: string
): Promise<DashboardCourses> => {
  try {
    // Fetch purchased courses
    const purchasedCourses = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      select: {
        course: {
          include: {
            category: true,
            chapters: {
              where: {
                isPublished: true,
              },
            },
          },
        },
      },
    });

    // Fetch purchased bundles
    const purchasedBundles = await db.bundlePurchase.findMany({
      where: {
        userId: userId,
      },
      include: {
        category: {
          include: {
            courses: {
              include: {
                chapters: {
                  where: {
                    isPublished: true,
                  },
                },
                category: true,
              },
            },
          },
        },
      },
    });

    // Combine courses from purchases and bundles
    const allCourses: CourseWithProgressWithCategory[] = [
      ...purchasedCourses.map((purchase) => ({
        ...purchase.course,
        category: purchase.course.category,
        chapters: purchase.course.chapters,
        progress: null,
      })),
      ...purchasedBundles.flatMap((bundle) =>
        bundle.category.courses.map((course) => ({
          ...course,
          category: bundle.category,
          chapters: course.chapters,
          progress: null,
        }))
      ),
    ];

    // Calculate progress for each course
    for (let course of allCourses) {
      const progress = await getProgress(userId, course.id);
      course.progress = progress;
    }

    // Separate completed and in-progress courses
    const completedCourses = allCourses.filter((course) => course.progress === 100);
    const coursesInProgress = allCourses.filter((course) => (course.progress ?? 0) < 100);

    return {
      completedCourses,
      coursesInProgress,
    };
  } catch (error) {
    console.log('[GET_DASHBOARD_COURSES]', error);
    return {
      completedCourses: [],
      coursesInProgress: [],
    };
  }
};