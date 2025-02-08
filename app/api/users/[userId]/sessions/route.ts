import { NextApiRequest, NextApiResponse } from 'next';
import { clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';

export async function GET(
  req: Request,
  {params}:{params:{userId:string}}
) {
  
  try {
    console.log('starting')
    //const { userId } = auth();
  //if (!userId) {
    //return new NextResponse('Unauthorized', { status: 401 });
  //}
  const { userId } = params;

  if (!userId) {
    return new NextResponse('Invalid or missing userId', { status: 400 });
  }

  console.log(userId)

  const clientId = userId
    // Fetch the user's session list
    const sessions = await clerkClient.sessions.getSessionList({ userId});
    const sessionsW = await clerkClient.sessions.getSessionList({ userId});

    console.log('Sessions:',sessions.length)

    if (sessions.length === 0) {
      return new NextResponse('Not found', { status: 404 });
    }

    // Map sessions to include detailed information
    const sessionDetails = sessions.map((session) => ({
      id: session.id,
      createdAt: session.createdAt,
      lastActiveAt: session.lastActiveAt,
      expireAt: session.expireAt,
      isOnline: session.status === 'active',
    }));
    console.log(sessionDetails)
    return NextResponse.json({ sessions: sessionDetails });
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return new NextResponse('Internal Error', { status: 500 });;
  }
}
