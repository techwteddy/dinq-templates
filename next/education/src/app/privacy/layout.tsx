import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | EduPlatform',
  description:
    'Our policy regarding the collection and use of your personal data.',
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
