import {Article, Tag} from '@prisma/client';

import { db } from '@/lib/db';

type ArticleWithTag = Article & {
  tag: Tag | null;
};

type GetArticles = {
  title?: string;
  tagId: string;
}

export const getArticles = async ({
  title,
  tagId,
}: GetArticles): Promise<ArticleWithTag[]> => {
  try {
    const articles = await db.article.findMany({
      where: {
        isPublished: true,
        title: {
          contains: title,
        },
        tagId: tagId,
      },
      include: {
        tag: true,    
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const articlesWithCategory: ArticleWithTag[] = articles.map(
      (article) => ({
        ...article,
        tag: article.tag,
      })
    );

    return articlesWithCategory;
  } catch (error) {
    console.log('[GET_ARTICLES]', error);
    return [];
  }
};