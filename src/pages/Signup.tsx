import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'

export default function Signup() {
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (!isSupabaseConfigured) {
        await new Promise(r => setTimeout(r, 800))
        navigate('/dashboard')
        return
      }
      const { data, error: authError } = await (supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } }) as any)
      if (authError) throw authError
      if (data?.user && !data.session) {
        setSuccess(true)
      } else {
        navigate('/dashboard')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
        <Card className="w-full max-w-md text-center p-8">
          <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[var(--color-text)] mb-2">Check your email</h2>
          <p className="text-[var(--color-text-secondary)] mb-6">We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.</p>
          <Link to="/login" className="text-[var(--color-primary)] font-medium hover:underline">Back to sign in</Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-[var(--color-primary)]">WEIR</Link>
          <p className="text-[var(--color-text-secondary)] mt-2">Create your free account</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Start protecting your NIL</CardTitle>
            <CardDescription>Free plan includes 10 detections per month. No credit card needed.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                  <AlertCircle size={16} aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name">Display name</Label>
                <Input id="name" required value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name or handle" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" autoComplete="new-password" required minLength={8} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters" />
              </div>
              <Button type="submit" className="w-full bg-[var(--color-primary)] text-white hover:opacity-90" disabled={loading}>
                {loading ? <><Loader2 size={16} className="animate-spin mr-2" aria-hidden="true" />Creating account...</> : 'Start free'}
              </Button>
            </form>
            <p className="text-center text-sm text-[var(--color-text-secondary)] mt-6">
              Already have an account? <Link to="/login" className="text-[var(--color-primary)] font-medium hover:underline">Sign in</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
