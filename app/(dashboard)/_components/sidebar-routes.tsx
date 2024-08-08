'use client';

import { usePathname } from 'next/navigation';
import { Layout, Compass, List, BarChart } from 'lucide-react';

import SidebarItem from './sidebar-item';

const guestRotues = [
  {
    icon: Layout,
    label: 'Tableau de bord',
    href: '/dashboard',
  },
  {
    icon: Compass,
    label: 'Cours',
    href: '/search',
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
