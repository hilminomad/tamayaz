import {Article, Tag} from '@prisma/client';

import { db } from '@/lib/db';

type ArticleWithTag = Article & {
  tag: Tag | null;
};



export const getBannerArticles = async (): Promise<ArticleWithTag[]> => {
  try {
    const articles = await db.article.findMany({
      where: {
        isPublished: true,
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