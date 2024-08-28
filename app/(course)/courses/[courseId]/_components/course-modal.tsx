import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';
import { Chapter, Course, UserProgress } from '@prisma/client';

import { CourseSidebarItem } from './course-sidebar-item';
import { CourseProgress } from '@/components/course-progress';

import { db } from '@/lib/db';
import Logo from '@/app/(dashboard)/_components/logo';
import { CourseEnrollButton } from '../chapters/[chapterId]/_components/course-enroll-button';
import { Book } from 'lucide-react';

interface CourseModalProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseModal = async ({
  course,
  progressCount,
}: CourseModalProps) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId: userId,
        courseId: course.id,
      },
    },
  });
  
  const progress = course.chapters.map((chapter, index) => {
    !!chapter.userProgress?.[0]?.isFirstTime === false;
  })

  console.log(progress)

  return (
    <div className="h-full flex flex-col shadow-sm">
      <div className="p-6 flex flex-col bg-slate-50">
      
        <div className='w-full my-10 flex flex-col gap-4 md:flex-row items-center justify-between'>
          <div>
            <h1 className="font-bold text-3xl mb-4">{course.title}</h1>
            <p className='max-w-[400px] mb-4 text-slate-700'>{course.description}</p>
            <div className='flex text-slate-500'>
              <Book/>
              <p className='text-xl text-blue font-semibold'>
               {course.chapters.length} 
              {course.chapters.length === 1 ? ' Chapitre' : ' Chapitres'} 
              </p>
                
              </div>
          </div>
          {!purchase ? 
            <CourseEnrollButton
              courseId={course.id}
              price={course.price!}
            />
            :
            <div className='sm:w-[260px] w-full'>
              <CourseProgress
                variant={progressCount === 100 ? 'success' : 'default'}
                value={progressCount}
              />
            </div> 
            
          }
        </div>
        
      </div>
      <div className="p-6 flex flex-wrap justify-around w-full">
        {course.chapters.map((chapter) => (
          
          <CourseSidebarItem
            key={chapter.id}
            id={chapter.id}
            label={chapter.title}
            number={chapter.position}
            description={chapter.description || ''}
            isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
            isProgress={!!chapter.userProgress?.[0]?.isFirstTime}
            courseId={course.id}
            isLocked={!chapter.isFree && !purchase}
          />
        ))}
      </div>
    </div>
  );
};
