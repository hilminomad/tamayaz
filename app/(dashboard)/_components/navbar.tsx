"use client"

import NavbarRoutes from '@/components/navbar-routes';
import { usePathname } from 'next/navigation';
import MobileSidebar from './mobile-sidebar';
import Logo from './logo';

const Navbar = () => {

  const pathname = usePathname()

  const isHomePage = pathname === '/';
  return (
    <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
      {isHomePage && <Logo/>}
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
