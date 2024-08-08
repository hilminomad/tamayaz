import './globals.css';
import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';

// Authentication
import { ClerkProvider } from '@clerk/nextjs';

// Providers
import { ToastProvider } from '@/components/providers/toaster-provider';
import { ConfettiProvider } from '@/components/providers/confetti-provider';

const inter = Rubik({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Learning Management System',
  description: 'Making online teaching easy',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConfettiProvider />
          <ToastProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
