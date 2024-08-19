'use client';

import { useState } from 'react';
import axios from 'axios';
import { Answer } from '@prisma/client';

import { cn } from '@/lib/utils';
import { Pencil, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

import toast from 'react-hot-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface AnswersListProps {
  items: Answer[];
  questionId: string;
  chapterId: string;
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, "La réponse est requise"),
  isCorrect: z.boolean().default(false),
});



export const AnwsersList = ({
  items,
  questionId,
  chapterId,
  courseId,
}: AnswersListProps) => {
  const [answers, setAnswers] = useState(items);
  const [updatingAnswerId, setUpdatingAnswerId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      isCorrect: false,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const handleUpdate = async (answerId: string, values: Partial<Answer>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}/questions/${questionId}/answers/${answerId}`, values);
      toast.success('Réponse mise à jour avec succès');
      setUpdatingAnswerId(null);
      setAnswers((prevAnswers) =>
        prevAnswers.map((a) =>
          a.id === answerId ? { ...a, ...values } : a
        )
      );
      window.location.reload(); 
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la mise à jour");
    }
  };

  const handleDelete = async (answerId: string) => {
    try {
      setIsDeleting(true);
      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}/questions/${questionId}/answers/${answerId}`);
      toast.success('Réponse supprimée avec succès');
      setAnswers((prevAnswers) => prevAnswers.filter((a) => a.id !== answerId));
      window.location.reload(); 
    } catch (error) {
      toast.error("Une erreur s'est produite lors de la suppression");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {answers.map((answer) => (
        <div key={answer.id}
          className={cn(
            "mb-6 mt-6 border bg-red-100 rounded-md p-4",
            answer.isCorrect && 'bg-green-100'
          )}
        >
          {updatingAnswerId !== answer.id && (
            <div className="flex w-full items-center justify-between">
              <div>{answer.title}</div>
              <div className="flex items-center space-x-2">
                <Pencil
                  onClick={() => {
                    form.setValue('title', answer.title);
                    form.setValue('isCorrect', answer.isCorrect);
                    setUpdatingAnswerId(answer.id);
                  }}
                  className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                />
                <Trash
                  onClick={() => handleDelete(answer.id)}
                  className="w-4 h-4 cursor-pointer text-red-500 hover:opacity-75 transition"
                />
              </div>
            </div>
          )}

          {updatingAnswerId === answer.id && (
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((values) => handleUpdate(answer.id, values))}
                className="space-y-4 mt-4"
              >
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isCorrect"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-3">
                      <FormControl>
                      <Checkbox
                        checked={field.value} // This connects the checkbox's state to the form field's value
                        onCheckedChange={(checked) => field.onChange(checked)} // Ensure the correct value is passed to onChange
                      />
                      </FormControl>
                      <FormDescription>
                        Cochez cette case si cette réponse est correcte
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-x-2">
                  <Button disabled={isDeleting || !isValid || isSubmitting} type="submit">
                    Mettre à jour
                  </Button>
                  <Button variant="ghost" onClick={() => setUpdatingAnswerId(null)}>
                    Annuler
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </div>
      ))}
    </div>
  );
};
