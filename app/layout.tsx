import type { Metadata } from 'next';
import './globals.css';
import MainHeader from '@/components/header/MainHeader';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import MainFooter from '@/components/footer/MainFooter';

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
      <body className={`antialiased`}>
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
