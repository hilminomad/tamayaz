"use client"

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import * as z from 'zod';
import axios from 'axios';
import { Pencil, PlusCircle, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import ReactPlayer from 'react-player';
import { getAuth } from '@clerk/nextjs/server';
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
  const { getToken } = useAuth(); // Get the getToken function from useAuth
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success('Chapite modifié');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Erreur');
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
      // Get the JWT token from Clerk for Authorization
      const token = await getToken();// You may use a specific token template or leave it blank for default.

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Add the token to the Authorization header
        },
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
      toast.error('Erreur');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Vidéo
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Annuler</>}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter une vidéo
            </>
          )}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Modifier vidéo
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
          Les vidéos peuvent prendre quelques minutes à traiter. Rafraîchissez la page si la vidéo n&apos;apparaît pas.
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;