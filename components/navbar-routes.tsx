'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Book } from 'lucide-react';

import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';

import { Button } from '@/components/ui/button';
import { SearchInput } from './search-input';

import { isTeacher } from '@/lib/teacher';

const NavbarRoutes = () => {
  const { userId } = useAuth();
  const pathname = usePathname();

  const isTeacherPage = pathname?.startsWith('/teacher');
  const isCoursePage = pathname?.startsWith('/courses');
  const isSearchPage = pathname === '/search';
  const isHomePage = pathname === '/';

  if (isHomePage){
    if(!userId){
      return(
        <>
          <div className="ml-16 hidden md:block">
            <SearchInput />
          </div>
          <div className='flex gap-x-2 ml-auto'>
          <Link href="/sign-up">
            <Button size="sm" variant="ghost">
              Se connecter
            </Button>
          </Link>
          <Link href="/sign-in">
            <Button size="sm" variant="default">
              S'inscrire
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
        {isTeacherPage || isCoursePage ? (
          <Link href="/dashboard">
            <Button size="sm" variant="ghost">
              <Book className="h-4 w-4 mr-2" />
              Mode étudiant
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href="/teacher/courses">
            <Button size="sm" variant="ghost">
              Mode admin
            </Button>
          </Link>
        ) : null}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
};

export default NavbarRoutes;
