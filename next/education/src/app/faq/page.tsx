'use client';

import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Icons } from '@/components/ui/Icons';

const faqs = [
  {
    category: 'General',
    questions: [
      {
        q: 'What is EduPlatform?',
        a: 'EduPlatform is a modern learning platform offering high-quality courses in web development, design, business, and more.',
      },
      {
        q: 'How do I get started?',
        a: 'Simply create an account, browse our catalog, and enroll in any course that interests you. Many courses have free introductory lessons.',
      },
    ],
  },
  {
    category: 'Billing',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards, PayPal, and Apple Pay.',
      },
      {
        q: 'Can I cancel my subscription?',
        a: 'Yes, you can cancel your subscription at any time from your profile settings. You will continue to have access until the end of your billing cycle.',
      },
    ],
  },
  {
    category: 'Courses',
    questions: [
      {
        q: 'Are the courses self-paced?',
        a: 'Yes, all our courses are 100% self-paced. You can learn on your own schedule, from anywhere in the world.',
      },
      {
        q: 'Will I receive a certificate?',
        a: 'Yes, upon successful completion of a course, you will receive a digital certificate that you can share on LinkedIn or with employers.',
      },
    ],
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredFaqs = faqs
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="container max-w-4xl space-y-12 py-10">
      <section className="space-y-4 text-center">
        <h1 className="font-serif text-4xl font-bold tracking-tight lg:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to know about EduPlatform.
        </p>
      </section>

      <div className="relative mx-auto max-w-xl">
        <Icons.search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search FAQs..."
          className="h-12 pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-10">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((category) => (
            <div key={category.category} className="space-y-4">
              <h2 className="border-b pb-2 text-2xl font-bold">
                {category.category}
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, index) => (
                  <AccordionItem
                    key={index}
                    value={`${category.category}-${index}`}
                  >
                    <AccordionTrigger className="text-left">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No results found for &quot;{searchQuery}&quot;
          </p>
        )}
      </div>
    </div>
  );
}
