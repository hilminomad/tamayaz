import Image from 'next/image';
import Link from 'next/link';

import { BookOpen } from 'lucide-react';

import { IconBadge } from '@/components/icon-badge';

import { formatPrice } from '@/lib/format';

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  chaptersLength: number;
  price: number;

  category: string;
}

export const CourseCard = ({
  id,
  title,
  imageUrl,
  chaptersLength,
  price,
  category,
}: CourseCardProps) => {
  return (
    <Link href={`/courses/${id}`}>
      <div className="group relative aspect-video hover:shadow-sm transition duration-1000 overflow-hidden border rounded-lg  h-full">
      <Image fill className="absolute x-0 y-0 z-[-1] w-full h-full object-cover" alt={title} src={imageUrl} />
       
        <div className="flex flex-col h-full justify-between ">
          <div className='relative -translate-y-full w-full flex justify-between items-center duration-1000 bg-gradient-to-b from-black to-transparent p-3 group-hover:translate-y-0 transition line-clamp-2'>
            <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
              <div className="flex items-center gap-x-1 text-slate-200">
                <IconBadge size="sm" icon={BookOpen} />
                <span>
                  {chaptersLength} {chaptersLength === 1 ? 'Chapitre' : 'Chapitres'}
                </span>
              </div>
            </div>                      
            <p className="text-md md:text-sm font-medium text-slate-200">
              {formatPrice(price)}
            </p>
          </div>
          <div className='p-3 pt-5 w-full bg-gradient-to-t from-black to-transparent flex flex-col transition-all duration-1000 group-hover:items-center'>
            <div className="text-xl text-slate-200 md:text-base font-medium text-white group-hover:text-2xl transitionall duration-1000 line-clamp-2">
              {title}
            </div>
            <p className="text-xs text-slate-300 group-hover:text-slate-200 transition-all duration-1000 line-clamp-2 text-muted-foreground">{category}</p> 
          </div>
            
        </div>
      </div>
    </Link>
  );
};
