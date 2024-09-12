'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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

import { cn } from '@/lib/utils';

import { Article } from '@prisma/client';

interface TagFormProps {
  initialData: Article;
  articleId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  tagId: z.string().min(1),
});

const TagForm = ({
  initialData,
  articleId,
  options,
}: TagFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tagId: initialData?.tagId || '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/articles/${articleId}`, values);
      toast.success('Cours mis à jour');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Une erreur s'est produite");
    }
  };

  const selectedOption = options.find(
    (option) => option.value === initialData.tagId
  );

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        La categorie du cours
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Annuler</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Modifier la categorie
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            'text-sm mt-2',
            !initialData.tagId && 'text-slate-500 italic'
          )}
        >
          {selectedOption?.label || 'Aucune categorie'}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="tagId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox options={options} {...field} />
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

export default TagForm;
