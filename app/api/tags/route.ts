import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

import { db } from '@/lib/db';
import { isTeacher } from '@/lib/teacher';

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { name } = await req.json();

    if (!userId || !isTeacher(userId)) {
      return new NextResponse('Unauthorized operation', { status: 401 });
    }

    const tag = await db.tag.create({
      data: {
        name,
      },
    });

    return NextResponse.json(tag);
  } catch (error) {
    console.log('[TAGS]', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
