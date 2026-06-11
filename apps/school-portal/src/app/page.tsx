import { redirect } from 'next/navigation';

export default function RootPage() {
  // Default to English news if no language is picked
  redirect('/en/news');
}