import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: { tagId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const tag = await db.tag.findUnique({
      where: {
        id: params.tagId,
      },
      
    });

    if (!tag) {
      return new NextResponse('Not found', { status: 404 });
    }

    const deletedArticle = await db.tag.delete({
      where: {
        id: params.tagId,
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
  { params }: { params: { tagId: string } }
) {
  try {
    const { userId } = auth();
    const { tagId } = params;
    const values = await req.json();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const tag = await db.tag.update({
      where: {
        id: tagId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.log('[TAG_ID_PATCH]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
