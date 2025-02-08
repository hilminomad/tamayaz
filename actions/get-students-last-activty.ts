
import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { clerkClient } from '@clerk/nextjs/server'; 

export const getLastActivity = async() => {

  const userId = auth()

  if(!userId)
  {
    return null
  }


  //console.log(userId)
  try {
    // Fetch students with more details
    const students = await clerkClient.users.getUserList({
      limit: 500,
      // You can add more query parameters if needed
    });

    if(!students)
    {
      return null;
    }

    /*const sessions = await clerkClient.sessions.getSessionList({
      clientId : userId,
      
    })*/

    


    //console.log(sessions)


  

    const studentsCount = students.length;

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
      include: {
        chapter: {
          include: {
            course: {
              include: {
                category: true,
              }
            }
          }
        }
      },
      orderBy: {
        updatedAt: "desc"
      },
      take: 10 // Limit the number of results to 10
    });

    const progressData = progresses.map(progress => {
      // Find the corresponding user from Clerk
      const user = students.find(student => student.id === progress.userId);

      return {
        //...progress,
        course: progress.chapter?.course.title ?? null,
        chapter: progress.chapter?.title ?? null, 
        category: progress.chapter?.course?.category?.name ?? null,
        studentFirstName: user?.firstName ?? 'Utilisateur',
        studentLastName: user?.lastName ?? 'Inconnu',
        studentEmail: user?.emailAddresses[0]?.emailAddress ?? 'N/A',
        time : progress.updatedAt ?? null,
      }


    });
    return progressData
  } catch (error) {
    console.log("Error fetching last activities:", error);
    return [];
  }
}