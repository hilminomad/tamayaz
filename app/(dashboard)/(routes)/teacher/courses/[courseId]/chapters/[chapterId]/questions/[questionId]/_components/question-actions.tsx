'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import toast from 'react-hot-toast';
import axios from 'axios';
import { Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ConfirmModal } from '@/components/modals/confirm-modal';

interface QuestionActionsProps {
  disabled: boolean;
  courseId: string;
  chapterId: string;
  questionId: string;
  isPublished: boolean;
}

const QuestionActions = ({
  disabled,
  courseId,
  chapterId,
  questionId,
  isPublished,
}: QuestionActionsProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);

      if (isPublished) {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/questions/${questionId}/unpublish`
        );
        toast.success('Question non publiée');
      } else {
        await axios.patch(
          `/api/courses/${courseId}/chapters/${chapterId}/questions/${questionId}/publish`
        );
        toast.success('Question publiée');
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

      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/questions/${questionId}`
      );

      toast.success('Question supprimée');
      router.refresh();
      
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

export default QuestionActions;
