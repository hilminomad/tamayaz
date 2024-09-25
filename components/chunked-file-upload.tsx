'use client';

import React, { useState } from 'react';
import * as tus from 'tus-js-client';

interface ChunkedFileUploadProps {
  onUploadComplete: (url: string) => void;
}

const ChunkedFileUpload: React.FC<ChunkedFileUploadProps> = ({ onUploadComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    const upload = new tus.Upload(file, {
      endpoint: 'http://localhost:3000/api/upload',
      retryDelays: [0, 3000, 5000, 10000, 20000],
      metadata: {
        filename: file.name,
        filetype: file.type
      },
      onError: function (error: Error) {
        console.log('Failed because: ' + error.message);
        setIsUploading(false);
      },
      onProgress: function (bytesUploaded: number, bytesTotal: number) {
        const percentage = (bytesUploaded / bytesTotal * 100).toFixed(2);
        setProgress(parseFloat(percentage));
      },
      onSuccess: function () {
        // Type guard to ensure upload.file is of type File
        if (upload.file instanceof File) {
          console.log('Download %s from %s', upload.file.name, upload.url);
        }
        setIsUploading(false);
        if (upload.url) {
          onUploadComplete(upload.url);
        }
      }
    });

    upload.start();
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} disabled={isUploading} />
      {isUploading && (
        <div>
          <progress value={progress} max="100" />
          <p>{progress.toFixed(2)}% uploaded</p>
        </div>
      )}
    </div>
  );
};

export default ChunkedFileUpload;
