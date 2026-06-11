import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | EduPlatform',
  description: 'Legal terms and conditions for using the EduPlatform website.',
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
