import Link from "next/link";
import BackgroundImage from "./BackgroundImage";
import SignOutButton from "./SignOutButton";
import BackButton from "./BackButton";
import PullToRefresh from "./PullToRefresh";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <BackgroundImage />
      <header className="sticky top-0 z-30 flex items-center gap-3 h-14 px-4 bg-card/90 backdrop-blur-md border-b border-card-border shadow-sm">
        <BackButton />
        <Link href="/" className="font-semibold text-lg tracking-tight text-foreground hover:opacity-80 transition-opacity">
          My Family Genius
        </Link>
        <div className="ml-auto">
          <SignOutButton />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <PullToRefresh>{children}</PullToRefresh>
      </main>
    </div>
  );
}
