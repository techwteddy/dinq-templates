import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Support | EduPlatform',
  description: 'Get help with EduPlatform courses and platform.',
};

export default function SupportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
