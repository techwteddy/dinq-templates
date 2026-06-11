import { createClient } from '@supabase/supabase-js'

// ✅ Supabase project credentials
const supabaseUrl = 'https://hvhaavxjbujkpvbvftkj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh2aGFhdnhqYnVqa3B2YnZmdGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4MDIxNTksImV4cCI6MjA2NzM3ODE1OX0.Rtyf3tRc8cDiXtuf23BnvGrBw0cbJ4QOTBhm93Typ40'

// ✅ Create and export Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey) 