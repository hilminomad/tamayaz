'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import axios from 'axios';
import { Trash } from 'lucide-react';

// Components
import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/confirm-modal';

// Hooks
import { useConfettiStore } from '@/hooks/use-confetti-store';

interface ActionsProps {
  disabled: boolean;
  articleId: string;
  isPublished: boolean;
}

const Actions = ({ disabled, articleId, isPublished }: ActionsProps) => {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(`/api/articles/${articleId}/unpublish`);
        toast.success('Article non publié');
      } else {
        await axios.patch(`/api/articles/${articleId}/publish`);
        toast.success('Article publié');
        confetti.onOpen();
      }

      router.refresh();
    } catch (error) {
      toast.error("Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/courses/${articleId}`);

      toast.success('Article supprimé');
      router.refresh();
      router.push(`/teacher/articles`);
    } catch (error) {
      toast.error("Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={onClick}
        disabled={disabled || isLoading}
        variant="outline"
        size="sm"
      >
        {isPublished ? 'Retirer' : 'Publier'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button size="sm" disabled={isLoading}>
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Actions;
