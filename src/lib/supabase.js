import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL || 'https://upcizwgxrmzluwhfqcpn.supabase.co'
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_FBbaBkJ9FPLPTb_vjjlNew_UcrD8z2z'

export const supabase = createClient(url, publishableKey, {
  auth: { persistSession: true, autoRefreshToken: true }
})
