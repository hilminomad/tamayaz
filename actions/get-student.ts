import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { clerkClient } from '@clerk/nextjs/server'; 

export const getStudent = async (
  studentId: string
) : Promise<any> => {

  const userId = auth()

  if(!userId)
  {
    return null
  }

  try {
    const student = await clerkClient.users.getUser(studentId);
    //console.log(student)
    if(!student)
    {
      return null;
    }

    const studentExercices = await db.userProgress.findMany({
      where: {
        userId: studentId,
      }
    })

    const studentSubscriptions = await db.bundlePurchase.findMany({
      where: {
        userId: studentId,
      }
    })
    
    const categories = await db.category.findMany();

    const titles: string[] = [];
      studentSubscriptions.forEach((sub) => {
        const category = categories.find(
          (cat) => cat.id === sub.categoryId
        );
        if (category) {
          titles.push(category.name);
        }
      });

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

      const progress = progresses.filter(
        (prog) => prog.userId === student.id
      ).length;

    

    let studentHeader = {
      name : student.firstName + ' ' + student.lastName,
      email: student.emailAddresses[0].emailAddress,
      imageUrl : student.imageUrl,
      startDate : student.createdAt,
      lastSignInAt: student.lastSignInAt,
      levels: titles,
      progress: progress,
    }


    // session logic

    //const userId = studentId

    //const sessions = await clerkClient.sessions.getSessionList({userId})

    //console.log('Sessionobject', sessions)

    return({studentHeader, progress})
    

  } catch (error) {
    console.log("Error fetching student:", error);
    return [];
  }
}