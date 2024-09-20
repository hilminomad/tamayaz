'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import toast from 'react-hot-toast';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  title: z.string().min(1, {
    message: 'Title is required',
  }),
});

const CreateArticlePage = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/articles', values);
      router.push(`/teacher/articles/${response.data.id}`);
      toast.success('Article ajouté avec succès');
      
    } catch (error) {
      toast.error('Erreur');
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-2xl text-semibold">Donnez un titre à votre article</h1>
        <p className="text-sm text-slate-600">
          Quel titre souhaitez-vous donner à votre article ? Ne vous inquiétez pas, vous pourrez le changer plus tard.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre de l&apos;article</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="ex. Introduction à l'économie"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                  De quoi allez-vous parler dans cet article ?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button type="button" variant="ghost">
                  Annuler
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continuer
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateArticlePage;
