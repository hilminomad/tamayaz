import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized operation', { status: 401 });
    }

    const article = await db.article.create({
      data: {
        userId,
        title,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.log('[ARTICLES]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
