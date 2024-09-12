import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

export async function DELETE(
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

    const deletedArticle = await db.article.delete({
      where: {
        id: params.articleId,
      },
    });

    return NextResponse.json(deletedArticle);
  } catch (error) {
    console.log('[ARTICLE_ID_DELETE]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { articleId: string } }
) {
  try {
    const { userId } = auth();
    const { articleId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const article = await db.article.update({
      where: {
        id: articleId,
        userId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.log('[ARTICLE_ID_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
