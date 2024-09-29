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

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
      toast.success('Chapter modified');
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error('Error updating chapter');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const token = await getToken({ template: "FileUploadToken" });
      
      if (!token) {
        throw new Error("Failed to get authentication token");
      }

      const formData = new FormData();
      formData.append('video', file);

      const response = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,
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
      toast.success('Video uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading video');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // ... rest of the component remains the same

  return (
    <div className="mt-6 border bg-slate-100 rounded-md p-4">
      {/* ... existing JSX ... */}
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
          Attendez la vidéo! Cela peut prendre quelques minutes.
        </div>
      )}
    </div>
  );
};

export default ChapterVideoForm;