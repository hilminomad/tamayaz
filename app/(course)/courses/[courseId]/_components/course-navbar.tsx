import { Chapter, Course, UserProgress } from '@prisma/client';

import NavbarRoutes from '@/components/navbar-routes';
import { CourseMobileSidebar } from './course-mobile.sidebar';
import Logo from '@/app/(dashboard)/_components/logo';

interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progressCount: number;
}

export const CourseNavbar = ({ course, progressCount }: CourseNavbarProps) => {
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      <Logo/>
      <NavbarRoutes />
    </div>
  );
};
