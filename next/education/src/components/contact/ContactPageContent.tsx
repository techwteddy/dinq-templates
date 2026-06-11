'use client';

import { ChatProvider } from '@/components/chat/chat-context';
import { ContactCards } from '@/components/contact/ContactCards';
import { ContactForm } from '@/components/contact/ContactForm';
import { OfficeHours } from '@/components/contact/OfficeHours';
import { EmergencyContact } from '@/components/contact/EmergencyContact';
import { FAQAccordion } from '@/components/contact/FAQAccordion';
import { LiveChatWidget } from '@/components/chat/LiveChatWidget';

export function ContactPageContent() {
  return (
    <ChatProvider>
      <div className="container space-y-16 py-10">
        {/* Hero Section */}
        <section className="mx-auto max-w-3xl space-y-4 text-center">
          <h1 className="font-serif text-4xl font-bold tracking-tight lg:text-6xl">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground">
            Whether you&apos;re a prospective student, a current learner, or a
            faculty member, we&apos;re here to help you succeed.
          </p>
        </section>

        {/* Quick Contact Cards */}
        <section>
          <ContactCards />
        </section>

        <div className="grid gap-16 lg:grid-cols-2">
          {/* Contact Form Section */}
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Send us a Message</h2>
              <p className="text-muted-foreground">
                Fill out the form below and the relevant department will get
                back to you.
              </p>
            </div>
            <ContactForm />
          </section>

          {/* Info Sidebar */}
          <div className="space-y-10">
            <section>
              <OfficeHours />
            </section>
            <section>
              <EmergencyContact />
            </section>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mx-auto max-w-4xl">
          <FAQAccordion />
        </section>

        <LiveChatWidget />
      </div>
    </ChatProvider>
  );
}
