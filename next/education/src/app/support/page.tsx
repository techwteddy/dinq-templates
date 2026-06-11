'use client';

import { useState } from 'react';
import { Icons } from '@/components/ui/Icons';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

const supportCategories = [
  {
    title: 'Knowledge Base',
    description: 'Articles and guides to help you use the platform.',
    icon: Icons.fileText,
    link: '#',
  },
  {
    title: 'Contact Support',
    description: 'Get in touch with our team for personalized help.',
    icon: Icons.mail,
    link: '/contact',
  },
  {
    title: 'Community Forum',
    description: 'Ask questions and share knowledge with other learners.',
    icon: Icons.users,
    link: '#',
  },
  {
    title: 'Billing & Account',
    description: 'Manage your subscription and account settings.',
    icon: Icons.creditCard,
    link: '/profile',
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: 'Searching...',
        description: `We're looking for articles related to "${searchQuery}". This is a demo feature.`,
      });
    }
  };

  return (
    <div className="container space-y-16 py-10">
      <section className="mx-auto max-w-3xl space-y-6 text-center">
        <h1 className="font-serif text-4xl font-bold tracking-tight lg:text-6xl">
          How can we help?
        </h1>
        <form onSubmit={handleSearch} className="relative mx-auto max-w-xl">
          <Icons.search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search for help..."
            className="h-12 pl-10 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      </section>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {supportCategories.map((category) => (
          <Card
            key={category.title}
            className="group cursor-pointer transition-colors hover:border-primary"
          >
            <Link href={category.link}>
              <CardHeader>
                <category.icon className="mb-2 h-10 w-10 text-primary transition-transform group-hover:scale-110" />
                <CardTitle>{category.title}</CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
            </Link>
          </Card>
        ))}
      </div>

      <section className="space-y-6 rounded-2xl bg-muted/50 p-8 text-center">
        <h2 className="text-3xl font-bold">Still need help?</h2>
        <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
          Our support team is available 24/7 to help you with any questions or
          technical issues you may encounter.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/contact">Contact Support</Link>
          </Button>
          <Button variant="outline" size="lg">
            Live Chat
          </Button>
        </div>
      </section>
    </div>
  );
}
