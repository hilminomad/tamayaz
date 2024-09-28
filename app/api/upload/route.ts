import { NextRequest, NextResponse } from 'next/server';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { auth, clerkClient } from '@clerk/nextjs';

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB
const TOKEN_REFRESH_INTERVAL = 4 * 60 * 1000; // 4 minutes

export async function POST(request: NextRequest) {
  console.log('Received request');
  try {
    // Check initial authentication
    const { userId } = auth();
    console.log('User ID:', userId);

    if (!userId) {
      console.log('Unauthorized: userId is null or undefined');
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Content type must be multipart/form-data' }, { status: 400 });
    }

    const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
    if (contentLength > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the 1GB limit' }, { status: 413 });
    }

    const formData = await request.formData();
    const file = formData.get('video') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const filename = `${uuidv4()}-${file.name}`;
    const filepath = path.join(process.cwd(), 'public', 'uploads', filename);

    const fileStream = file.stream();
    const writeStream = createWriteStream(filepath);

    const readable = new Readable();
    readable._read = () => {}; // _read is required but you can noop it

    let lastTokenRefresh = Date.now();

    await new Promise<void>((resolve, reject) => {
      const reader = fileStream.getReader();
      const push = async () => {
        const { done, value } = await reader.read();
        if (done) {
          readable.push(null);
          resolve();
        } else {
          // Check if it's time to refresh the token
          if (Date.now() - lastTokenRefresh > TOKEN_REFRESH_INTERVAL) {
            try {
              // Refresh the session
              await clerkClient.sessions.getSession(userId);
              lastTokenRefresh = Date.now();
              console.log('Token refreshed');
            } catch (error) {
              console.error('Error refreshing token:', error);
              reject(new Error('Token refresh failed'));
              return;
            }
          }

          readable.push(Buffer.from(value));
          push();
        }
      };
      push().catch(reject);
    });

    await pipeline(readable, writeStream);

    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Error details:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}