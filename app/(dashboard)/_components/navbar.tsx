"use client"

import NavbarRoutes from '@/components/navbar-routes';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import MobileSidebar from './mobile-sidebar';
import Logo from './logo';
import LogoWhite from './logo-white';


const Navbar = () => {

  const pathname = usePathname()

  const isHomePage = pathname === '/';
  const isTermsPage = pathname === '/terms-and-conditions';
  const isFaqPage = pathname === '/faq';
  const isBlog = pathname.startsWith('/blog')

  
  return (
    <div className={cn ("p-6 border-b h-full flex items-center bg-white" 
    ,isBlog && "bg-black"
    )}>
      {isHomePage && <Logo/>}
      {isTermsPage && <Logo/>}
      {isFaqPage && <Logo/>}
      {isBlog && <LogoWhite/>}
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
