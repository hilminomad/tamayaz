'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/db';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';



import { Pencil } from 'lucide-react';
import toast from 'react-hot-toast';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Combobox } from '@/components/ui/combobox';
import { Button } from '@/components/ui/button';

interface FormationEnrollFormProps {
  options: { label: string; value: string }[];
  students: { label: string; value: string }[];
}

const formSchema = z.object({
  courseId: z.string().min(1),
  studentId: z.string().min(1),
});

const FormationEnrollForm = ({ options, students }: FormationEnrollFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      courseId: '',
      studentId: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // Check for existing purchase
      const existingPurchase = await db.purchase.findFirst({
        where: {
          userId: values.studentId,
          courseId: values.courseId,
        },
      });
  
      if (existingPurchase) {
        toast.error("Cette formation est déjà inscrite pour cet étudiant");
        return;
      }
  
      // Create purchase if it doesn't exist
      await axios.post('/api/purchase', values);
      // ... rest of your success logic
    } catch (error) {
      toast.error("Une erreur s'est produite");
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Sélectionner formation et étudiant
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Annuler</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Modifier la sélection
            </>
          )}
        </Button>
      </div>
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          > 
            <p className='font-semibold'>Selection de formation</p>
            <FormField
              control={form.control}
              name="courseId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <p className='font-semibold'>Selection d'étudiant</p>
            <FormField
              control={form.control}
              name="studentId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={students} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Enregistrer
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default FormationEnrollForm;