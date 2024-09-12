import { Article, Tag } from "@prisma/client";
import { db } from '@/lib/db';

interface GetArticleProps {
  articleId: string
}

export const getArticle = async({
  articleId,
}: GetArticleProps): Promise<(Article & { tag: Tag | null }) | null> => {
  try {
    const article = await db.article.findUnique({
      where: {
        id: articleId,
        isPublished: true,
      },
      include: {
        tag: true,
      }      
    });
    return article;
  } catch (error) {
    console.log('[GET_ARTICLE]', error);
    return null;
  }
}

