import { Metadata } from 'next';
import { ContactPageContent } from '@/components/contact/ContactPageContent';

export const metadata: Metadata = {
  title: 'Contact Us | EduPlatform',
  description:
    'Get in touch with the EduPlatform team for admissions, support, and general inquiries.',
};

export default function ContactPage() {
  return <ContactPageContent />;
}
