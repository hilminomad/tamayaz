// file-upload-image.tsx
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button'; // Adjust the import based on your button component
import toast from 'react-hot-toast';

interface ImageUploadProps {
  onChange: (url?: string) => void; // Callback for the uploaded image URL
}

export const ImageUpload = ({ onChange }: ImageUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const image = event.target.files?.[0] || null;
    setSelectedImage(image);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error('Choisissez une image!'); // "Choose an image!" in French
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
      setIsUploading(true);
      const { data } = await axios.post('/api/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onChange(data.url); // Assuming the API response contains the image URL
      toast.success('Image téléchargée avec succés');
    } catch (error) {
      toast.error('Téléchargement échoué!');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*" // Accept only image files
      />
      <Button onClick={handleUpload} disabled={!selectedImage || isUploading}>
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  );
};
