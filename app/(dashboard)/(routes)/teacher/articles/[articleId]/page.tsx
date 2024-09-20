// full article customization page

import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs';
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from 'lucide-react';

import { db } from '@/lib/db';

// Components
import { IconBadge } from '@/components/icon-badge';
import { Banner } from '@/components/banner';
import TitleForm from './_components/title-form';
import   ArticleDescriptionForm from './_components/description-form';
import ImageForm from './_components/image-form';
import TagForm from './_components/tag-form';
import Actions from './_components/article-actions';
import DescriptionForm from './_components/subtitle-form';

const articleIdPage = async ({ params }: { params: { articleId: string } }) => {
  // To verify if the article creator, is the one editing it
  const { userId } = auth();

  if (!userId) {
    return redirect('/');
  }

  // Query to database to check for presence of article id passed in url
  const article = await db.article.findUnique({
    where: {
      id: params.articleId,
      userId: userId,
    },
  });

  // Query to database to load the seeded categories list
  const tags = await db.tag.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  if (!article) {
    return redirect('/');
  }

  const requiredFields = [
    article.title,
    article.description,
    article.texte,
    article.imageUrl,
    article.tagId,
  ];
  // calculates the number of fields
  const totalFields = requiredFields.length;

  // calculates the filled fields
  const completedFields = requiredFields.filter(Boolean).length;

  // calcultaes progress
  const completionText = `(${completedFields}/${totalFields})`;

  // check if all fields are filles
  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!article.isPublished && (
        <Banner
          variant="warning"
          label="Cet article est non publié. Il ne sera pas visible pour les visiteurs."
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2">
            <h1 className="text-2xl font-medium">Configuration de l&apos;article</h1>
            <span className="text-sm text-slate-700">
              Remplissez tous les champs{completionText}
            </span>
          </div>
          
            <Actions
            disabled={!isComplete}
            articleId={params.articleId}
            isPublished={article.isPublished}
            />
          
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Personnalisez votre Article</h2>
            </div>
            <TitleForm initialData={article} articleId={article.id} />
            <DescriptionForm initialData={article} articleId={article.id} />
            <ImageForm initialData={article} articleId={article.id} />
            <TagForm
              initialData={article}
              articleId={article.id}
              options={tags.map((tag) => ({
                label: tag.name,
                value: tag.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Texte de l&apos;article</h2>
              </div>
              <ArticleDescriptionForm initialData={article} articleId={article.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
  };
  
  export default articleIdPage;
  
