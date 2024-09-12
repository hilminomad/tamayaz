'use client';

import { Tag } from '@prisma/client';

import {
  FcEngineering,
  FcInspection,
  FcGraduationCap,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from 'react-icons/fc';
import { IconType } from 'react-icons';

import { CategoryItem } from './tag-items';

interface CategoriesProps {
  items: Tag[];
}

const iconMap: Record<Tag['name'], IconType> = {
  Formation: FcInspection,
  Cours: FcGraduationCap,
};

export const Categories = ({ items }: CategoriesProps) => {
  return (
    <div className="flex w-full max-w-7xl mt-8 items-center gap-x-2 overflow-x-auto">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
};
