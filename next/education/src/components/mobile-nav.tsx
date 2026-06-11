'use client';

import * as React from 'react';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useDemo } from '@/components/demo-provider';

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { openDemo } = useDemo();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Icons.menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={setOpen}
        >
          <Icons.logo className="mr-2 h-4 w-4" />
          <span className="font-serif font-bold">{siteConfig.name}</span>
        </MobileLink>
        <div className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
          <div className="flex flex-col space-y-3">
            {siteConfig.mainNav?.map((item) => {
              const isDemo = siteConfig.demoPaths.includes(item.href);
              return (
                item.href && (
                  <MobileLink
                    key={item.href}
                    href={item.href}
                    onOpenChange={setOpen}
                    onClick={
                      isDemo
                        ? (e) => {
                            e.preventDefault();
                            setOpen(false);
                            openDemo();
                          }
                        : undefined
                    }
                  >
                    {item.title}
                  </MobileLink>
                )
              );
            })}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  onClick,
  ...props
}: MobileLinkProps) {
  const router = useRouter();
  return (
    <Link
      href={href}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        } else {
          router.push(href.toString());
          onOpenChange?.(false);
        }
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  );
}
