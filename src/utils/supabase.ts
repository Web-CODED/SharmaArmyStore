import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      storageKey: 'sharma-army-store-auth',
      storage: window.localStorage,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
)

export default supabase

// Razorpay configuration
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_test_key_here';