import Link from 'next/link';
import { Search } from 'lucide-react';
import { currentUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { LoginButton } from '@/components/auth/login-button';
import { UserButton } from '@/components/auth/user-button';

const MainHeader = async () => {
  const user = await currentUser();

  return (
    <header className="bg-background border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-foreground">
              Placeaway
            </span>
          </Link>
          <nav className="hidden md:flex space-x-4">
            <Link
              href="/explore"
              className="px-4 py-2 text-foreground hover:text-primary transition-colors rounded-md hover:bg-accent"
            >
              Explore
            </Link>
            <Link
              href="/plan"
              className="px-4 py-2 text-foreground hover:text-primary transition-colors rounded-md hover:bg-accent"
            >
              Plan
            </Link>
            <Link
              href="/trip"
              className="px-4 py-2 text-foreground hover:text-primary transition-colors rounded-md hover:bg-accent"
            >
              My Trip
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Link
              href="/search"
              className="p-2 text-foreground hover:text-primary transition-colors"
            >
              <Search className="h-6 w-6" />
            </Link>

            {user ? (
              <UserButton />
            ) : (
              <div className="flex items-center gap-2">
                <LoginButton mode="modal" asChild>
                  <Button variant={'outline'}>Sign In</Button>
                </LoginButton>
                <LoginButton mode="modal" asChild>
                  <Button>Sign Up</Button>
                </LoginButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MainHeader;
