import { redirect } from 'next/navigation';

import { db } from '@/lib/db';
import { getProgress } from '@/actions/get-progress';
import { auth } from '@clerk/nextjs';
import { CourseModal } from './_components/course-modal';

const CourseIdPage = async ({ params }: { params: { courseId: string } }) => {
  
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId: userId,
            },
          },
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  });

  if (!course) {
    return redirect('/');
  }

  const progressCount = await getProgress(userId, course.id);

  return(
    <CourseModal course={course} progressCount={progressCount} />
  )
};

export default CourseIdPage;
