import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../utils/supabase'

export default function AuthCallback() {
  const navigate = useNavigate()
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const token_hash = params.get('token_hash')
        const type = params.get('type')

        if (token_hash && type === 'email') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash,
            type: 'email',
          })

          if (error) {
            setMessage('Verification failed. Please try again.')
            setTimeout(() => navigate('/login'), 2000)
            return
          }

          setMessage('Email verified! Redirecting...')
          setTimeout(() => navigate('/profile'), 1500)
        } else {
          navigate('/login')
        }
      } catch (err) {
        console.error(err)
        navigate('/login')
      }
    }

    handleEmailConfirmation()
  }, [navigate])

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem',
      }}
    >
      {message}
    </div>
  )
}