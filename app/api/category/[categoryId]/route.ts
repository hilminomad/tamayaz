import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const category = await db.category.findUnique({
      where: {
        id: params.categoryId,
      },
      
    });

    if (!category) {
      return new NextResponse('Not found', { status: 404 });
    }

    const deletedArticle = await db.category.delete({
      where: {
        id: params.categoryId,
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
  { params }: { params: { categoryId: string } }
) {
  try {
    const { userId } = auth();
    const { categoryId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const category = await db.category.update({
      where: {
        id: categoryId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[CATEGORY_ID_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
