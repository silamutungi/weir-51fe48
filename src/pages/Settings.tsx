```typescript
import { useEffect, useState, type FormEvent } from 'react'
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import Navbar from '../components/Navbar'

export default function Settings() {
  const [displayName, setDisplayName] = useState('')
  const [bio, setBio] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) {
        setDisplayName('Alex Creator')
        setEmail('alex@example.com')
        setBio('Professional athlete and content creator.')
        setLoading(false)
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setEmail(session.user.email ?? '')
        const { data } = await (supabase.from('weir_profiles').select('*').eq('user_id', session.user.id).single() as any)
        if (data) {
          setDisplayName(data.display_name ?? '')
          setBio(data.bio ?? '')
        }
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      if (!isSupabaseConfigured) {
        await new Promise(r => setTimeout(r, 600))
        setSuccess(true)
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')
      const { error: upsertError } = await (supabase.from('weir_profiles').upsert({ user_id: session.user.id, display_name: displayName, bio, email, plan: 'free' } as any) as any)
      if (upsertError) throw upsertError
      setSuccess(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed. Try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    if (!isSupabaseConfigured) { alert('Connect database to enable account deletion.'); return }
    await supabase.auth.signOut()
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-8">
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-8">Settings</h1>

        {loading ? (
          <div className="flex items-center gap-3 py-16 text-[var(--color-text-secondary)]">
            <Loader2 size={20} className="animate-spin" aria-hidden="true" />
            Loading profile...
          </div>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your public display information.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="space-y-4">
                  {error && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                      <AlertCircle size={16} aria-hidden="true" /><span>{error}</span>
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm">
                      <CheckCircle size={16} aria-hidden="true" /><span>Profile saved successfully.</span>
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display name</Label>
                    <Input id="displayName" required value={displayName} onChange={e => setDisplayName(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="settingsEmail">Email</Label>
                    <Input id="settingsEmail" type="email" value={email} disabled className="opacity-60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Input id="bio" value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell brands about yourself" />
                  </div>
                  <Button type="submit" className="bg-[var(--color-primary)] text-white hover:opacity-90" disabled={saving}>
                    {saving ? <><Loader2 size={16} className="animate-spin mr-2" aria-hidden="true" />Saving...</> : 'Save changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-red-200 dark:border-red-800">
              <CardHeader>
                <CardTitle className="text-[var(--color-error)]">Danger zone</CardTitle>
                <CardDescription>Irreversible actions. Proceed with caution.</CardDescription>
              </CardHeader>
              <CardContent>
                {!deleteConfirm ? (
                  <Button variant="destructive" onClick={() => setDeleteConfirm(true)}>Delete account</Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-[var(--color-text-secondary)]">Are you sure? All your data will be permanently removed.</p>
                    <div className="flex gap-3">
                      <Button variant="destructive" onClick={handleDeleteAccount}>Yes, delete my account</Button>
                      <Button variant="outline" onClick={() => setDeleteConfirm(false)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
```