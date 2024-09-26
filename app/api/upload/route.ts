import { NextRequest, NextResponse } from 'next/server';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { auth } from '@clerk/nextjs';

const MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = auth();

    if (!userId) {
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

    await new Promise<void>((resolve, reject) => {
      const reader = fileStream.getReader();
      const push = async () => {
        const { done, value } = await reader.read();
        if (done) {
          readable.push(null);
          resolve();
        } else {
          readable.push(Buffer.from(value));
          push();
        }
      };
      push().catch(reject);
    });

    await pipeline(readable, writeStream);

    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Error saving file' }, { status: 500 });
  }
}