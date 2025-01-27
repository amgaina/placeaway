import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import MainHeader from '@/components/header/MainHeader';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import MainFooter from '@/components/footer/MainFooter';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Placeaway',
  description: 'Tour Guide App',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TooltipProvider>
          <MainHeader />
          <Toaster />
          {children}
          <MainFooter />
        </TooltipProvider>
      </body>
    </html>
  );
}
