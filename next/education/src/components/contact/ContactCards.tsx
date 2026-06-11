'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Phone, Mail, MessageSquare } from 'lucide-react';
import { useChat } from '@/components/chat/chat-context';

export function ContactCards() {
  const { openChat } = useChat();

  const cards = [
    {
      title: 'Call Us',
      description: 'Available Mon-Fri, 9am-5pm',
      contact: '+1 (555) 123-4567',
      icon: Phone,
      href: 'tel:+15551234567',
    },
    {
      title: 'Email Us',
      description: "We'll respond within 24 hours",
      contact: 'support@eduplatform.com',
      icon: Mail,
      href: 'mailto:support@eduplatform.com',
    },
    {
      title: 'Live Chat',
      description: 'Quick support for simple questions',
      contact: 'Start Chat',
      icon: MessageSquare,
      onClick: (e: React.MouseEvent) => {
        e.preventDefault();
        openChat();
      },
      href: '#',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center gap-4">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <card.icon className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg">{card.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{card.description}</p>
            <a
              href={card.href}
              onClick={card.onClick}
              className="mt-2 inline-block cursor-pointer font-semibold text-primary hover:underline"
            >
              {card.contact}
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
