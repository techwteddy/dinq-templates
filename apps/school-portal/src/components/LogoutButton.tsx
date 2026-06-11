"use client"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"

export function LogoutButton() {
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh() // Refreshes the page to hide the "Add News" form
  }

  return (
    <button 
      onClick={handleLogout}
      className="text-sm font-medium text-red-500 hover:underline"
    >
      Log Out
    </button>
  )
}