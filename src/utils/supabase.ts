import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
      persistSession: true,
          storageKey: 'sharma-army-store-auth',
              storage: window.localStorage,
                  autoRefreshToken: true,
                      detectSessionInUrl: true,
                          flowType: 'pkce'
                            }
                            })

                            export default supabase

                      

// Razorpay configuration
export const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_test_key_here';