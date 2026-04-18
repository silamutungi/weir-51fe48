import { useEffect, useState, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface ProtectedRouteProps {
  children: ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [checking, setChecking] = useState(true)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthed(true)
      setChecking(false)
      return
    }
    supabase.auth.getSession().then(({ data }) => {
      setAuthed(Boolean(data.session))
      setChecking(false)
    })
  }, [])

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" aria-label="Checking authentication" />
      </div>
    )
  }

  return authed ? <>{children}</> : <Navigate to="/login" replace />
}
