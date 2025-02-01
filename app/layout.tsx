import type { Metadata } from 'next';
import './globals.css';
import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

// Dynamic imports for client components
const MainHeader = dynamic(() => import('@/components/header/MainHeader'), {
  ssr: true,
});

const MainFooter = dynamic(() => import('@/components/footer/MainFooter'), {
  ssr: true,
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
      <body className="antialiased" suppressHydrationWarning>
        <TooltipProvider>
          <MainHeader />
          <Toaster />
          <main>{children}</main>
          <MainFooter />
        </TooltipProvider>
      </body>
    </html>
  );
}
