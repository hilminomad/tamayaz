import { db } from '@/lib/db';
import { clerkClient } from "@clerk/nextjs/server";

export const getStudentAnalytics = async () => {
  try {
    // Fetch students with more details
    const students = await clerkClient.users.getUserList({
      limit: 500,
    });

    if (!students) {
      return null;
    }

    const publishedChapters = await db.chapter.findMany({
      where: {
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    const progresses = await db.userProgress.findMany({
      where: {
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    const subscriptions = await db.bundlePurchase.findMany();

    const categories = await db.category.findMany();

    const studentData = students.map((student) => {
      // Getting the number of chapters a student has solved
      const progress = progresses.filter(
        (prog) => prog.userId === student.id
      ).length;

      // Getting the categories that a user is enrolled in
      const studentSubscriptions = subscriptions.filter(
        (sub) => sub.userId === student.id
      );

      const titles: string[] = [];
      studentSubscriptions.forEach((sub) => {
        const category = categories.find(
          (cat) => cat.id === sub.categoryId
        );
        if (category) {
          titles.push(category.name);
        }
      });

      // Join the titles array into a single string
      const title = titles.join(" ");

      return {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        progress,
        title, // Use the joined string instead of the array
      };
    });

    return studentData;

  } catch (error) {
    console.log('Error student Data', error);
    return null;
  }
};
