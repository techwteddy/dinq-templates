'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';
import { CommandMenu } from '@/components/command-menu';
import { MainNav } from '@/components/main-nav';
import { MobileNav } from '@/components/mobile-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { buttonVariants } from '@/components/ui/button';

export function SiteHeader() {
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <CommandMenu />
          </div>
          <nav className="flex items-center space-x-2">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    size: 'icon',
                  })
                )}
              >
                <Icons.gitHub className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </div>
            </Link>
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                    size: 'icon',
                  })
                )}
              >
                <Icons.twitter className="h-4 w-4 fill-current" />
                <span className="sr-only">Twitter</span>
              </div>
            </Link>
            {isAuthenticated ? (
              <Link
                href="/profile"
                className={cn(
                  buttonVariants({ variant: 'ghost', size: 'sm' }),
                  'px-4'
                )}
              >
                Profile
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({ variant: 'ghost', size: 'sm' }),
                    'px-4'
                  )}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className={cn(
                    buttonVariants({ variant: 'default', size: 'sm' }),
                    'px-4'
                  )}
                >
                  Sign Up
                </Link>
              </>
            )}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
