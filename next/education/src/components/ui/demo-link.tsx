'use client';

import Link, { LinkProps } from 'next/link';
import { useDemo } from '@/components/demo-provider';
import React from 'react';

interface DemoLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export function DemoLink({ children, ...props }: DemoLinkProps) {
  const { openDemo } = useDemo();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    openDemo();
  };

  return (
    <Link {...props} onClick={handleClick} prefetch={false}>
      {children}
    </Link>
  );
}
