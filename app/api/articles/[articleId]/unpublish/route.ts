import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: { articleId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const article = await db.article.findUnique({
      where: {
        id: params.articleId,
        userId,
      },
    });

    if (!article) {
      return new NextResponse('Not found', { status: 404 });
    }

    const unPublishedArticle = await db.article.update({
      where: {
        id: params.articleId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });

    return NextResponse.json(unPublishedArticle);
  } catch (error) {
    console.log('[ARTICLES_ARTICLE-ID_UNPUBLISH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
