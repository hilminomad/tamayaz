import Link from 'next/link';
import { redirect } from 'next/navigation';

import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';
import QuestionTitleForm from './_components/question-title-form';
import { IconBadge } from '@/components/icon-badge';
import { ArrowLeft, CheckSquare, LayoutDashboard, ListChecks, Text } from 'lucide-react';
import QuestionsAnswerForm from './_components/questions-answer-form';
import { AnwsersList } from './_components/answers-list';
import { Banner } from '@/components/banner';
import QuestionActions from './_components/question-actions';


const QuestionIdPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string; questionId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  const question = await db.question.findUnique({
    where: {
      id: params.questionId,
      chapterId: params.chapterId
    },
    include: {
      answers: true, // Include answers here
    },
  });

  if (!question) {
    return redirect('/');
  }

  // Check if there's at least one correct and one incorrect answer
  const hasCorrectAnswer = question.answers.some(answer => answer.isCorrect);
  const hasIncorrectAnswer = question.answers.some(answer => !answer.isCorrect);
  const isComplete = hasCorrectAnswer && hasIncorrectAnswer;

  return (
    <>
      {!question.isPublished && (
        <Banner
          variant="warning"
          label="Cette question n'est pas publiée."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/teacher/courses/${params.courseId}/chapters/${params.chapterId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Retour à la configuration du chapitre
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Création de question</h1>
                <span className="text-sm text-slate-700">
                  Ajoutez au moins une réponse correcte et une réponse incorrecte pour publier la question! ({hasCorrectAnswer && hasIncorrectAnswer ? 'Complet' : 'Incomplet'})
                </span>
              </div>
              <QuestionActions
                disabled={!isComplete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                questionId={params.questionId}
                isPublished={question.isPublished}
                //answers={question.answers}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Personnaliser la question</h2>
            </div>
            <QuestionTitleForm
              initialData={question}
              questionId={params.questionId}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
            <div className="flex mt-6 items-center gap-x-2">
              <IconBadge icon={CheckSquare} />
              <h2 className="text-xl">Ajouter une réponse</h2>
            </div>
            <QuestionsAnswerForm
              initialData={question?.answers}
              questionId={params.questionId}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListChecks} />
              <h2 className="text-xl">Réponses</h2>
            </div>
            <AnwsersList
              items={question?.answers}
              questionId={params.questionId}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionIdPage;