'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Pencil, PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';

import { cn } from '@/lib/utils';
import { Answer, Question } from "@prisma/client";
import { AnwsersList } from './answers-list';

interface QuestionsAnswerFormProps {
  initialData: Answer[];
  questionId : string;
  chapterId : string;
  courseId : string;
}

const formSchema = z.object({
  title: z.string().min(1, "La réponse est requis"),
  isCorrect: z.boolean().default(false),
});

const QuestionsAnswerForm: React.FC<QuestionsAnswerFormProps>  = ({initialData, questionId, chapterId, courseId }) => {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  


  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      isCorrect: false,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters/${chapterId}/questions/${questionId}/answers`, values);
      toast.success('Réponse créée avec succès');
      toggleCreating();
      window.location.reload(); 
    } catch (error) {
      toast.error("Une erreur s'est produite");
    }
  };

  
    
  return (
    <div className="mb-6 mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Nouvelle réponse
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Annuler</>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une réponse
            </>
          )}
        </Button>
        
      </div>
      {isCreating && (
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="ex. 'La capitale de la France est Paris.'"
                      {...field}
                    />
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
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    Cochez cette case si cette réponse est correcte
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Enregistrer
              </Button>
              <Button variant="ghost" onClick={toggleCreating}>
                Annuler
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
    );
};

export default QuestionsAnswerForm;