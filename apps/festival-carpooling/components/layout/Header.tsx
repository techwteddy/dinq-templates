import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="mx-auto flex h-14 max-w-lg items-center justify-between px-4">
        <Link href="/" className="font-serif text-xl font-bold italic text-forest tracking-tight">
          Carpooling
        </Link>
      </div>
    </header>
  )
}
