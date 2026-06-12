import { createClient } from '@/lib/supabase/client';

export async function handleLogout() {
  const supabase = createClient();
  
  // Clear localStorage
  localStorage.removeItem('rememberMe');
  localStorage.removeItem('rememberMeExpiry');
  localStorage.removeItem('onboarding_shown');
  
  // Sign out from Supabase
  await supabase.auth.signOut();
}
