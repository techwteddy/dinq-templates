'use client'

import { useTransition } from 'react'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function SignOutButton() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  return (
    <Button
      variant="ghost"
      size="sm"
      loading={isPending}
      onClick={() =>
        startTransition(async () => {
          const supabase = createClient()
          await supabase.auth.signOut()
          router.push('/')
          router.refresh()
        })
      }
    >
      Esci
    </Button>
  )
}
