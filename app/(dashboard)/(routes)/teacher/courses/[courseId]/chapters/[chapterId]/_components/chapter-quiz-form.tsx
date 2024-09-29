'use client';

import { useState , useEffect} from "react";
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from "@/components/ui/button";
import { PlusCircle, Loader2 } from "lucide-react";
import { Chapter, Question, Answer } from "@prisma/client";

import { QuestionsList } from './questions-list'; // Import your new component
import { cn } from "@/lib/utils";

interface QuestionWithAnswers extends Question {
  answers: Answer[];
}

interface QuestionsFormProps {
  initialData: Chapter & { questions: QuestionWithAnswers[] };
  chapterId: string;
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
});

const ChapterQuizForm: React.FC<QuestionsFormProps> = ({ initialData, chapterId, courseId }) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);


  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });


  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/questions`, values);
      toast.success('Question créée avec succès');
      toggleCreating();
      router.refresh();
    } catch (error) {
      toast.error("Une erreur s'est produite");
    }
  };

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    try {
      setIsUpdating(true);
      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/questions/reorder`, {
        list: updateData,
      });
      toast.success('Ordre des questions modifié');
      router.refresh();
    } catch (error) {
      toast.error("Une erreur s'est produite");
    }
    finally {
      setIsUpdating(false);
    }
  };

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${chapterId}/questions/${id}`);
  };


  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      {isUpdating && (
        <div className="absolute h-full w-full bg-slate-500/20 top-0 right-0 rounded-m flex items-center justify-center">
          <Loader2 className="animate-spin h-6 w-6 text-sky-700" />
        </div>
      )}
      <div className="font-medium flex items-center justify-between">
        Questions
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Annuler</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une question
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="ex. 'Introduction ...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={!isValid || isSubmitting} type="submit">
              Créer
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.questions.length && 'text-slate-500 italic'
          )}
        >
          {!initialData.questions.length && 'Aucune question'}
          <QuestionsList
            onEdit={onEdit}
            onReorder={onReorder}
            items={initialData.questions || []}
            chapterId={chapterId}
            courseId={courseId}
          />
        </div>
      )}
      
      {!isCreating  && (
        <p className="text-xs text-muted-foreground mt-4">
          Faites glisser pour réordonner les questions
        </p>
      )}
    </div>
  );
};

export default ChapterQuizForm;


