import { NextApiRequest, NextApiResponse } from 'next';
import { createReadStream } from 'fs';
import { join, extname } from 'path';
import { stat } from 'fs/promises';
import mime from 'mime-types';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;

  if (!path || typeof path === 'string') {
    res.status(400).end('Invalid path');
    return;
  }

  const filePath = join(process.cwd(), 'public', 'uploads', ...path);

  try {
    const stats = await stat(filePath);
    
    if (!stats.isFile()) {
      res.status(404).end('Not found');
      return;
    }

    const fileExtension = extname(filePath).toLowerCase();
    const mimeType = mime.lookup(fileExtension) || 'application/octet-stream';

    const range = req.headers.range;
    const fileSize = stats.size;

    if (range) {
      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = (end - start) + 1;
      const file = createReadStream(filePath, { start, end });
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mimeType,
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
      };
      res.writeHead(200, head);
      createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).end('Internal Server Error');
  }
}