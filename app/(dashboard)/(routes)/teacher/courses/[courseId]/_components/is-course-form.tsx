'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Check, CheckSquare, Pencil, Square } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { cn } from '@/lib/utils';

import { Course } from '@prisma/client';


interface IsCourseFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  isCourse: z.boolean().default(false),
});

const IsCourseForm = ({
  initialData,
  courseId,
}: IsCourseFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isCourse: Boolean(initialData.isCourse),
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // If `isCourse` is true, keep the categoryId, otherwise set it to null
      

      await axios.patch(
        `/api/courses/${courseId}/`,
        values
      );

      toast.success('Mis à jour');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Une erreur s'est produite");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Module ou Formation
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? 'Annuler' : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Modifier
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div
          className={cn(
            'text-sm mt-2',
            !initialData.isCourse && 'text-slate-500 italic'
          )}
        >
          {initialData.isCourse ? (
            <p>C&apos;est un module.</p>
          ) : (
            <p>C&apos;est une formation.</p>
          )}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="isCourse"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormDescription>
                    <div className='flex'>
                      <Check/> pour module <Square/> pour formation  
                      </div> 
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="mt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Mise à jour...' : 'Confirmer'}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default IsCourseForm;