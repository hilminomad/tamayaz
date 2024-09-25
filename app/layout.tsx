import './globals.css';
import type { Metadata } from 'next';
import { Rubik } from 'next/font/google';

// Authentication
import { ClerkProvider } from '@clerk/nextjs';
import { frFR } from '@clerk/localizations'

// Providers
import { ToastProvider } from '@/components/providers/toaster-provider';
import { ConfettiProvider } from '@/components/providers/confetti-provider';
import { Footer } from '@/components/footer';

const inter = Rubik({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tamayaz',
  description: "Votre plateforme d'apprentissage en ligne au Maroc, offrant des formations variées adaptées à vos besoins.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider localization={frFR}>
      <html lang="en">
        <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <ConfettiProvider />
          <ToastProvider />
          {children}
          
        </div>
        <Footer/>
        </body>
      </html>
    </ClerkProvider>
  );
}
