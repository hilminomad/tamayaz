import Image from 'next/image';
import Link from 'next/link';

import { BookOpen } from 'lucide-react';

import { IconBadge } from '@/components/icon-badge';

import { formatPrice } from '@/lib/format';

interface ArticleCardProps {
  id: string;
  title: string;
  imageUrl: string;
  texte: string;
  time: Date;

  description: string;
  tag: string;
}

export const ArticleCard = ({
  id,
  title,
  imageUrl,
  texte,
  time,
  description,
  tag,
}: ArticleCardProps) => {
  const formattedTime = time.toLocaleDateString('fr-FR', { year: '2-digit', month: 'long', day: 'numeric' })
  return (
    <Link href={`/blog/${id}`}>
      <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
        <div className="relative w-full aspect-video rounded-md overflow-hidden">
          <Image fill className="object-cover" alt={title} src={imageUrl} />
        </div>
        <div className="flex flex-col pt-2">
          <div className='w-full flex justify-between'>
            <p className='text-xs text-muted-foreground'>{ Math.ceil(Number(description.length / 1025))} minutes</p>
            <p className='text-xs text-muted-foreground'>{formattedTime}</p>
          </div>
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{tag}</p>
        
        </div>
      </div>
    </Link>
  );
};
