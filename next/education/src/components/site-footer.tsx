import * as React from 'react';
import Link from 'next/link';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/ui/Icons';
import { NewsletterForm } from '@/components/newsletter-form';

export function SiteFooter({ className }: React.HTMLAttributes<HTMLElement>) {
  return (
    <footer className={cn(className, 'border-t')}>
      <div className="container grid gap-8 py-10 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Icons.logo className="h-6 w-6" />
            <span className="font-bold">{siteConfig.name}</span>
          </Link>
          <p className="text-sm text-muted-foreground">
            Providing world-class education and resources to help you master
            modern web technologies.
          </p>
          <div className="flex gap-4">
            <Link
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noreferrer"
            >
              <Icons.twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer"
            >
              <Icons.gitHub className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="grid gap-2">
            <h4 className="text-sm font-medium">Resources</h4>
            <Link
              href="/courses"
              className="text-sm text-muted-foreground hover:underline"
            >
              Courses
            </Link>
            <Link
              href="/blog"
              className="text-sm text-muted-foreground hover:underline"
            >
              Blog
            </Link>
            <Link
              href="/faculty"
              className="text-sm text-muted-foreground hover:underline"
            >
              Faculty
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-muted-foreground hover:underline"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              className="text-sm text-muted-foreground hover:underline"
            >
              FAQ
            </Link>
            <Link
              href="/support"
              className="text-sm text-muted-foreground hover:underline"
            >
              Support
            </Link>
          </div>
          <div className="grid gap-2">
            <h4 className="text-sm font-medium">Company</h4>
            <Link
              href="/about"
              className="text-sm text-muted-foreground hover:underline"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground hover:underline"
            >
              Contact
            </Link>
          </div>
          <div className="grid gap-2">
            <h4 className="text-sm font-medium">Legal</h4>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
        <div className="md:col-span-2 lg:col-span-1">
          <NewsletterForm />
        </div>
      </div>
      <div className="container border-t py-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="text-sm text-muted-foreground">
            Designed by{' '}
            <a
              href="https://github.com/MasuRii"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline-offset-4 hover:text-primary hover:underline"
            >
              MasuRii
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
