import { GitHubLogoIcon } from '@radix-ui/react-icons';
import Link from 'next/link';

export default function FloatingGithubLink() {
  return (
    <Link
      href="https://github.com/ThomasGhali/engineering-company-webpage"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 left-4 md:bottom-8 md:left-8"
    >
      <GitHubLogoIcon className="size-13 outline-2 outline-transparent hover:outline-primary-100 bg-charcoal-950 text-zinc-200 rounded-full hover:scale-110 transition-all duration-200 " />
    </Link>
  );
}
