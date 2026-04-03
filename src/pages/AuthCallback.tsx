import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../utils/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) throw error

        if (data.session) {
          navigate('/profile')
        } else {
          navigate('/login')
        }
      } catch (err) {
        console.error(err)
        navigate('/login')
      }
    }

    handleCallback()
  }, [])

  return (
    <div>Verifying your email, please wait...</div>
  )
}