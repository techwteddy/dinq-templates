import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LoginForm } from './LoginForm'

export const metadata = { title: 'Accedi' }

interface PageProps {
  searchParams: Promise<{ next?: string }>
}

export default async function LoginPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  const { next } = await searchParams

  if (session) redirect(next ?? '/')

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="font-serif text-2xl font-bold text-ink">Di nuovo qui!</h1>
          <p className="mt-2 text-sm text-ink-muted">
            Accedi per offrire o richiedere passaggi.
          </p>
        </div>
        <LoginForm next={next} />
      </div>
    </div>
  )
}
