'use client';

import { useEffect, useState } from 'react';
import { Question, Answer } from '@prisma/client';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from '@hello-pangea/dnd';

import { Grip, Pencil, Badge } from 'lucide-react';

import { cn } from '@/lib/utils';
import QuestionsAnswerForm from '../questions/[questionId]/_components/questions-answer-form';

interface QuestionWithAnswers extends Question {
  answers: Answer[];
}

interface QuestionsListProps {
  items: QuestionWithAnswers[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
  chapterId: string;
  courseId: string;
}

export const QuestionsList = ({
  items,
  onReorder,
  onEdit,
  chapterId,
  courseId,
}: QuestionsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [questions, setQuestions] = useState(items);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);

  useEffect(() => {
    // To avoid hydration issues between server side rendering & client side
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setQuestions(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedQuestions = items.slice(startIndex, endIndex + 1);

    setQuestions(items);

    // Update the positions based on the new order
    const bulkUpdateData = updatedQuestions.map((question) => ({
      id: question.id,
      position:  items.findIndex((item) => item.id === question.id),
    }));

    onReorder(bulkUpdateData);
  };
  if (!isMounted) {
    return null;
  }

  const handleEditClick = (id: string) => {
    setEditingQuestionId((prevId) => (prevId === id ? null : id));
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="questions">
        {(provided) => (
          <div
          
          {...provided.droppableProps} ref={provided.innerRef}>
            {questions.map((question, index) => (
              <div>
              <Draggable
                key={question.id}
                draggableId={question.id}
                index={index}
              >
                {(provided) => (
                  <div className='flex flex-col w-full'>
                  <div
                    className={cn(
                      'flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm',
                      question.isPublished &&
                        'bg-sky-100 border-sky-200 text-sky-700'
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition'
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-5 w-5" />
                    </div>
                    {question.title}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                    <div
                        className={cn(
                          'text-slate-500',
                          question.isPublished && 'text-sky-700'
                        )}
                      >
                        {question.isPublished ? 'Publié' : 'Brouillon'}
                      </div>
                      <Pencil
                       // onClick={() => onEdit(question.id)}
                       onClick={() => onEdit(question.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
                    
                  </div>
                  </div>
                )}
              </Draggable>
              
                                          
              </div>
              
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
