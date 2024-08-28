'use client';

import { usePathname, useRouter } from 'next/navigation';

import { CheckCircle, Lock, LockIcon, PlayCircle } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useState } from 'react';
import { AnimatedPin } from '@/components/animated-card';
import { PinContainer } from '@/components/ui/3d-pin';

interface CourseSidebarItemProps {
  label: string;
  id: string;
  description: string,
  isCompleted: boolean;
  isProgress: boolean;
  courseId: string;
  isLocked: boolean;
  number: number;
}

export const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  isProgress,
  courseId,
  isLocked,
  description,
  number,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const [check, setCheck] = useState(false)

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;

  const isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  const buttonText = () => {

  }
  if(check){
    return (
      <button
        onClick={onClick}
        type="button"
        className={cn(
          'flex items-center gap-x-2 text-slate-500 text-sm font-[500] pl-6 transition-all hover:text-slate-600 hover:bg-slate-300/20',
          isActive &&
            'text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700',
          isCompleted && 'text-emerald-700 hover:text-emerald-700',
          isCompleted && isActive && 'bg-emerald-200/20'
        )}
      >
        <div className="flex items-center gap-x-2 py-4">
          <Icon
            size={22}
            className={cn(
              'text-slate-500',
              isActive && 'text-slate-700',
              isCompleted && 'text-emerald-700'
            )}
          />
          {label}
        </div>
        <div
          className={cn(
            'ml-auto opacity-0 border-2 border-slate-700 h-full transition-all',
            isActive && 'opacity-110',
            isCompleted && 'border-emerald-700'
          )}
        />
      </button>
    );
  }

  if(isCompleted){
    return(
      <div>
        <div className="h-[24rem] w-[17rem] sm:w-[18rem] flex flex-col sm:flex-row items-center justify-center ">
        <p className=' sm:text-[10rem] text-[6rem] sm:mr-[-85px] mb-[-70px]  text-green-500 font-extrabold '>{number + 1}</p>
        <PinContainer
          title="Voir chapitre"
          href={`/courses/${courseId}/chapters/${id}`}
        >
          <div className="flex basis-full flex-col  tracking-tight text-slate-100/50 sm:basis-1/2 w-[14rem] h-[13rem] ">
            <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
              {label}
            </h3>
            <div className="text-base !m-0 !p-0 font-normal">
              <div
                className="text-base !m-0 !p-0 font-normal"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
            <div className="flex flex-1 w-full rounded-lg  mt-5 bg-gradient-to-br from-green-500 via-emerald-500 to-blue-500" />
          </div>
        </PinContainer>
      </div>
      </div>
    )
  }

  if(!isCompleted && ((number === 0 && !isLocked) || isProgress))
  {
    return(
      <div>
        <div className="h-[24rem] w-[17rem] sm:w-[18rem] flex flex-col sm:flex-row items-center justify-center ">
        <p className=' sm:text-[10rem] text-[6rem] sm:mr-[-85px] mb-[-70px]  text-slate-500 font-extrabold '>{number + 1}</p>
        <PinContainer
          title="Voir chapitre"
          href={`/courses/${courseId}/chapters/${id}`}
        >
          <div className="flex basis-full flex-col  tracking-tight text-slate-100/50 sm:basis-1/2 w-[14rem] h-[13rem] ">
            <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
              {label}
            </h3>
            <div className="text-base !m-0 !p-0 font-normal">
              <div
                className="text-base !m-0 !p-0 font-normal"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </div>
            <div className="flex flex-1 w-full rounded-lg  mt-5 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-900" />
          </div>
        </PinContainer>
      </div>
      </div>
    )
  }
  return(
    <div className='relative' style={{ pointerEvents: 'none'}}>

      <div className='absolute  w-full flex flex-col justify-center items-center'>
        <LockIcon className='w-10 mt-2 h-10 font-medium'/>
        <p className='font-semibold'>Ce chapitre est fermé !</p>
      </div>
      <div className="h-[22rem] w-[17rem] sm:w-[18rem] flex flex-col sm:flex-row items-center justify-center ">
        <p className=' sm:text-[10rem] text-[6rem] sm:mr-[-85px] mb-[-70px]  text-slate-500 font-extrabold '>{number + 1}</p>
      <PinContainer
        title="Chapitre fermé!"
        href="https://twitter.com/mannupaaji"
      >
        <div className="flex basis-full flex-col  tracking-tight text-slate-100/50 sm:basis-1/2 w-[14rem] h-[13rem] ">
          <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
            {label}
          </h3>
          <div className="text-base !m-0 !p-0 font-normal">
          <div
            className="text-base !m-0 !p-0 font-normal"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          </div>
          <div className="flex flex-1 w-full rounded-lg  mt-5 bg-gradient-to-br from-slate-600 via-slate-500 to-slate-900" />
        </div>
      </PinContainer>
      </div>
    </div>
  )
};
