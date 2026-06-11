import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | EduPlatform',
  description: 'Frequently asked questions about our courses and platform.',
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
