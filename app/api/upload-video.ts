// pages/api/upload-video.ts
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const videoDir = path.join(process.cwd(), 'public/videos');
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }

    const filePath = path.join(videoDir, req.body.file.name);

    // You can use fs or any streaming solution to store the video
    const fileStream = fs.createWriteStream(filePath);
    req.pipe(fileStream);

    req.on('end', () => {
      res.status(200).json({ url: `/videos/${req.body.file.name}` });
    });

    fileStream.on('error', (error) => {
      res.status(500).json({ message: 'File upload failed', error });
    });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred', error });
  }
}
