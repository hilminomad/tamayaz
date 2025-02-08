// columns.tsx
'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Define the Student type
interface Student {
  id: string;
  name: string;
  progress: number;
  title: string,
}

export const columns: ColumnDef<Student>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Nom
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Niveaux
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: 'progress',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Chapitres finis
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
];