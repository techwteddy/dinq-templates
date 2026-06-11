'use client';

import { useState } from 'react';
import { MessageCircle, X, Send, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useChat } from './chat-context';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hello! How can we help you today?',
    sender: 'agent',
    timestamp: new Date(),
  },
  {
    id: '2',
    text: 'I have a question about the Web Development course.',
    sender: 'user',
    timestamp: new Date(),
  },
  {
    id: '3',
    text: 'Our Web Development course covers HTML, CSS, React, and Next.js. What specifically would you like to know?',
    sender: 'agent',
    timestamp: new Date(),
  },
];

export function LiveChatWidget() {
  const { isOpen, setIsOpen } = useChat();
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // Simulate agent response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Thank you for your message! This is a demo. In a real application, an agent would respond here.',
        sender: 'agent',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-110"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Open chat</span>
      </Button>
    );
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 flex flex-col transition-all duration-300',
        isMinimized ? 'h-14 w-64' : 'h-[500px] w-80 sm:w-96'
      )}
    >
      <Card className="flex h-full flex-col overflow-hidden border-primary/20 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between bg-primary p-4 text-primary-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            <span className="font-semibold">Live Support</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-white/20"
              onClick={() => setIsMinimized(!isMinimized)}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:bg-white/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 space-y-4 overflow-y-auto bg-muted/30 p-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex max-w-[80%] flex-col',
                    msg.sender === 'user' ? 'ml-auto items-end' : 'items-start'
                  )}
                >
                  <div
                    className={cn(
                      'rounded-2xl px-4 py-2 text-sm shadow-sm',
                      msg.sender === 'user'
                        ? 'rounded-tr-none bg-primary text-primary-foreground'
                        : 'rounded-tl-none border border-border bg-white text-foreground dark:bg-zinc-800'
                    )}
                  >
                    {msg.text}
                  </div>
                  <span className="mt-1 text-[10px] text-muted-foreground">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))}
            </CardContent>
            <CardFooter className="border-t bg-background p-4">
              <form onSubmit={handleSend} className="flex w-full gap-2">
                <Input
                  placeholder="Type a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="icon" disabled={!message.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
