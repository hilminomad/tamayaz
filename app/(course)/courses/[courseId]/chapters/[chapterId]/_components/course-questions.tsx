'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Answer, Question } from '@prisma/client';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useConfettiStore } from '@/hooks/use-confetti-store';
import axios from 'axios';

interface CourseQuestionsProps {
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  completeOnEnd: boolean;
  isCompleted?: boolean;
  isFirstTime?: boolean;
  questions: (Question & { answers: Answer[] })[];
}

export const CourseQuestions: React.FC<CourseQuestionsProps> = ({
  courseId,
  chapterId,
  completeOnEnd: initialCompleteOnEnd,
  nextChapterId,
  questions,
  isCompleted,
  isFirstTime,
}) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [progress, setProgress] = useState(0);
  const [unlockedQuestionIndex, setUnlockedQuestionIndex] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<boolean[]>(Array(questions.length).fill(false));
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: Set<string> }>({});

  const handleAnswerClick = (questionIndex: number, answerId: string) => {
    setSelectedAnswers((prev) => {
      const updated = { ...prev };
      const answersSet = new Set(updated[questionIndex] || []);
      
      if (answersSet.has(answerId)) {
        answersSet.delete(answerId);
      } else {
        answersSet.add(answerId);
      }

      updated[questionIndex] = answersSet;
      return updated;
    });
  };

  const handleConfirmClick = (questionIndex: number) => {
    const correctAnswers = questions[questionIndex].answers
      .filter((answer) => answer.isCorrect)
      .map((answer) => answer.id);
    const selected = Array.from(selectedAnswers[questionIndex] || []);

    const isCorrect =
      correctAnswers.length === selected.length &&
      correctAnswers.every((id) => selected.includes(id));

    if (isCorrect) {
      toast.success("Très bien!");
      setUnlockedQuestionIndex((prev) => Math.max(prev, questionIndex + 1));
      setAnsweredQuestions((prev) => {
        const updated = [...prev];
        updated[questionIndex] = true;
        return updated;
      });
      setProgress((prev) => prev + (100 / questions.length));
    } else {
      toast.error("Votre réponse est incorrecte!");
    }
  };

  const handleRetakeQuestion = (questionIndex: number) => {
    if (questionIndex <= unlockedQuestionIndex) {
      setAnsweredQuestions((prev) => {
        const updated = [...prev];
        updated[questionIndex] = false;
        return updated;
      });

      setSelectedAnswers((prev) => {
        const updated = { ...prev };
        updated[questionIndex] = new Set();
        return updated;
      });

      setProgress((prev) => prev - (100 / questions.length));
    }
  };

  const isProgressFull = progress === 100;
  const completeOnEnd = initialCompleteOnEnd && isProgressFull;

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(
          `/api/courses/${courseId}/chapters/${chapterId}/progress`,
          {
            isCompleted: true,
            isFirstTime: true,
            
          }
        );

        if(nextChapterId){
          await axios.put(
            `/api/courses/${courseId}/chapters/${nextChapterId}/progress`,
            {
              isFirstTime: true,              
            }
          );
        }

        if (!nextChapterId) {
          confetti.onOpen();
        }

        toast.success('Félicitation! Vous avez fini ce chapitre');

        router.refresh();

        if (nextChapterId) {
          router.push(`/courses/${courseId}`);
        }
      } else {
        toast.error("Vous devez répondre à toutes les questions avant de terminer le chapitre.");
      }
    } catch (error) {
      toast.error('Erreur');
      console.log('Problem', error);
    }
  };

  return (

    <>
      { !isCompleted &&
        <div>
        {questions.map((question, index) => {
          const isUnlocked = index <= unlockedQuestionIndex;
          const isAnswered = answeredQuestions[index];
          const selected = Array.from(selectedAnswers[index] || []);
  
          return (
            <div key={question.id} className="relative min-h-[220px] m-4 border rounded-md p-4 bg-slate-100">
              {isUnlocked ? (
                <>
                  <h3 className="text-l font-semibold italic my-2">- {question.title}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
                    {question.answers.map((answer) => (
                      <div key={answer.id}>
                        <Button
                          className={cn(
                            'w-full py-8 min-h-[120px] transform transition-transform duration-200 ease-in-out',
                            selected.includes(answer.id) ? 'bg-emerald-600 text-white scale-105' : 'bg-white hover:scale-105'
                          )}
                          size="lg"
                          variant="outline"
                          onClick={() => handleAnswerClick(index, answer.id)}
                        >
                          <h3 className="font-semibold">{answer.title}</h3>
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="w-full flex justify-center">
                    {!isAnswered && (
                      <Button onClick={() => handleConfirmClick(index)}>
                        Confirmer la réponse
                      </Button>
                    )}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center text-center">
                  <Lock size={48} />
                  <p>Répondez correctement à la question précédente pour déverrouiller celle-ci.</p>
                </div>
              )}
  
              {isAnswered && index < unlockedQuestionIndex && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex flex-col items-center justify-center text-center">
                  <Button onClick={() => handleRetakeQuestion(index)}>
                    Refaire la question
                  </Button>
                </div>
              )}
            </div>
          );
        })}
  
        <div className="p-4">
          <Button
            onClick={onEnd}
            className={cn(
              'w-full py-8 min-h-[80px] transform transition-transform duration-200 ease-in-out',
              completeOnEnd && 'bg-emerald-600 text-white scale-105'
            )}
          >
            Progrès: {progress}%<br /> {completeOnEnd && 'Cliquez pour confirmer vos réponses'}
          </Button>
        </div>
      </div>
      }
    </>
    
  );
};
