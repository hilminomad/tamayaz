'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Book, GraduationCap } from 'lucide-react';

import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import { SearchInput } from './search-input';

import { isTeacher } from '@/lib/teacher';
import MobileSidebar from '@/app/(dashboard)/_components/mobile-sidebar';

const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isCoursePage = pathname?.startsWith('/courses');
  const isBlogPage = pathname?.startsWith('/blog');
  const isSearchPage = pathname === '/search';
  const isHomePage = pathname === '/';

  if (isHomePage || isBlogPage){
    if(!userId){
      return(
        <>
          
          <div className='flex gap-x-2 ml-auto'>
          <Link href="/sign-up">
            <Button size="sm" variant="outline">
              Se connecter
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="sm" variant="default">
              S&apos;inscrire
            </Button>
          </Link>
          </div>        
          
        </>
      )
    }
  }

  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-auto">
        {
          isTeacher(userId)  &&
            <Link href="/teacher/courses">
              <Button size="sm" variant="outline">
                <GraduationCap/>
              </Button>
            </Link>
        }
        
        {userId && 
          <Link href="/dashboard">
            <Button size="sm" variant="outline">
              <Book className="h-4 w-4 mr-2" />
              Tableau de bord
            </Button>
          </Link>
        
        }
        <div className='h-8 w-8'>
        <UserButton afterSignOutUrl="/" />
        </div>
        <MobileSidebar/>
      </div>
    </>
  );
};

export default NavbarRoutes;
