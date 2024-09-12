'use client';

import { usePathname } from 'next/navigation';
import { Layout, Compass, List, BarChart, FileEdit, Plus, PlusCircle, FileStack, SquareStack, ListFilter, ListOrdered, Sheet, BookMarked } from 'lucide-react';

import SidebarItem from './sidebar-item';

const guestRotues = [
  {
    icon: Layout,
    label: 'Tableau de bord',
    href: '/dashboard',
  },
  {
    icon: ListOrdered,
    label: 'Cours',
    href: '/courses',
  },
  {
    icon: Compass,
    label: 'Recherche',
    href: '/search',
  },
  {
    icon: BookMarked,
    label: 'Blog',
    href: '/blog',
  },
];

const teacherRotues = [
  {
    icon: List,
    label: 'Cours',
    href: '/teacher/courses',
  },
  {
    icon: BarChart,
    label: 'Analytique',
    href: '/teacher/analytics',
  },
  {
    icon: PlusCircle,
    label: 'Inscrire',
    href: '/teacher/enroll',
  },
  {
    icon: FileEdit,
    label: 'Articles',
    href: '/teacher/articles',
  },
];

const SidebarRoutes = () => {
  const pathname = usePathname();

  const isTeacherPage = pathname?.includes('/teacher');

  const routes = isTeacherPage ? teacherRotues : guestRotues;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
