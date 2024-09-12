import { Article, Category, Course, Tag } from '@prisma/client';

import { CourseCard } from '@/components/animated-course-card-guest';
import { ArticleCard } from './article-card';

type ArticleWithCategory = Article & {
  tag: Tag | null;
};

interface ArticlesListProps {
  items: ArticleWithCategory[];
}

export const ArticlesList = ({ items }: ArticlesListProps) => {
  return (
    <div className='w-full p-6 flex justify-center'>
      <div className="w-full max-w-7xl grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <ArticleCard
            key={item.id}
            id={item.id}
            title={item.title}
            texte={item.texte!}
            description={item.description!}
            time={item.createdAt!}
            imageUrl={item.imageUrl!}
            tag={item?.tag?.name!}
          />
        ))}
      </div>
      {items.length === 0 && (
        <div className="text-center text-sm text-muted-foreground mt-10">
          Aucun article trouvé
        </div>
      )}
    </div>
  );
};
