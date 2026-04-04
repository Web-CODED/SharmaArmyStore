import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '@/utils/supabase';

export default function ProfilePage() {
  // STEP 1: ALL declarations at very top
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // STEP 2: useEffect after declarations
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: { session } } =
          await supabase.auth.getSession()

        if (!session) {
          navigate('/login')
          return
        }

        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (error) throw error
        setProfile(data)

      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  // STEP 3: All conditional returns before main return
  if (loading) return <div>Loading...</div>
  if (error) return (
    <div>
      <p>Something went wrong: {error}</p>
      <button onClick={() => navigate('/login')}>
        Go to Login
      </button>
    </div>
  )
  if (!profile) return (
    <div>
      <p>Profile not found</p>
      <button onClick={() => navigate('/login')}>
        Go to Login
      </button>
    </div>
  )

  // STEP 4: Main render only after all checks pass
  return (
    <div>
      <h1>{profile.full_name}</h1>
      <p>{profile.email}</p>
    </div>
  )
}