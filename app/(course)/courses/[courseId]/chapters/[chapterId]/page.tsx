import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';
import { ArrowLeft, File } from 'lucide-react';

import { Banner } from '@/components/banner';
import { Preview } from '@/components/preview';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { VideoPlayer } from './_components/video-player';
import { CourseEnrollButton } from './_components/course-enroll-button';
import { CourseProgressButton } from './_components/course-progress-button';

// DB & Actions
import { getChapter } from '@/actions/get-chapter';
import { CourseQuestions } from './_components/course-questions';
import Link from 'next/link';

const ChapterIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const {
    chapter,
    course,
    attachments,
    questions,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId: userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });

  if (!chapter || !course || !questions ) {
    return redirect('/');
  }
  console.log(questions)
  const isLocked = !chapter.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div>
      {userProgress?.isCompleted && (
        <Banner label="Vous avez déjà terminé ce chapitre." variant="success" />
      )}
      {isLocked && (
        <Banner
          label="Vous devez acheter ce cours pour regarder ce chapitre."
          variant="warning"
        />
      )}
      <Link
        href={`/courses/${params.courseId}`}
        className="flex items-center text-sm hover:opacity-75 transition font-medium px-4 my-4"
      >
        <Button>
        <ArrowLeft className="h-4 w-4 mr-2 font-medium" />
         <p className='font-medium'>Retour à la page du cours</p> 
        </Button>
        
      </Link>
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}   
  
            isLocked={isLocked}
            
            videoUrl={chapter.videoUrl ?? undefined} 
          />
        </div>
        <div>
          <div className="p-4 flex flex-col md:flex-row items-center justify-between">
            <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
            {purchase ? (
              <CourseProgressButton
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            ) : (
              <CourseEnrollButton
                courseId={params.courseId}
                price={course.price!}
              />
            )}
          </div>
          <Separator />
          <div>
            <Preview value={chapter.description!} />
          </div>
          {!!attachments.length && (
            <>
              <Separator />
              <div className="p-4">
                {attachments.map((attachment) => (
                  <a
                    href={attachment.url}
                    target="_blank"
                    key={attachment.id}
                    className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  >
                    <File />
                    <p className="line-clamp-1">{attachment.name}</p>
                  </a>
                ))}
              </div>
            </>
          )}
          <Separator/>
          
          {
            purchase && 
          
          <CourseQuestions
            courseId={params.courseId}
            chapterId={params.chapterId}   
            questions={questions}
            isCompleted={!!userProgress?.isCompleted}
            isFirstTime={!!userProgress?.isFirstTime}
            nextChapterId={nextChapter?.id}   
            completeOnEnd={completeOnEnd}       
          />
          } 
        </div>
      </div>
    </div>
  );
};

export default ChapterIdPage;
