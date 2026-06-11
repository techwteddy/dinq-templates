import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pricing | EduPlatform',
  description: 'Choose the right plan for your learning journey.',
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
