"use client"

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import axios from 'axios';
import { Pencil, PlusCircle, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import ReactPlayer from 'react-player';
import { useAuth } from '@clerk/nextjs';

interface ChapterVideoFormProps {
  initialData: { videoUrl?: string | null };
  courseId: string;
  chapterId: string;
}

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

const ChapterVideoForm = ({ initialData, courseId, chapterId }: ChapterVideoFormProps) => {
  const { getToken } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tokenRefreshInterval, setTokenRefreshInterval] = useState<NodeJS.Timeout | null>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const refreshToken = async () => {
    try {
      const newToken = await getToken({ skipCache: true });
      return newToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success('Chapter modified');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Error');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('video', file);

    try {
      // Start token refresh mechanism
      const refreshTokenAndUpdateHeader = async () => {
        const newToken = await refreshToken();
        if (newToken) {
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        }
      };

      // Set up interval to refresh token every 4 minutes
      const interval = setInterval(refreshTokenAndUpdateHeader, 4 * 60 * 1000);
      setTokenRefreshInterval(interval);

      // Initial token fetch
      const initialToken = await getToken();

      // Create an Axios instance with the initial token
      const axiosInstance = axios.create({
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${initialToken}`,
        },
      });

      const response = await axiosInstance.post('/api/upload', formData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / (progressEvent.total || file.size)
          );
          setUploadProgress(percentCompleted);
        },
      });

      const videoUrl = response.data.url;
      onSubmit({ videoUrl });
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading video');
    } finally {
      // Clean up interval when done
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
        setTokenRefreshInterval(null);
      }
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Clean up the interval on unmount
  useEffect(() => {
    return () => {
      if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
      }
    };
  }, [tokenRefreshInterval]);

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add a video
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit video
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <ReactPlayer url={initialData.videoUrl} controls width="100%" height="100%" />
          </div>
        )
      )}
      {isEditing && (
        <div>
          <input
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            ref={fileInputRef}
            className="hidden"
          />
          <Button 
            onClick={() => fileInputRef.current?.click()} 
            disabled={isUploading}
          >
            {isUploading ? `Uploading... ${uploadProgress}%` : 'Select Video'}
          </Button>
          {isUploading && (
            <div className="mt-4 bg-slate-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-4">
            Upload (max 1GB)
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          Attndez la vidéo! Cela peut prendre du temps 
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;